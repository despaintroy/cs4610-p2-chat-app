import { Person } from '@mui/icons-material'
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
import React, { useContext } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Paths } from 'utils/Paths'
import { ServersContext } from '../Home'

const ServerNav: React.FC = () => {
	const { serverId } = useParams<{ serverId: string }>()
	const location = useLocation()
	const navigate = useNavigate()

	const servers = useContext(ServersContext) || []

	const isAccountPage = location.pathname === Paths.account

	return (
		<Box>
			<List>
				<ListItem
					onClick={(): void => navigate(Paths.account)}
					sx={{
						cursor: 'pointer',
					}}
				>
					<Tooltip
						title={<Typography p={'8px'}>Profile</Typography>}
						placement='right'
						arrow
						disableInteractive
					>
						<Avatar
							variant={isAccountPage ? 'rounded' : 'circular'}
							sx={{
								bgcolor: isAccountPage ? 'primary.main' : 'grey',
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
									invisible={isSelected}
									color='warning'
									overlap='circular'
									variant='dot'
								>
									<Avatar
										variant={isSelected ? 'rounded' : 'circular'}
										sx={{
											bgcolor: isSelected ? 'primary.main' : 'grey',
										}}
									>
										{server.name?.substring(0, 1)}
									</Avatar>
								</Badge>
							</Tooltip>
						</ListItem>
					)
				})}
			</List>
		</Box>
	)
}

export default ServerNav
