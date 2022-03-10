import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { ServersContext } from 'AuthHome'
import React, { useContext, useEffect } from 'react'
import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { Server } from 'utils/services/models'

const ServerDetail: FC = () => {
	const servers = useContext(ServersContext) || []
	const { serverId } = useParams<{ serverId: string }>()

	const [server, setServer] = React.useState<Server>()

	useEffect(() => {
		const foundServer = servers.find(server => server.id === serverId)
		setServer(foundServer)
	}, [serverId])

	return (
		<Box sx={{ p: 2, backgroundColor: '#37393e', width: '100%' }}>
			<Typography variant='h1'>{server?.name}</Typography>
		</Box>
	)
}

export default ServerDetail
