import React, { useRef } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import TextField from '@mui/material/TextField'
import CircleAvatar from '~/components/Common/CircleAvatar'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import CreateRoleDialog from '../Dialogs/CreateRoleDialog'

import { Can } from '~/core/utils/access-control'
import { useGetWorkspaceRolesQuery, useUpdateRoleMutation } from '~/core/redux/api/role.api'
import { useDispatch, useSelector } from 'react-redux'
import { Role } from '~/core/model/role.model'
import PermissionPopover from './pop-overs/PermissionPopover'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { handleError } from '~/core/utils/api-utils'
import { updateActions, updateName } from '~/core/redux/slices/workspaceSlice'
import { RoleUpdateReq } from '~/core/services/role-services.model'
import { ApiResponse } from '~/core/services/api.model'
import Tooltip from '@mui/material/Tooltip'
import MemberPopover from './pop-overs/MemberPopover'
import { useGetWorkspaceMemberQuery } from '~/core/redux/api/workspace.api'

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

export class FormData {
    name: string
}

const RoleSettingFC = () => {
    const dispatch = useDispatch()
    const [updateRole] = useUpdateRoleMutation()

    const [anchorElPermission, setAnchorElPermission] = React.useState(null)
    const [anchorElMember, setAnchorElMember] = React.useState(null)
    const [openCreateRole, setOpenCreateRole] = React.useState(false)
    const [editNameId, setEditNameId] = React.useState('')

    const { error, isLoading } = useGetWorkspaceRolesQuery({})
    const {error1} = useGetWorkspaceMemberQuery({})

    const roles = useSelector((state: any) => state.workspaceReducer.roles) as Role[]

    const openPermission = Boolean(anchorElPermission)
    const openMember = Boolean(anchorElMember)

    const handleClose = () => {
        setAnchorElPermission(null)
        setAnchorElMember(null)
    }

    const [currentSelectedRole, setCurrentSelectedRole] = React.useState(null)

    const form = useForm<FormData>()

    const { handleSubmit, register } = form

    const formRef = useRef(null)

    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        const req = {} as RoleUpdateReq
        req.id = editNameId
        req.name = data.name

        setEditNameId(null)

        try {
            const resp = await updateRole(req).unwrap() as ApiResponse<RoleUpdateReq>
            dispatch(updateName(resp.data))
            toast.success('Role name updated', {
                position: 'bottom-right'
            })
        } catch (err) {
            handleError( //todo fix error
                err.data.code,
                [
                    { code: 'RoleService.UpdateActions.defaultRole', message: 'default-role' },
                    { code: 'ROLE_NAME_REQUIRED', message: 'Role name is required' },
                    { code: 'ROLE_NOT_FOUND', message: 'Role not found' },
                    { code: 'ROLE_NOT_FOUND', message: 'Role not found' }
                ],
                toast
            )
        }


    }

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
                                    <Can not I='edit' a='role'>
                                        <Box sx={{ fontSize: '16px', fontWeight: '800', color: '#172B4D' }}>{item.name}</Box>
                                    </Can>
                                    <Can I='edit' a='role'>
                                        {editNameId === item.id
                                            ?
                                            <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                                                <TextField
                                                    id="standard-basic"
                                                    variant="standard"
                                                    autoFocus
                                                    onKeyDown={(event) => {
                                                        if (event.key === 'Enter') {
                                                            event.preventDefault()
                                                            formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
                                                        }
                                                    }}
                                                    {...register('name', {
                                                        required: 'Field is required',
                                                        onBlur: () => formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
                                                    })}
                                                />
                                            </form>
                                            :
                                            <>
                                                {item.id.includes('default-role')
                                                    ?
                                                    <Box
                                                        sx={{
                                                            fontSize: '16px',
                                                            fontWeight: '800',
                                                            color: '#172B4D',
                                                        }}
                                                    >
                                                        {item.name}
                                                    </Box>
                                                    :
                                                    <Tooltip title='Click to edit name.'>
                                                        <Box
                                                            sx={{
                                                                fontSize: '16px',
                                                                fontWeight: '800',
                                                                color: '#172B4D',
                                                                cursor: item.id.includes('default-role') ? 'default' : 'pointer'
                                                            }}
                                                            onClick={() => {
                                                                if (item.id.includes('default-role')) return
                                                                setEditNameId(item.id)
                                                                form.setValue('name', item.name)
                                                            }}
                                                        >
                                                            {item.name}
                                                        </Box>
                                                    </Tooltip>
                                                }
                                            </>
                                        }
                                    </Can>
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
                                        setAnchorElPermission(event.currentTarget)
                                        setCurrentSelectedRole(item)
                                    }}
                                >
                                    View permissions({item.actionCode.length})
                                </Button>
                                <Button
                                    sx={{ ...buttonSx, mr: item.id.includes('default-role') ? 0 : '14px' }}
                                    variant='contained'
                                    startIcon={<PeopleAltOutlinedIcon />}
                                    onClick={(event) => {
                                        setAnchorElMember(event.currentTarget)
                                        setCurrentSelectedRole(item)
                                    }}
                                >
                                    Member ({item.member?.length || 0})
                                </Button>
                                {!item.id.includes('default-role') &&
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
                open={openPermission} anchorEl={anchorElPermission} onClose={handleClose}
            />
            <MemberPopover
                id='role-member-popover'
                roleItem={currentSelectedRole}
                open={openMember} anchorEl={anchorElMember} onClose={handleClose}
            />
        </>
    )
}

export default RoleSettingFC