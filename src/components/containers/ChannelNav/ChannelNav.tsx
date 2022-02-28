import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext } from 'react'
import { ServersContext } from '../Home'

export interface ChannelNavProps {
	selectedServerId: string | null
	selectedChannelId: string | null
	setSelectedChannelId: (channelId: string) => void
}

const ChannelNav: React.FC<ChannelNavProps> = props => {
	const { selectedServerId, selectedChannelId, setSelectedChannelId } = props
	const channels =
		useContext(ServersContext)?.find(server => server.id === selectedServerId)
			?.channels || []

	return (
		<Box sx={{ minWidth: '250px', backgroundColor: '#2F3136' }}>
			<List>
				{channels.map(channel => (
					<ListItem disablePadding key={channel.id}>
						<ListItemButton
							selected={channel.id === selectedChannelId}
							onClick={(): void => setSelectedChannelId(channel.id)}
							classes={{ selected: 'channel-nav-selected' }}
							sx={{ m: 1 }}
						>
							<ListItemText primary={channel.name} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	)
}

export default ChannelNav
