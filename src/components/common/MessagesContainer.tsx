import { Avatar, Skeleton, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import parse from 'html-react-parser'
import React, { FC, useLayoutEffect, useRef, useState } from 'react'
import { Message, PublicProfile } from 'utils/services/models'

export interface MessagesContainerProps {
	userProfiles: PublicProfile[] | undefined
	messages: Message[] | undefined
}

const MessageSkeleton: FC = () => {
	const length = Math.random() * 5 + 0.1

	return (
		<Box className='message'>
			<Stack direction='row'>
				<Skeleton
					variant='circular'
					width={40}
					height={40}
					sx={{ mr: 2, mt: 1 }}
				/>
				<Box sx={{ width: '100%' }}>
					<Skeleton
						variant='text'
						sx={{ maxWidth: Math.random() * 50 + 100, mb: 1 }}
					/>
					{length < 1 ? (
						<Skeleton
							variant='rectangular'
							height={20}
							width={`${length * 100}%`}
						/>
					) : (
						<Skeleton variant='rectangular' height={20 * Math.round(length)} />
					)}
				</Box>
			</Stack>
		</Box>
	)
}

const MessagesContainer: FC<MessagesContainerProps> = ({
	userProfiles,
	messages,
}) => {
	const messagesEndRef = useRef<HTMLDivElement>(null)

	// Scroll to bottom of messages when new message is added
	useLayoutEffect((): void => {
		messagesEndRef?.current?.scrollIntoView({ behavior: 'auto' })
	}, [messages])

	const [skeletonMessages] = useState(
		new Array(10).fill(null).map((_, index) => <MessageSkeleton key={index} />)
	)

	const isLoaded = userProfiles && messages

	return (
		<Box
			className='messages-container'
			sx={{
				pb: 2,
				mt: 'auto',
				width: '100%',
				overflowY: isLoaded ? 'scroll' : 'hidden',
			}}
		>
			{!isLoaded
				? skeletonMessages
				: messages
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
						})}
			<div ref={messagesEndRef} />
		</Box>
	)
}

export default MessagesContainer
