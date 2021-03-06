import { Container, Paper, Typography } from '@mui/material'
import React, { FC } from 'react'
import SignInForm from './SignInForm'

const SignIn: FC = () => {
	return (
		<Container maxWidth='xs'>
			<Paper sx={{ p: 2, mt: '20%' }}>
				<Typography variant='h1' sx={{ textAlign: 'center', mb: 2 }}>
					Sign In
				</Typography>
				<SignInForm />
			</Paper>
		</Container>
	)
}

export default SignIn
