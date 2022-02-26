import React, { useContext } from 'react'

import { useFormik } from 'formik'
import { FormikTextField, SubmitButton } from 'components/common/FormComponents'

import { Box, Link } from '@mui/material'
import * as yup from 'yup'

import { Paths } from 'utils/Paths'
import { useNavigate } from 'react-router-dom'
import { FC } from 'react'
import { AuthContext } from 'App'

interface FormValues {
	email: string
	password: string
}

const SignInForm: FC = (): React.ReactElement => {
	const { signIn } = useContext(AuthContext)
	const navigate = useNavigate()
	// const [formError, setFormError] = React.useState('')

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
			await signIn(values.email, values.password)
			navigate(Paths.home)
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

			{/* <FormErrorMessage message={formError} /> */}
			<SubmitButton isSubmitting={formik.isSubmitting} buttonText='Sign In' />

			<Link href={Paths.signup} variant='body2'>
				{`Don't have an account? Sign Up`}
			</Link>
		</Box>
	)
}

export default SignInForm
