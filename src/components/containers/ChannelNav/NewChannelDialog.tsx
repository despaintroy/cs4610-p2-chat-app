import { TagRounded } from '@mui/icons-material'
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Box,
	InputAdornment,
} from '@mui/material'
import {
	FormErrorMessage,
	FormikTextField,
	SubmitButton,
} from 'components/common/FormComponents'
import { useFormik } from 'formik'
import React from 'react'
import { createChannel } from 'utils/services/channels'
import * as yup from 'yup'

interface NewChannelDialogProps {
	serverId: string
	open: boolean
	handleClose: () => void
}

interface FormValues {
	channelName: string
}

const NewChannelDialog: React.FC<NewChannelDialogProps> = props => {
	const { serverId, open, handleClose } = props
	const [formError, setFormError] = React.useState<string | null>()

	const formik = useFormik({
		initialValues: {
			channelName: '',
		},
		validationSchema: yup.object({
			channelName: yup.string().required('Required'),
		}),
		onSubmit: async (values: FormValues, { resetForm }): Promise<void> => {
			setFormError(null)
			console.log('submit', values)
			try {
				await createChannel(serverId, values.channelName)
				resetForm()
				handleClose()
			} catch (e) {
				setFormError((e as Error).message)
			}
		},
	})

	// Enforce lowercase, replace spaces with dashes
	const handleChange = (e: React.ChangeEvent<HTMLFormElement>): void => {
		formik.setFieldValue(
			e.target.name,
			e.target.value.replace(/[\s-]+/g, '-').toLowerCase()
		)
	}

	return (
		<Dialog
			open={open}
			onClose={(): void => {
				formik.resetForm()
				handleClose()
			}}
		>
			<Box
				component='form'
				onSubmit={formik.handleSubmit}
				onChange={handleChange}
				noValidate
				sx={{ width: '100%' }}
			>
				<DialogTitle>Create Channel</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Creating a new channel will share it with everyone in the server
					</DialogContentText>
					<FormikTextField
						autoFocus
						formik={formik}
						fieldName='channelName'
						label='Channel Name'
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<TagRounded />
								</InputAdornment>
							),
						}}
					/>
					<FormErrorMessage message={formError} />
				</DialogContent>
				<DialogActions>
					<Button
						onClick={(): void => {
							formik.resetForm()
							handleClose()
						}}
					>
						Cancel
					</Button>
					<SubmitButton
						fullWidth={false}
						isSubmitting={formik.isSubmitting}
						buttonText='Create'
					/>
				</DialogActions>
			</Box>
		</Dialog>
	)
}

export default NewChannelDialog
