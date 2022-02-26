import React, { useContext } from 'react'

import { useFormik } from 'formik'
import {
	FormErrorMessage,
	FormikTextField,
	SubmitButton,
} from 'components/common/FormComponents'

import { Box } from '@mui/material'
import * as yup from 'yup'

import { Paths } from 'utils/Paths'
import { useNavigate } from 'react-router-dom'
import { FC } from 'react'
import { AuthContext } from 'Router'
import RouterMuiLink from 'components/common/RouterMuiLink'

interface FormValues {
	email: string
	password: string
}

const SignInForm: FC = (): React.ReactElement => {
	const { signIn } = useContext(AuthContext)
	const navigate = useNavigate()
	const [formError, setFormError] = React.useState<string | null>(null)

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validationSchema: yup.object({
			email: yup.string().email('Enter a valid email').required('Required'),
			password: yup.string().required('Required'),
		}),
		onSubmit: async (values: FormValues): Promise<void> => {
			setFormError(null)
			try {
				await signIn(values.email, values.password)
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
				fieldName='email'
				label='Email'
			/>
			<FormikTextField
				variant='filled'
				formik={formik}
				fieldName='password'
				label='Password'
				type='password'
				autoComplete='current-password'
			/>

			<FormErrorMessage message={formError} />
			<SubmitButton isSubmitting={formik.isSubmitting} buttonText='Sign In' />

			<RouterMuiLink
				to={Paths.createAccount}
				variant='body2'
			>{`Don't have an account? Sign up`}</RouterMuiLink>
		</Box>
	)
}

export default SignInForm
