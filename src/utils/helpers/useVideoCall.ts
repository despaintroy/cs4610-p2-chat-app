import { useEffect, useState } from 'react'
import * as videoCallFunctions from './_videoCall'

export enum CallStatus {
	DISCONNECTED,
	RINGING,
	CONNECTED,
}

export interface UseVideoCallReturnType {
	startPreview: () => Promise<void>
	callUser: (userId: string, onDisconnect?: () => void) => Promise<void>
	joinCall: (callId: string, onDisconnect?: () => void) => Promise<void>
	endCall: () => void
	callStatus: CallStatus
	streams: {
		local: MediaStream | null
		incoming: MediaStream | null
	}
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
}

const useVideoCall = (): UseVideoCallReturnType => {
	// Call
	const [callId, setCallId] = useState<string | null>(null)
	const [callStatus, setCallStatus] = useState<CallStatus>(
		CallStatus.DISCONNECTED
	)

	// Streaming
	const [localStream, setLocalStream] = useState<MediaStream | null>(null)
	const [incomingStream, setIncomingStream] = useState<MediaStream | null>(null)
	const [peerConnection, setPeerConnection] =
		useState<RTCPeerConnection | null>(null)

	// Media
	const [cameraMuted, setCameraMuted] = useState(false)
	const [audioMuted, setAudioMuted] = useState(false)

	const [availableCams, setAvailableCams] = useState<MediaDeviceInfo[]>([])
	const [selectedCam, setSelectedCam] = useState<MediaDeviceInfo | null>(null)

	const [availableMics, setAvailableMics] = useState<MediaDeviceInfo[]>([])
	const [selectedMic, setSelectedMic] = useState<MediaDeviceInfo | null>(null)

	const [isSharing, setIsSharing] = useState(false)
	const [screenShareTrack, setScreenShareTrack] =
		useState<MediaStreamTrack | null>(null)

	const setupLocalStream = async (): Promise<MediaStream> => {
		const stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true,
		})

		setLocalStream(stream)

		navigator.mediaDevices.enumerateDevices().then(devices => {
			const cameras = devices.filter(device => device.kind === 'videoinput')
			setAvailableCams(cameras)
			setSelectedCam(cameras[0] || null)

			const mics = devices.filter(device => device.kind === 'audioinput')
			setAvailableMics(mics)
			setSelectedMic(mics[0] || null)
		})

		return stream
	}

	const setCameraById = (deviceId: string): void => {
		const camera = availableCams.find(device => device.deviceId === deviceId)
		setSelectedCam(camera || null)
	}

	const setMicById = (deviceId: string): void => {
		const mic = availableMics.find(device => device.deviceId === deviceId)
		setSelectedMic(mic || null)
	}

	useEffect(() => {
		!isSharing && screenShareTrack?.stop()
	}, [isSharing])

	useEffect(() => {
		localStream && streamSelectedInputs()
	}, [selectedCam, isSharing, cameraMuted, selectedMic, audioMuted])

	async function streamSelectedInputs(): Promise<void> {
		let targetVideoTrack: MediaStreamTrack | null | undefined = null
		let targetAudioTrack: MediaStreamTrack | null | undefined = null

		const deviceMediaStream = await navigator.mediaDevices
			.getUserMedia({
				audio: {
					deviceId: selectedMic?.deviceId,
				},
				video: {
					deviceId: selectedCam?.deviceId,
				},
			})
			.catch(() => null)

		targetAudioTrack = audioMuted
			? null
			: deviceMediaStream?.getAudioTracks()[0]

		if (!isSharing) {
			targetVideoTrack = cameraMuted
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
		const stream = localStream || (await setupLocalStream())

		return videoCallFunctions
			.startCall(userId, stream, () => handleDisconnectCall(onDisconnect))
			.then(v => {
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
		const stream = localStream || (await setupLocalStream())

		return videoCallFunctions
			.joinCall(callId, stream, () => handleDisconnectCall(onDisconnect))
			.then(v => {
				setCallStatus(CallStatus.CONNECTED)

				setIncomingStream(v.remoteStream)
				setPeerConnection(v.peerConnection)
				setCallId(callId)
			})
	}

	const handleDisconnectCall = (callback?: () => void): void => {
		localStream?.getTracks().forEach(track => track.stop())
		incomingStream?.getTracks().forEach(track => track.stop())
		peerConnection?.close()
		setCallStatus(CallStatus.DISCONNECTED)
		callback && callback()
	}

	return {
		startPreview: async (): Promise<void> => {
			await setupLocalStream()
		},
		callUser,
		joinCall: joinExistingCall,
		endCall: handleDisconnectCall,
		streams: {
			local: localStream,
			incoming: incomingStream,
		},
		callStatus,
		screenShare: {
			setIsSharing,
			isSharing,
			toggleSharing: () => setIsSharing(!isSharing),
		},
		video: {
			setMuted: setCameraMuted,
			toggleMuted: () => setCameraMuted(!cameraMuted),
			muted: cameraMuted,
			availableCameras: availableCams,
			setCamera: setCameraById,
			selectedCamera: selectedCam,
		},
		audio: {
			setMuted: setAudioMuted,
			toggleMuted: () => setAudioMuted(!audioMuted),
			muted: audioMuted,
			availableMics,
			setMic: setMicById,
			selectedMic,
		},
		listenForIncomingCalls: videoCallFunctions.listenForIncomingCalls,
	}
}

export default useVideoCall
