import {
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Stack,
	Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Paths } from 'utils/Paths'
import { FiberManualRecord } from '@mui/icons-material'
import { Channel, Server } from 'utils/services/models'
import { ServersContext } from 'AuthHome'

const ChannelNav: React.FC = () => {
	const { serverId, channelId } =
		useParams<{ serverId: string; channelId: string }>()
	const navigate = useNavigate()
	const servers = useContext(ServersContext) || []

	const [server, setServer] = React.useState<Server | undefined>(undefined)
	const [channels, setChannels] = React.useState<Channel[] | undefined>(
		undefined
	)

	useEffect(() => {
		const foundServer = servers.find(server => server.id === serverId)
		const foundChannels = foundServer?.channels
		setServer(foundServer)
		setChannels(foundChannels)
	}, [serverId, servers])

	if (!serverId) {
		return <></>
	}

	return (
		<Box sx={{ minWidth: '250px', backgroundColor: '#2F3136' }}>
			<Box sx={{ borderBottom: 1, borderColor: 'black', px: 2, py: 1 }}>
				<Typography variant='h6'>{server?.name}</Typography>
			</Box>
			<List>
				{channels?.length === 0 && (
					<Typography sx={{ p: 2 }}>TODO: create a new channel</Typography>
				)}
				{channels?.map(channel => {
					const isSelected = channel.id === channelId
					return (
						<ListItem disablePadding dense key={channel.id}>
							<ListItemButton
								selected={isSelected}
								onClick={(): void =>
									navigate(Paths.getChannelPath(serverId, channel.id))
								}
								classes={{ selected: 'channel-nav-selected' }}
								sx={{ mx: 1, my: '0.2rem' }}
							>
								<ListItemText
									primary={
										<Stack
											direction='row'
											alignItems='center'
											justifyContent='space-between'
										>
											<Typography
												fontWeight='bold'
												color={isSelected ? 'white' : '#8f9296'}
											>
												{`# ${channel.name}`}
											</Typography>
											{channel.id === '2' && (
												<FiberManualRecord
													color='warning'
													sx={{ fontSize: 10 }}
												/>
											)}
										</Stack>
									}
								/>
							</ListItemButton>
						</ListItem>
					)
				})}
			</List>
		</Box>
	)
}

export default ChannelNav
