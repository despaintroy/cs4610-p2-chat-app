import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { FC } from 'react'

const Home: FC = () => {
	return (
		<Box sx={{ p: 2, backgroundColor: '#37393e', width: '100%' }}>
			<Typography variant='h1'>Home</Typography>
		</Box>
	)
}

export default Home
