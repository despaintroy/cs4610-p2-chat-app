import {
	addDoc,
	collection,
	doc,
	onSnapshot,
	query,
	serverTimestamp,
	Timestamp,
	updateDoc,
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
	answered: boolean
	ended: boolean
}

export const startCall = async (
	recipientId: string,
	localStream: MediaStream,
	onDisconnect: () => void
): Promise<{
	remoteStream: MediaStream
	peerConnection: RTCPeerConnection
	callId: string
}> => {
	const remoteStream = new MediaStream()
	let callId: string

	// Try to add the call doc to the Firestore database
	try {
		if (!auth.currentUser) throw new Error()
		const ref = await addDoc(collection(database, 'calls'), {
			caller: auth.currentUser.uid,
			recipient: recipientId,
			timestamp: serverTimestamp(),
			answered: false,
			ended: false,
		})
		callId = ref.id
		console.log('GENERATED CALL ID:', callId)
	} catch {
		console.error('Unable to add call doc to the Firestore database')
		return Promise.reject()
	}

	// Start the WebRTC connection
	const peerConnection = await startConnectRTC(
		callId,
		localStream,
		remoteStream
	).catch(() => {
		return Promise.reject()
	})

	// Handle unexpected call disconnect
	peerConnection.addEventListener('connectionstatechange', () => {
		if (
			peerConnection.connectionState === 'disconnected' ||
			peerConnection.connectionState === 'failed'
		) {
			console.log('WebRTC connection has been disconnected')
			onDisconnect()
		}
	})

	// Handle call end
	onSnapshot(doc(database, 'calls', callId), snapshot => {
		const data = snapshot.data()
		if (data?.ended) {
			onDisconnect()
			updateDoc(doc(database, 'calls', callId), {
				ended: true,
			})
		}
	})

	return {
		remoteStream,
		peerConnection,
		callId,
	}
}

export const listenForIncomingCalls = (
	userId: string,
	handleIncoming: (callId: string) => void
): (() => void) => {
	const q = query(
		collection(database, 'calls'),
		where('recipient', '==', userId),
		where('answered', '==', false)
	)

	const unsubscribe = onSnapshot(q, snapshot => {
		snapshot.docChanges().forEach(change => {
			if (change.type === 'added') {
				const timestamp = change.doc.data()
					.timestamp as CallDatabaseDocument['timestamp']
				if (Timestamp.now().seconds < timestamp.seconds + 60) {
					console.log('Observed incoming call')
					handleIncoming(change.doc.id)
				} else {
					console.log('Observed old call')
				}
			}
		})
	})

	console.log('Listening for incoming calls')

	return unsubscribe
}

export const joinCall = async (
	callId: string,
	localStream: MediaStream,
	onDisconnect: () => void
): Promise<{
	remoteStream: MediaStream
	peerConnection: RTCPeerConnection
}> => {
	const remoteStream = new MediaStream()
	let peerConnection: RTCPeerConnection

	// Try to accept the WebRTC connection
	try {
		peerConnection = await acceptConnectRTC(callId, localStream, remoteStream)
		await updateDoc(doc(database, 'calls', callId), {
			answered: true,
		})
	} catch {
		console.error('Unable to join the WebRTC connection')
		return Promise.reject()
	}

	// Handle call end
	onSnapshot(doc(database, 'calls', callId), snapshot => {
		const data = snapshot.data()
		if (data?.ended) {
			onDisconnect()
			updateDoc(doc(database, 'calls', callId), {
				ended: true,
			})
		}
	})

	peerConnection.addEventListener('connectionstatechange', async () => {
		if (
			peerConnection.connectionState === 'disconnected' ||
			peerConnection.connectionState === 'failed'
		) {
			console.log('WebRTC connection has been disconnected')
			onDisconnect()
			updateDoc(doc(database, 'calls', callId), {
				ended: true,
			})
		}
	})

	return {
		remoteStream,
		peerConnection,
	}
}

export const endCall = async (callId: string): Promise<void> => {
	try {
		await updateDoc(doc(database, 'calls', callId), {
			ended: true,
		})
	} catch {
		console.error('Unable to end the call')
		return Promise.reject()
	}
}