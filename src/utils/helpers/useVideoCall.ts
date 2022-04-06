import { useEffect, useState } from 'react'
import { joinCall, listenForIncomingCalls, startCall } from './_videoCall'

export enum CallStatus {
	DISCONNECTED,
	RINGING,
	CONNECTED,
}

const useVideoCall = (): {
	streams: {
		local: MediaStream | null
		incoming: MediaStream | null
	}
	callUser: (userId: string, onDisconnect?: () => void) => Promise<void>
	join: (callId: string, onDisconnect?: () => void) => Promise<void>
	disconnect: () => void
	callStatus: CallStatus
	video: {
		setMuted: (muted: boolean) => void
		toggleMuted: () => void
		muted: boolean
		availableCameras: MediaDeviceInfo[]
		setCamera: (deviceId: string) => void
		selectedCamera: MediaDeviceInfo | null
	}
	audio: {
		setMuted: (muted: boolean) => void
		toggleMuted: () => void
		muted: boolean
		availableMics: MediaDeviceInfo[]
		setMic: (deviceId: string) => void
		selectedMic: MediaDeviceInfo | null
	}
	listenForIncomingCalls: (
		userId: string,
		handleIncoming: (callId: string) => void
	) => () => void
} => {
	const [localStream, setLocalStream] = useState<MediaStream | null>(null)
	const [incomingStream, setIncomingStream] = useState<MediaStream | null>(null)
	const [callId, setCallId] = useState<string | null>(null)
	const [peerConnection, setPeerConnection] =
		useState<RTCPeerConnection | null>(null)
	const [callStatus, setCallStatus] = useState<CallStatus>(
		CallStatus.DISCONNECTED
	)
	const [videoMuted, setVideoMuted] = useState(false)
	const [audioMuted, setAudioMuted] = useState(false)

	const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>(
		[]
	)
	const [selectedCamera, setSelectedCamera] = useState<MediaDeviceInfo | null>(
		null
	)

	const [availableMics, setAvailableMics] = useState<MediaDeviceInfo[]>([])
	const [selectedMic, setSelectedMic] = useState<MediaDeviceInfo | null>(null)

	useEffect(() => {
		console.log('VIDEO MUTED:', videoMuted)
		localStream
			?.getVideoTracks()
			.forEach(track => (track.enabled = !videoMuted))
	}, [videoMuted])

	useEffect(() => {
		console.log('AUDIO MUTED:', audioMuted)
		localStream
			?.getAudioTracks()
			.forEach(track => (track.enabled = !audioMuted))
	}, [audioMuted])

	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then(() => {
				navigator.mediaDevices.enumerateDevices().then(devices => {
					const cameras = devices.filter(device => device.kind === 'videoinput')
					setAvailableCameras(cameras)
					setSelectedCamera(cameras[0] || null)

					const mics = devices.filter(device => device.kind === 'audioinput')
					setAvailableMics(mics)
					setSelectedMic(mics[0] || null)
				})
			})
	}, [])

	const callUser = async (
		userId: string,
		onDisconnect?: () => void
	): Promise<void> => {
		return startCall(userId, onDisconnect).then(v => {
			setCallStatus(CallStatus.CONNECTED)

			setLocalStream(v.localStream)
			setIncomingStream(v.remoteStream)
			setPeerConnection(v.peerConnection)
			setCallId(v.callId)
		})
	}

	const joinExistingCall = async (
		callId: string,
		onDisconnect?: () => void
	): Promise<void> => {
		return joinCall(callId, onDisconnect).then(v => {
			setCallStatus(CallStatus.CONNECTED)

			setLocalStream(v.localStream)
			setIncomingStream(v.remoteStream)
			setPeerConnection(v.peerConnection)
			setCallId(v.callId)
		})
	}

	const disconnectCall = (): void => {
		localStream?.getTracks().forEach(track => track.stop())
		incomingStream?.getTracks().forEach(track => track.stop())
		peerConnection?.close()
		setCallStatus(CallStatus.DISCONNECTED)
	}

	const setCameraById = (deviceId: string): void => {
		const camera = availableCameras.find(device => device.deviceId === deviceId)
		setSelectedCamera(camera || null)
	}

	const setMicById = (deviceId: string): void => {
		const mic = availableMics.find(device => device.deviceId === deviceId)
		setSelectedMic(mic || null)
	}

	return {
		streams: {
			local: localStream,
			incoming: incomingStream,
		},
		callUser,
		join: joinExistingCall,
		disconnect: disconnectCall,
		callStatus,
		video: {
			setMuted: setVideoMuted,
			toggleMuted: () => setVideoMuted(!videoMuted),
			muted: videoMuted,
			availableCameras,
			setCamera: setCameraById,
			selectedCamera,
		},
		audio: {
			setMuted: setAudioMuted,
			toggleMuted: () => setAudioMuted(!audioMuted),
			muted: audioMuted,
			availableMics,
			setMic: setMicById,
			selectedMic,
		},
		listenForIncomingCalls,
	}
}

export default useVideoCall
