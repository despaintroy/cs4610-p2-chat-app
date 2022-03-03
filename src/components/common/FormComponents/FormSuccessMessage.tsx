import React from 'react'

import { Alert } from '@mui/material'

export default function FormSuccessMessage(props: {
	message?: string | null
}): React.ReactElement {
	const { message } = props

	if (message) {
		return (
			<Alert sx={{ mt: 2 }} severity='success'>
				{message}
			</Alert>
		)
	}

	return <></>
}
