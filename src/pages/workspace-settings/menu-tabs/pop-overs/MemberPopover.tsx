import React from 'react'

import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'

import { Role } from '~/core/model/role.model'
import CircleAvatar from '~/components/Common/CircleAvatar'
import { convertDate } from '~/core/utils/data-utils'

export interface MemberPopoverProps {
    id: string
    roleItem: Role
    open: boolean
    anchorEl: HTMLElement
    onClose?: () => void
    memberRoleMap: Map<string, any[]>
}

export interface MemberItemmProps {
    item: any
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

const MemberPopover: React.FC<MemberPopoverProps> = ({ id, roleItem, open, anchorEl, onClose, memberRoleMap }) => {
    const [fillterName, setFillterName] = React.useState(null)


    const MemberItem: React.FC<MemberItemmProps> = ({ item }) => {
        return (
            <Box sx={{ ...borderBottom, p: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '450px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircleAvatar
                        sx={{
                            width: '42px',
                            height: '42px',
                            fontSize: '16px',
                            mr: '12px',
                            background: item.avatarUrl ? '' : '#172B4D',
                            borderRadius: '50%'
                        }}
                        src={item.avatarUrl}
                        alt={item.fullName.charAt(0)}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ fontSize: '16px', fontWeight: '800', color: '#172B4D' }}>{item.fullName}</Box>
                        <Box sx={{ fontSize: '14px', fontWeight: '400', color: '#44546f', display: 'flex' }}>
                            <Box>@{item.userName}</Box>
                            <Box sx={{ fontSize: '20px', display: 'flex', alignItems: 'center', lineHeight: '14px' }}>
                                &nbsp;•&nbsp;
                            </Box>
                            <Box>Joined on {convertDate(item.joinDate)}</Box>
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
                        placeholder='John doe...'
                        size='small'
                        sx={{ width: '450px' }}
                        onChange={(e) => setFillterName(e.target.value)}
                    />
                    <FormHelperText>Type name to search</FormHelperText>
                </Box>
                {(fillterName
                    ? memberRoleMap.get(roleItem?.id)?.filter((item: any) =>
                        item.fullName.toLowerCase().includes(fillterName.toLowerCase())
                    )
                    : memberRoleMap.get(roleItem?.id)
                )?.map((item: any) => {
                    return (
                        <Box key={item.id}>
                            <MemberItem item={item} />
                        </Box>
                    )
                })}
            </Box>
        </Popover >
    )
}

export default MemberPopover