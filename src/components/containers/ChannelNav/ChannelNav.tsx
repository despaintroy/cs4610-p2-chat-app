import { AddCircle, Close, Delete, Logout, Settings } from '@mui/icons-material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
	ButtonBase,
	Divider,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Popover,
	Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChannelsContext, ServerContext } from 'utils/context'
import { Paths } from 'utils/Paths'
import ChannelNavButton from './ChannelNavButton'
import NewChannelDialog from './NewChannelDialog'
import ConfirmDeleteDialog from './ServerSettings/ConfirmDeleteDialog'
import ConfirmLeaveDialog from './ServerSettings/ConfirmLeaveDialog'
import ServerSettingsDialog from './ServerSettingsDialog'

const ChannelNav: React.FC = () => {
	const { serverId, channelId } =
		useParams<{ serverId: string; channelId: string }>()
	const navigate = useNavigate()
	const server = useContext(ServerContext)
	const channels = useContext(ChannelsContext) || []

	const menuAnchor = React.useRef<HTMLButtonElement>(null)
	const [showMenu, setShowMenu] = React.useState(false)

	const [showNewChannelDialog, setShowNewChannelDialog] = React.useState(false)
	const [showServerSettings, setShowServerSettings] = React.useState(false)
	const [showLeaveDialog, setShowLeaveDialog] = React.useState(false)
	const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)

	useEffect(() => {
		if (!serverId) return
		if (!channels.some(channel => channel.id === channelId))
			navigate(Paths.getServerPath(serverId))
		if (channels.length > 0 && !channelId)
			navigate(Paths.getChannelPath(serverId, channels[0].id))
	}, [channels, channelId, serverId])

	if (!serverId || !server) {
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
				<Typography variant='h6'>{server.name}</Typography>

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
					<ListItem
						button
						dense
						onClick={(): void => setShowServerSettings(true)}
					>
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
					<ListItem
						button
						dense
						onClick={(): void => setShowDeleteDialog(true)}
					>
						<ListItemText>
							<Typography variant='body2' color='error'>
								Delete Server
							</Typography>
						</ListItemText>
						<ListItemIcon sx={{ minWidth: 0 }}>
							<Delete fontSize='small' color='error' />
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
			<ConfirmDeleteDialog
				serverId={serverId}
				open={showDeleteDialog}
				handleClose={(): void => setShowDeleteDialog(false)}
			/>
			<ServerSettingsDialog
				server={server}
				open={showServerSettings}
				handleClose={(): void => setShowServerSettings(false)}
			/>
			<List>
				{channels.length === 0 && <ListItem>No channels</ListItem>}
				{channels
					?.sort((a, b) => (a.name < b.name ? -1 : 1))
					.map(channel => (
						<ChannelNavButton key={channel.id} channel={channel} />
					))}
			</List>
		</Box>
	)
}

export default ChannelNav
