import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'
import Input from '@mui/joy/Input'
import CloseIcon from '@mui/icons-material/Close'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ViewStreamOutlinedIcon from '@mui/icons-material/ViewStreamOutlined'
import ShortTextOutlinedIcon from '@mui/icons-material/ShortTextOutlined'
import SubjectOutlinedIcon from '@mui/icons-material/SubjectOutlined'

import TinyMce from '~/components/Common/TinyMce'
import BackgroundColorSection from './BackgroundColorSection'
import Button from '@mui/material/Button'
import { useParams } from 'react-router-dom'
import { useLazyGetBoardInfomationQuery, useUpdateBoardInfomationMutation } from '~/core/redux/api/board.api'
import { SubmitHandler, useForm } from 'react-hook-form'
import { BoardInfoUpdateReq } from '~/core/services/board-services.model'
import { ApiResponse } from '~/core/services/api.model'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'
import { AbilityContext } from '~/core/utils/access-control'

interface DialogProps {
    open: boolean
    handleClose: () => void
}

const labelTextSx = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#44546f'
}

const titleTextSx = {
    color: '#172b4d',
    fontWeight: '500'
}

const inputSx = {
    borderRadius: '3px',
    border: '1px solid #dfe1e6',
    '&:focus': {
        backgroundColor: 'transparent !important'
    }
}


const BoardInfoDialog: React.FC<DialogProps> = ({ open, handleClose }) => {
    const ability = React.useContext(AbilityContext)
    const boardId = useParams().boardId
    const [boardInfo, setBoardInfo] = React.useState(null)
    const [loadBoadInfo, { isLoading: isLoadingInfo, isSuccess }] = useLazyGetBoardInfomationQuery()
    const [updateBoardInfo, { isLoading: isUpdating }] = useUpdateBoardInfomationMutation()

    const fetchBoardInfo = async () => {
        try {
            const res = await loadBoadInfo(boardId).unwrap() as ApiResponse<any>
            setBoardInfo(res?.data)
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    React.useEffect(() => {
        if (open) {
            fetchBoardInfo()
        } else {
            setBoardInfo(null)
            reset()
        }
        console.log('ability', ability)
    }, [open])

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<BoardInfoUpdateReq>({
        defaultValues: {
            id: null,
            title: null,
            shortDescription: null,
            description: null
        }
    })

    const onSubmit: SubmitHandler<BoardInfoUpdateReq> = async (data) => {
        try {
            await updateBoardInfo({
                id: data.id,
                title: data.title,
                shortDescription: data.shortDescription,
                description: data.description
            }).unwrap() as ApiResponse<any>
            toast.success('Update board info successfully', {
                position: 'bottom-right'
            })
            await fetchBoardInfo()
        } catch (error) {
            console.log(error)
        }
    }

    const [description, setDescription] = React.useState('')

    const handleEditorChange = (content: string) => {
        setDescription(content)
        setValue('description', content)
    }

    const updateForm = () => {
        setValue('id', boardInfo?.id)
        setValue('title', boardInfo?.title)
        setValue('shortDescription', boardInfo?.shortDescription)
        setValue('description', boardInfo?.description)

        setDescription(boardInfo?.description)
    }

    React.useEffect(() => {
        if (isSuccess) {
            updateForm()
        }
    }, [isSuccess, boardInfo])

    return (
        <Dialog
            fullWidth={true}
            maxWidth='sm'
            style={{ zIndex: 99 }}
            open={open}
            onClose={handleClose}
            scroll='body'
            PaperProps={{
                sx: { borderRadius: '15px', backgroundColor: '#F0F1F4' }
            }}
        >
            <Box className="closeIcon">
                <CloseIcon sx={{ pr: '2px' }} onClick={handleClose} />
            </Box>

            <DialogTitle sx={{ mb: '14px' }} className="dialogTitle">
                <Box sx={{ display: 'flex' }}>
                    <Box sx={{ mt: '3px' }}>
                        <DashboardIcon className="left-icon subtitlesIcon" />
                    </Box>
                    <Box>
                        <Box className="textarea-title">
                            Board Setting
                        </Box>
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ m: '0px 32px' }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{ mb: '18px' }}>
                        <Box sx={{ display: 'flex', mb: '12px' }}>
                            <ViewStreamOutlinedIcon sx={{ ...titleTextSx, fontSize: '28px', mr: '14px' }} />
                            <Box sx={{ ...titleTextSx, fontSize: '18px', lineHeight: '28px' }}>Board title</Box>
                        </Box>
                        <Box>
                            <Input
                                placeholder=''
                                sx={inputSx}
                                {...register('title', { required: 'This field is required' })}
                                error={!!errors.title}
                                disabled={ability.cannot('edit', 'board')}
                            />
                            {errors?.title &&
                                <Typography variant="caption" color="error">
                                    &nbsp;{errors?.title?.message}
                                </Typography>
                            }
                        </Box>
                    </Box>
                    <Box sx={{ mb: '18px' }}>
                        <Box sx={{ display: 'flex', mb: '12px' }}>
                            <ShortTextOutlinedIcon sx={{ ...titleTextSx, fontSize: '28px', mr: '14px' }} />
                            <Box sx={{ ...titleTextSx, fontSize: '18px', lineHeight: '28px' }}>Board short description</Box>
                        </Box>
                        <Box>
                            <Input
                                placeholder=''
                                sx={inputSx}
                                {...register('shortDescription',
                                    { maxLength: { value: 50, message: 'Max length is 50 characters' } }
                                )}
                                error={!!errors.shortDescription}
                                disabled={ability.cannot('edit', 'board')}
                            />
                            {errors?.shortDescription &&
                                <Typography variant="caption" color="error">
                                    &nbsp;{errors?.shortDescription?.message}
                                </Typography>
                            }
                        </Box>
                    </Box>
                    <BackgroundColorSection refetch={fetchBoardInfo} />
                    <Box sx={{ mb: '18px' }}>
                        <Box sx={{ display: 'flex', mb: '12px' }}>
                            <SubjectOutlinedIcon sx={{ ...titleTextSx, fontSize: '28px', mr: '14px' }} />
                            <Box sx={{ ...titleTextSx, fontSize: '18px', lineHeight: '28px' }}>Description</Box>
                        </Box>
                        <Box>
                            {ability.cannot('edit', 'board')
                                ?
                                <Box sx={{
                                    p: '8px 12px',
                                    ...labelTextSx,
                                    fontSize: '16px',
                                    fontWeight: '400',
                                    backgroundColor: '#E2E4EA',
                                    borderRadius: '3px'
                                }}>
                                    <div dangerouslySetInnerHTML={{ __html: description }} />
                                </Box>
                                :
                                <TinyMce
                                    value={description}
                                    setValue={handleEditorChange}
                                    disableAutoFocus={true}
                                    disableChange={ability.cannot('edit', 'board')}
                                />
                            }
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Box>
                            <Button
                                variant="text" sx={{ mr: '14px' }}
                                onClick={updateForm}
                            >Cancel</Button>
                            <Button
                                variant="contained"
                                type='submit'
                                disabled={ability.cannot('edit', 'board')}
                            >Save</Button>
                        </Box>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default BoardInfoDialog