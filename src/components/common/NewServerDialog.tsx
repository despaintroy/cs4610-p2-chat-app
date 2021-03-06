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
	FormikTextField,
	SubmitButton,
} from 'components/common/FormComponents'
import { useFormik } from 'formik'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Paths } from 'utils/Paths'
import { createServer } from 'utils/services/servers'
import * as yup from 'yup'

interface newServerDialogProps {
	open: boolean
	handleClose: () => void
}

interface FormValues {
	serverName: string
}

const NewServerDialog: React.FC<newServerDialogProps> = props => {
	const { open, handleClose } = props
	const [formError, setFormError] = React.useState<string | null>()
	const navigate = useNavigate()

	const formik = useFormik({
		initialValues: {
			serverName: '',
		},
		validationSchema: yup.object({
			serverName: yup.string().required('Required'),
		}),
		onSubmit: async (values: FormValues, { resetForm }): Promise<void> => {
			setFormError(null)
			try {
				const newServerId = await createServer(values.serverName)
				resetForm()
				handleClose()
				navigate(Paths.getServerPath(newServerId))
			} catch (e) {
				setFormError((e as Error).message)
			}
		},
	})

	// Replace multiple spaces with single space
	const handleChange = (e: React.ChangeEvent<HTMLFormElement>): void => {
		formik.setFieldValue(e.target.name, e.target.value.replace(/[\s-]+/g, ' '))
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
				<DialogTitle>Create Server</DialogTitle>
				<DialogContent>
					<DialogContentText>
						You can add all your friends and create multiple channels in seach
						server!
					</DialogContentText>
					<FormikTextField
						autoFocus
						formik={formik}
						fieldName='serverName'
						label='Server Name'
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

export default NewServerDialog
