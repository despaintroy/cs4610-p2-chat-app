import {
	Avatar,
	InputAdornment,
	OutlinedInput,
	Stack,
	Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import React, { FC, useContext, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { ServersContext } from 'AuthHome'
import SendIcon from '@mui/icons-material/Send'

const ChannelDetail: FC = () => {
	const servers = useContext(ServersContext) || []
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const { serverId, channelId } =
		useParams<{ serverId: string; channelId: string }>()

	const currentServer = servers.find(server => server.id === serverId)
	const channel = currentServer?.channels?.find(
		channel => channel.id === channelId
	)

	const scrollToBottom = (behavior: ScrollBehavior = 'auto'): void => {
		messagesEndRef?.current?.scrollIntoView({ behavior })
	}

	useEffect(scrollToBottom, [channelId])

	const lotsMessages = channel?.messages
		? [...channel.messages, ...channel.messages, ...channel.messages]
		: []

	return (
		<Stack direction='column'>
			<Box className='messages-container' sx={{ backgroundColor: '#37393e' }}>
				{lotsMessages?.map((message, index) => {
					const userProfile = currentServer?.userProfiles?.find(
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
										{message.content}
									</Box>
								</Box>
							</Stack>
						</Box>
					)
				})}
				<div ref={messagesEndRef} />
			</Box>
			<Box sx={{ px: 1, pb: 3, bgcolor: '#37393e' }}>
				<OutlinedInput
					fullWidth
					autoFocus
					placeholder={`Message #${channel?.name}`}
					size='small'
					autoComplete='off'
					endAdornment={
						<InputAdornment position='end'>
							<SendIcon />
						</InputAdornment>
					}
					sx={{ bgcolor: '#41444A' }}
				/>
			</Box>
		</Stack>
	)
}

export default ChannelDetail
