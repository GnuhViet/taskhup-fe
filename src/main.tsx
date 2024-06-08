// import React from 'react'
import ReactDOM from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'

import App from '~/App.jsx'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '~/theme'
import {
    experimental_extendTheme as materialExtendTheme,
    Experimental_CssVarsProvider as MaterialCssVarsProvider,
    THEME_ID as MATERIAL_THEME_ID
} from '@mui/material/styles'
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles'


// Cấu hình react-toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Cấu hình MUI Dialog
import { ConfirmProvider } from 'material-ui-confirm'
import { Provider } from 'react-redux'
import { store } from '~/core/redux/store'
import { setCredentials } from './core/redux/slices/authSlice'

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const storedToken = localStorage.getItem('auth-token')
if (storedToken) {
    const token = JSON.parse(storedToken)
    store.dispatch(setCredentials(token))
}

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
    <Provider store={store}>
        <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: theme }}>
            <JoyCssVarsProvider>
                <ConfirmProvider defaultOptions={{
                    allowClose: false,
                    dialogProps: { maxWidth: 'xs' },
                    buttonOrder: ['confirm', 'cancel'],
                    cancellationButtonProps: { color: 'inherit' },
                    confirmationButtonProps: { color: 'secondary', variant: 'outlined' }
                }}>
                    <CssBaseline />
                    <App />
                    <ToastContainer position="bottom-left" theme="colored" />
                </ConfirmProvider>
            </JoyCssVarsProvider>
        </MaterialCssVarsProvider>
    </Provider>
    // </React.StrictMode>
)
