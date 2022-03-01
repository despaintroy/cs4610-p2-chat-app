import { Button, Container, Divider, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { FC, useContext } from 'react'
import { AuthContext } from 'Router'
import ProfileForm from './ProfileForm'

const Account: FC = () => {
	const { signOut } = useContext(AuthContext)
	console.log('Account')

	return (
		<Box sx={{ p: 2, pt: 4, backgroundColor: '#37393e', width: '100%' }}>
			<Container maxWidth='sm'>
				<Stack direction='row'>
					<Typography variant='h1'>Account</Typography>
					<Button
						variant='contained'
						onClick={signOut}
						sx={{ display: 'block', ml: 'auto' }}
					>
						Sign Out
					</Button>
				</Stack>
				<Divider sx={{ my: 2 }} />
				<Box>
					<Typography variant='h2' gutterBottom>
						Profile
					</Typography>
					<ProfileForm />
				</Box>
			</Container>
		</Box>
	)
}

export default Account
