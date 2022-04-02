import { BaseTextFieldProps, TextField, TextFieldProps } from '@mui/material'
import { FormikContextType } from 'formik'
import React from 'react'

export interface FormikTextFieldProps<Values> extends BaseTextFieldProps {
	formik: FormikContextType<Values>
	fieldName: keyof Values
}

FormikTextField.defaultProps = {
	variant: 'standard',
	margin: 'normal',
	fullWidth: true,
	type: 'text',
}

export default function FormikTextField<Values>(
	props: FormikTextFieldProps<Values> & TextFieldProps
): React.ReactElement {
	const { formik, fieldName, ...rest } = props

	return (
		<TextField
			{...rest}
			fullWidth={rest.fullWidth}
			margin={rest.margin}
			id={rest.id ?? fieldName.toString()}
			name={fieldName.toString()}
			type={rest.type}
			variant={rest.variant}
			value={formik.values[fieldName]}
			onChange={formik.handleChange}
			error={formik.touched[fieldName] && !!formik.errors[fieldName]}
			helperText={formik.touched[fieldName] && formik.errors[fieldName]}
		/>
	)
}
