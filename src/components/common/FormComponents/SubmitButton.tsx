import { LoadingButton, LoadingButtonProps } from '@mui/lab'
import React, { FC } from 'react'

export interface SubmitButtonProps extends LoadingButtonProps {
	isSubmitting: boolean
	buttonText: string
}

const SubmitButton: FC<SubmitButtonProps> = ({
	isSubmitting,
	buttonText,
	...rest
}) => {
	return (
		<LoadingButton
			{...rest}
			loading={isSubmitting}
			type='submit'
			fullWidth={rest.fullWidth ?? true}
			variant={rest.variant ?? 'contained'}
			sx={{ ...rest.sx }}
		>
			{buttonText ?? 'Submit'}
		</LoadingButton>
	)
}

export default SubmitButton
