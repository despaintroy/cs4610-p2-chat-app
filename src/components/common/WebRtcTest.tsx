import { Mic, MicOff, Videocam, VideocamOff } from '@mui/icons-material'
import { Button, Input, Stack, ToggleButton, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect } from 'react'
import useVideoCall, { CallStatus } from 'utils/helpers/useVideoCall'
import { auth } from 'utils/services/auth'

const WebRtcTest: React.FC = () => {
	const [otherUserId, setOtherUserId] = React.useState('')

	const videoCall = useVideoCall()

	const localVideoEl = React.useRef<HTMLVideoElement>(null)
	const remoteVideoEl = React.useRef<HTMLVideoElement>(null)

	useEffect(() => {
		if (!auth.currentUser) return

		videoCall.listenForIncomingCalls(auth.currentUser.uid, (callId: string) => {
			console.log('RECEIVED INCOMING CALL', callId)
			const willJoin = confirm('Incoming call from ' + callId)
			if (willJoin) videoCall.join(callId)
		})
	}, [auth.currentUser])

	// When call is created, attach video streams to the video elements
	useEffect(() => {
		if (!localVideoEl.current || !remoteVideoEl.current) return

		localVideoEl.current.srcObject = videoCall.streams.local
		remoteVideoEl.current.srcObject = videoCall.streams.incoming
	}, [
		videoCall.streams.local,
		videoCall.streams.incoming,
		localVideoEl.current,
		remoteVideoEl.current,
	])

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
						videoCall.callUser(otherUserId)
					}}
				>
					Request Call
				</Button>
				<Button
					disabled={videoCall.callStatus === CallStatus.DISCONNECTED}
					variant='contained'
					onClick={(): void => videoCall.disconnect()}
				>
					End Call
				</Button>

				<Stack direction='row' gap={2}>
					<ToggleButton
						value='check'
						selected={videoCall.video.muted}
						onChange={(): void => videoCall.video.toggleMuted()}
					>
						{videoCall.video.muted ? <VideocamOff /> : <Videocam />}
					</ToggleButton>

					<ToggleButton
						value='check'
						selected={videoCall.audio.muted}
						onChange={(): void => videoCall.audio.toggleMuted()}
					>
						{videoCall.audio.muted ? <MicOff /> : <Mic />}
					</ToggleButton>
				</Stack>

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
