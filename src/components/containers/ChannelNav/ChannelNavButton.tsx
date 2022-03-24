import { Settings } from '@mui/icons-material'
import {
	ListItem,
	ListItemButton,
	ListItemText,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Paths } from 'utils/Paths'
import { Channel } from 'utils/services/models'

export interface ChannelNavButtonProps {
	channel: Channel
}

const ChannelNavButton: React.FC<ChannelNavButtonProps> = props => {
	const { channel } = props
	const { channelId, serverId } =
		useParams<{ channelId: string; serverId: string }>()
	const navigate = useNavigate()

	const [isSelected, setIsSelected] = useState(false)
	const [isHover, setIsHover] = useState(false)

	useEffect(() => setIsSelected(channel.id === channelId), [channelId, channel])

	if (!serverId || !channel) return <></>

	return (
		<ListItem
			disablePadding
			dense
			key={channel.id}
			onMouseOver={(): void => setIsHover(true)}
			onMouseLeave={(): void => setIsHover(false)}
		>
			<ListItemButton
				disableRipple
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
							{/* <FiberManualRecord color='warning' sx={{ fontSize: 10 }} /> */}
							{isHover && (
								<Tooltip
									title='Channel Settings'
									placement='top'
									arrow
									disableInteractive
								>
									<Settings fontSize='small' />
								</Tooltip>
							)}
						</Stack>
					}
				/>
			</ListItemButton>
		</ListItem>
	)
}

export default ChannelNavButton
