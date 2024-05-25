import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import ViewComfyOutlinedIcon from '@mui/icons-material/ViewComfyOutlined'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import ButtonBase from '@mui/material/ButtonBase'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined'
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined'
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined'

import React from 'react'
import SquareAvatar from '~/components/Common/SquareAvatar'
import LabelPopoverFC from './popovers/LabelPopoverFC'
import TextField from '@mui/material/TextField'
import { useParams } from 'react-router-dom'
import { useCreateBoardTemplateMutation, useDeleteBoardTemplateMutation, useGetBoardTemplateQuery } from '~/core/redux/api/board-template.api'
import { ApiResponse } from '~/core/services/api.model'
import ApiLoadingOverlay from '~/components/Common/ApiLoadingOverlay'
import { BoardTemplateCreateRequest } from '~/core/services/board-template-services.model'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

interface CardDialogProps {
    open: boolean
    handleClose: () => void
}

interface TemplateItemProps {
    item: any
}

const customScrollbarSx = {
    '&::-webkit-scrollbar': {
        width: '6px',
        height: '6px'
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#dcdde1',
        borderRadius: '8px'
    },
    '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#A8A8A8'
    }
}


const TemplateDialogFC: React.FC<CardDialogProps> = ({ open, handleClose }) => {
    const boardId = useParams().boardId
    const { data: apiResponse, isLoading, refetch } = useGetBoardTemplateQuery(boardId)
    const [createNew, { isLoading: isLoadingCreate }] = useCreateBoardTemplateMutation()
    const [deleteTemplate, { isLoading: isLoadingDelete }] = useDeleteBoardTemplateMutation()
    const response = apiResponse as ApiResponse<any>
    const template = response?.data

    const [showAddForm, setShowAddForm] = React.useState(false)

    const handleDelete = async (id: string) => {
        try {
            await deleteTemplate(id).unwrap() as ApiResponse<any>
            toast.success('Template deleted successfully', {
                position: 'bottom-right'
            })
            refetch()
        } catch (error) { // SWITCH CASE ???
            toast.error('INTERNAL SERVER ERROR!')
        }
    }

    const TemplateItem: React.FC<TemplateItemProps> = ({ item }) => {
        const [anchorElMember, setAnchorElMember] = React.useState(null)
        const openMember = Boolean(anchorElMember)
        const handleClose = () => {
            setAnchorElMember(null)
        }

        return (
            <Paper
                sx={{
                    p: 2,
                    margin: '0 0 10px 0',
                    flexGrow: 1,
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
                }}
            >
                <Grid container spacing={2}>
                    <Grid item>
                        <ButtonBase sx={{ width: 64, height: 64 }}>
                            <SquareAvatar alt={item.title.charAt(0).toUpperCase()} src={item.avatar} sx={{
                                width: '100% !important',
                                height: '100%',
                                fontSize: '58px'
                            }} />
                        </ButtonBase>
                    </Grid>
                    <Grid item xs={12} sm container>
                        <Grid item xs container direction="column" spacing={2}>
                            <Grid item xs>
                                <Typography gutterBottom variant="subtitle1" component={'span'}>
                                    {item.title}
                                </Typography>
                                <Typography variant="body2" gutterBottom component={'div'}>
                                    <Box sx={{ display: 'flex' }}>
                                        <Box>
                                            <Button
                                                id={`label-${item.id}`}
                                                sx={{ mr: '8px' }}
                                                className="button right-button"
                                                variant="contained"
                                                startIcon={<BookmarksOutlinedIcon />}
                                                onClick={(event) => {
                                                    setAnchorElMember(event.currentTarget)
                                                }}
                                            >Labels</Button>
                                            <Button
                                                className="button right-button"
                                                variant="contained"
                                                startIcon={<DriveFileRenameOutlineOutlinedIcon />}
                                            >Custom Fields</Button>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ alignContent: 'end' }}>
                                            {'\u00A0'}{'\u00A0'}{'\u00A0'} Used in {item.usedIn} cards
                                        </Typography>
                                    </Box>
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <ButtonBase
                                sx={{ borderRadius: '6px' }}
                                disabled={item.usedIn !== 0}
                                onClick={() => handleDelete(item.id)}
                            >
                                <Typography
                                    variant="subtitle1"
                                    component={'span'}
                                    sx={{
                                        padding: '0 12px 0 12px',
                                        textDecoration: item.usedIn === 0 ? 'none' : 'line-through'
                                    }}>
                                    Delete
                                </Typography>
                            </ButtonBase>
                        </Grid>
                    </Grid>
                </Grid>
                <LabelPopoverFC
                    id='label-popover'
                    templateItem={item}
                    open={openMember}
                    anchorEl={anchorElMember}
                    onClose={handleClose}
                />
            </Paper>
        )
    }

    const { register, handleSubmit, formState: { errors }, reset } = useForm<BoardTemplateCreateRequest>({
        defaultValues: {
            title: '',
            boardId: boardId
        }
    })

    const onSubmit: SubmitHandler<BoardTemplateCreateRequest> = async (data) => {
        try {
            const resp = await createNew(data).unwrap() as ApiResponse<any>
            toast.success('Template created successfully', {
                position: 'bottom-right'
            })
            refetch()
        } catch (error) { // SWITCH CASE ??
            toast.error('INTERAL SERVER ERROR!')
        }
    }

    if (isLoading) {
        <Dialog
            // fullWidth={true}
            maxWidth='md'
            style={{ zIndex: 99 }}
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: { borderRadius: '15px', backgroundColor: '#F0F1F4' }
            }}
        >
            <Box sx={{ height: '200px' }}>
                <ApiLoadingOverlay />
            </Box>
        </Dialog>
    }

    return (
        <Dialog
            // fullWidth={true}
            maxWidth='md'
            style={{ zIndex: 99 }}
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: { borderRadius: '15px', backgroundColor: '#F0F1F4' }
            }}
        >
            <Box className="closeIcon">
                <CloseIcon sx={{ pr: '2px' }} onClick={handleClose} />
            </Box>

            <DialogTitle sx={{ mb: '14px' }} className="dialogTitle">
                <ViewComfyOutlinedIcon className="left-icon subtitlesIcon" />
                <Box>
                    <Box className="textarea-title">
                        Card Template
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ display: 'flex' }}>
                    <Button
                        sx={{ mb: '8px' }}
                        className="button right-button"
                        variant="contained"
                        startIcon={showAddForm ? <CloseOutlinedIcon /> : <PlaylistAddOutlinedIcon />}
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        {showAddForm ? 'Cancel' : 'Add'}
                    </Button>
                    {showAddForm && (
                        <Typography variant="body2" color="text.secondary" sx={{ alignContent: 'center' }}>
                            {'\u00A0'}{'\u00A0'}{'\u00A0'} When the template is being used, you can only edit the avatar and title.
                        </Typography>
                    )}

                </Box>
                <Box sx={{
                    mb: '12px',
                    display: showAddForm ? 'block' : 'none'
                }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={{ fontSize: '12px', fontWeight: '500', color: '#44546f' }}>
                            Title
                            <Typography variant="caption" color="error">
                                &nbsp;&nbsp;&nbsp;{errors?.title?.message}
                            </Typography>
                        </Box>
                        <TextField
                            placeholder=''
                            size='small'
                            sx={{ width: '400px' }}
                            {...register('title', {
                                required: 'Field is required'
                            })}
                        />
                        <Button
                            type='submit'
                            sx={{ ml: '8px', mt: '2px' }}
                            className="button right-button"
                            variant="contained"
                            startIcon={<SaveAsOutlinedIcon />}
                        >Save</Button>
                    </form>
                </Box>
                {isLoadingCreate || isLoadingDelete
                    ? (
                        <Box>
                            <Box sx={{
                                position: 'relative',
                                overflowY: 'scroll',
                                maxHeight: '600px',
                                ...customScrollbarSx
                            }}>
                                <Box sx={{
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        background: 'rgba(0, 0, 0, 0.3)',
                                        zIndex: 1,
                                        borderRadius: '4px'
                                    }
                                }}>
                                    <Box sx={{
                                        position: 'absolute',
                                        ml: 'auto',
                                        mr: 'auto',
                                        top: '40%',
                                        left: '0',
                                        right: '0',
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}>
                                        <ApiLoadingOverlay sx={{ height: '100% !important' }} />
                                    </Box>
                                    {
                                        template?.map((item: any) => (
                                            <TemplateItem key={item.id} item={item} />
                                        ))
                                    }
                                </Box>
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{
                            overflowY: 'scroll',
                            maxHeight: '600px',
                            ...customScrollbarSx
                        }}>
                            {
                                template?.map((item: any) => (
                                    <TemplateItem key={item.id} item={item} />
                                ))
                            }
                        </Box>
                    )}
            </DialogContent>
        </Dialog>
    )
}

export default TemplateDialogFC