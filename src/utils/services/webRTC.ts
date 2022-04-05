import {
	addDoc,
	collection,
	doc,
	getDoc,
	onSnapshot,
	updateDoc,
} from 'firebase/firestore'
import { requestDeviceAV } from 'utils/helpers/videoCall'
import { auth } from './auth'
import { database } from './firebase'

interface Offer {
	type: RTCSdpType
	sdp: string
}

interface Answer {
	type: RTCSdpType
	sdp: string
}

interface Call {
	offer?: Offer
	answer?: Answer
}

const RTC_CONFIG: RTCConfiguration = {
	iceServers: [
		{
			urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
		},
	],
	iceCandidatePoolSize: 10,
}

let peerConnection: RTCPeerConnection
let localStream: MediaStream
let remoteStream: MediaStream

let localVideo: HTMLVideoElement
let remoteVideo: HTMLVideoElement

export const createCall = async (): Promise<void> => {
	peerConnection = new RTCPeerConnection(RTC_CONFIG)

	registerPeerConnectionListeners()

	localStream.getTracks().forEach(track => {
		peerConnection.addTrack(track, localStream)
	})

	// Collect ICE candidates
	peerConnection.addEventListener('icecandidate', event => {
		if (!event.candidate) {
			console.log('Got final candidate!')
			return
		}
		console.log('Got candidate: ', event.candidate)
		addDoc(collection(database, 'callerCandidates'), event.candidate.toJSON())
	})

	const offer = await peerConnection.createOffer()
	await peerConnection.setLocalDescription(offer)

	if (!offer.sdp) {
		console.error('No offer sdp')
		return Promise.reject()
	}

	let callId: string

	try {
		callId = await sendOffer(offer.type, offer.sdp)
		console.log('Created call with id:', callId)
	} catch {
		console.error('Failed to send offer')
		return Promise.reject()
	}

	peerConnection.addEventListener('track', event => {
		console.log('Got remote track:', event.streams[0])
		event.streams[0].getTracks().forEach(track => {
			console.log('Add a track to the remoteStream:', track)
			remoteStream.addTrack(track)
		})
	})

	// Listening for remote session description below
	onSnapshot(doc(database, 'calls', callId), async docSnap => {
		const data = docSnap.data()
		if (!peerConnection.currentRemoteDescription && data && data.answer) {
			console.log('Got remote description: ', data.answer)
			const rtcSessionDescription = new RTCSessionDescription(data.answer)
			await peerConnection.setRemoteDescription(rtcSessionDescription)
		}
	})

	onSnapshot(
		collection(database, 'calls', callId, 'calleeCandidates'),
		async snapshot => {
			snapshot.docChanges().forEach(async change => {
				if (change.type === 'added') {
					const data = change.doc.data()
					console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`)
					await peerConnection.addIceCandidate(new RTCIceCandidate(data))
				}
			})
		}
	)
}

export const joinCall = async (callId: string): Promise<void> => {
	peerConnection = new RTCPeerConnection(RTC_CONFIG)
	registerPeerConnectionListeners()

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

	const docRef = doc(database, 'calls', callId)
	const docSnap = await getDoc(docRef)

	const data = docSnap.data()

	if (!data) {
		console.error('No call found')
		return Promise.reject()
	}

	const offer = data.offer

	if (!offer) {
		console.error('No offer found in call')
		return Promise.reject()
	}

	await peerConnection.setRemoteDescription(offer)
	const answer = await peerConnection.createAnswer()
	await peerConnection.setLocalDescription(answer)

	const roomWithAnswer = {
		answer: {
			type: answer.type,
			sdp: answer.sdp,
		},
	}
	await updateDoc(docRef, roomWithAnswer)
		.then(() => console.log('Sent answer'))
		.catch(() => console.error('Failed to send answer'))

	onSnapshot(
		collection(database, 'calls', callId, 'callerCandidates'),
		async snapshot => {
			snapshot.docChanges().forEach(async change => {
				if (change.type === 'added') {
					const data = change.doc.data()
					console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`)
					await peerConnection.addIceCandidate(new RTCIceCandidate(data))
				}
			})
		}
	)
}

async function sendOffer(type: RTCSdpType, sdp: string): Promise<string> {
	if (!auth.currentUser) return Promise.reject()

	const call: Call = {
		offer: {
			type,
			sdp,
		},
	}

	console.log('Sending offer:', call)
	const ref = await addDoc(collection(database, 'calls'), call)

	return ref.id
}

function registerPeerConnectionListeners(): void {
	peerConnection.addEventListener('icegatheringstatechange', () => {
		console.log(
			`ICE gathering state changed: ${peerConnection.iceGatheringState}`
		)
	})

	peerConnection.addEventListener('connectionstatechange', () => {
		console.log(`Connection state change: ${peerConnection.connectionState}`)
	})

	peerConnection.addEventListener('signalingstatechange', () => {
		console.log(`Signaling state change: ${peerConnection.signalingState}`)
	})

	peerConnection.addEventListener('iceconnectionstatechange ', () => {
		console.log(
			`ICE connection state change: ${peerConnection.iceConnectionState}`
		)
	})
}

export async function openUserMedia(
	localVideoEl: HTMLVideoElement,
	remoteVideoEl: HTMLVideoElement
): Promise<void> {
	const stream = await requestDeviceAV()

	localStream = stream

	localVideo = localVideoEl
	remoteVideo = remoteVideoEl

	console.log('Got local stream:', stream)
	localVideo.srcObject = stream
	remoteStream = new MediaStream()
	remoteVideo.srcObject = remoteStream
}

export async function hangUp(): Promise<void> {
	localStream.getTracks().forEach(track => track.stop())

	if (remoteStream) {
		remoteStream.getTracks().forEach(track => track.stop())
	}

	if (peerConnection) {
		peerConnection.close()
	}
}
