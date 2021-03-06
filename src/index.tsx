import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import React from 'react'
import ReactDOM from 'react-dom'
import Router from 'Router'
import 'sass/index.scss'
import theme from 'theme'

ReactDOM.render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Router />
		</ThemeProvider>
	</React.StrictMode>,
	document.getElementById('root')
)
