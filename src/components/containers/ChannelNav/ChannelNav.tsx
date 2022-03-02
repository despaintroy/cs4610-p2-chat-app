import {
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Stack,
	Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Paths } from 'utils/Paths'
import { ServersContext } from 'AuthHome'
import { FiberManualRecord } from '@mui/icons-material'

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

	return (
		<Box sx={{ minWidth: '250px', backgroundColor: '#2F3136' }}>
			<List>
				{channels.map(channel => {
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
												{channel.name}
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
