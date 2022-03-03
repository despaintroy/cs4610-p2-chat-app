import {
	Avatar,
	FormHelperText,
	IconButton,
	InputAdornment,
	OutlinedInput,
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
import { ServersContext } from 'AuthHome'
import SendIcon from '@mui/icons-material/Send'
import { Channel, Message, Server } from 'utils/services/models'
import parse from 'html-react-parser'

const ChannelDetail: FC = () => {
	const { serverId, channelId } =
		useParams<{ serverId: string; channelId: string }>()
	const servers = useContext(ServersContext) || []
	const messagesEndRef = useRef<HTMLDivElement>(null)

	const [messageDraft, setMessageDraft] = useState('')
	const [messages, setMessages] = useState<Message[] | undefined>()
	const [server, setServer] = useState<Server | undefined>()
	const [channel, setChannel] = useState<Channel | undefined>()

	const scrollToBottom = (behavior: ScrollBehavior = 'auto'): void => {
		messagesEndRef?.current?.scrollIntoView({ behavior })
	}

	useEffect(() => {
		const foundServer = servers.find(server => server.id === serverId)
		const foundChannel = foundServer?.channels?.find(
			channel => channel.id === channelId
		)
		setServer(foundServer)
		setChannel(foundChannel)
		foundChannel?.messages &&
			setMessages([...foundChannel.messages, ...foundChannel.messages])
	}, [channelId])

	useLayoutEffect(scrollToBottom, [messages])

	const handleSend = (): void => {
		if (!messageDraft) return
		setMessages(messages => [
			...(messages || []),
			{
				id: Math.random().toString(),
				userId: '0',
				timestamp: new Date(),
				content: messageDraft,
			},
		])
		setMessageDraft('')
	}

	return (
		<Stack direction='row'>
			<Stack direction='column' sx={{ backgroundColor: '#37393e' }}>
				<Box sx={{ borderBottom: 1, borderColor: 'black', px: 2, py: 1 }}>
					<Typography variant='h6'>{`# ${channel?.name}`}</Typography>
				</Box>
				<Box
					className='messages-container'
					sx={{ pb: 2, mt: 'auto', width: '100%', overflowY: 'scroll' }}
				>
					{messages?.map((message, index) => {
						const userProfile = server?.userProfiles?.find(
							profile => profile.userId === message.userId
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
													{(message.timestamp &&
														new Date(message.timestamp)
															.toISOString()
															.split('T')[0]) ||
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
					})}
					<div ref={messagesEndRef} />
				</Box>
				<Box sx={{ px: 2, pb: 3, bgcolor: '#37393e' }}>
					<OutlinedInput
						multiline
						fullWidth
						autoFocus
						placeholder={`Message #${channel?.name}`}
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
					{server?.userProfiles?.map(profile => (
						<Stack
							key={profile.userId}
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
