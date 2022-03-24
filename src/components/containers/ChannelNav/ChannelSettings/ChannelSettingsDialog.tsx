import { TagRounded } from '@mui/icons-material'
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
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
import { updateChannelName } from 'utils/services/channels'
import { Channel } from 'utils/services/models'
import * as yup from 'yup'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'

interface ChannelSettingsDialogProps {
	channel: Channel
	open: boolean
	handleClose: () => void
}

interface FormValues {
	channelName: string
}

const ChannelSettingsDialog: React.FC<ChannelSettingsDialogProps> = props => {
	const { channel, open, handleClose } = props
	const [formError, setFormError] = React.useState<string | null>(null)
	const [showDelete, setShowDelete] = React.useState(false)

	const formik = useFormik({
		initialValues: {
			channelName: channel.name,
		},
		validationSchema: yup.object({
			channelName: yup.string().required('Required'),
		}),
		onSubmit: async (values: FormValues): Promise<void> => {
			setFormError(null)
			try {
				await updateChannelName(channel.id, values.channelName)
				handleClose()
			} catch (e) {
				setFormError((e as Error).message)
			}
		},
	})

	// Replace multiple spaces with single space
	const handleChange = (e: React.ChangeEvent<HTMLFormElement>): void => {
		formik.setFieldValue(e.target.name, e.target.value.replace(/[\s-]+/g, '-'))
	}

	return (
		<>
			<Dialog
				fullWidth
				maxWidth='sm'
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
					<DialogTitle>Channel Settings</DialogTitle>
					<DialogContent>
						<FormikTextField
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
							color='error'
							sx={{ mr: 'auto' }}
							onClick={(): void => {
								handleClose()
								setShowDelete(true)
							}}
						>
							Delete Channel
						</Button>
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
							buttonText='Save'
						/>
					</DialogActions>
				</Box>
			</Dialog>
			<ConfirmDeleteDialog
				channelId={channel.id}
				open={showDelete}
				handleClose={(): void => {
					setShowDelete(false)
				}}
			/>
		</>
	)
}

export default ChannelSettingsDialog
