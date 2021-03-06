import { TagRounded } from '@mui/icons-material'
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	InputAdornment,
} from '@mui/material'
import {
	FormErrorMessage,
	FormikTextField,
	SubmitButton,
} from 'components/common/FormComponents'
import { useFormik } from 'formik'
import React from 'react'
import { Server } from 'utils/services/models'
import { updateServerName } from 'utils/services/servers'
import * as yup from 'yup'

interface ServerSettingsDialogProps {
	server: Server
	open: boolean
	handleClose: () => void
}

interface FormValues {
	serverName: string
}

const ServerSettingsDialog: React.FC<ServerSettingsDialogProps> = props => {
	const { server, open, handleClose } = props
	const [formError, setFormError] = React.useState<string | null>(null)

	const formik = useFormik({
		initialValues: {
			serverName: server.name,
		},
		validationSchema: yup.object({
			serverName: yup.string().required('Required'),
		}),
		onSubmit: async (values: FormValues): Promise<void> => {
			setFormError(null)
			try {
				await updateServerName(server.id, values.serverName)
				handleClose()
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
				<DialogTitle>Manage Server</DialogTitle>
				<DialogContent>
					<FormikTextField
						formik={formik}
						fieldName='serverName'
						label='Server Name'
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
						buttonText='Save'
					/>
				</DialogActions>
			</Box>
		</Dialog>
	)
}

export default ServerSettingsDialog
