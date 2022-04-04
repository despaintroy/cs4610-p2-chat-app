import { Button, Container, Divider, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Server } from 'utils/services/models'
import { getServerById } from 'utils/services/servers'

const ServerInvite: FC = () => {
	const params = useParams<{ joinServerId: string }>()

	const [server, setServer] = React.useState<Server | null>()

	useEffect(() => {
		if (!params.joinServerId) {
			setServer(null)
			return
		}

		getServerById(params.joinServerId).then(setServer)
	}, [params.joinServerId])

	return (
		<Box sx={{ p: 2, pt: 4, backgroundColor: '#37393e', width: '100%' }}>
			<Container maxWidth='sm'>
				{!server ? (
					<></>
				) : (
					<>
						<Typography variant='h1'>Join Server</Typography>
						<Divider sx={{ my: 2 }} />
						<Button
							variant='contained'
							onClick={(): void => {
								return
							}}
						>
							Join {server.name}
						</Button>
					</>
				)}
			</Container>
		</Box>
	)
}

export default ServerInvite
