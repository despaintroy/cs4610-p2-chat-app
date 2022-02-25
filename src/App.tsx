import { Button, Container, Typography } from '@mui/material'
import React from 'react'
import { FC } from 'react'

const App: FC = () => {
	return (
		<div className='App'>
			<Container style={{ marginTop: '1rem' }}>
				<Typography variant='h1'>Welcome to React</Typography>
				<Typography>Welcome to the react app!</Typography>
				<Button
					variant='contained'
					color='secondary'
					onClick={(): void => console.log('Hello!')}
				>
					Say Hello Everyone!
				</Button>
			</Container>
		</div>
	)
}

export default App
