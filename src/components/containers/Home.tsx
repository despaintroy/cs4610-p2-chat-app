import { Box, Typography } from '@mui/material'
import React from 'react'
import { FC } from 'react'
import ServerNav from './ServerNav/ServerNav'
import { servers } from 'utils/services/fakeData'

const Home: FC = () => {
	return (
		<Box sx={{ display: 'flex', height: '100vh' }}>
			<ServerNav servers={servers} />
			<Box sx={{ backgroundColor: '#2F3136', minWidth: '250px' }}></Box>
			<Box sx={{ backgroundColor: '#37393E', width: '100%' }}>
				<Typography>Here are the messages</Typography>
			</Box>
		</Box>
	)
}

export default Home
