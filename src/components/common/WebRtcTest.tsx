import { Mic, MicOff, Videocam, VideocamOff } from '@mui/icons-material'
import {
	Button,
	FormControl,
	Input,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	ToggleButton,
	Typography,
} from '@mui/material'
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

					<FormControl fullWidth>
						<InputLabel id='camera-select-label'>Select Camera</InputLabel>
						<Select
							labelId='camera-select-label'
							id='camera-select'
							value={videoCall.video.selectedCamera?.deviceId || 'none'}
							disabled={!videoCall.video.selectedCamera}
							label='Select Camera'
							fullWidth
							onChange={(e): void => videoCall.video.setCamera(e.target.value)}
						>
							{!videoCall.video.selectedCamera && (
								<MenuItem value='none'>No cameras available</MenuItem>
							)}
							{videoCall.video.availableCameras.map(camera => (
								<MenuItem key={camera.deviceId} value={camera.deviceId}>
									{camera.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Stack>

				<Stack direction='row' gap={2}>
					<ToggleButton
						value='check'
						selected={videoCall.audio.muted}
						onChange={(): void => videoCall.audio.toggleMuted()}
					>
						{videoCall.audio.muted ? <MicOff /> : <Mic />}
					</ToggleButton>

					<FormControl fullWidth>
						<InputLabel id='microphone-select-label'>
							Select Microphone
						</InputLabel>
						<Select
							labelId='microphone-select-label'
							id='microphone-select'
							value={videoCall.audio.selectedMic?.deviceId || 'none'}
							disabled={!videoCall.audio.selectedMic}
							label='Select Microphone'
							fullWidth
							onChange={(e): void => videoCall.audio.setMic(e.target.value)}
						>
							{!videoCall.audio.selectedMic && (
								<MenuItem value='none'>No microphones available</MenuItem>
							)}
							{videoCall.audio.availableMics.map(microphone => (
								<MenuItem key={microphone.deviceId} value={microphone.deviceId}>
									{microphone.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>
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
