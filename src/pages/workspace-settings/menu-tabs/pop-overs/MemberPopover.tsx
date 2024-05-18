import React from 'react'

import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'

import { Role } from '~/core/model/role.model'
import CircleAvatar from '~/components/Common/CircleAvatar'

export interface MemberPopoverProps {
    id: string
    roleItem: Role
    open: boolean
    anchorEl: HTMLElement
    onClose?: () => void
}

export interface MemberItemmProps {
    item?: any
    label?: any
    helperText?: any
    subHelperText?: any
}

const buttonSx = {
    color: '#172B4D',
    backgroundColor: '#F0F1F4',
    boxShadow: 'none !important',
    height: '32px',
    frontSize: '14px',
    frontWeight: '300',
    alignItems: 'center',
    mr: '14px',
    '&:hover': {
        backgroundColor: '#DCDFE4'
    }
}

const borderBottom = {
    borderBottom: '1px solid #DCDFE4'
}

const MemberPopover: React.FC<MemberPopoverProps> = ({ id, roleItem, open, anchorEl, onClose }) => {

    const MemberItem: React.FC<MemberItemmProps> = () => {
        return (
            <Box key='5' sx={{ ...borderBottom, p: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '450px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircleAvatar sx={{ minWidth: '42px', minHeight: '42px', fontSize: '16px', mr: '12px', background: '#172B4D' }} src={null} alt='V' />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ fontSize: '16px', fontWeight: '800', color: '#172B4D' }}>Việt Hưng Nguyễn</Box>
                        <Box sx={{ fontSize: '14px', fontWeight: '400', color: '#44546f', display: 'flex' }}>
                            <Box>@vithngnguyn16</Box>
                            <Box sx={{ fontSize: '20px', display: 'flex', alignItems: 'center', lineHeight: '14px' }}>
                                &nbsp;•&nbsp;
                            </Box>
                            <Box>Joined 1 month ago</Box>
                        </Box>
                    </Box>
                </Box>
                <Box>
                    <Button sx={{ ...buttonSx, mr: 0 }} variant='contained' startIcon={<CloseOutlinedIcon />}>Remove</Button>
                </Box>
            </Box>
        )
    }

    return (
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
            slotProps={{
                paper: {
                    style: {
                        minWidth: '300px',
                        borderRadius: '8px',
                        // border: '1px solid #B2B9C4',
                        boxShadow: '0',
                        marginTop: id === 'header-create-board-popover' ? '8px' : '0'
                    }
                }
            }}
            style={{ zIndex: 99 }}
        >
            <Box sx={{ m: '12px 24px' }}>
                {/* <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                </form> */}
                <Box sx={{ ...borderBottom, p: '24px 0 12px 0' }}>
                    <TextField
                        placeholder='Add new member...'
                        size='small'
                        sx={{ width: '450px' }}
                    />
                    <FormHelperText>Type name to search</FormHelperText>
                </Box>

                <MemberItem />
                <MemberItem />
                <MemberItem />
                <MemberItem />
            </Box>
        </Popover >
    )
}

export default MemberPopover