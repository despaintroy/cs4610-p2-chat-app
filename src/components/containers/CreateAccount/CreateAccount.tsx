import { Container, Paper, Typography } from '@mui/material'
import React, { FC } from 'react'
import CreateAccountForm from './CreateAccountForm'

const CreateAccount: FC = () => {
	return (
		<Container maxWidth='xs'>
			<Paper sx={{ p: 2, mt: '20%' }}>
				<Typography variant='h1' sx={{ textAlign: 'center', mb: 2 }}>
					Create Account
				</Typography>
				<CreateAccountForm />
			</Paper>
		</Container>
	)
}

export default CreateAccount
