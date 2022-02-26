import React, { FC } from 'react'
import {
	Link as RouterLink,
	LinkProps as RouterLinkProps,
} from 'react-router-dom'

import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material'

const RouterMuiLink: FC<MuiLinkProps & RouterLinkProps> = props => {
	const { to, children, ...rest } = props
	return (
		<MuiLink component={RouterLink} to={to} {...rest}>
			{children}
		</MuiLink>
	)
}

export default RouterMuiLink
