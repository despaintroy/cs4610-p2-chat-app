import React from 'react'

import { LoadingButton, LoadingButtonProps } from '@mui/lab'

export interface SubmitButtonProps extends LoadingButtonProps {
	isSubmitting: boolean
	buttonText: string
}

SubmitButton.defaultProps = {
	buttonText: 'Submit',
}

export default function SubmitButton(
	props: SubmitButtonProps
): React.ReactElement {
	const { isSubmitting, ...rest } = props

	return (
		<LoadingButton
			{...rest}
			loading={isSubmitting}
			type='submit'
			fullWidth={rest.fullWidth ?? true}
			variant={rest.variant ?? 'contained'}
			sx={{ ...rest.sx, mt: 2, mb: 1 }}
		>
			{props.buttonText ?? 'Submit'}
		</LoadingButton>
	)
}
