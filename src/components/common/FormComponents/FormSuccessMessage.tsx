import { Alert } from '@mui/material'
import React, { FC } from 'react'

export interface FormSuccessMessageProps {
	message?: string | null
}

const FormSuccessMessage: FC<FormSuccessMessageProps> = ({ message }) => {
	return !message ? null : (
		<Alert sx={{ mt: 2 }} severity='success'>
			{message}
		</Alert>
	)
}

export default FormSuccessMessage
