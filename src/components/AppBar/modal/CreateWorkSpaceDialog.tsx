import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'

import { ReactComponent as PathIcon } from '~/assets/Path.svg'
import { ReactComponent as BoardIcon } from '~/assets/Board.svg'


import React, { useEffect } from 'react'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import FormHelperText from '@mui/joy/FormHelperText'
import Textarea from '@mui/joy/Textarea'

import './CreateWorkSpaceDialog.scss'
import TextField from '@mui/material/TextField'
import Select, { selectClasses } from '@mui/joy/Select'
import Option from '@mui/joy/Option'
import CircularProgress from '@mui/material/CircularProgress'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import { useForm, SubmitHandler } from 'react-hook-form'
import { WorkSpaceCreateReq } from '~/core/services/workspace-services.model'
import { useCreateWorkspaceMutation } from '~/core/redux/api/workspace.api'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { addCreatedWorkSpace } from '~/core/redux/slices/homeSlice'

interface CreateWorkSpaceDialogProps {
    open: boolean
    handleClose: () => void
}

const CreateWorkSpaceDialog: React.FC<CreateWorkSpaceDialogProps> = ({ open, handleClose }) => {
    const dispatch = useDispatch()

    const form = useForm<WorkSpaceCreateReq>({
        defaultValues: {
            title: '',
            type: '',
            description: ''
        }
    })
    const { register, handleSubmit, formState } = form
    const { errors } = formState

    const [create, { isLoading }] = useCreateWorkspaceMutation()

    const onSubmit: SubmitHandler<WorkSpaceCreateReq> = async (data) => {
        try {
            const workspaceReq = {} as WorkSpaceCreateReq
            workspaceReq.title = data.title
            workspaceReq.type = data.type
            workspaceReq.description = data.description

            const res = await create(workspaceReq).unwrap()
            if (res.httpStatus === 'CREATED') {
                dispatch(addCreatedWorkSpace(res.data))
                handleClose()
            }
        } catch (error) {
            toast.error('INTERAL SERVER ERROR!')
        }
    }

    useEffect(() => {
        if (!open) {
            form.reset()
        }
    }, [open, form])


    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <React.Fragment>
            <Dialog
                fullWidth={true}
                maxWidth='lg'
                style={{ zIndex: 100 }}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        borderRadius: '15px',
                        backgroundColor: '#FFFFFF'
                        // minWidth: '1200px'
                    }
                }}
                scroll='body'
            >
                <Box className="closeIcon">
                    <CloseIcon sx={{ pr: '2px' }} onClick={handleClose} />
                </Box>

                <Box sx={{ display: 'flex' }}>
                    <DialogContent className='dialog-content' sx={{ width: '40%', display: 'flex', margin: '24px 64px 24px 64px' }}>
                        <Box className='left-content' sx={{ width: '100%' }}>
                            <Box>
                                <Box sx={{ fontSize: '24px', fontWeight: '500', color: 'rgb(23, 43, 77)', mb: '12px' }}>Let's build a Workspace</Box>
                                <Box sx={{ fontSize: '18px', fontWeight: '300', color: '#44546f' }}>Boost your productivity by making it easier for everyone to access boards in one location.</Box>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <FormControl sx={{ mt: '24px' }}>
                                        <FormLabel>Workspace name</FormLabel>
                                        <TextField
                                            autoFocus
                                            placeholder="Taco's Co."
                                            size='small'
                                            {...register('title', { required: 'Field is required' })}
                                            error={!!errors.title}
                                        />
                                        <FormHelperText sx={{ fontSize: '10px' }}>This is the name of your company, team or organization.</FormHelperText>
                                    </FormControl>

                                    <FormControl sx={{ mt: '24px' }}>
                                        <FormLabel>Workspace type</FormLabel>
                                        <Select
                                            placeholder="Choose…"
                                            indicator={<KeyboardArrowDown />}
                                            sx={{
                                                [`& .${selectClasses.indicator}`]: {
                                                    transition: '0.2s',
                                                    [`&.${selectClasses.expanded}`]: {
                                                        transform: 'rotate(-180deg)'
                                                    }
                                                },
                                                zIndex: 9999 // Add this line
                                            }}
                                            {...register('type', { required: 'Field is required' })}
                                        >
                                            <Option value="Operations">Operations</Option>
                                            <Option value="Engineering-IT">Engineering-IT</Option>
                                            <Option value="Human Resources">Human Resources</Option>
                                            <Option value="Marketing">Marketing</Option>
                                            <Option value="Education">Education</Option>
                                            <Option value="Sales CRM">Sales CRM</Option>
                                            <Option value="Other">Other</Option>
                                        </Select>
                                    </FormControl>

                                    <FormControl sx={{ mt: '24px' }}>
                                        <Box sx={{ display: 'flex' }}>
                                            <FormLabel>Workspace description</FormLabel>
                                            <FormHelperText sx={{ pb: '6px', pl: '6px' }}>Optional</FormHelperText>
                                        </Box>
                                        <Textarea
                                            placeholder="Our team organizes everything here."
                                            minRows={5}
                                            {...register('description', { required: 'Field is required' })}
                                        />
                                        <FormHelperText sx={{ pb: '6px', fontSize: '12px' }}>Get your members on board with a few words about your Workspace.</FormHelperText>
                                    </FormControl>

                                    <DialogActions sx={{ width: '100%', p: 0, mt: '12px' }}>
                                        <Button type="submit" variant="contained" fullWidth disabled={!formState.isValid}>Submit</Button>
                                    </DialogActions>
                                </form>
                            </Box>
                        </Box>
                    </DialogContent>

                    <Box sx={{ p: 0, width: '60%', maxHeight: '647px', overflow: 'hidden' }}>
                        <Box className='right-content' sx={{ position: 'relative' }}>
                            <PathIcon style={{ position: 'relative', height: '100%', width: '100%', boxSizing: 'border-box', minHeight: '647px' }} />
                            <BoardIcon style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                        </Box>
                    </Box>
                </Box>


            </Dialog>
        </React.Fragment >
    )
}

export default CreateWorkSpaceDialog