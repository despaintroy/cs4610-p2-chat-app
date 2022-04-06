import { useState } from 'react'
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

	return {
		streams: {
			local: localStream,
			incoming: incomingStream,
		},
		callUser,
		join: joinExistingCall,
		disconnect: disconnectCall,
		callStatus,
		listenForIncomingCalls,
	}
}

export default useVideoCall
