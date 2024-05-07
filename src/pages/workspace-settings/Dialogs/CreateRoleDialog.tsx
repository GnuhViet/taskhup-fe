
import React, { useRef } from 'react'

import { useParams } from 'react-router-dom'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import CloseIcon from '@mui/icons-material/Close'
import DialogActions from '@mui/material/DialogActions'
import Input from '@mui/joy/Input'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Switch from '@mui/joy/Switch'
import FormHelperText from '@mui/joy/FormHelperText'
import CircularProgress from '@mui/material/CircularProgress'
import { RoleCreateReq, RoleGetResp } from '~/core/services/role-services.model'
import { useCreateRoleMutation } from '~/core/redux/api/role.api'
import { useDispatch } from 'react-redux'
import { ApiResponse } from '~/core/services/api.model'
import { addRole } from '~/core/redux/slices/workspaceSlice'

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

const borderTop = {
    borderTop: '1px solid #DCDFE4'
}

const permissionsSwitch = {
    ...borderBottom,
    display: 'flex',
    justifyContent: 'space-between',
    mb: '6px',
    pb: '8px'
}

const roleTitleSx = {
    maxWidth: '400px',
    mr: '8px'
}

export interface RoleSwitchProps {
    item: any
    label: string
    helperText: string
    subHelperText?: string
}

export interface CreateRoleDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
}

class RoleFormData {
    name: string
    color: string
    actions: {
        EDIT_WORKSPACE: boolean
        MANAGE_USER: boolean
        EDIT_ROLE: boolean
        EDIT_BOARD: boolean
        DELETE_BOARD: boolean
        EDIT_CARD_TEMPLATE: boolean
        EDIT_CARD: boolean
    }
}

const CreateRoleDialog: React.FC<CreateRoleDialogProps> = ({ open, setOpen }) => {
    const dispatch = useDispatch()
    const { workspaceId } = useParams()
    const formRef = useRef(null)
    const [roleCounter, setRoleCounter] = React.useState(0)
    const form = useForm<RoleFormData>({
        defaultValues: {
            name: '',
            color: '#FF0000',
            actions: {
                EDIT_WORKSPACE: false,
                MANAGE_USER: false,
                EDIT_ROLE: false,
                EDIT_BOARD: false,
                DELETE_BOARD: false,
                EDIT_CARD_TEMPLATE: false,
                EDIT_CARD: false
            }
        }
    })
    const { register, control, handleSubmit, formState } = form
    const { errors } = formState

    const [createRole, { isLoading }] = useCreateRoleMutation()

    const onSubmit: SubmitHandler<RoleFormData> = async (data) => {
        // arrray of 8 colors from light to dark
        const colors = ['#FF0000', '#FF4500', '#FFA500', '#FFD700', '#ADFF2F', '#32CD32', '#008000', '#006400']

        console.log('submited')
        try {
            data.color = colors[roleCounter]
            console.log(data)
            const req = {} as RoleCreateReq
            req.name = data.name
            req.color = data.color
            req.actionCode = Object.keys(data.actions).filter((key: keyof typeof data.actions) => data.actions[key])

            const resp = await createRole(req).unwrap() as ApiResponse<RoleGetResp>
            await dispatch(addRole(resp.data))

            setOpen(false)
            toast('Role Created')
            // navigate('/home')
        } catch (err) {
            if (!err?.originalStatus) {
                // isLoading: true until timeout occurs
                toast('No Server Response', {
                    position: 'bottom-right'
                })
            } else if (err.originalStatus === 400) {
                toast('Missing Username or Password')
            } else if (err.originalStatus === 401) {
                toast('Unauthorized')
            } else {
                toast('Login Failed')
            }
        }
    }


    const RoleSwitch: React.FC<RoleSwitchProps> = ({ item, label, helperText, subHelperText }) => {
        return (
            <Box sx={permissionsSwitch}>
                <Box sx={roleTitleSx}>
                    <FormLabel sx={{ mb: 0 }}>{label}</FormLabel>
                    <FormHelperText sx={{ mt: 0 }}>{helperText} {subHelperText && <><br /> {subHelperText}</>}</FormHelperText>
                </Box>
                <Switch
                    checked={item.field.value}
                    onChange={(e) => {
                        setRoleCounter(e.target.checked ? roleCounter + 1 : roleCounter - 1)
                        item.field.onChange(e.target.checked)
                    }}
                />
            </Box>
        )
    }

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Dialog
            fullWidth={true}
            maxWidth='sm'
            style={{ zIndex: 9999 }}
            open={open}
            onClose={() => setOpen(false)}
            PaperProps={{
                sx: { borderRadius: '15px', backgroundColor: '#F0F1F4' }
            }}
        >
            <Box className="closeIcon">
                <CloseIcon sx={{ pr: '2px' }} onClick={() => setOpen(false)} />
            </Box>

            <DialogTitle sx={{ mb: '10px', ...borderBottom }} >
                Create new Role
            </DialogTitle>

            <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                    <FormControl>
                        <FormLabel sx={{ fontSize: '16px' }}>Role name</FormLabel>
                        <Input
                            autoFocus
                            fullWidth
                            placeholder='Project Manager'
                            sx={{ background: 'transparent', border: '2px #D5D9DF solid', borderRadius: '0' }}
                            {...register('name', {
                                required: 'Field is required'
                            })}
                            error={!!errors.name}
                        />
                    </FormControl>
                    <Box sx={{ mt: '12px' }}>
                        <FormLabel sx={{ ...borderBottom, fontSize: '16px', width: '100%', mb: '14px', pb: '6px' }}>
                            Permissions&nbsp;&nbsp;
                            <Box sx={{ backgroundColor: '#c5cdd88c', borderRadius: '80px', p: '0 12px', lineHeight: '22px' }}>{roleCounter}/7</Box>
                        </FormLabel>
                        <Box>
                            <Controller
                                name="actions.EDIT_WORKSPACE"
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
                                name='actions.MANAGE_USER'
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
                                name='actions.EDIT_ROLE'
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
                                name='actions.EDIT_BOARD'
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
                                name='actions.DELETE_BOARD'
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
                                name='actions.EDIT_CARD_TEMPLATE'
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
                                name='actions.EDIT_CARD'
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
                    </Box>
                </form>
                <Box sx={{ backgroundColor: '#FFF7D6', mt: '16px', pt: '16px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#172b4d', paddingLeft: '22px' }}>1 new role license</span>
                    <ul style={{ margin: '10px 0 16px 0', fontSize: '12px', fontWeight: '300', color: '#626f86' }}>
                        <li>You will be charged $0.00 now</li>
                        <li>Your monthly bill will increase by $12.50 on May 20, 2024</li>
                    </ul>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: '6px 24px 18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...borderTop }}>
                <Box sx={{ fontSize: '14px', fontWeight: '300', color: '#172b4d' }}>Create new role to group your members and assign permissions.</Box>
                <Button
                    sx={{
                        ...buttonSx,
                        mr: 0,
                        backgroundColor: '#DCDFE4',
                        '&:hover': {
                            backgroundColor: '#bac0ca'
                        }
                    }} variant='contained'
                    onClick={() => {
                        formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
                    }}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CreateRoleDialog