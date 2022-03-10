import {
	ButtonBase,
	Divider,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Popover,
	Stack,
	Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Paths } from 'utils/Paths'
import {
	AddCircle,
	Close,
	FiberManualRecord,
	Logout,
	Settings,
} from '@mui/icons-material'
import { Channel, Server } from 'utils/services/models'
import { ServersContext } from 'AuthHome'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import ConfirmLeaveDialog from './ConfirmLeaveDialog'
import NewChannelDialog from './NewChannelDialog'

const ChannelNav: React.FC = () => {
	const { serverId, channelId } =
		useParams<{ serverId: string; channelId: string }>()
	const navigate = useNavigate()
	const servers = useContext(ServersContext) || []

	const [server, setServer] = React.useState<Server | undefined>(undefined)
	const [channels, setChannels] = React.useState<Channel[] | undefined>(
		undefined
	)

	const menuAnchor = React.useRef<HTMLButtonElement>(null)
	const [showMenu, setShowMenu] = React.useState(false)

	const [showNewChannelDialog, setShowNewChannelDialog] = React.useState(false)
	const [showLeaveDialog, setShowLeaveDialog] = React.useState(false)

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
			<ButtonBase
				onClick={(): void => setShowMenu(true)}
				ref={menuAnchor}
				sx={{
					width: '100%',
					borderBottom: 1,
					borderColor: 'black',
					px: 2,
					py: 1,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Typography variant='h6'>{server?.name}</Typography>

				{showMenu ? (
					<Close fontSize='small' />
				) : (
					<KeyboardArrowDownIcon fontSize='small' />
				)}
			</ButtonBase>
			<Popover
				open={showMenu}
				anchorEl={menuAnchor.current}
				onClose={(): void => setShowMenu(false)}
				onClick={(): void => setShowMenu(false)}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				PaperProps={{ sx: { backgroundColor: 'black', mt: 1, p: 1 } }}
			>
				<List disablePadding sx={{ width: '220px', color: 'grey.400' }}>
					<ListItem
						button
						dense
						onClick={(): void => setShowNewChannelDialog(true)}
					>
						<ListItemText primary='Create Channel' />
						<ListItemIcon sx={{ minWidth: 0, color: 'grey.400' }}>
							<AddCircle fontSize='small' />
						</ListItemIcon>
					</ListItem>
					<ListItem button dense>
						<ListItemText primary='Server Settings' />
						<ListItemIcon sx={{ minWidth: 0, color: 'grey.400' }}>
							<Settings fontSize='small' />
						</ListItemIcon>
					</ListItem>
					<Divider sx={{ my: 1 }} />
					<ListItem button dense onClick={(): void => setShowLeaveDialog(true)}>
						<ListItemText>
							<Typography variant='body2' color='error'>
								Leave Server
							</Typography>
						</ListItemText>
						<ListItemIcon sx={{ minWidth: 0 }}>
							<Logout fontSize='small' color='error' />
						</ListItemIcon>
					</ListItem>
				</List>
			</Popover>
			<NewChannelDialog
				serverId={serverId}
				open={showNewChannelDialog}
				handleClose={(): void => setShowNewChannelDialog(false)}
			/>
			<ConfirmLeaveDialog
				serverId={serverId}
				open={showLeaveDialog}
				handleClose={(): void => setShowLeaveDialog(false)}
			/>
			<List>
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
