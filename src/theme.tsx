import React from 'react'

import {
	Link as RouterLink,
	LinkProps as RouterLinkProps,
} from 'react-router-dom'

import { colors } from '@mui/material'
import { createTheme } from '@mui/material/styles'

// Allow adapting MUI links to react-router-dom links
const LinkBehavior = React.forwardRef<
	never,
	Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
	const { href, ...other } = props
	return <RouterLink ref={ref} to={href} {...other} />
})

LinkBehavior.displayName = 'LinkBehavior'

const theme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: colors.lightBlue[500],
		},
	},
	components: {
		// MuiLink: {
		// 	defaultProps: {
		// 		component: LinkBehavior,
		// 	},
		// },
		MuiButtonBase: {
			defaultProps: {
				LinkComponent: LinkBehavior,
			},
		},
		// MuiAppBar: {
		// 	styleOverrides: {
		// 		colorPrimary: {
		// 			backgroundColor: '#fff',
		// 			color: colors.blueGrey[800],
		// 		},
		// 	},
		// },
		MuiListItemButton: {
			styleOverrides: {
				root: {
					borderRadius: 5,
					margin: '0.5rem',
				},
			},
		},
	},
	typography: {
		// allVariants: {
		// 	color: colors.blueGrey[100],
		// },
		h1: {
			fontSize: '1.8rem',
			fontWeight: '500',
		},
		h2: {
			fontSize: '1.3rem',
			fontWeight: '500',
		},
		h3: {
			fontSize: '1.1rem',
			fontWeight: '500',
		},
	},
})

export default theme
