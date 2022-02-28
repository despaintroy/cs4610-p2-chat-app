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
	const { serverId, channelId } =
		useParams<{ serverId: string; channelId: string }>()

	useEffect(() => {
		const currentServer: Server | null =
			servers.find(
				server => server.id === serverId || server.id === channelId
			) || null

		const currentChannel: Channel | null =
			currentServer?.channels?.find(channel => channel.id === channelId) || null

		// Navigate to first server if no server selected or server not found
		if (!serverId || !currentServer) {
			if (servers.length > 0) navigate(Paths.getServerPath(servers[0].id))
			else navigate(Paths.home)
			return
		}

		// Navigate to first channel if no channel selected or channel not found
		if (!channelId || !currentChannel) {
			if (currentServer.channels?.length)
				navigate(Paths.getChannelPath(serverId, currentServer.channels[0].id))
			else navigate(Paths.getServerPath(serverId))
		}
	}, [serverId, channelId, servers])

	return (
		<ServersContext.Provider value={servers}>
			<Box sx={{ display: 'flex', height: '100vh' }}>
				<ServerNav />
				{channelId && <ChannelNav />}
				{serverId && channelId && (
					<ChannelDetail serverId={serverId} channelId={channelId} />
				)}
			</Box>
		</ServersContext.Provider>
	)
}

export default Home
