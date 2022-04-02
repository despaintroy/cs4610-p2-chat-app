import { Add, LocationOn, Person } from '@mui/icons-material'
import {
	Avatar,
	Badge,
	Divider,
	List,
	ListItem,
	Tooltip,
	Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { AllServersContext } from 'AuthHome'
import NewServerDialog from 'components/common/NewServerDialog'
import React, { useContext, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Paths } from 'utils/Paths'

const ServerNav: React.FC = () => {
	const { serverId } = useParams<{ serverId: string }>()
	const location = useLocation()
	const navigate = useNavigate()
	const servers = useContext(AllServersContext) || []

	const [showCreateServer, setShowCreateServer] = React.useState(false)

	useEffect(() => {
		if (!serverId) return
		if (!servers.some(s => s.id === serverId)) {
			navigate(
				serverId && servers.length > 0
					? Paths.getServerPath(servers[0].id)
					: Paths.home
			)
		}
	}, [serverId, servers])

	const isAccountPage = location.pathname === Paths.account
	const isNearbyPage = location.pathname.includes(Paths.nearby)

	return (
		<Box className='server-nav' sx={{ backgroundColor: 'background.default' }}>
			<List>
				<ListItem
					onClick={(): void => navigate(Paths.account)}
					sx={{
						cursor: 'pointer',
					}}
				>
					<Tooltip
						title={<Typography p={'8px'}>Account</Typography>}
						placement='right'
						arrow
						disableInteractive
					>
						<Avatar
							variant={isAccountPage ? 'rounded' : 'circular'}
							sx={{
								bgcolor: isAccountPage ? 'primary.main' : 'grey',
								color: 'white',
							}}
						>
							<Person />
						</Avatar>
					</Tooltip>
				</ListItem>
				<Divider sx={{ m: 1 }} />
				{servers.map(server => {
					const isSelected = server.id === serverId
					return (
						<ListItem
							key={server.id}
							onClick={(): void => navigate(Paths.getServerPath(server.id))}
							sx={{
								cursor: 'pointer',
							}}
						>
							<Tooltip
								title={<Typography p={'8px'}>{server.name}</Typography>}
								placement='right'
								arrow
								disableInteractive
							>
								<Badge
									invisible={isSelected || server.id !== '1'}
									color='warning'
									overlap='circular'
									variant='dot'
								>
									<Avatar
										variant={isSelected ? 'rounded' : 'circular'}
										sx={{
											bgcolor: isSelected ? 'primary.main' : 'grey',
											color: 'white',
										}}
									>
										{server.name?.substring(0, 1)}
									</Avatar>
								</Badge>
							</Tooltip>
						</ListItem>
					)
				})}
				<ListItem
					sx={{
						cursor: 'pointer',
					}}
					onClick={(): void => setShowCreateServer(true)}
				>
					<Tooltip
						title={<Typography p={'8px'}>Create Server</Typography>}
						placement='right'
						arrow
						disableInteractive
					>
						<Avatar>
							<Add sx={{ color: 'white' }} />
						</Avatar>
					</Tooltip>
				</ListItem>
				<Divider sx={{ m: 1 }} />
				<ListItem
					sx={{
						cursor: 'pointer',
					}}
				>
					<Tooltip
						title={<Typography p={'8px'}>Nearby</Typography>}
						onClick={(): void => navigate(Paths.nearby)}
						placement='right'
						arrow
						disableInteractive
					>
						<Avatar
							variant={isNearbyPage ? 'rounded' : 'circular'}
							sx={{
								bgcolor: isNearbyPage ? 'primary.main' : 'grey',
								color: 'white',
							}}
						>
							<LocationOn sx={{ color: 'white' }} />
						</Avatar>
					</Tooltip>
				</ListItem>
			</List>

			<NewServerDialog
				open={showCreateServer}
				handleClose={(): void => setShowCreateServer(false)}
			/>
		</Box>
	)
}

export default ServerNav
