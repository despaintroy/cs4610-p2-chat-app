import { Button } from '@mui/material'
import { AuthContext } from 'App'
import React, { useContext } from 'react'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Paths } from 'utils/Paths'

const SignIn: FC = () => {
	const navigate = useNavigate()
	const { signIn } = useContext(AuthContext)

	return (
		<Button
			variant='contained'
			color='secondary'
			onClick={(): void => {
				signIn('', '')
				navigate(Paths.home)
			}}
		>
			Sign In
		</Button>
	)
}

export default SignIn
