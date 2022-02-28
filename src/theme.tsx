import { colors } from '@mui/material'
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
	palette: {
		mode: 'dark',
		background: {
			default: '#202225',
		},
		primary: {
			main: colors.lightBlue[500],
		},
	},
	components: {
		MuiListItemButton: {
			styleOverrides: {
				root: {
					borderRadius: 5,
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
