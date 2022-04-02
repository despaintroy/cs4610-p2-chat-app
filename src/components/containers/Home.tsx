import { Alert, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { AllServersContext } from 'AuthHome'
import React, { useContext, useEffect } from 'react'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Paths } from 'utils/Paths'

const Home: FC = () => {
	const servers = useContext(AllServersContext) || []
	const navigate = useNavigate()

	useEffect(() => {
		if (servers.length > 0) navigate(Paths.getServerPath(servers[0].id))
	}, [servers])

	return (
		<Box sx={{ p: 2, backgroundColor: '#37393e', width: '100%' }}>
			<Typography variant='h1' sx={{ mt: 2 }}>
				Hello!
			</Typography>
			<Alert severity='info' variant='filled' sx={{ mt: 3 }}>
				<Typography variant='body1'>
					It looks like you might not have any servers! Use the + icon on the
					sidebar to get started.
				</Typography>
				<Typography variant='body1' sx={{ mt: 1 }}>
					To join a nearby location-based chat, click the <i>pin</i> icon.
				</Typography>
			</Alert>
		</Box>
	)
}

export default Home
