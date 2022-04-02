import { ArrowForwardIos } from '@mui/icons-material'
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Container,
	Divider,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Typography,
} from '@mui/material'
import React, { FC, useEffect, useState } from 'react'
import { getLocalChannels } from 'utils/services/localChannels'
import { LocalChannel } from 'utils/services/models'
import { convertDistance, getDistance } from 'geolib'
import NewLocalChannelDialog from './NewLocalChannelDialog'
import { Paths } from 'utils/Paths'
import { useNavigate } from 'react-router-dom'

const Nearby: FC = () => {
	const [localChannels, setLocalChannels] = useState<LocalChannel[]>()
	const [error, setError] = useState<string | null>(null)
	const [showCreateChannelDialog, setShowCreateChannelDialog] = useState(false)
	const [myLocation, setMyLocation] = useState<
		GeolocationPosition | null | undefined
	>(undefined)
	const navigate = useNavigate()

	useEffect(() => {
		getLocalChannels().then(setLocalChannels).catch(console.error)

		if (!navigator.geolocation)
			setError('Geolocation is not supported by this browser')

		navigator.geolocation.getCurrentPosition(
			location => setMyLocation(location),
			error => {
				setMyLocation(null)
				switch (error.code) {
					case error.PERMISSION_DENIED:
						setError('User denied the request for Geolocation.')
						break
					case error.POSITION_UNAVAILABLE:
						setError('Location information is unavailable.')
						break
					case error.TIMEOUT:
						setError('The request to get user location timed out.')
						break
					default:
						setError('An unknown error occurred.')
						break
				}
			}
		)
	}, [])

	return (
		<Box sx={{ backgroundColor: '#37393e', width: '100%', py: 2 }}>
			<Container maxWidth='sm'>
				<Typography variant='h1'>Local Channels</Typography>
				<Divider sx={{ p: 1 }} />
				{error && <Alert severity='error'>{error}</Alert>}
				{myLocation === undefined && (
					<Box sx={{ textAlign: 'center', mt: 5 }}>
						<p>Getting location...</p>
						<CircularProgress />
					</Box>
				)}
				{myLocation && (
					<>
						<List>
							{localChannels?.map(channel => {
								const distance = convertDistance(
									getDistance(
										{
											latitude: myLocation.coords.latitude,
											longitude: myLocation.coords.longitude,
										},
										{
											latitude: channel.location.lat,
											longitude: channel.location.lon,
										}
									),
									'mi'
								)
								return (
									<ListItem key={channel.id} disablePadding>
										<ListItemButton
											onClick={(): void =>
												navigate(Paths.getLocalChannelPath(channel.id))
											}
										>
											<ListItemText
												primary={channel.name}
												secondary={
													!myLocation?.coords
														? `${channel.location.lat}º, ${channel.location.lon}º`
														: Math.round(distance) + ' miles away'
												}
											/>
											<ArrowForwardIos />
										</ListItemButton>
									</ListItem>
								)
							})}
						</List>
						<Button
							variant='contained'
							onClick={(): void => setShowCreateChannelDialog(true)}
							fullWidth
						>
							New Local Channel
						</Button>
					</>
				)}
			</Container>
			{myLocation && (
				<NewLocalChannelDialog
					open={showCreateChannelDialog}
					handleClose={(): void => setShowCreateChannelDialog(false)}
					geolocation={myLocation}
				/>
			)}
		</Box>
	)
}

export default Nearby
