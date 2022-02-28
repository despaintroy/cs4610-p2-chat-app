import { Box } from '@mui/material'
import React, { useEffect } from 'react'
import { FC } from 'react'
import ServerNav from './ServerNav'
import { servers } from 'utils/services/fakeData'
import ChannelNav from './ChannelNav'
import { useNavigate, useParams } from 'react-router-dom'
import { Paths } from 'utils/Paths'
import { Channel, Server } from 'utils/services/models'
import ChannelDetail from './ChannelDetail'

export const ServersContext = React.createContext<Server[] | null>(null)

const Home: FC = () => {
	const navigate = useNavigate()
	const { serverId: serverIdParam, channelId: channelIdParam } =
		useParams<{ serverId: string; channelId: string }>()
	const [serverId, setServerId] = React.useState<string | null>(
		serverIdParam || null
	)
	const [channelId, setChannelId] = React.useState<string | null>(
		channelIdParam || null
	)

	useEffect(() => {
		const currentServer: Server | null =
			servers.find(
				server => server.id === serverId || server.id === channelId
			) || null

		const currentChannel: Channel | null =
			currentServer?.channels?.find(channel => channel.id === channelId) || null

		// Navigate to first server if no server selected or server not found
		if (!serverId || !currentServer) {
			if (servers.length > 0) setServerId(servers[0].id)
			else setServerId(null)
			setChannelId(null)
			return
		}

		// Navigate to first channel if no channel selected or channel not found
		if (!channelId || !currentChannel) {
			if (currentServer.channels?.length)
				setChannelId(currentServer.channels[0].id)
			else setChannelId(null)
		}
	}, [serverId, channelId, servers])

	// Set browser path to match selected server and channel
	useEffect(() => {
		if (!serverId) navigate(Paths.home)

		if (serverId && !channelId) navigate(Paths.getServerPath(serverId))

		if (serverId && channelId)
			navigate(Paths.getChannelPath(serverId, channelId))
	}, [serverId, channelId])

	return (
		<ServersContext.Provider value={servers}>
			<Box sx={{ display: 'flex', height: '100vh' }}>
				<ServerNav
					selectedServerId={serverId}
					setSelectedServerId={setServerId}
				/>
				<ChannelNav
					selectedServerId={serverId}
					selectedChannelId={channelId}
					setSelectedChannelId={setChannelId}
				/>
				{serverId && channelId && (
					<ChannelDetail serverId={serverId} channelId={channelId} />
				)}
			</Box>
		</ServersContext.Provider>
	)
}

export default Home
