import {
	Button,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
} from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from 'Router'
import { Paths } from 'utils/Paths'
import { Server } from 'utils/services/models'

export interface ServerNavProps {
	servers: Server[]

}

const ServerNav: React.FC<ServerNavProps> = props => {
	const { servers } = props
	const { signOut } = useContext(AuthContext)
	const navigate = useNavigate()
	const { serverId } = useParams<{ serverId: string }>()
	const selectedServer = Number(serverId)

	return (
		<Box sx={{ minWidth: '250px' }}>
			<Button onClick={signOut}>Sign Out</Button>
			<List>
				{servers.map(server => (
					<ListItem disablePadding key={server.id}>
						<ListItemButton
							selected={server.id === selectedServer}
							onClick={(): void => navigate(Paths.getServerPath(server.id))}
							classes={{ selected: 'server-nav-selected' }}
							sx={{ m: 1 }}
						>
							<ListItemText primary={server.name} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	)
}

export default ServerNav
