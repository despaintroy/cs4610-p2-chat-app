import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { ServersContext } from 'AuthHome'
import React, { useContext, useEffect } from 'react'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Paths } from 'utils/Paths'

const Home: FC = () => {
	const servers = useContext(ServersContext) || []
	const navigate = useNavigate()

	useEffect(() => {
		servers.length > 0 && navigate(Paths.getServerPath(servers[0].id))
	}, [servers])

	return (
		<Box sx={{ p: 2, backgroundColor: '#37393e', width: '100%' }}>
			<Typography variant='h1'>Home</Typography>
		</Box>
	)
}

export default Home
