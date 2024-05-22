import Box from '@mui/material/Box'
import React from 'react'

export interface SquareAvatarProps {
    src: string
    alt: string
    sx?: any
}

const boxSx = {
    width: '32px',
    height: '32px',
    borderRadius: '50%'
}

const boxTextSx = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    background: 'linear-gradient(to bottom, #C9372C , #FEA362)',
    color: 'white'
}

const CircleAvatar: React.FC<SquareAvatarProps> = ({ src, alt, sx }) => {
    if (src === null) {
        const firstChar = alt.charAt(0)
        return (
            <Box sx={{ ...boxSx, ...boxTextSx, ...sx }}>
                {firstChar}
            </Box>
        )
    }

    return (
        <Box sx={{ ...sx, boxSx }}>
            <img src={src} alt={alt} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
        </Box>
    )
}

export default CircleAvatar