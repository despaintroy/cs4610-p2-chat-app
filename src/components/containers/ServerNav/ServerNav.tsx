import {
	Button,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
} from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext } from 'react'
import { AuthContext } from 'Router'
import { ServersContext } from '../Home'

export interface ServerNavProps {
	selectedServerId: string | null
	setSelectedServerId: (serverId: string) => void
}

const ServerNav: React.FC<ServerNavProps> = props => {
	const { selectedServerId, setSelectedServerId } = props
	const servers = useContext(ServersContext) || []

	const { signOut } = useContext(AuthContext)

	return (
		<Box sx={{ minWidth: '250px' }}>
			<Button onClick={signOut}>Sign Out</Button>
			<List>
				{servers.map(server => (
					<ListItem disablePadding key={server.id}>
						<ListItemButton
							selected={server.id === selectedServerId}
							onClick={(): void => setSelectedServerId(server.id)}
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
