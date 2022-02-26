import { Button } from '@mui/material'
import { AuthContext } from 'Router'
import React, { useContext } from 'react'
import { FC } from 'react'

const Home: FC = () => {
	const { signOut } = useContext(AuthContext)

	return (
		<Button variant='contained' onClick={(): Promise<void> => signOut()}>
			Sign Out
		</Button>
	)
}

export default Home
