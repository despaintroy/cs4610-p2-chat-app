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
import { deleteServer } from 'utils/services/servers'

interface ConfirmDeleteDialogProps {
	serverId: string
	open: boolean
	handleClose: () => void
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = props => {
	const { serverId, open, handleClose } = props
	const [formError, setFormError] = React.useState<string | null>()
	const [isSubmitting, setIsSubmitting] = React.useState(false)

	const handleSubmit = async (): Promise<void> => {
		setFormError(null)
		setIsSubmitting(true)
		try {
			await deleteServer(serverId)
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
				<DialogTitle>Permanently Delete Server</DialogTitle>
				<DialogContent>
					<DialogContentText>
						This server will be permanently deleted for all users
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
						buttonText='Delete Server'
					/>
				</DialogActions>
			</Box>
		</Dialog>
	)
}

export default ConfirmDeleteDialog
