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
import { ServersContext } from '../Home'

const ChannelNav: React.FC = () => {
	const { serverId, channelId } =
		useParams<{ serverId: string; channelId: string }>()
	const navigate = useNavigate()

	const channels =
		useContext(ServersContext)?.find(server => server.id === serverId)
			?.channels || []

	if (!serverId) {
		navigate(Paths.home)
		return <></>
	}

	if (!channelId) {
		navigate(Paths.getServerPath(serverId))
		return <></>
	}

	const { signOut } = useContext(AuthContext)

	return (
		<Box sx={{ minWidth: '250px', backgroundColor: '#2F3136' }}>
			<Button onClick={signOut}>Sign Out</Button>
			<List>
				{channels.map(channel => {
					const isSelected = channel.id === channelId
					return (
						<ListItem disablePadding key={channel.id}>
							<ListItemButton
								selected={isSelected}
								onClick={(): void =>
									navigate(Paths.getChannelPath(serverId, channel.id))
								}
								classes={{ selected: 'channel-nav-selected' }}
								sx={{ m: 1 }}
							>
								<ListItemText primary={channel.name} />
							</ListItemButton>
						</ListItem>
					)
				})}
			</List>
		</Box>
	)
}

export default ChannelNav
