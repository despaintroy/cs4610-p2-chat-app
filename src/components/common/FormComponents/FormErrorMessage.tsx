import { Alert } from '@mui/material'
import React, { FC } from 'react'

export interface FormErrorMessageProps {
	message?: string | null
}

const FormErrorMessage: FC<FormErrorMessageProps> = ({ message }) => {
	return !message ? null : (
		<Alert sx={{ mt: 2 }} severity='error'>
			{message}
		</Alert>
	)
}

export default FormErrorMessage
