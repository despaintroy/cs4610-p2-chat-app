import { Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import MessagesContainer from 'components/common/MessagesContainer'
import SendMessage from 'components/common/SendMessage'
import React, { FC, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ChannelsContext, ServerContext } from 'utils/context'
import { Paths } from 'utils/Paths'
import { sendMessage, watchMessages } from 'utils/services/messages'
import { Channel, Message, PublicProfile } from 'utils/services/models'
import { getUserProfiles } from 'utils/services/user'
import ChannelMembers from './ChannelMembers'

const ChannelDetail: FC = () => {
	const params = useParams<{ serverId: string; channelId: string }>()
	const server = useContext(ServerContext)
	const channels = useContext(ChannelsContext) || []

	const [messages, setMessages] = useState<Message[] | undefined>()
	const [selectedChannel, setSelectedChannel] = useState<Channel | undefined>()
	const [userProfiles, setUserProfiles] = useState<PublicProfile[]>()

	useEffect(() => {
		if (!params.channelId) return

		watchMessages(params.channelId, setMessages)

		setSelectedChannel(
			channels.find(channel => channel.id === params.channelId) || undefined
		)
	}, [params.channelId])

	useEffect(() => {
		if (!server) return
		getUserProfiles(server.users).then(setUserProfiles).catch(console.error)
	}, [server])

	const handleSend = (message: string): void => {
		if (!params.channelId) return
		sendMessage(params.channelId, message)
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
				<MessagesContainer messages={messages} userProfiles={userProfiles} />
				<SendMessage
					sendMessage={handleSend}
					placeholder={`Message #${selectedChannel?.name}`}
				/>
			</Stack>
			<ChannelMembers userProfiles={userProfiles || []}>
				{params.serverId && (
					<>
						<Typography>Server invite:</Typography>
						<Typography>{Paths.getJoinServerPath(params.serverId)}</Typography>
					</>
				)}
			</ChannelMembers>
		</Stack>
	)
}

export default ChannelDetail
