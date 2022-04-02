import { Box } from '@mui/material'
import {
	FormErrorMessage,
	FormikTextField,
	SubmitButton,
} from 'components/common/FormComponents'
import RouterMuiLink from 'components/common/RouterMuiLink'
import { useFormik } from 'formik'
import React, { FC, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from 'Router'
import { Paths } from 'utils/Paths'
import * as yup from 'yup'

interface FormValues {
	name: string
	email: string
	password1: string
	password2: string
}

const CreateAccountForm: FC = (): React.ReactElement => {
	const { createAccount } = useContext(AuthContext)
	const navigate = useNavigate()
	const [formError, setFormError] = React.useState<string | null>(null)

	const formik = useFormik({
		initialValues: {
			name: '',
			email: '',
			password1: '',
			password2: '',
		},
		validationSchema: yup.object({
			name: yup.string().required('Required'),
			email: yup.string().email('Enter a valid email').required('Required'),
			password1: yup
				.string()
				.required('Required')
				.min(8, 'Password must be at least 8 characters long'),
			password2: yup
				.string()
				.required('Required')
				.equals([yup.ref('password1')], 'Passwords do not match'),
		}),
		onSubmit: async (values: FormValues): Promise<void> => {
			setFormError(null)
			try {
				await createAccount(values.name, values.email, values.password1)
				navigate(Paths.home)
			} catch (e) {
				setFormError((e as Error).message)
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
				variant='filled'
				formik={formik}
				fieldName='name'
				label='Name'
			/>
			<FormikTextField
				variant='filled'
				formik={formik}
				fieldName='email'
				label='Email'
			/>
			<FormikTextField
				variant='filled'
				formik={formik}
				fieldName='password1'
				label='Password'
				type='password'
				autoComplete='new-password'
			/>
			<FormikTextField
				variant='filled'
				formik={formik}
				fieldName='password2'
				label='Confirm Password'
				type='password'
				autoComplete='new-password'
			/>

			<FormErrorMessage message={formError} />
			<SubmitButton
				isSubmitting={formik.isSubmitting}
				buttonText='Create Account'
			/>

			<RouterMuiLink
				to={Paths.signin}
				variant='body2'
			>{`Already have an account? Sign In`}</RouterMuiLink>
		</Box>
	)
}

export default CreateAccountForm
