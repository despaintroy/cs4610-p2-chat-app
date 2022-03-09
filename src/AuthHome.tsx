import { Box } from '@mui/system'
import ChannelNav from 'components/containers/ChannelNav'
import ServerNav from 'components/containers/ServerNav'
import React, { useEffect } from 'react'
import { FC } from 'react'
import { Navigate, Outlet, useNavigate, useParams } from 'react-router-dom'
import { Paths } from 'utils/Paths'
import { watchChannels } from 'utils/services/channels'
import { watchMessages } from 'utils/services/messages'
import {
	Channel,
	Message,
	PublicProfile,
	Server,
	User,
} from 'utils/services/models'
import { watchServers } from 'utils/services/servers'
import { getUserProfiles } from 'utils/services/user'

export const ServersContext = React.createContext<Server[] | null>(null)

const AuthHome: FC<{ user: User | null | undefined }> = props => {
	const { user } = props
	const navigate = useNavigate()
	const { serverId, channelId } =
		useParams<{ serverId: string; channelId: string }>()

	const [servers, setServers] = React.useState<Server[]>()
	const [channels, setChannels] = React.useState<Channel[]>()
	const [messages, setMessages] = React.useState<Message[]>()
	const [userProfiles, setUserProfiles] = React.useState<PublicProfile[]>()

	const [serverContext, setServerContext] = React.useState<Server[]>()

	// Watch for changes to servers
	useEffect(() => {
		if (!user?.id) return

		watchServers(user.id, setServers)
	}, [user?.id])

	// Watch for changes to channels
	useEffect(() => {
		if (!servers?.length) return

		watchChannels(
			servers.map(s => s.id),
			setChannels
		)
	}, [servers])

	// Watch for changes to messages
	useEffect(() => {
		if (!channels?.length) return

		watchMessages(
			channels.map(c => c.id),
			setMessages
		)
	}, [channels])

	// Get users profiles
	useEffect(() => {
		if (!servers?.length) return
		const userIds = servers.flatMap(s => s?.users || [])
		const uniqueUserIds = [...new Set(userIds)]
		getUserProfiles(uniqueUserIds).then(profiles => setUserProfiles(profiles))
	}, [servers])

	useEffect(() => {
		if (!servers || !channels || !messages || !userProfiles) return

		setServerContext(
			servers.map(s => ({
				...s,
				userProfiles: userProfiles.filter(p => s.users?.includes(p.id)),
				channels: channels
					.filter(c => c.serverId === s.id)
					.map(c => ({
						...c,
						messages: messages?.filter(m => m.channelId === c.id),
					})),
			}))
		)
	}, [servers, channels, messages, userProfiles])

	useEffect(
		() => console.log('built server context', serverContext),
		[serverContext]
	)

	useEffect(() => {
		if (!serverContext) return

		const currentServer: Server | null =
			serverContext.find(
				server => server.id === serverId || server.id === channelId
			) || null

		const currentChannel: Channel | null =
			currentServer?.channels?.find(channel => channel.id === channelId) || null

		// Navigate to first server if no server selected or server not found
		if (serverId && !currentServer) {
			if (serverContext.length > 0)
				navigate(Paths.getServerPath(serverContext[0].id))
			else navigate(Paths.home)
			return
		}

		// Navigate to first channel if no channel selected or channel not found
		if (serverId && currentServer && (!channelId || !currentChannel)) {
			if (currentServer.channels?.length)
				navigate(Paths.getChannelPath(serverId, currentServer.channels[0].id))
			else navigate(Paths.getServerPath(serverId))
		}
	}, [serverId, channelId, serverContext])

	// TODO: Loading screen
	if (user === undefined) return <></>

	if (user === null) {
		return <Navigate to={Paths.signin} />
	}

	if (!serverContext) return <></>

	return (
		<ServersContext.Provider value={serverContext}>
			<Box sx={{ display: 'flex', height: '100vh' }}>
				<ServerNav />
				<ChannelNav />
				<Outlet />
			</Box>
		</ServersContext.Provider>
	)
}

export default AuthHome
