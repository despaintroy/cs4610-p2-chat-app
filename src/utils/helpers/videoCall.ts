import {
	addDoc,
	collection,
	onSnapshot,
	query,
	serverTimestamp,
	where,
} from 'firebase/firestore'
import { auth } from 'utils/services/auth'
import { database } from 'utils/services/firebase'
import {
	acceptConnectRTC,
	Answer,
	Offer,
	startConnectRTC,
} from 'utils/services/rtc'

export interface VideoCall {
	localStream: MediaStream
	remoteStream: MediaStream
	peerConnection: RTCPeerConnection
	callId: string
}

export interface CallDatabaseDocument {
	caller: string
	recipient: string
	timestamp: {
		seconds: number
		nanoseconds: number
	}
	offer?: Offer
	answer?: Answer
	calleeCandidates?: unknown
}

export const requestDeviceAV = async (): Promise<MediaStream> =>
	navigator.mediaDevices.getUserMedia({
		video: true,
		audio: true,
	})

export const startCall = async (
	recipientId: string,
	onDisconnect: () => void
): Promise<VideoCall> => {
	let localStream: MediaStream
	const remoteStream = new MediaStream()
	let callId: string
	let peerConnection: RTCPeerConnection

	// Try to access device camera and microphone
	try {
		localStream = await requestDeviceAV()
	} catch {
		console.error('Unable to access device camera and microphone')
		return Promise.reject()
	}

	// Try to add the call doc to the Firestore database
	try {
		if (!auth.currentUser) throw new Error()
		const ref = await addDoc(collection(database, 'calls'), {
			caller: auth.currentUser.uid,
			recipient: recipientId,
			timestamp: serverTimestamp(),
		})
		callId = ref.id
		console.log('GENERATED CALL ID:', callId)
	} catch {
		console.error('Unable to add call doc to the Firestore database')
		return Promise.reject()
	}

	// Try to start the WebRTC connection
	try {
		peerConnection = await startConnectRTC(callId, localStream, remoteStream)
	} catch {
		console.error('Unable to start a WebRTC connection')
		return Promise.reject()
	}

	const videoCall = {
		localStream,
		remoteStream,
		peerConnection,
		callId,
	}

	peerConnection.addEventListener('connectionstatechange', () => {
		if (
			peerConnection.connectionState === 'disconnected' ||
			peerConnection.connectionState === 'failed'
		) {
			console.log('WebRTC connection has been disconnected')
			disconnectCall(videoCall)
			onDisconnect()
		}
	})

	return videoCall
}

export const watchIncomingCalls = (
	userId: string,
	handleIncoming: (callId: string) => void
): (() => void) => {
	const q = query(
		collection(database, 'calls'),
		where('recipient', '==', userId)
	)

	const unsubscribe = onSnapshot(q, querySnapshot => {
		querySnapshot.docChanges().forEach(change => {
			if (change.type === 'added') {
				const data = change.doc.data() as CallDatabaseDocument
				if (new Date().getTime() / 1000 - data.timestamp.seconds < 60) {
					console.log('INCOMING CALL DATA', data)
					handleIncoming(change.doc.id)
				} else {
					console.log('Observed old call')
				}
			}
		})
	})

	console.log('WATCHING FOR INCOMING CALLS')

	return unsubscribe
}

export const joinCall = async (
	callId: string,
	onDisconnect: () => void
): Promise<VideoCall> => {
	let localStream: MediaStream
	const remoteStream = new MediaStream()
	let peerConnection: RTCPeerConnection

	// Try to access device camera and microphone
	try {
		localStream = await requestDeviceAV()
	} catch {
		console.error('Unable to access device camera and microphone')
		return Promise.reject()
	}

	// Try to accept the WebRTC connection
	try {
		peerConnection = await acceptConnectRTC(callId, localStream, remoteStream)
	} catch {
		console.error('Unable to join the WebRTC connection')
		return Promise.reject()
	}

	const videoCall = {
		localStream,
		remoteStream,
		peerConnection,
		callId,
	}

	peerConnection.addEventListener('connectionstatechange', () => {
		if (
			peerConnection.connectionState === 'disconnected' ||
			peerConnection.connectionState === 'failed'
		) {
			console.log('WebRTC connection has been disconnected')
			disconnectCall(videoCall)
			onDisconnect()
		}
	})

	return videoCall
}

export const disconnectCall = (call: VideoCall): void => {
	call.localStream.getTracks().forEach(track => track.stop())
	call.remoteStream.getTracks().forEach(track => track.stop())
	call.peerConnection.close()
}
