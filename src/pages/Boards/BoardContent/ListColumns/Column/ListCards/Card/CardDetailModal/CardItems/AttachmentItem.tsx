import React from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import CallMadeOutlinedIcon from '@mui/icons-material/CallMadeOutlined'
import ObjectFitAvatar from '~/components/Common/ObjectFitAvatar'
import TextBoxToolTip from '~/components/Common/TextBoxToolTip'
import SingleLineTextBoxToolTip from '~/components/Common/SingleLineTextBoxToolTip'

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

const dotSx = {
    fontSize: '21px',
    lineHeight: '18px'
}

const textButtonSx = {
    cursor: 'pointer',
    textDecoration: 'underline'
}

function getRandomString(length) {
    return Math.random().toString(36).substring(2, 2 + length);
}

const AttachmentItem = () => {
    return (
        <Box sx={{
            display: 'flex',
            '&:hover': {
                backgroundColor: '#E2E4EA'
            },
            mb: '16px'
        }}>
            <Box>
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
            <Box sx={{ p: '0 20px' }}>
                <Box sx={{ m: '6px 0' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SingleLineTextBoxToolTip
                            sx={{ ...mediumTextSx, maxWidth: '460px' }}
                            id={'AttachItem-File-name-afasdlafk'}
                            text={'440939633_1150506733047856_2638472083588603517_440939633_11_n.jpg'}
                        />
                        &nbsp;&nbsp;
                        <Tooltip title="Open in new tab" arrow>
                            <CallMadeOutlinedIcon
                                sx={{ fontSize: '15px', color: '#162B4D', cursor: 'pointer' }}
                            />
                        </Tooltip>
                    </Box>

                    <Box sx={{ ...smallTextSx }}>Size: 1.2MB</Box>
                    <Box sx={{ display: 'flex' }}>
                        <Box sx={{ ...smallTextSx }}>
                            Added on 22/11/2023
                        </Box>
                        <Box sx={{ ...dotSx }}>&nbsp;•&nbsp;</Box>
                        <Box sx={{ ...smallTextSx, ...textButtonSx }}>
                            Download
                        </Box>
                        <Box sx={{ ...dotSx }}>&nbsp;•&nbsp;</Box>
                        <Box sx={{ ...smallTextSx, ...textButtonSx }}>
                            Delete
                        </Box>
                    </Box>

                </Box>
            </Box>
        </Box>
    )
}

export default AttachmentItem