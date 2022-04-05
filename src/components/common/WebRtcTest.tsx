import { Button, Input, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { createCall, joinCall, openUserMedia } from 'utils/services/webRTC'

const WebRtcTest: React.FC = () => {
	const [callId, setCallId] = React.useState('')

	const localVideo = React.useRef<HTMLVideoElement>(null)
	const remoteVideo = React.useRef<HTMLVideoElement>(null)

	return (
		<Box sx={{ py: 4 }}>
			<Typography variant='h2'>WebRTC Test</Typography>
			<Box
				sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: '20px' }}
			>
				<Button
					variant='contained'
					onClick={(): void => {
						localVideo.current &&
							remoteVideo.current &&
							openUserMedia(localVideo.current, remoteVideo.current)
					}}
				>
					Setup Camera / Mic
				</Button>
				<Button
					variant='contained'
					onClick={(): void => {
						createCall()
					}}
				>
					Test Create Connection
				</Button>
				<Input
					placeholder='Room ID'
					onChange={(value): void => setCallId(value.target.value)}
				/>
				<Button
					variant='contained'
					onClick={(): void => {
						joinCall(callId)
					}}
				>
					Test Join Connection
				</Button>

				<div id='videos'>
					<video ref={localVideo} id='localVideo' muted autoPlay playsInline />
					<video ref={remoteVideo} id='remoteVideo' autoPlay playsInline />
				</div>
			</Box>
		</Box>
	)
}

export default WebRtcTest
