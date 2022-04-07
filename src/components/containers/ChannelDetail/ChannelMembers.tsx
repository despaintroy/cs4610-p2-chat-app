import { VideoCameraFront } from '@mui/icons-material'
import {
	Avatar,
	Button,
	Dialog,
	DialogContent,
	Portal,
	Stack,
	Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import VideoCallDialog from 'components/common/VideoCallDialog'
import React, { FC } from 'react'
import useToggleShow from 'utils/hooks/useToggleShow'
import { PublicProfile } from 'utils/services/models'

const ChannelMembers: FC<{ userProfiles: PublicProfile[] }> = ({
	userProfiles,
}) => {
	const [
		isShowProfileDialog,
		{ show: showProfileDialog, hide: hideProfileDialog },
	] = useToggleShow(false)
	const [isShowVideoCall, { show: showVideoCall, hide: hideVideoCall }] =
		useToggleShow(false)
	const [selectedProfile, setSelectedProfile] = React.useState<PublicProfile>()

	const showUserDialog = (profile: PublicProfile): void => {
		setSelectedProfile(profile)
		showProfileDialog()
	}

	return (
		<Box sx={{ minWidth: '250px', bgcolor: '#2f3136' }}>
			<Box
				sx={{
					backgroundColor: '#37393e',
					borderBottom: 1,
					borderColor: 'black',
					px: 2,
					py: 1,
				}}
			>
				<Typography variant='h6'>&nbsp;</Typography>
			</Box>
			<Box sx={{ px: 3, py: 1 }}>
				<Typography variant='h6' color='text.disabled'>
					Channel Members
				</Typography>
				{userProfiles?.map(profile => (
					<Stack
						key={profile.id}
						direction='row'
						alignItems='center'
						sx={{ my: 1, cursor: 'pointer' }}
						onClick={(): void => showUserDialog(profile)}
					>
						<Avatar
							src={profile.profileImage || undefined}
							sx={{ mr: 2, width: '2rem', height: '2rem' }}
						/>
						<Box className='user-name' sx={{ width: '100%' }}>
							{profile.name}
						</Box>
					</Stack>
				))}
			</Box>
			<Portal>
				<Dialog onClose={hideProfileDialog} open={isShowProfileDialog}>
					<DialogContent>
						<Stack direction='row' alignItems='center' sx={{}}>
							<Avatar
								src={selectedProfile?.profileImage || '...'}
								sx={{ mr: 2, width: '4rem', height: '4rem' }}
							/>
							<Box sx={{ width: '100%' }}>
								<Typography fontSize='1.5rem' fontWeight={800}>
									{selectedProfile?.name}
								</Typography>
								<Button
									variant='contained'
									color='primary'
									endIcon={<VideoCameraFront />}
									fullWidth
									sx={{ mt: 2 }}
									onClick={(): void => {
										hideProfileDialog()
										showVideoCall()
									}}
								>
									Call
								</Button>
							</Box>
						</Stack>
					</DialogContent>
				</Dialog>
				<VideoCallDialog
					profile={selectedProfile}
					handleClose={hideVideoCall}
					show={isShowVideoCall}
				/>
			</Portal>
		</Box>
	)
}

export default ChannelMembers
