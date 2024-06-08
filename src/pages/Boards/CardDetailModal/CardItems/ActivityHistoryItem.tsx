import React from 'react'

import Box from '@mui/material/Box'
import CircleAvatar from '~/components/Common/CircleAvatar'
import { useSelector } from 'react-redux'
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined'

const mediumTextSx = {
    fontSize: '15px',
    fontWeight: '700',
    color: '#162B4D'
}

const smallTextSx = {
    fontSize: '12px',
    fontWeight: '400',
    color: '#44546f'
}

const textButtonSx = {
    cursor: 'pointer',
    textDecoration: 'underline'
}

const ActivityHistoryItem: React.FC = () => {
    const userInfo = useSelector((state: any) => state.homeReducer.userInfo)
    return (
        <Box sx={{ display: 'flex', mb: '16px' }}>
            <Box sx={{
                mr: '10px',
                mt: '4px'
            }}>
                <CircleAvatar
                    src={userInfo?.avatar}
                    alt={userInfo?.fullName}
                    sx={{
                        width: '32px',
                        height: '32px'
                    }}
                />
            </Box>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: '4px' }}>
                    <Box sx={{ ...mediumTextSx }}>Việt Hưng Nguyễn</Box>
                    <Box sx={{ ...smallTextSx, ml: '8px', mt: '2px' }}>Attached</Box>
                </Box>
                <Box sx={{ display: 'flex' }}>
                    <Box sx={{ ...smallTextSx, ...textButtonSx }}>
                        <AttachmentOutlinedIcon sx={{ fontSize: '16px' }} />
                    </Box>
                    &nbsp;
                    <Box sx={{ ...smallTextSx }}>
                        to this card
                    </Box>
                    &nbsp;
                    <Box sx={{ ...smallTextSx }}>
                        on 22/11/2023 at 15:20
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default ActivityHistoryItem