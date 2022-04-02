import { Alert } from '@mui/material'
import React from 'react'

export default function FormErrorMessage(props: {
	message?: string | null
}): React.ReactElement {
	const { message } = props

	if (message) {
		return (
			<Alert sx={{ mt: 2 }} severity='error'>
				{message}
			</Alert>
		)
	}

	return <></>
}
