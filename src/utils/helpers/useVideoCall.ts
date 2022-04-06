import { useEffect, useState } from 'react'
import {
	joinCall,
	listenForIncomingCalls,
	requestDeviceMedia,
	startCall,
} from './_videoCall'

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
	screenShare: {
		setIsSharing: (isSharing: boolean) => void
		toggleSharing: () => void
		isSharing: boolean
	}
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

	const [isSharing, setIsSharing] = useState(false)
	const [screenShareTrack, setScreenShareTrack] =
		useState<MediaStreamTrack | null>(null)

	useEffect(() => {
		requestDeviceMedia().then(stream => {
			setLocalStream(stream)

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

	useEffect(() => {
		streamSelectedInputs()
	}, [selectedCamera, isSharing, videoMuted])

	useEffect(() => {
		streamSelectedInputs()
	}, [selectedMic, audioMuted])

	useEffect(() => {
		!isSharing && screenShareTrack?.stop()
	}, [isSharing])

	async function streamSelectedInputs(): Promise<void> {
		let targetVideoTrack: MediaStreamTrack | null | undefined = null
		let targetAudioTrack: MediaStreamTrack | null | undefined = null

		const deviceMediaStream = await requestDeviceMedia({
			audio: {
				deviceId: selectedMic?.deviceId,
			},
			video: {
				deviceId: selectedCamera?.deviceId,
			},
		}).catch(() => null)

		targetAudioTrack = audioMuted
			? null
			: deviceMediaStream?.getAudioTracks()[0]

		if (!isSharing) {
			targetVideoTrack = videoMuted
				? null
				: deviceMediaStream?.getVideoTracks()[0]
		} else if (screenShareTrack && screenShareTrack.readyState !== 'ended') {
			targetVideoTrack = screenShareTrack
		} else {
			const screenVideoTrack = await navigator.mediaDevices
				.getDisplayMedia()
				.then(stream => stream.getVideoTracks()[0])
				.catch(() => setIsSharing(false))

			if (screenVideoTrack) {
				screenVideoTrack.onended = (): void => {
					setIsSharing(false), setScreenShareTrack(null)
				}

				targetVideoTrack = screenVideoTrack
				setScreenShareTrack(screenVideoTrack)
			} else {
				console.error('Failed to share screen')
			}
		}

		const tracks: MediaStreamTrack[] = []
		if (targetAudioTrack) tracks.push(targetAudioTrack)
		if (targetVideoTrack) tracks.push(targetVideoTrack)

		setLocalStream(new MediaStream(tracks))
	}

	// When the sources of the local stream change, we need to update the WebRTC tracks
	useEffect(() => {
		const currentAudioTrack = localStream?.getAudioTracks()[0]
		const currentVideoTrack = localStream?.getVideoTracks()[0]

		peerConnection?.getSenders().forEach(sender => {
			const track = sender.track
			if (track?.kind === 'audio') {
				if (currentAudioTrack && track.id !== currentAudioTrack.id) {
					sender.replaceTrack(currentAudioTrack)
				}
				track.enabled = !!currentAudioTrack
			}
			if (track?.kind === 'video') {
				if (currentVideoTrack && track.id !== currentVideoTrack.id) {
					sender.replaceTrack(currentVideoTrack)
				}
				track.enabled = !!currentVideoTrack
			}
		})
	}, [localStream])

	const callUser = async (
		userId: string,
		onDisconnect?: () => void
	): Promise<void> => {
		return startCall(userId, onDisconnect).then(v => {
			setCallStatus(CallStatus.CONNECTED)

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
		screenShare: {
			setIsSharing,
			isSharing,
			toggleSharing: () => setIsSharing(!isSharing),
		},
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
