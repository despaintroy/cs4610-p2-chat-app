import { Box } from '@mui/system'
import {
	FormErrorMessage,
	FormikTextField,
	SubmitButton,
} from 'components/common/FormComponents'
import FormSuccessMessage from 'components/common/FormComponents/FormSuccessMessage'
import { AuthError } from 'firebase/auth'
import { useFormik } from 'formik'
import React, { FC, useContext } from 'react'
import { AuthContext } from 'Router'
import { getMessage } from 'utils/services/errors'
import { updatePassword } from 'utils/services/user'
import * as yup from 'yup'

const PasswordForm: FC = (): React.ReactElement => {
	const { user } = useContext(AuthContext)
	const [errorMessage, setErrorMessage] = React.useState('')
	const [successMessage, setSuccessMessage] = React.useState('')

	if (!user) return <></>

	const initialValues = {
		password1: '',
		password2: '',
	}

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: yup.object({
			password1: yup
				.string()
				.required('Required')
				.min(8, 'Password must be at least 8 characters long'),
			password2: yup
				.string()
				.required('Required')
				.equals([yup.ref('password1')], 'Passwords do not match'),
		}),
		onSubmit: async (values, { resetForm }): Promise<void> => {
			setErrorMessage('')
			try {
				await updatePassword(values.password1)
				setSuccessMessage('Password updated successfully')
				setTimeout(() => setSuccessMessage(''), 4000)
				resetForm()
			} catch (e) {
				return setErrorMessage(getMessage(e as AuthError))
			}
		},
	})

	return (
		<Box
			component='form'
			onSubmit={formik.handleSubmit}
			noValidate
			sx={{ width: '100%' }}
		>
			<FormikTextField
				formik={formik}
				fieldName='password1'
				label='New Password'
				type='password'
			/>
			<FormikTextField
				formik={formik}
				fieldName='password2'
				label='Confirm New Password'
				type='password'
			/>

			<FormErrorMessage message={errorMessage} />
			<FormSuccessMessage message={successMessage} />
			<SubmitButton
				isSubmitting={formik.isSubmitting}
				buttonText='Change Password'
				disabled={!formik.values.password1 && !formik.values.password2}
				fullWidth={false}
			/>
		</Box>
	)
}

export default PasswordForm
