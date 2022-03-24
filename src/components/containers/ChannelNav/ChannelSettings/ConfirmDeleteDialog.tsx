import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Box,
} from '@mui/material'
import {
	FormErrorMessage,
	SubmitButton,
} from 'components/common/FormComponents'
import React from 'react'
import { deleteChannel } from 'utils/services/channels'

interface ConfirmDeleteDialogProps {
	channelId: string
	open: boolean
	handleClose: () => void
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = props => {
	const { channelId, open, handleClose } = props
	const [formError, setFormError] = React.useState<string | null>()
	const [isSubmitting, setIsSubmitting] = React.useState(false)

	const handleSubmit = async (): Promise<void> => {
		setFormError(null)
		setIsSubmitting(true)
		try {
			await deleteChannel(channelId)
			handleClose()
		} catch (e) {
			setFormError((e as Error).message)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Dialog open={open} onClose={handleClose}>
			<Box>
				<DialogTitle>Permanently Delete Channel</DialogTitle>
				<DialogContent>
					<DialogContentText>
						This channel will be permanently deleted for all users
					</DialogContentText>
					<FormErrorMessage message={formError} />
				</DialogContent>
				<DialogActions>
					<Button color='error' onClick={handleClose}>
						Cancel
					</Button>
					<SubmitButton
						color='error'
						onClick={handleSubmit}
						fullWidth={false}
						isSubmitting={isSubmitting}
						buttonText='Delete Channel'
					/>
				</DialogActions>
			</Box>
		</Dialog>
	)
}

export default ConfirmDeleteDialog
