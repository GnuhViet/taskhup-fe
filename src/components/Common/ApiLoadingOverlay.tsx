import React from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

export interface ApiLoadingOverlayProps {
    sx?: any
    processSx?: any
    size?: string
}

const ApiLoadingOverlay: React.FC<ApiLoadingOverlayProps> = ({ sx, processSx, size }) => {
    return (
        <Box sx={{ ...sx, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'auto' }}>
            <CircularProgress
                size={size || '48px'}
                sx={{
                    ...processSx
                }}
            />
        </Box>
    )
}

export default ApiLoadingOverlay