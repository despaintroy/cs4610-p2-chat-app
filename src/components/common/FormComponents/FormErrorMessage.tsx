import React from 'react'

import { Alert } from '@mui/material'

export default function FormErrorMessage(props: {
	message: string
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
