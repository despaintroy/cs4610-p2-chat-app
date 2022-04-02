import { Stack, Avatar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { FC, useLayoutEffect, useRef } from 'react'
import { Message, PublicProfile } from 'utils/services/models'
import parse from 'html-react-parser'

export interface MessagesContainerProps {
	userProfiles: PublicProfile[]
	messages: Message[]
}

const MessagesContainer: FC<MessagesContainerProps> = ({
	userProfiles,
	messages,
}) => {
	const messagesEndRef = useRef<HTMLDivElement>(null)

	const scrollToBottom = (behavior: ScrollBehavior = 'auto'): void => {
		messagesEndRef?.current?.scrollIntoView({ behavior })
	}

	useLayoutEffect(scrollToBottom, [messages])

	return (
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
	)
}

export default MessagesContainer
