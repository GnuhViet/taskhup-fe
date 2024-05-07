import React, { useRef } from 'react'

import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import FormLabel from '@mui/joy/FormLabel'
import Switch from '@mui/joy/Switch'

import FormHelperText from '@mui/joy/FormHelperText'
import { Actions, ActionsBoolean } from '~/core/services/auth-services.model'
import { Can } from '~/core/utils/access-control'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { Button } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { useUpdateRoleMutation } from '~/core/redux/api/role.api'
import { useDispatch, useSelector } from 'react-redux'
import { RoleUpdateReq } from '~/core/services/role-services.model'
import { toast } from 'react-toastify'
import { ApiResponse } from '~/core/services/api.model'
import { updateActions } from '~/core/redux/slices/workspaceSlice'
import { Role } from '~/core/model/role.model'
import { handleError } from '~/core/utils/api-utils'

export interface PermissionPopoverProps {
    id: string
    roleItem: Role
    open: boolean
    anchorEl: HTMLElement
    onClose?: () => void
}

export interface RoleSwitchProps {
    item: any
    label: string
    helperText: string
    subHelperText?: string
}

const borderBottom = {
    borderBottom: '1px solid #DCDFE4'
}

const permissionsSwitch = {
    ...borderBottom,
    display: 'flex',
    justifyContent: 'space-between',
    mb: '6px',
    pb: '8px'
}

// const switchSx = {
//     PointerEvent: 'none',
//     cursor: 'default'
// }

const primaryBoxButtonSx = {
    cursor: 'pointer',
    color: '#1976D2',
    '&:hover': {
        color: '#0055CC'
    }
}

const secondaryBoxButtonSx = {
    cursor: 'pointer',
    color: '#172B4D',
    '&:hover': {
        color: '#2d5395'
    }
}


const roleTitleSx = {
    maxWidth: '400px',
    mr: '8px'
}


