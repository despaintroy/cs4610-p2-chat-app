import {
	Check,
	Mic,
	MicOff,
	Settings,
	Videocam,
	VideocamOff,
} from '@mui/icons-material'
import {
	AppBar,
	Button,
	Dialog,
	Divider,
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	MenuList,
	Stack,
	ToggleButton,
	Toolbar,
} from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useRef, useState } from 'react'
import useVideoCall, { CallStatus } from 'utils/helpers/useVideoCall'
import { PublicProfile } from 'utils/services/models'

const VideoCallDialog: React.FC<{
	profile: PublicProfile
	handleClose: () => void
}> = ({ profile, handleClose }) => {
	const videoCall = useVideoCall()

	const localVideoEl = useRef<HTMLVideoElement>(null)
	const remoteVideoEl = useRef<HTMLVideoElement>(null)

	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

	useEffect(() => {
		videoCall.startPreview()
	}, [])

	useEffect(() => {
		if (!localVideoEl.current) return
		localVideoEl.current.srcObject = videoCall.streams.local
	}, [videoCall.streams.local, localVideoEl.current])

	useEffect(() => {
		if (!remoteVideoEl.current) return
		remoteVideoEl.current.srcObject = videoCall.streams.incoming
	}, [videoCall.streams.incoming, remoteVideoEl.current])

	return (
		<Dialog fullScreen open={true}>
			<Stack height='100%'>
				<Box sx={{ bgcolor: '#000', flexGrow: 1, position: 'relative' }}>
					<video
						ref={
							videoCall.callStatus === CallStatus.DISCONNECTED
								? localVideoEl
								: remoteVideoEl
						}
						id='localVideo'
						muted={videoCall.callStatus === CallStatus.DISCONNECTED}
						autoPlay
						playsInline
						style={{
							width: '100%',
							height: '100%',
						}}
					/>
					<video
						ref={
							videoCall.callStatus === CallStatus.DISCONNECTED
								? remoteVideoEl
								: localVideoEl
						}
						id='remoteVideo'
						autoPlay
						muted={videoCall.callStatus !== CallStatus.DISCONNECTED}
						playsInline
						style={{
							border: '1px solid #ccc',
							width: '300px',
							height: 'auto',
							position: 'absolute',
							top: '10px',
							left: '10px',
							backgroundColor: '#111',
						}}
					/>
				</Box>
				<AppBar position='static'>
					<Toolbar sx={{ gap: 2 }}>
						<IconButton
							id='basic-button'
							onClick={(e): void => {
								setMenuAnchor(e.currentTarget)
							}}
						>
							<Settings />
						</IconButton>
						<Menu
							id='basic-menu'
							anchorEl={menuAnchor}
							open={!!menuAnchor}
							onClose={(): void => setMenuAnchor(null)}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							transformOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
						>
							<MenuList dense>
								<Divider>Camera</Divider>
								{videoCall.video.availableCameras.map(cam => {
									const isSelected =
										videoCall.video.selectedCamera?.deviceId === cam.deviceId
									return (
										<MenuItem
											key={cam.deviceId}
											onClick={(): void =>
												videoCall.video.setCamera(cam.deviceId)
											}
										>
											{isSelected && (
												<ListItemIcon>
													<Check />
												</ListItemIcon>
											)}
											<ListItemText inset={!isSelected}>
												{cam.label}
											</ListItemText>
										</MenuItem>
									)
								})}

								<Divider>Microphone</Divider>
								{videoCall.audio.availableMics.map(mic => {
									const isSelected =
										videoCall.audio.selectedMic?.deviceId === mic.deviceId
									return (
										<MenuItem
											key={mic.deviceId}
											onClick={(): void => videoCall.audio.setMic(mic.deviceId)}
										>
											{isSelected && (
												<ListItemIcon>
													<Check />
												</ListItemIcon>
											)}
											<ListItemText inset={!isSelected}>
												{mic.label}
											</ListItemText>
										</MenuItem>
									)
								})}
							</MenuList>
						</Menu>

						<ToggleButton
							color='error'
							value='check'
							selected={videoCall.video.muted}
							onChange={(): void => videoCall.video.toggleMuted()}
							disableRipple
						>
							{videoCall.video.muted ? <VideocamOff /> : <Videocam />}
						</ToggleButton>
						<ToggleButton
							color='error'
							value='check'
							selected={videoCall.audio.muted}
							onChange={(): void => videoCall.audio.toggleMuted()}
							disableRipple
						>
							{videoCall.audio.muted ? <MicOff /> : <Mic />}
						</ToggleButton>
						{videoCall.callStatus === CallStatus.DISCONNECTED ? (
							<Button
								variant='contained'
								color='success'
								onClick={(): void => {
									videoCall.callUser(profile.id)
								}}
								sx={{ marginLeft: 'auto' }}
							>
								Start Call
							</Button>
						) : (
							<Button
								variant='contained'
								color='error'
								onClick={(): void => {
									videoCall.endCall()
									handleClose()
								}}
								sx={{ marginLeft: 'auto' }}
							>
								End Call
							</Button>
						)}
					</Toolbar>
				</AppBar>
			</Stack>
		</Dialog>
	)
}

export default VideoCallDialog
