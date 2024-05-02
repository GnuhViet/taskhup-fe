
import React from 'react'

import { useParams } from 'react-router-dom'
import { SubmitHandler, useForm } from 'react-hook-form'
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

export interface CreateRoleDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
}

const CreateRoleDialog: React.FC<CreateRoleDialogProps> = ({ open, setOpen }) => {
    const { workspaceId } = useParams()

    const form = useForm({
        defaultValues: {
            username: '',
            password: ''
        }
    })

    const { register, handleSubmit, formState } = form
    const { errors } = formState

    const onSubmit: SubmitHandler = async (data) => {
        try {
            console.log(data)
            navigate('/home')
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

    return (
        <Dialog
            fullWidth={true}
            maxWidth='sm'
            style={{ zIndex: 9999 }}
            open={open}
            onClose={() => setOpen(false)}
            PaperProps={{
                sx: { borderRadius: '15px', backgroundColor: '#F0F1F4' },
                onSubmit: (event: any) => {
                    event.preventDefault()
                    const formData = new FormData(event.currentTarget)
                    const formJson = Object.fromEntries((formData).entries())
                    const email = formJson.email
                    console.log(email)
                    // handleClose()
                }
            }}
        >
            <Box className="closeIcon">
                <CloseIcon sx={{ pr: '2px' }} onClick={() => setOpen(false)} />
            </Box>

            <DialogTitle sx={{ mb: '10px' }} >
                Create new Role
            </DialogTitle>

            <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <FormControl>
                    <FormLabel sx={{ fontSize: '16px' }}>Role name</FormLabel>
                    <Input
                        fullWidth
                        placeholder='Project Manager'
                        sx={{ background: 'transparent', border: '2px #D5D9DF solid', borderRadius: '0' }}
                    />
                </FormControl>
                <Box sx={{ mt: '12px' }}>
                    <FormLabel sx={{ ...borderBottom, fontSize: '16px', width: '100%', mb: '14px', pb: '6px' }}>
                        Permissions&nbsp;&nbsp;
                        <Box sx={{ backgroundColor: '#c5cdd88c', borderRadius: '80px', p: '0 12px', lineHeight: '22px' }}>0/7</Box>
                    </FormLabel>
                    <Box>
                        <Box sx={{ ...borderBottom, display: 'flex', justifyContent: 'space-between', mb: '6px', pb: '8px' }}>
                            <Box sx={{ maxWidth: '400px' }}>
                                <FormLabel sx={{ mb: 0 }}>Edit Workspace</FormLabel>
                                <FormHelperText sx={{ mt: 0 }}>Allow members to edit workspace (title, name, ...).</FormHelperText>
                            </Box>
                            <Switch />
                        </Box>
                        <Box sx={{ ...borderBottom, display: 'flex', justifyContent: 'space-between', mb: '6px', pb: '8px' }}>
                            <Box sx={{ maxWidth: '400px' }}>
                                <FormLabel sx={{ mb: 0 }}>Manage User</FormLabel>
                                <FormHelperText sx={{ mt: 0 }}>Allow members to manage workspace user<br />(create invite link, accept join request, remove member).</FormHelperText>
                            </Box>
                            <Switch />
                        </Box>
                        <Box sx={{ ...borderBottom, display: 'flex', justifyContent: 'space-between', mb: '6px', pb: '8px' }}>
                            <Box sx={{ maxWidth: '400px' }}>
                                <FormLabel sx={{ mb: 0 }}>Edit Role</FormLabel>
                                <FormHelperText sx={{ mt: 0 }}>Allow members to edit Role (create, edit permissions).</FormHelperText>
                            </Box>
                            <Switch />
                        </Box>
                        <Box sx={{ ...borderBottom, display: 'flex', justifyContent: 'space-between', mb: '6px', pb: '8px' }}>
                            <Box sx={{ maxWidth: '400px' }}>
                                <FormLabel sx={{ mb: 0 }}>Edit Board</FormLabel>
                                <FormHelperText sx={{ mt: 0 }}>Allow members to create new board.(create, edit)</FormHelperText>
                            </Box>
                            <Switch />
                        </Box>
                        <Box sx={{ ...borderBottom, display: 'flex', justifyContent: 'space-between', mb: '6px', pb: '8px' }}>
                            <Box sx={{ maxWidth: '400px' }}>
                                <FormLabel sx={{ mb: 0 }}>Delete Board</FormLabel>
                                <FormHelperText sx={{ mt: 0 }}>Allow members to delete board.</FormHelperText>
                            </Box>
                            <Switch />
                        </Box>
                        <Box sx={{ ...borderBottom, display: 'flex', justifyContent: 'space-between', mb: '6px', pb: '8px' }}>
                            <Box sx={{ maxWidth: '400px' }}>
                                <FormLabel sx={{ mb: 0 }}>Edit Card Template</FormLabel>
                                <FormHelperText sx={{ mt: 0 }}>Allow members to create/update/delete card template.</FormHelperText>
                            </Box>
                            <Switch />
                        </Box>
                        <Box sx={{ ...borderBottom, display: 'flex', justifyContent: 'space-between', mb: '6px', pb: '8px' }}>
                            <Box sx={{ maxWidth: '400px' }}>
                                <FormLabel sx={{ mb: 0 }}>Edit Card</FormLabel>
                                <FormHelperText sx={{ mt: 0 }}>Allow members to create/update/delete card.</FormHelperText>
                            </Box>
                            <Switch />
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ backgroundColor: '#FFF7D6', mt: '16px', pt: '16px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#172b4d', paddingLeft: '22px' }}>1 new role license</span>
                    <ul style={{ margin: '10px 0 16px 0', fontSize: '12px', fontWeight: '300', color: '#626f86' }}>
                        <li>You will be charged $0.00 now</li>
                        <li>Your monthly bill will increase by $12.50 on May 20, 2024</li>
                    </ul>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: '0 24px 18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ fontSize: '14px', fontWeight: '300', color: '#172b4d' }}>Create new role to group your members and assign permissions.</Box>
                <Button sx={{
                    ...buttonSx,
                    mr: 0,
                    backgroundColor: '#DCDFE4',
                    '&:hover': {
                        backgroundColor: '#bac0ca'
                    }
                }} variant='contained'>
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CreateRoleDialog