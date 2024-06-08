import React from 'react'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: '#E2E4EA'
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: '#1F845B'
    }
}))

export interface ProgressBarProps {
    value: number
    showValue?: boolean
    sx?: any
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, showValue, sx }) => {
    return (
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', ...sx }}>
            <BorderLinearProgress variant="determinate" value={value} sx={{ flexGrow: 1 }} />
            <Typography
                variant="body2"
                sx={{
                    display: showValue ? 'block' : 'none',
                    position: 'absolute',
                    width: '100%',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    mt: '2px'
                }}>\
                {value}%
            </Typography>
        </Box>
    )
}

export default ProgressBar