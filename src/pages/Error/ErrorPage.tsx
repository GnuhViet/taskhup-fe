import React from 'react'

import { Box } from '@mui/material'
import { Link } from 'react-router-dom'

export const ErrorPage = () => {
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="error-container">
                    <div className="error-content" style={{ textAlign: 'center' }}>
                        <h1 style={{ fontSize: '10rem', margin: '0', height: 'fit-content' }}>404</h1>
                        <h2>Page not found!</h2>
                        <p>Sorry, the page you are looking for does not exist.</p>
                        <p>Click <Link to={'/home'}>here</Link> to go back to the home page.</p>
                    </div>
                </div>
            </Box>
        </>
    )
}

export default ErrorPage