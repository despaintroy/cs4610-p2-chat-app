import { Box } from '@mui/system'
import ChannelNav from 'components/containers/ChannelNav'
import ServerNav from 'components/containers/ServerNav'
import React, { FC, useEffect } from 'react'
import { Navigate, Outlet, useParams } from 'react-router-dom'
import {
	AllServersContext,
	ChannelsContext,
	ServerContext,
} from 'utils/context'
import { Paths } from 'utils/Paths'
import { watchChannels } from 'utils/services/channels'
import { Channel, Server, User } from 'utils/services/models'
import { watchServers } from 'utils/services/servers'

const AuthLayout: FC<{ user: User | null | undefined }> = props => {
	const { user } = props
	const { serverId } = useParams<{ serverId: string }>()

	const [servers, setServers] = React.useState<Server[] | null>()
	const [channels, setChannels] = React.useState<Channel[] | null>()

	// Watch for changes to servers
	useEffect(() => {
		if (!user?.id) return
		watchServers(user.id, setServers)
	}, [user?.id])

	// Watch for changes to channels
	useEffect(() => {
		if (!serverId) {
			setChannels(null)
			return
		}

		watchChannels(serverId, setChannels)
	}, [serverId])

	// TODO: Loading screen
	if (user === undefined) return <></>

	if (user === null) {
		return <Navigate to={Paths.signin} />
	}

	if (servers === undefined || channels === undefined) return <></>

	return (
		<AllServersContext.Provider value={servers}>
			<ServerContext.Provider
				value={servers?.find(server => server.id === serverId) || null}
			>
				<Box sx={{ display: 'flex', height: '100vh' }}>
					<ServerNav />
					<ChannelsContext.Provider value={channels}>
						<ChannelNav />
						<Outlet />
					</ChannelsContext.Provider>
				</Box>
			</ServerContext.Provider>
		</AllServersContext.Provider>
	)
}

export default AuthLayout
