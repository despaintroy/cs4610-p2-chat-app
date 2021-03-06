import { Box } from '@mui/system'
import {
	FormErrorMessage,
	FormikTextField,
	SubmitButton,
} from 'components/common/FormComponents'
import FormSuccessMessage from 'components/common/FormComponents/FormSuccessMessage'
import { AuthError } from 'firebase/auth'
import { useFormik } from 'formik'
import React, { FC, useContext, useEffect } from 'react'
import { AuthContext } from 'Router'
import { getMessage } from 'utils/services/errors'
import { updateEmail, updateName } from 'utils/services/user'
import * as yup from 'yup'

const ProfileForm: FC = (): React.ReactElement => {
	const { user, syncUser } = useContext(AuthContext)
	const [errorMessage, setErrorMessage] = React.useState('')
	const [successMessage, setSuccessMessage] = React.useState('')
	const [hasChanged, setHasChanged] = React.useState(false)

	if (!user) return <></>

	const initialValues = {
		name: user.name ?? '',
		email: user.email ?? '',
	}

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: yup.object({
			name: yup.string().required('Required'),
			email: yup.string().required('Required').email('Email is invalid'),
		}),
		onSubmit: async (values): Promise<void> => {
			setErrorMessage('')
			try {
				await Promise.all([
					user.name !== values.name
						? updateName(values.name)
						: Promise.resolve(),
					user.email !== values.email
						? updateEmail(values.email)
						: Promise.resolve(),
				])
				syncUser()
				setSuccessMessage('Profile updated successfully')
				setTimeout(() => setSuccessMessage(''), 4000)
			} catch (e) {
				return setErrorMessage(getMessage(e as AuthError))
			}
		},
	})

	useEffect(
		() =>
			setHasChanged(
				user.name !== formik.values.name || user.email !== formik.values.email
			),
		[formik.values.name, formik.values.email, user.name, user.email]
	)

	return (
		<Box
			component='form'
			onSubmit={formik.handleSubmit}
			noValidate
			sx={{ width: '100%' }}
		>
			<FormikTextField formik={formik} fieldName='name' label='Name' />
			<FormikTextField formik={formik} fieldName='email' label='Email' />

			<FormErrorMessage message={errorMessage} />
			<FormSuccessMessage message={successMessage} />
			<SubmitButton
				isSubmitting={formik.isSubmitting}
				buttonText='Save Changes'
				disabled={!hasChanged}
				fullWidth={false}
				sx={{ mt: 2, mb: 1 }}
			/>
		</Box>
	)
}

export default ProfileForm
