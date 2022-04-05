import { Button, Input, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { joinCall, startCall } from 'utils/helpers/videoCall'

const WebRtcTest: React.FC = () => {
	const [callId, setCallId] = React.useState('')

	const localVideoEl = React.useRef<HTMLVideoElement>(null)
	const remoteVideoEl = React.useRef<HTMLVideoElement>(null)

	const [localStream, setLocalStream] = useState<MediaStream | null>(null)
	const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)

	useEffect(() => {
		if (localStream && localVideoEl.current) {
			localVideoEl.current.srcObject = localStream
		}
	}, [localStream, localVideoEl.current])

	useEffect(() => {
		if (remoteStream && remoteVideoEl.current) {
			remoteVideoEl.current.srcObject = remoteStream
		}
	}, [remoteStream, remoteVideoEl.current])

	return (
		<Box sx={{ py: 4 }}>
			<Typography variant='h2'>WebRTC Test</Typography>
			<Box
				sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: '20px' }}
			>
				<Button
					variant='contained'
					onClick={(): void => {
						startCall().then(r => {
							setLocalStream(r.localStream)
							setRemoteStream(r.remoteStream)
							console.log('CALL ID:', r.callId)
						})
					}}
				>
					Request Call
				</Button>
				<Input
					placeholder='Room ID'
					onChange={(value): void => setCallId(value.target.value)}
				/>
				<Button
					variant='contained'
					onClick={(): void => {
						joinCall(callId).then(r => {
							setLocalStream(r.localStream)
							setRemoteStream(r.remoteStream)
						})
					}}
				>
					Join Call
				</Button>
				{/* <Button
					variant='contained'
					onClick={(): void => {
						hangUp()
					}}
				>
					End Call
				</Button> */}

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
