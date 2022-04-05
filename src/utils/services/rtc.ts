import {
	addDoc,
	collection,
	doc,
	getDoc,
	onSnapshot,
	updateDoc,
} from 'firebase/firestore'
import { Call } from 'utils/helpers/videoCall'
import { database } from './firebase'

export interface Offer {
	type: RTCSdpType
	sdp: string
}

export interface Answer {
	type: RTCSdpType
	sdp: string
}

const RTC_CONFIG: RTCConfiguration = {
	iceServers: [
		{
			urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
		},
	],
	iceCandidatePoolSize: 10,
}

export const startConnectRTC = async (
	callId: string,
	localStream: MediaStream,
	remoteStream: MediaStream
): Promise<string> => {
	// Add tracks from the local MediaStrem to the RTCPeerConnection
	const peerConnection = new RTCPeerConnection(RTC_CONFIG)
	localStream
		.getTracks()
		.forEach(track => peerConnection.addTrack(track, localStream))

	// Collect ICE candidates
	peerConnection.addEventListener('icecandidate', event => {
		// Found final candidate
		if (!event.candidate) return

		// Record potential candidate
		addDoc(collection(database, 'callerCandidates'), event.candidate.toJSON())
	})

	let sessionDescription: RTCSessionDescriptionInit

	try {
		sessionDescription = await peerConnection.createOffer()
		await peerConnection.setLocalDescription(sessionDescription)
		if (!sessionDescription.sdp) throw new Error()
	} catch {
		console.error('Failed to create offer')
		return Promise.reject()
	}

	// Add offer to the call document
	try {
		await updateDoc(doc(database, 'calls', callId), {
			offer: {
				type: sessionDescription.type,
				sdp: sessionDescription.sdp,
			},
		})
	} catch {
		console.error('Failed to send offer')
		return Promise.reject()
	}

	// Add tracks from the peer connection to the remote stream
	peerConnection.addEventListener('track', event =>
		event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track))
	)

	// Listening for remote session description below
	onSnapshot(doc(database, 'calls', callId), async docSnap => {
		const data = docSnap.data() as Call
		if (!peerConnection.currentRemoteDescription && data && data.answer) {
			const rtcSessionDescription = new RTCSessionDescription(data.answer)
			await peerConnection.setRemoteDescription(rtcSessionDescription)
		}
	})

	// Consider incoming ICE candidates
	onSnapshot(
		collection(database, 'calls', callId, 'calleeCandidates'),
		async snapshot => {
			snapshot.docChanges().forEach(async change => {
				if (change.type === 'added') {
					const data = change.doc.data()
					await peerConnection.addIceCandidate(new RTCIceCandidate(data))
				}
			})
		}
	)

	return callId
}

export const acceptConnectRTC = async (
	callId: string,
	localStream: MediaStream,
	remoteStream: MediaStream
): Promise<void> => {
	// Add tracks from the local MediaStrem to the RTCPeerConnection
	const peerConnection = new RTCPeerConnection(RTC_CONFIG)
	localStream.getTracks().forEach(track => {
		peerConnection.addTrack(track, localStream)
	})

	const calleeCandidatesCollection = collection(
		database,
		'calls',
		callId,
		'calleeCandidates'
	)

	peerConnection.addEventListener('icecandidate', event => {
		if (!event.candidate) {
			console.log('Got final candidate!')
			return
		}
		console.log('Got candidate: ', event.candidate)
		addDoc(calleeCandidatesCollection, event.candidate.toJSON())
	})

	peerConnection.addEventListener('track', event => {
		console.log('Got remote track:', event.streams[0])
		event.streams[0].getTracks().forEach(track => {
			console.log('Add a track to the remoteStream:', track)
			remoteStream.addTrack(track)
		})
	})

	let offer: Offer
	const docRef = doc(database, 'calls', callId)

	try {
		const docSnap = await getDoc(docRef)
		const data = docSnap.data()
		offer = data?.offer

		if (!offer) throw new Error()
	} catch {
		console.error('No call offer found')
		return Promise.reject()
	}

	let sessionDescription: RTCSessionDescriptionInit

	try {
		await peerConnection.setRemoteDescription(offer)
		sessionDescription = await peerConnection.createAnswer()
		await peerConnection.setLocalDescription(sessionDescription)
		if (!sessionDescription.sdp) throw new Error()
	} catch {
		console.error('Failed to create answer')
		return Promise.reject()
	}

	const answer: Answer = {
		type: sessionDescription.type,
		sdp: sessionDescription.sdp,
	}

	await updateDoc(docRef, { answer })
		.then(() => console.log('Sent answer'))
		.catch(() => console.error('Failed to send answer'))

	onSnapshot(
		collection(database, 'calls', callId, 'callerCandidates'),
		async snapshot =>
			snapshot.docChanges().forEach(async change => {
				if (change.type === 'added') {
					const data = change.doc.data()
					await peerConnection.addIceCandidate(new RTCIceCandidate(data))
				}
			})
	)
}
