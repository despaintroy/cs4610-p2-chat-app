import { Button, Input, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import {
	disconnectCall,
	joinCall,
	listenForIncomingCalls,
	startCall,
	VideoCall,
} from 'utils/helpers/videoCall'
import { auth } from 'utils/services/auth'

const WebRtcTest: React.FC = () => {
	const [otherUserId, setOtherUserId] = React.useState('')

	const localVideoEl = React.useRef<HTMLVideoElement>(null)
	const remoteVideoEl = React.useRef<HTMLVideoElement>(null)

	const [videoCall, setVideoCall] = useState<VideoCall>()

	const onDisconnect = (): void => console.log('onDisconnect')

	useEffect(() => {
		if (!auth.currentUser) return

		listenForIncomingCalls(auth.currentUser.uid, (callId: string) => {
			console.log('RECEIVED INCOMING CALL', callId)
			const willJoin = confirm('Incoming call from ' + callId)
			if (willJoin) joinCall(callId, onDisconnect).then(setVideoCall)
		})
	}, [auth.currentUser])

	// When call is created, attach video streams to the video elements
	useEffect(() => {
		if (!videoCall || !localVideoEl.current || !remoteVideoEl.current) return

		localVideoEl.current.srcObject = videoCall.localStream
		remoteVideoEl.current.srcObject = videoCall.remoteStream
	}, [videoCall, localVideoEl, remoteVideoEl])

	return (
		<Box sx={{ py: 4 }}>
			<Typography variant='h2'>WebRTC Test</Typography>
			<Box
				sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: '20px' }}
			>
				<Typography>
					My ID: <code>{auth.currentUser?.uid}</code>
				</Typography>
				<Input
					placeholder='Other User ID'
					onChange={(value): void => setOtherUserId(value.target.value)}
				/>
				<Button
					variant='contained'
					disabled={!otherUserId}
					onClick={(): void => {
						startCall(otherUserId, onDisconnect).then(setVideoCall)
					}}
				>
					Request Call
				</Button>
				<Button
					disabled={!videoCall}
					variant='contained'
					onClick={(): void => videoCall && disconnectCall(videoCall)}
				>
					End Call
				</Button>

				<div id='videos'>
					<video
						ref={localVideoEl}
						id='localVideo'
						muted
						autoPlay
						playsInline
					/>
					<video ref={remoteVideoEl} id='remoteVideo' autoPlay playsInline />
				</div>
			</Box>
		</Box>
	)
}

export default WebRtcTest