const PermissionPopover: React.FC<PermissionPopoverProps> = ({ id, roleItem, open, anchorEl, onClose }) => {
    const isDefaultRole = roleItem?.id.includes('default-role')
    const actions = roleItem?.actionCode
    const dispatch = useDispatch()
    const checked = React.useMemo(() => ({
        EDIT_WORKSPACE: actions?.indexOf(Actions.EDIT_WORKSPACE) > -1,
        MANAGE_USER: actions?.indexOf(Actions.MANAGE_USER) > -1,
        EDIT_ROLE: actions?.indexOf(Actions.EDIT_ROLE) > -1,
        EDIT_BOARD: actions?.indexOf(Actions.EDIT_BOARD) > -1,
        DELETE_BOARD: actions?.indexOf(Actions.DELETE_BOARD) > -1,
        EDIT_CARD_TEMPLATE: actions?.indexOf(Actions.EDIT_CARD_TEMPLATE) > -1,
        EDIT_CARD: actions?.indexOf(Actions.EDIT_CARD) > -1
    }), [actions]) as ActionsBoolean
    const [roleCounter, setRoleCounter] = React.useState(() => {
        const initialCount = Object.values(checked).filter((value) => value).length;
        return initialCount
    })
    // const countChecked = Object.values(checked).filter((value) => value).length
    const [editMode, setEditMode] = React.useState(false)

    const form = useForm<ActionsBoolean>({
        defaultValues: { ...checked }
    })

    const formRef = useRef(null)
    const { handleSubmit, formState: { errors }, control } = form

    const [updateRole, { isLoading }] = useUpdateRoleMutation()
    // const role = useSelector((state: any) => state.workspaceReducer.roles.find((role: Role) => role.id === roleId))

    const onSubmit: SubmitHandler<ActionsBoolean> = async (data: ActionsBoolean) => {
        console.log('clicked on submit')
        console.log(data)

        const req = {} as RoleUpdateReq
        req.id = roleItem.id
        req.name = ''
        req.actionCode = Object.keys(data).filter((key: keyof typeof data) => data[key])

        // bottom right toast
        await toast.promise(
            updateRole(req),
            {
                pending: 'Updating Role... 🕒',
                success: 'Role updated 👌'
            },
            {
                position: 'bottom-right',
                autoClose: 2000
            }
        ).catch((err) => { // internal error, ect...
            handleError( //todo fix error
                err?.originalStatus,
                [
                    { code: 'ROLE_NAME_EXIST', message: 'Role name already exists' },
                    { code: 'ROLE_NAME_REQUIRED', message: 'Role name is required' },
                    { code: 'ROLE_NOT_FOUND', message: 'Role not found' },
                    { code: 'ROLE_NOT_FOUND', message: 'Role not found' }
                ],
                toast
            )
        }).then((body: any) => {
            const resp = body.data as ApiResponse<RoleUpdateReq>
            if (resp.code === 'OK') {
                dispatch(updateActions(resp.data))
            }
            else {
                handleError( //todo fix error
                    resp.code,
                    [
                        { code: 'ROLE_NAME_EXIST', message: 'Role name already exists' },
                        { code: 'ROLE_NAME_REQUIRED', message: 'Role name is required' },
                        { code: 'ROLE_NOT_FOUND', message: 'Role not found' },
                        { code: 'ROLE_NOT_FOUND', message: 'Role not found' }
                    ],
                    toast
                )
            }
        })
    }

    React.useEffect(() => {
        if (open) {
            setEditMode(false)
            setRoleCounter(Object.values(checked).filter((value) => value).length)
            form.reset({ ...checked })
        }
    }, [checked, open, form])

    const RoleSwitch: React.FC<RoleSwitchProps> = ({ item, label, helperText, subHelperText }) => {
        return (
            <Box sx={permissionsSwitch}>
                <Box sx={roleTitleSx}>
                    <FormLabel sx={{ mb: 0, textDecoration: !item.field.value ? 'line-through' : 'none' }}>{label}</FormLabel>
                    <FormHelperText sx={{ mt: 0 }}>{helperText} {subHelperText && <><br /> {subHelperText}</>}</FormHelperText>
                </Box>
                <Switch
                    disabled={!editMode}
                    checked={item.field.value}
                    onChange={(e) => {
                        setRoleCounter(e.target.checked ? roleCounter + 1 : roleCounter - 1)
                        item.field.onChange(e.target.checked)
                    }}
                />
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
                <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                    <FormLabel sx={{ ...borderBottom, fontSize: '16px', width: '100%', mb: '14px', pb: '6px', display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex' }}>
                            Permissions&nbsp;&nbsp;
                            <Box sx={{ backgroundColor: '#c5cdd88c', borderRadius: '80px', p: '0 12px', lineHeight: '22px' }}>{roleCounter}/7</Box>
                        </Box>
                        {!isDefaultRole &&
                            <Can I="edit" a="role">
                                {!editMode
                                    ? (
                                        <Box onClick={() => setEditMode(true)} sx={primaryBoxButtonSx}>
                                            Edit
                                        </Box>
                                    )
                                    : (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Box sx={secondaryBoxButtonSx} onClick={() => { setEditMode(false) }}>
                                                Cancel
                                            </Box>
                                            <Box
                                                sx={{ ...primaryBoxButtonSx, ml: '16px' }}
                                                onClick={() => {
                                                    formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
                                                    setEditMode(false)
                                                }}
                                            >
                                                Save
                                            </Box>
                                        </Box>
                                    )
                                }
                            </Can>
                        }
                    </FormLabel>
                    <Box>
                        <Controller
                            name="EDIT_WORKSPACE"
                            control={control}
                            render={(field) => (
                                <RoleSwitch
                                    item={field}
                                    label='Edit Workspace'
                                    helperText='Allow members to edit workspace (title, name, ...).'
                                />
                            )}
                        />
                        <Controller
                            name='MANAGE_USER'
                            control={control}
                            render={(field) => (
                                <RoleSwitch
                                    item={field}
                                    label='Manage User'
                                    helperText='Allow members to manage workspace user'
                                    subHelperText='(create invite link, accept join request, remove member).'
                                />
                            )}
                        />
                        <Controller
                            name='EDIT_ROLE'
                            control={control}
                            render={(field) => (
                                <RoleSwitch
                                    item={field}
                                    label='Edit Role'
                                    helperText='Allow members to edit Role (create, edit permissions).'
                                />
                            )}
                        />
                        <Controller
                            name='EDIT_BOARD'
                            control={control}
                            render={(field) => (
                                <RoleSwitch
                                    item={field}
                                    label='Edit Board'
                                    helperText='Allow members to create new board (create, edit).'
                                />
                            )}
                        />
                        <Controller
                            name='DELETE_BOARD'
                            control={control}
                            render={(field) => (
                                <RoleSwitch
                                    item={field}
                                    label='Delete Board'
                                    helperText='Allow members to delete board.'
                                />
                            )}
                        />
                        <Controller
                            name='EDIT_CARD_TEMPLATE'
                            control={control}
                            render={(field) => (
                                <RoleSwitch
                                    item={field}
                                    label='Edit Card Template'
                                    helperText='Allow members to create/update/delete card template.'
                                />
                            )}
                        />
                        <Controller
                            name='EDIT_CARD'
                            control={control}
                            render={(field) => (
                                <RoleSwitch
                                    item={field}
                                    label='Edit Card'
                                    helperText='Allow members to create/update/delete card.'
                                />
                            )}
                        />
                    </Box>
                </form>
            </Box>
        </Popover >
    )
}

export default PermissionPopover