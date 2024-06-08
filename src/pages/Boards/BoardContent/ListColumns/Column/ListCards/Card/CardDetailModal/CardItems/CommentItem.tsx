import React from 'react'

import Box from '@mui/material/Box'
import CircleAvatar from '~/components/Common/CircleAvatar'
import { useSelector } from 'react-redux'
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined'
import ObjectFitAvatar from '~/components/Common/ObjectFitAvatar'

const mediumTextSx = {
    fontSize: '15px',
    fontWeight: '700',
    color: '#162B4D'
}

const labelTextSx = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#44546f'
}

const smallTextSx = {
    fontSize: '12px',
    fontWeight: '400',
    color: '#44546f'
}

const dotSx = {
    fontSize: '21px',
    lineHeight: '18px'
}

const textButtonSx = {
    cursor: 'pointer',
    textDecoration: 'underline'
}

const CommentItem: React.FC = () => {
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
                    <Box sx={{ ...smallTextSx, ml: '8px', mt: '2px' }}>Added on 22/11/2023 at 15:20</Box>
                </Box>
                <Box
                    sx={{
                        backgroundColor: '#E2E4EA',
                        borderRadius: '3px',
                        border: '1px solid #dfe1e6',
                        mb: '4px'
                        // '&:hover': {
                        //     backgroundColor: '#CFD3DB'
                        // }
                    }}
                >
                    <Box sx={{
                        p: '8px 12px',
                        ...labelTextSx,
                        fontSize: '16px',
                        fontWeight: '400'
                    }}>
                        {'content of comments'}
                    </Box>
                </Box>
                <Box sx={{ display: 'flex' }}>
                    <Box sx={{ ...smallTextSx, ...textButtonSx }}>
                        <AttachmentOutlinedIcon sx={{ fontSize: '16px' }} />
                    </Box>
                    <Box sx={{ ...dotSx }}>&nbsp;•&nbsp;</Box>
                    <Box sx={{ ...smallTextSx, ...textButtonSx }}>
                        Edit
                    </Box>
                    <Box sx={{ ...dotSx }}>&nbsp;•&nbsp;</Box>
                    <Box sx={{ ...smallTextSx, ...textButtonSx }}>
                        Delete
                    </Box>
                </Box>
                <Box sx={{ display: 'flex' }}>
                    <Box sx={{ mr: '12px' }}>
                        <ObjectFitAvatar
                            src={'https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D'}
                            alt={null}
                            sx={{
                                width: '112px',
                                height: '80px',
                                borderRadius: '3px'
                            }}
                        />
                    </Box>
                    <Box sx={{ mr: '12px' }}>
                        <ObjectFitAvatar
                            src={'https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D'}
                            alt={null}
                            sx={{
                                width: '112px',
                                height: '80px',
                                borderRadius: '3px'
                            }}
                        />
                    </Box>
                    <Box sx={{ mr: '12px' }}>
                        <ObjectFitAvatar
                            src={'https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D'}
                            alt={null}
                            sx={{
                                width: '112px',
                                height: '80px',
                                borderRadius: '3px'
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default CommentItem