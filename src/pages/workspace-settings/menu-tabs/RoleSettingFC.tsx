import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import TextField from '@mui/material/TextField'
import CircleAvatar from '~/components/Common/CircleAvatar'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import CreateRoleDialog from '../Dialogs/CreateRoleDialog'

import { Can } from '~/core/utils/access-control'
import { useGetWorkspaceRolesQuery } from '~/core/redux/api/role.api'
import { useSelector } from 'react-redux'
import { Role } from '~/core/model/role.model'
import PermissionPopover from './pop-overs/PermissionPopover'

const headingSx = {
    fontSize: '18px',
    fontWeight: '500',
    color: '#172b4d',
    mb: '12px'
}

const textSx = {
    fontSize: '13px',
    fontWeight: '300',
    color: '#172b4d'
}

const borderBottom = {
    borderBottom: '1px solid #DCDFE4'
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

const RoleSettingFC = () => {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [openCreateRole, setOpenCreateRole] = React.useState(false)

    const { error, isLoading } = useGetWorkspaceRolesQuery({})

    const roles = useSelector((state: any) => state.workspaceReducer.roles) as Role[]

    const open = Boolean(anchorEl)

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const [currentSelectedRole, setCurrentSelectedRole] = React.useState(null)

    if (error) return <div>Error: {error.message}</div>
    if (isLoading) return <div>Loading...</div>


    return (
        <>
            <Box>
                <Box sx={{ ...borderBottom, pb: '14px' }}>
                    <Box sx={headingSx}>Roles ({roles.length})</Box>
                    <Box sx={textSx}>Use roles to group your members and assign permissions.</Box>
                </Box>
                <Box sx={{ ...borderBottom, p: '24px 0 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ maxWidth: '600px' }}>
                        <TextField
                            placeholder='Filter by name...'
                            size='small'
                            sx={{ width: '450px' }}
                        />
                    </Box>
                    <Can I='edit' a='role'>
                        <Button
                            sx={{ ...buttonSx, mr: 0 }}
                            variant='contained'
                            startIcon={<BadgeOutlinedIcon sx={{ mb: '4px' }} />}
                            onClick={() => setOpenCreateRole(true)}
                        >Create Role</Button>
                    </Can>
                </Box>
                <Box>

                    {roles.map((item) => (
                        <Box key={item.id} sx={{ ...borderBottom, p: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CircleAvatar sx={{ minWidth: '42px', minHeight: '42px', fontSize: '16px', mr: '12px', background: `${item.color}` }}
                                    src={null}
                                    alt={item.name.charAt(0).toUpperCase()}
                                />
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ fontSize: '16px', fontWeight: '800', color: '#172B4D' }}>{item.name}</Box>
                                    <Box sx={{ fontSize: '14px', fontWeight: '400', color: '#44546f', display: 'flex' }}>
                                        <Box>@{item.createBy}</Box>
                                        <Box sx={{ fontSize: '20px', display: 'flex', alignItems: 'center', lineHeight: '14px' }}>
                                            &nbsp;•&nbsp;
                                        </Box>
                                        <Box>Created on {item.createDate}</Box>
                                    </Box>
                                </Box>
                            </Box>
                            <Box>
                                <Button
                                    sx={{ ...buttonSx }}
                                    variant='contained'
                                    onClick={(event) => {
                                        handleClick(event)
                                        setCurrentSelectedRole(item)}
                                    }
                                >
                                    View permissions({item.actionCode.length})
                                </Button>
                                <Button
                                    sx = {{ ...buttonSx, mr: item.id.includes('default-role') ? 0 : '14px' }}
                                    variant='contained'
                                    startIcon={<PeopleAltOutlinedIcon />}
                                >
                                    Member ({item.member?.length || 0})
                                </Button>
                                { !item.id.includes('default-role') &&
                                    <Can I='edit' a='role'>
                                        <Button
                                            sx={{ ...buttonSx, mr: 0 }}
                                            variant='contained'
                                            startIcon={<CloseOutlinedIcon />}
                                        >Delete&nbsp;...</Button>
                                    </Can>
                                }
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
            <CreateRoleDialog open={openCreateRole} setOpen={setOpenCreateRole} />
            <PermissionPopover
                id='role-permissions-popover'
                roleItem={currentSelectedRole}
                open={open} anchorEl={anchorEl} onClose={handleClose}
            />
        </>
    )
}

export default RoleSettingFC