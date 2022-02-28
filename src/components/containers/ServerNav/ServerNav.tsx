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
import { ServersContext } from '../Home'

export interface ServerNavProps {
	selectedServerId: string | null
	setSelectedServerId: (serverId: string) => void
}

const ServerNav: React.FC<ServerNavProps> = props => {
	const { selectedServerId, setSelectedServerId } = props
	const servers = useContext(ServersContext) || []

	return (
		<Box>
			<List>
				<ListItem
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
						<Avatar>
							<Person />
						</Avatar>
					</Tooltip>
				</ListItem>
				<Divider sx={{ m: 1 }} />
				{servers.map(server => (
					<ListItem
						key={server.id}
						onClick={(): void => setSelectedServerId(server.id)}
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
								invisible={server.id === selectedServerId}
								color='warning'
								overlap='circular'
								variant='dot'
							>
								<Avatar
									variant={
										server.id === selectedServerId ? 'rounded' : 'circular'
									}
									sx={{
										bgcolor:
											server.id === selectedServerId ? 'primary.main' : 'grey',
									}}
								>
									{server.name?.substring(0, 1)}
								</Avatar>
							</Badge>
						</Tooltip>
					</ListItem>
				))}
			</List>
		</Box>
	)
}

export default ServerNav
