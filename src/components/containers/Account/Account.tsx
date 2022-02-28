import { Button } from '@mui/material'
import { Box } from '@mui/system'
import React, { FC, useContext } from 'react'
import { AuthContext } from 'Router'

const Account: FC = () => {
	const { signOut } = useContext(AuthContext)
	console.log('Account')

	return (
		<Box sx={{ p: 2, backgroundColor: '#37393e', width: '100%' }}>
			<Button variant='contained' onClick={signOut}>
				Sign Out
			</Button>
		</Box>
	)
}

export default Account
