import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { ServerContext } from 'AuthHome'
import React, { useContext } from 'react'
import { FC } from 'react'

const ServerDetail: FC = () => {
	const server = useContext(ServerContext)

	return (
		<Box sx={{ p: 2, backgroundColor: '#37393e', width: '100%' }}>
			<Typography variant='h1'>{server?.name}</Typography>
		</Box>
	)
}

export default ServerDetail
