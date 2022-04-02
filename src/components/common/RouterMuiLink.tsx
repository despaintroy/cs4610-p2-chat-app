import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material'
import React, { FC } from 'react'
import {
	Link as RouterLink,
	LinkProps as RouterLinkProps,
} from 'react-router-dom'

const RouterMuiLink: FC<MuiLinkProps & RouterLinkProps> = ({
	to,
	children,
	...rest
}) => {
	return (
		<MuiLink component={RouterLink} to={to} {...rest}>
			{children}
		</MuiLink>
	)
}

export default RouterMuiLink
