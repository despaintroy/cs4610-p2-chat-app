import { Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LocalChannel, Message, PublicProfile } from 'utils/services/models'
import { sendMessage, watchMessages } from 'utils/services/messages'
import MessagesContainer from 'components/common/MessagesContainer'
import SendMessage from 'components/common/SendMessage'
import { getLocalChannelById } from 'utils/services/localChannels'

const LocalChannelDetail: FC = () => {
	const { localChannelId } = useParams<{ localChannelId: string }>()

	const [messages, setMessages] = useState<Message[] | undefined>()
	const [localChannel, setLocalChannel] = useState<LocalChannel | undefined>()
	const [userProfiles, setUserProfiles] = useState<PublicProfile[]>()

	useEffect(() => {
		if (!localChannelId) return
		getLocalChannelById(localChannelId).then((lc): void => setLocalChannel(lc))

		watchMessages(localChannelId, setMessages)
	}, [localChannelId])

	const handleSend = (message: string): void => {
		if (!localChannelId) return
		sendMessage(localChannelId, message)
	}

	if (!localChannel) return null

	return (
		<Stack direction='row' sx={{ width: '100%' }}>
			<Stack
				direction='column'
				sx={{ width: '100%', backgroundColor: '#37393e' }}
			>
				<Box sx={{ borderBottom: 1, borderColor: 'black', px: 2, py: 1 }}>
					<Typography variant='h6'>{`# ${localChannel.name}`}</Typography>
				</Box>
				<MessagesContainer
					messages={messages || []}
					userProfiles={userProfiles || []}
				/>
				<SendMessage
					sendMessage={handleSend}
					placeholder={`Message #${localChannel.name}`}
				/>
			</Stack>
		</Stack>
	)
}

export default LocalChannelDetail
