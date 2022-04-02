import { Typography, Stack, Avatar } from '@mui/material'
import { Box } from '@mui/system'
import React, { FC } from 'react'
import { PublicProfile } from 'utils/services/models'

const ChannelMembers: FC<{ userProfiles: PublicProfile[] }> = ({
	userProfiles,
}) => {
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
						sx={{ my: 1 }}
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
		</Box>
	)
}

export default ChannelMembers
