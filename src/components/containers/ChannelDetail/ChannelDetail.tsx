import { Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { FC, useContext, useEffect, useRef } from 'react'
import { ServersContext } from '../Home'

export interface MessagesProps {
	serverId: string | null
	channelId: string | null
}

const ChannelDetail: FC<MessagesProps> = props => {
	const { serverId, channelId } = props
	const servers = useContext(ServersContext) || []
	const messagesEndRef = useRef<HTMLDivElement>(null)

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
		<Box className='messages-container'>
			{lotsMessages?.map((message, index) => (
				<Box key={index} className='message'>
					<Stack direction='row'>
						<Box className='user-name'>
							{
								currentServer?.userProfiles?.find(
									u => u.userId === message.userId
								)?.name
							}
						</Box>
						<Box className='time' sx={{ ml: 'auto' }}>
							<Typography variant='caption' color='text.disabled'>
								{(message.timestamp &&
									new Date(message.timestamp).toISOString().split('T')[0]) ||
									'-'}
							</Typography>
						</Box>
					</Stack>
					<Box className='content'>{message.content}</Box>
				</Box>
			))}
			<div ref={messagesEndRef} />
		</Box>
	)
}

export default ChannelDetail
