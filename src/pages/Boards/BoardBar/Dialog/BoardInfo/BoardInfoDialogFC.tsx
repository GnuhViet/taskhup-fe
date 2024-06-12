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
import { DateRange } from 'react-date-range'
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
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import dayjs from 'dayjs'
import { isBlank } from '~/core/utils/data-utils'

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

const borderBottom = {
    borderBottom: '1px solid #DCDFE4'
}

const DATE_FORMAT = 'DD/MM/YYYY'

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
            if (res?.data.startDate && res?.data.endDate) {
                setValue('startDate', res?.data.startDate)
                setValue('endDate', res?.data.endDate)
                setIsSelectDateRange(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const [isSelectDateRange, setIsSelectDateRange] = React.useState(false)

    const [dateRanges, setDateRanges] = React.useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ])

    const handleDateRangeChange = (item: any) => {
        if (item.selection.startDate === null) return
        if (item.selection.endDate === null) return


        setIsSelectDateRange(true)
        setDateRanges([item.selection])
        setValue('startDate', dayjs(item.selection.startDate).format(DATE_FORMAT), { shouldDirty: true })
        setValue('endDate', dayjs(item.selection.endDate).format(DATE_FORMAT), { shouldDirty: true })
    }

    const handleRemoveDate = () => {
        setIsSelectDateRange(false)
        setDateRanges([
            {
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection'
            }
        ])
    }

    React.useEffect(() => {
        if (open) {
            fetchBoardInfo()
        } else {
            setBoardInfo(null)
            reset()
        }
    }, [open])

    const { register, handleSubmit, formState: { errors, isDirty }, setValue, reset } = useForm<BoardInfoUpdateReq>({
        defaultValues: {
            id: null,
            title: null,
            shortDescription: null,
            description: null,
            startDate: null,
            endDate: null
        }
    })

    const onSubmit: SubmitHandler<BoardInfoUpdateReq> = async (data) => {
        console.log(data)
        try {
            await updateBoardInfo({
                id: data.id,
                title: data.title,
                shortDescription: data.shortDescription,
                description: data.description,
                startDate: data.startDate,
                endDate: data.endDate
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
        handleRemoveDate()
        setDescription(boardInfo?.description)

        if (isBlank(boardInfo?.startDate) || isBlank(boardInfo?.endDate)) return

        setIsSelectDateRange(true)
        setDateRanges([
            {
                startDate: new Date(boardInfo?.startDate),
                endDate: new Date(boardInfo?.endDate),
                key: 'selection'
            }
        ])

        setValue('startDate', boardInfo?.startDate)
        setValue('endDate', boardInfo?.endDate)
    }

    React.useEffect(() => {
        if (isSuccess) {
            updateForm()
        }
    }, [isSuccess, boardInfo])

    return (
        <Dialog
            fullWidth={true}
            maxWidth='lg'
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
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                        <Box >
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
                                <Box sx={{ display: 'flex', mb: '12px', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex' }}>
                                        <CalendarMonthOutlinedIcon sx={{ ...titleTextSx, fontSize: '28px', mr: '14px' }} />
                                        <Box sx={{ ...titleTextSx, fontSize: '18px', lineHeight: '28px' }}>Board Dates</Box>
                                    </Box>
                                    <Box>
                                        <Box
                                            sx={{
                                                ...titleTextSx,
                                                fontSize: '18px',
                                                lineHeight: '28px',
                                                cursor: ability.cannot('edit', 'board') ? 'normal' : 'pointer',
                                                '&:hover': {
                                                    textDecoration: 'underline'
                                                },
                                                display: isSelectDateRange ? 'block' : 'none'
                                            }}
                                            onClick={() => handleRemoveDate()}
                                        >
                                            Remove date
                                        </Box>
                                    </Box>
                                </Box>
                                <Box>
                                    <Box sx={{
                                        ml: '4px',
                                        mt: '4px',
                                        display: !isSelectDateRange ? 'none' : 'block',
                                        ...labelTextSx
                                    }}>
                                        Selected date: &nbsp;
                                        {dateRanges[0].startDate.toDateString()} - {dateRanges[0].endDate.toDateString()}
                                    </Box>
                                    <Box sx={{
                                        mt: '8px',
                                        pb: '8px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        minHeight: '400px'
                                    }}>
                                        <DateRange
                                            editableDateInputs={true}
                                            onChange={handleDateRangeChange}
                                            moveRangeOnFirstSelection={false}
                                            ranges={dateRanges}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                            <BackgroundColorSection refetch={fetchBoardInfo} />
                        </Box>
                        <Box >
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
                        </Box>
                    </Box>


                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Box>
                            <Button
                                variant="text" sx={{ mr: '14px' }}
                                onClick={() => {
                                    updateForm()
                                    handleClose()
                                }}
                            >Cancel</Button>
                            <Button
                                variant="contained"
                                type='submit'
                                disabled={
                                    ability.cannot('edit', 'board')
                                    || !isDirty
                                }
                            >Save</Button>
                        </Box>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default BoardInfoDialog