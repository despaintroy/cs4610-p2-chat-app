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

const AuthLayout: FC<{ user: User | null | undefined }> = ({ user }) => {
	const params = useParams<{ serverId: string }>()

	const [servers, setServers] = React.useState<Server[] | null>()
	const [channels, setChannels] = React.useState<Channel[] | null>()

	// Watch for changes to servers
	useEffect(() => {
		if (!user?.id) return
		watchServers(user.id, setServers)
	}, [user?.id])

	// Watch for changes to channels
	useEffect(() => {
		if (!params.serverId) {
			setChannels(null)
			return
		}

		const unsubscribe = watchChannels(params.serverId, setChannels)
		return unsubscribe
	}, [params.serverId])

	if (user === null) return <Navigate to={Paths.signin} />

	if (servers === undefined || channels === undefined || user === undefined)
		return <></>

	return (
		<AllServersContext.Provider value={servers}>
			<ServerContext.Provider
				value={servers?.find(s => s.id === params.serverId) || null}
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
