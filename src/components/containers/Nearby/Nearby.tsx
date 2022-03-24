import { Box, Divider, Typography } from '@mui/material'
import React, { FC } from 'react'

const Nearby: FC = () => {
	return (
		<Box sx={{ width: '100%', p: 2, backgroundColor: '#37393e' }}>
			<Typography variant='h1'>Nearby</Typography>
			<Divider sx={{ p: 1 }} />
		</Box>
	)
}

export default Nearby
