import React from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

export interface ApiLoadingOverlayProps {
    sx?: any
}

const ApiLoadingOverlay: React.FC<ApiLoadingOverlayProps> = ({ sx }) => {
    return (
        <Box sx={{ ...sx, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'auto' }}>
            <CircularProgress />
        </Box>
    )
}

export default ApiLoadingOverlay