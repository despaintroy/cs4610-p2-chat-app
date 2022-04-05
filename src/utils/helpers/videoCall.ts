import { acceptConnectRTC, startConnectRTC } from 'utils/services/rtc'

export const requestDeviceAV = async (): Promise<MediaStream> =>
	navigator.mediaDevices.getUserMedia({
		video: true,
		audio: true,
	})

export const startCall = async (): Promise<{
	localStream: MediaStream
	remoteStream: MediaStream
	callId: string
}> => {
	let localStream: MediaStream
	const remoteStream = new MediaStream()
	let callId: string

	// Try to access device camera and microphone
	try {
		localStream = await requestDeviceAV()
	} catch {
		console.error('Unable to access device camera and microphone')
		return Promise.reject()
	}

	// Try to start the WebRTC connection
	try {
		callId = await startConnectRTC(localStream, remoteStream)
	} catch {
		console.error('Unable to start a WebRTC connection')
		return Promise.reject()
	}

	return {
		localStream,
		remoteStream,
		callId,
	}
}

export const joinCall = async (
	callId: string
): Promise<{
	localStream: MediaStream
	remoteStream: MediaStream
}> => {
	let localStream: MediaStream
	const remoteStream = new MediaStream()

	// Try to access device camera and microphone
	try {
		localStream = await requestDeviceAV()
	} catch {
		console.error('Unable to access device camera and microphone')
		return Promise.reject()
	}

	// Try to accept the WebRTC connection
	try {
		await acceptConnectRTC(callId, localStream, remoteStream)
	} catch {
		console.error('Unable to join the WebRTC connection')
		return Promise.reject()
	}

	return {
		localStream,
		remoteStream,
	}
}
