import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@mui/material'
import {
	FormErrorMessage,
	SubmitButton,
} from 'components/common/FormComponents'
import React from 'react'
import { leaveServer } from 'utils/services/servers'

interface ConfirmLeaveDialogProps {
	serverId: string
	open: boolean
	handleClose: () => void
}

const ConfirmLeaveDialog: React.FC<ConfirmLeaveDialogProps> = props => {
	const { serverId, open, handleClose } = props
	const [formError, setFormError] = React.useState<string | null>()
	const [isSubmitting, setIsSubmitting] = React.useState(false)

	const handleSubmit = async (): Promise<void> => {
		setFormError(null)
		setIsSubmitting(true)
		try {
			await leaveServer(serverId)
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
				<DialogTitle>Leave Server</DialogTitle>
				<DialogContent>
					<DialogContentText>
						You will no longer be able to access this server.
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
						buttonText='Leave Server'
					/>
				</DialogActions>
			</Box>
		</Dialog>
	)
}

export default ConfirmLeaveDialog
