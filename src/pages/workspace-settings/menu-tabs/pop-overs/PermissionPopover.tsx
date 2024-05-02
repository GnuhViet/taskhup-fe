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

export interface CreateBoardPopoverProps {
    id: string
    roleId: string
    open: boolean
    anchorEl: HTMLElement
    actions: string[]
    onClose?: () => void
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

const switchSx = {
    PointerEvent: 'none',
    cursor: 'default'
}

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


const PermissionPopover: React.FC<CreateBoardPopoverProps> = ({ id, roleId, actions, open, anchorEl, onClose }) => {
    const isDefaultRole = roleId?.includes('default-role')
    const checked = {
        EDIT_WORKSPACE: actions?.indexOf(Actions.EDIT_WORKSPACE) > -1,
        MANAGE_USER: actions?.indexOf(Actions.MANAGE_USER) > -1,
        EDIT_ROLE: actions?.indexOf(Actions.EDIT_ROLE) > -1,
        EDIT_BOARD: actions?.indexOf(Actions.EDIT_BOARD) > -1,
        DELETE_BOARD: actions?.indexOf(Actions.DELETE_BOARD) > -1,
        EDIT_CARD_TEMPLATE: actions?.indexOf(Actions.EDIT_CARD_TEMPLATE) > -1,
        EDIT_CARD: actions?.indexOf(Actions.EDIT_CARD) > -1
    } as ActionsBoolean
    const countChecked = Object.values(checked).filter((value) => value).length
    const [editMode, setEditMode] = React.useState(false)

    React.useEffect(() => {
        if (open) {
            setEditMode(false)
        }
    }, [open])

    const form = useForm<ActionsBoolean>({
        defaultValues: {
            EDIT_WORKSPACE: actions?.indexOf(Actions.EDIT_WORKSPACE) > -1,
            MANAGE_USER: actions?.indexOf(Actions.MANAGE_USER) > -1,
            EDIT_ROLE: actions?.indexOf(Actions.EDIT_ROLE) > -1,
            EDIT_BOARD: actions?.indexOf(Actions.EDIT_BOARD) > -1,
            DELETE_BOARD: actions?.indexOf(Actions.DELETE_BOARD) > -1,
            EDIT_CARD_TEMPLATE: actions?.indexOf(Actions.EDIT_CARD_TEMPLATE) > -1,
            EDIT_CARD: actions?.indexOf(Actions.EDIT_CARD) > -1
        }
    })

    const formRef = useRef(null)
    const { register, handleSubmit, formState, control } = form
    const { errors } = formState

    const onSubmit: SubmitHandler<ActionsBoolean> = async (data: ActionsBoolean) => {
        console.log('clicked on submit')
        console.log(data)
    }

    const RoleSwitch: React.FC<{ name, label, helperText, defaultChecked: boolean}> = ({ name, label, helperText, defaultChecked }) => {
        return (
            <Controller
                name={name}
                control={control}
                render={(item) => (
                    <Box sx={permissionsSwitch}>
                        <Box sx={roleTitleSx}>
                            <FormLabel sx={{ mb: 0 }}>{label}</FormLabel>
                            <FormHelperText sx={{ mt: 0 }}>{helperText}</FormHelperText>
                        </Box>
                        <Switch
                            disabled={!editMode}
                            defaultChecked={defaultChecked}
                            onChange={(e) => item.field.onChange(e.target.checked)}
                            {...item}
                        />
                    </Box>
                )}
            />
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
                            <Box sx={{ backgroundColor: '#c5cdd88c', borderRadius: '80px', p: '0 12px', lineHeight: '22px' }}>{countChecked}/7</Box>
                        </Box>
                        {isDefaultRole &&
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
                                            >
                                                <input type="submit" value="Save" />
                                            </Box>
                                        </Box>
                                    )
                                }
                            </Can>
                        }
                    </FormLabel>
                    <Box>
                        <Button type='submit'>Submit</Button>
                        <RoleSwitch
                            name='EDIT_WORKSPACE'
                            label='Edit Workspace'
                            helperText='Allow members to edit workspace (title, name, ...).'
                            defaultChecked={checked.EDIT_WORKSPACE}
                        />
                        {/* <Controller
                            name='EDIT_WORKSPACE'
                            control={control}
                            render={(item) => (
                                <Box sx={permissionsSwitch}>
                                    <Box sx={roleTitleSx}>
                                        <FormLabel sx={{ mb: 0 }}>Edit Workspace</FormLabel>
                                        <FormHelperText sx={{ mt: 0 }}>Allow members to edit workspace (title, name, ...).</FormHelperText>
                                    </Box>
                                    <Switch
                                        disabled={!editMode}
                                        defaultChecked={checked.EDIT_WORKSPACE}
                                        onChange={(e) => item.field.onChange(e.target.checked)}
                                        {...item}
                                    />
                                </Box>
                            )}
                        /> */}

                        <Box sx={permissionsSwitch}>
                            <Box sx={roleTitleSx}>
                                <FormLabel sx={{ mb: 0 }}>Manage User</FormLabel>
                                <FormHelperText sx={{ mt: 0 }}>Allow members to manage workspace user<br />(create invite link, accept join request, remove member).</FormHelperText>
                            </Box>
                            <Switch
                                disabled={!editMode}
                                defaultChecked={checked.MANAGE_USER}
                                {...register('MANAGE_USER')}
                            />
                        </Box>
                        <Box sx={permissionsSwitch}>
                            <Box sx={roleTitleSx}>
                                <FormLabel sx={{ mb: 0 }}>Edit Role</FormLabel>
                                <FormHelperText sx={{ mt: 0 }}>Allow members to edit Role (create, edit permissions).</FormHelperText>
                            </Box>
                            <Switch
                                disabled={!editMode}
                                defaultChecked={checked.EDIT_ROLE}
                                {...register('EDIT_ROLE')}
                            />
                        </Box>
                        <Box sx={permissionsSwitch}>
                            <Box sx={roleTitleSx}>
                                <FormLabel sx={{ mb: 0 }}>Edit Board</FormLabel>
                                <FormHelperText sx={{ mt: 0 }}>Allow members to create new board.(create, edit)</FormHelperText>
                            </Box>
                            <Switch
                                disabled={!editMode}
                                defaultChecked={checked.EDIT_BOARD}
                                {...register('EDIT_BOARD')}
                            />
                        </Box>
                        <Box sx={permissionsSwitch}>
                            <Box sx={roleTitleSx}>
                                <FormLabel sx={{ mb: 0 }}>Delete Board</FormLabel>
                                <FormHelperText sx={{ mt: 0 }}>Allow members to delete board.</FormHelperText>
                            </Box>
                            <Switch
                                disabled={!editMode}
                                defaultChecked={checked.DELETE_BOARD}
                                {...register('DELETE_BOARD')}
                            />
                        </Box>
                        <Box sx={permissionsSwitch}>
                            <Box sx={roleTitleSx}>
                                <FormLabel sx={{ mb: 0 }}>Edit Card Template</FormLabel>
                                <FormHelperText sx={{ mt: 0 }}>Allow members to create/update/delete card template.</FormHelperText>
                            </Box>
                            <Switch
                                disabled={!editMode}
                                defaultChecked={checked.EDIT_CARD_TEMPLATE}
                                {...register('EDIT_CARD_TEMPLATE')}
                            />
                        </Box>
                        <Box sx={permissionsSwitch}>
                            <Box sx={roleTitleSx}>
                                <FormLabel sx={{ mb: 0 }}>Edit Card</FormLabel>
                                <FormHelperText sx={{ mt: 0 }}>Allow members to create/update/delete card.</FormHelperText>
                            </Box>
                            <Switch
                                disabled={!editMode}
                                defaultChecked={checked.EDIT_CARD}
                                {...register('EDIT_CARD')}
                            />
                        </Box>
                    </Box>

                </form>
            </Box>
        </Popover >
    )
}

export default PermissionPopover