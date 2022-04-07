import {
	CancelPresentation,
	Check,
	Mic,
	MicOff,
	PresentToAll,
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
	Switch,
	ToggleButton,
	Toolbar,
} from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useRef, useState } from 'react'
import useVideoCall, { CallStatus } from 'utils/helpers/useVideoCall'
import { PublicProfile } from 'utils/services/models'

const VideoCallDialog: React.FC<{
	profile: PublicProfile | undefined
	handleClose: () => void
	show: boolean
}> = ({ profile, handleClose, show }) => {
	const videoCall = useVideoCall()

	const localVideoEl = useRef<HTMLVideoElement>(null)
	const remoteVideoEl = useRef<HTMLVideoElement>(null)

	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

	const [mirror, setMirror] = useState(true)

	useEffect(() => {
		if (show) videoCall.startPreview()
		else videoCall.stopPreview()
	}, [show])

	useEffect(() => {
		if (!localVideoEl.current) return
		localVideoEl.current.srcObject = videoCall.streams.local
	}, [videoCall.streams.local, localVideoEl.current])

	useEffect(() => {
		if (!remoteVideoEl.current) return
		remoteVideoEl.current.srcObject = videoCall.streams.incoming
	}, [videoCall.streams.incoming, remoteVideoEl.current])

	if (!profile) return null

	return (
		<Dialog fullScreen open={show && !!profile}>
			<Stack height='100%'>
				<Box
					sx={{
						bgcolor: '#000',
						height: '0',
						flexGrow: 1,
						position: 'relative',
					}}
				>
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
						className={
							mirror &&
							videoCall.callStatus === CallStatus.DISCONNECTED &&
							!videoCall.screenShare.isSharing
								? 'mirror-video'
								: ''
						}
						style={{
							width: '100%',
							height: '100%',
						}}
					/>
					{videoCall.callStatus !== CallStatus.DISCONNECTED && (
						<video
							ref={localVideoEl}
							id='remoteVideo'
							autoPlay
							muted
							playsInline
							className={
								!videoCall.screenShare.isSharing && mirror ? 'mirror-video' : ''
							}
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
					)}
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

								<MenuItem
									onClick={(): void => setMirror(!mirror)}
									disableRipple
									sx={{ mt: 1 }}
								>
									<ListItemText inset>Mirror my video preview</ListItemText>
									<Switch
										checked={mirror}
										onChange={(): void => setMirror(!mirror)}
									/>
								</MenuItem>

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
							size='small'
							disableRipple
						>
							{videoCall.video.muted ? <VideocamOff /> : <Videocam />}
						</ToggleButton>
						<ToggleButton
							color='error'
							value='check'
							selected={videoCall.audio.muted}
							onChange={(): void => videoCall.audio.toggleMuted()}
							size='small'
							disableRipple
						>
							{videoCall.audio.muted ? <MicOff /> : <Mic />}
						</ToggleButton>
						<Button
							color={videoCall.screenShare.isSharing ? 'error' : 'inherit'}
							onClick={(): void => videoCall.screenShare.toggleSharing()}
							startIcon={
								videoCall.screenShare.isSharing ? (
									<CancelPresentation />
								) : (
									<PresentToAll />
								)
							}
							sx={{ px: '1rem' }}
						>
							{videoCall.screenShare.isSharing
								? 'Stop Sharing'
								: 'Share Screen'}
						</Button>
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
									videoCall.stopPreview()
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
