import React, { FC, useContext, useEffect } from 'react'

import { useFormik } from 'formik'
import * as yup from 'yup'

import { Box } from '@mui/system'
import { AuthContext } from 'Router'
import {
	FormErrorMessage,
	FormikTextField,
	SubmitButton,
} from 'components/common/FormComponents'
import { updateEmail, updateName } from 'utils/services/user'
import { getMessage } from 'utils/services/errors'
import { AuthError } from 'firebase/auth'

const ProfileForm: FC = (): React.ReactElement => {
	const { user } = useContext(AuthContext)
	const [formError, setFormError] = React.useState('')
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
			setFormError('')
			try {
				await Promise.all([
					user.name !== values.name
						? updateName(values.name)
						: Promise.resolve(),
					user.email !== values.email
						? updateEmail(values.email)
						: Promise.resolve(),
				])
			} catch (e) {
				return setFormError(getMessage(e as AuthError))
			}
		},
	})

	useEffect(
		() =>
			setHasChanged(
				user.name !== formik.values.name || user.email !== formik.values.email
			),
		[formik.values.name, formik.values.email]
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

			<FormErrorMessage message={formError} />
			<SubmitButton
				isSubmitting={formik.isSubmitting}
				buttonText='Save Changes'
				disabled={!hasChanged}
				fullWidth={false}
			/>
		</Box>
	)
}

export default ProfileForm