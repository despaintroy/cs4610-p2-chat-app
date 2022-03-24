import {
	Avatar,
	FormHelperText,
	IconButton,
	InputAdornment,
	OutlinedInput,
	Skeleton,
	Stack,
	Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import React, {
	FC,
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react'
import { useParams } from 'react-router-dom'
import { ChannelsContext, ServerContext } from 'AuthHome'
import SendIcon from '@mui/icons-material/Send'
import { Channel, Message, PublicProfile } from 'utils/services/models'
import parse from 'html-react-parser'
import { sendMessage, watchMessages } from 'utils/services/messages'
import { getUserProfiles } from 'utils/services/user'

const ChannelDetail: FC = () => {
	const { channelId } = useParams<{ serverId: string; channelId: string }>()
	const server = useContext(ServerContext)
	const channels = useContext(ChannelsContext) || []
	const messagesEndRef = useRef<HTMLDivElement>(null)

	const [messageDraft, setMessageDraft] = useState('')
	const [messages, setMessages] = useState<Message[] | undefined>()
	const [selectedChannel, setSelectedChannel] = useState<Channel | undefined>()
	const [userProfiles, setUserProfiles] = useState<PublicProfile[]>()

	const scrollToBottom = (behavior: ScrollBehavior = 'auto'): void => {
		messagesEndRef?.current?.scrollIntoView({ behavior })
	}

	useEffect(() => {
		if (!channelId) return

		watchMessages(channelId, setMessages)

		setSelectedChannel(
			channels.find(channel => channel.id === channelId) || undefined
		)
	}, [channelId])

	useEffect(() => {
		if (!server) return
		getUserProfiles(server.users).then(setUserProfiles).catch(console.error)
	}, [server])

	useLayoutEffect(scrollToBottom, [messages])

	const handleSend = (): void => {
		if (!messageDraft || !channelId) return
		sendMessage(channelId, messageDraft)
		setMessageDraft('')
	}

	return (
		<Stack direction='row' sx={{ width: '100%' }}>
			<Stack
				direction='column'
				sx={{ width: '100%', backgroundColor: '#37393e' }}
			>
				<Box sx={{ borderBottom: 1, borderColor: 'black', px: 2, py: 1 }}>
					<Typography variant='h6'>{`# ${selectedChannel?.name}`}</Typography>
				</Box>
				<Box
					className='messages-container'
					sx={{ pb: 2, mt: 'auto', width: '100%', overflowY: 'scroll' }}
				>
					{!userProfiles || !messages ? (
						// TODO: Loading
						<></>
					) : (
						messages
							.sort((a, b) => {
								if (!a.timestamp) return 1
								if (!b.timestamp) return -1
								return Number(a.timestamp) - Number(b.timestamp)
							})
							.map((message, index) => {
								const userProfile = userProfiles?.find(
									profile => profile.id === message.userId
								)

								return (
									<Box key={index} className='message'>
										<Stack direction='row'>
											<Avatar
												sx={{ mr: 2, mt: 1 }}
												src={userProfile?.profileImage || undefined}
											/>
											<Box sx={{ width: '100%' }}>
												<Stack direction='row'>
													<Box className='user-name'>
														{userProfile?.name || <i>Removed</i>}
													</Box>
													<Box className='time' sx={{ ml: 'auto' }}>
														<Typography variant='caption' color='text.disabled'>
															{message.timestamp?.toISOString().split('T')[0] ||
																'-'}
														</Typography>
													</Box>
												</Stack>
												<Box className='content' color='#d9dadb'>
													{parse(
														message.content?.replace(/[\n\r]/g, '<br />') || ''
													)}
												</Box>
											</Box>
										</Stack>
									</Box>
								)
							})
					)}
					<div ref={messagesEndRef} />
				</Box>
				<Box sx={{ px: 2, pb: 3, bgcolor: '#37393e' }}>
					<OutlinedInput
						multiline
						fullWidth
						autoFocus
						placeholder={`Message #${selectedChannel?.name}`}
						size='small'
						autoComplete='off'
						value={messageDraft}
						onChange={(e): void => setMessageDraft(e.target.value)}
						onKeyDown={(e): void => {
							if (e.key === 'Enter' && !e.shiftKey) {
								e.preventDefault()
								handleSend()
							}
						}}
						endAdornment={
							<InputAdornment position='end'>
								<IconButton
									edge='end'
									onClick={handleSend}
									disabled={!messageDraft}
								>
									<SendIcon />
								</IconButton>
							</InputAdornment>
						}
						sx={{ bgcolor: '#41444A' }}
					/>
					<FormHelperText>
						<Typography variant='caption' color='text.disabled'>
							Press <b>Enter</b> to send, <b>Shift + Enter</b> for new line
						</Typography>
					</FormHelperText>
				</Box>
			</Stack>
			<Box sx={{ minWidth: '250px', bgcolor: '#2f3136' }}>
				<Box
					sx={{
						backgroundColor: '#37393e',
						borderBottom: 1,
						borderColor: 'black',
						px: 2,
						py: 1,
					}}
				>
					<Typography variant='h6'>&nbsp;</Typography>
				</Box>
				<Box sx={{ px: 3, py: 1 }}>
					<Typography variant='h6' color='text.disabled'>
						Channel Members
					</Typography>
					{userProfiles?.map(profile => (
						<Stack
							key={profile.id}
							direction='row'
							alignItems='center'
							sx={{ my: 1 }}
						>
							<Avatar
								src={profile.profileImage || undefined}
								sx={{ mr: 2, width: '2rem', height: '2rem' }}
							/>
							<Box className='user-name' sx={{ width: '100%' }}>
								{profile.name}
							</Box>
						</Stack>
					))}
				</Box>
			</Box>
		</Stack>
	)
}

export default ChannelDetail
