import { Box } from '@mui/system'
import ChannelNav from 'components/containers/ChannelNav'
import ServerNav from 'components/containers/ServerNav'
import React, { useEffect } from 'react'
import { FC } from 'react'
import { Navigate, Outlet, useNavigate, useParams } from 'react-router-dom'
import { Paths } from 'utils/Paths'
import { servers } from 'utils/services/fakeData'
import { Channel, Server, User } from 'utils/services/models'

export const ServersContext = React.createContext<Server[] | null>(null)

const AuthHome: FC<{ user: User | null | undefined }> = props => {
	const { user } = props
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
		if (serverId && !currentServer) {
			if (servers.length > 0) navigate(Paths.getServerPath(servers[0].id))
			else navigate(Paths.home)
			return
		}

		// Navigate to first channel if no channel selected or channel not found
		if (serverId && currentServer && (!channelId || !currentChannel)) {
			if (currentServer.channels?.length)
				navigate(Paths.getChannelPath(serverId, currentServer.channels[0].id))
			else navigate(Paths.getServerPath(serverId))
		}
	}, [serverId, channelId, servers])

	// TODO: Loading screen
	if (user === undefined) return <></>

	if (user === null) {
		return <Navigate to={Paths.signin} />
	}

	return (
		<ServersContext.Provider value={servers}>
			<Box sx={{ display: 'flex', height: '100vh' }}>
				<ServerNav />
				{channelId && <ChannelNav />}
				<Outlet />
			</Box>
		</ServersContext.Provider>
	)
}

export default AuthHome
