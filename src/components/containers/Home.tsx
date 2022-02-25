import { Button } from '@mui/material'
import { AuthContext } from 'App'
import React, { useContext } from 'react'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Paths } from 'utils/Paths'

const Home: FC = () => {
	const navigate = useNavigate()
	const { signOut } = useContext(AuthContext)

	return (
		<Button
			variant='contained'
			color='secondary'
			onClick={async (): Promise<void> => {
				await signOut()
				navigate(Paths.home)
			}}
		>
			Sign Out
		</Button>
	)
}

export default Home
