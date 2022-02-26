import { Button } from '@mui/material'
import { AuthContext } from 'App'
import React, { useContext } from 'react'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Paths } from 'utils/Paths'

const SignUp: FC = () => {
	const navigate = useNavigate()
	const { signUp } = useContext(AuthContext)

	return (
		<Button
			variant='contained'
			// color='secondary'
			onClick={(): void => {
				signUp('', '', '')
				navigate(Paths.home)
			}}
		>
			Sign Up
		</Button>
	)
}

export default SignUp
