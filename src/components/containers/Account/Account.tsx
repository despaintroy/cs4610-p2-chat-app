import { Button, Container, Divider, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { FC, useContext } from 'react'
import { AuthContext } from 'Router'
import PasswordForm from './PasswordForm'
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
				<Box sx={{ pt: 2 }}>
					<Typography variant='h2'>Profile</Typography>
					<ProfileForm />
				</Box>
				<Box sx={{ pt: 4 }}>
					<Typography variant='h2'>Password</Typography>
					<PasswordForm />
				</Box>
			</Container>
		</Box>
	)
}

export default Account
