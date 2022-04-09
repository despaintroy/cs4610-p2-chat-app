// import FileInput from '@brainhubeu/react-file-input'
// import '@brainhubeu/react-file-input/dist/react-file-input.css'
import { Avatar, Button, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { FormErrorMessage } from 'components/common/FormComponents'
import React, { FC, useContext, useState } from 'react'
import { AuthContext } from 'Router'
import { updateProfilePicture } from 'utils/services/user'

const ProfileImageForm: FC = (): React.ReactElement => {
	const { user, syncUser } = useContext(AuthContext)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [errorMessage, setErrorMessage] = React.useState('')
	const [isEditing, setIsEditing] = React.useState(false)

	if (!user) return <></>

	const updateImage = async (file: File): Promise<void> => {
		setIsSubmitting(true)
		updateProfilePicture(file)
			.then(() => {
				setIsEditing(false)
				syncUser()
			})
			.catch(e => {
				setErrorMessage(e.message)
			})
			.finally(() => {
				setIsSubmitting(false)
			})
	}

	return (
		<Box sx={{ width: '100%' }}>
			{isEditing ? (
				isSubmitting ? (
					<Typography variant='body1'>Submitting...</Typography>
				) : (
					<></>
					// TODO: Add file input

					// <FileInput
					// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
					// 	onChangeCallback={(r: any): void => {
					// 		updateImage(r.value)
					// 	}}
					// 	scaleOptions={{
					// 		width: 128,
					// 		height: 128,
					// 	}}
					// 	label='Upload Image'
					// 	cropAspectRatio={1}
					// 	className='avatar-file-input'
					// 	dropAreaClassName='drop-area'
					// 	cropTool
					// />
				)
			) : (
				<Stack>
					<Avatar
						src={user.picture ?? undefined}
						sx={{
							width: 100,
							height: 100,
							mt: 3,
						}}
					/>
					<Button
						variant='text'
						onClick={(): void => setIsEditing(true)}
						sx={{ width: 100 }}
					>
						Edit
					</Button>
				</Stack>
			)}
			<FormErrorMessage message={errorMessage} />
		</Box>
	)
}

export default ProfileImageForm
