import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import TextField from '@mui/material/TextField'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import VideoLabelOutlinedIcon from '@mui/icons-material/VideoLabelOutlined'
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined'
import SubjectOutlinedIcon from '@mui/icons-material/SubjectOutlined'
import CloseIcon from '@mui/icons-material/Close'
import Textarea from '@mui/joy/Textarea'
import Box from '@mui/material/Box'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import SubdirectoryArrowRightOutlinedIcon from '@mui/icons-material/SubdirectoryArrowRightOutlined'
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';

import React, { useEffect, useRef } from 'react'
import './CardDetailModal.scss'
import { Editor } from '@tinymce/tinymce-react'
import CircleAvatar from '~/components/Common/CircleAvatar'
import IconButton from '@mui/material/IconButton'
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import InsertCommentOutlinedIcon from '@mui/icons-material/InsertCommentOutlined';
import TinyMce from '~/components/Common/TinyMce'
import { useSelector } from 'react-redux'
import { UserInfoResponse } from '~/core/services/user-services.model'
import SquareAvatar from '~/components/Common/SquareAvatar'
import ObjectFitAvatar from '~/components/Common/ObjectFitAvatar'
import { BorderAll } from '@mui/icons-material'
import CallMadeOutlinedIcon from '@mui/icons-material/CallMadeOutlined';
import { Tooltip } from '@mui/material'
import AttachmentItem from './CardItems/AttachmentItem'
import CommentItem from './CardItems/CommentItem'
import ActivityHistoryItem from './CardItems/ActivityHistoryItem'
import CustomFieldItem from './CardItems/CustomFieldItem'
import ProgressBar from '~/components/Common/ProgressBar'
import Checkbox from '@mui/joy/Checkbox'
import ChecklistSection from './CardSections/ChecklistSection'
import BoltIcon from '@mui/icons-material/Bolt'
import TemplateDialog from './CardPopovers/TemplateDialog'
import CustomFieldDialog from './CardPopovers/CustomFieldDialog'
import LabelDialog from './CardPopovers/LabelDialog'
import DateRangeDialog from './CardPopovers/DateRangeDialog'
import MemberDialog from './CardPopovers/MemberDialog'
import CheckListDialog from './CardPopovers/CheckListDialog'
import AttachmentDialog from './CardPopovers/AttachmentDialog'
import TitleSection from './CardSections/TitleSection'
import CoverSection from './CardSections/CoverSection'
import { useLazyGetCardDetailsQuery } from '~/core/redux/api/board-card.api'
import { ApiResponse } from '~/core/services/api.model'
import LabelSection from './CardSections/LabelSection'
import WatchSection from './CardSections/WatchSection'
import CustomFieldSection from './CardSections/CustomFieldSection'
import MemberSection from './CardSections/MemberSection'
import UploadCoverSection from './CardSections/UploadCoverSection'
import CardDateSection from './CardSections/CardDateSection'
import TinyMceWrap from '~/components/Common/TinyMceWrap'
import DescriptionSection from './CardSections/DescriptionSection'
import AttachmentSection from './CardSections/AttachmentSection'
import CommentSection from './CardSections/CommentSection'
import CardHistorySection from './CardSections/CardHistorySection'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import DeleteCardDialog from './CardPopovers/DeleteCardDialog'


interface CardDialogProps {
    open: boolean
    handleClose: () => void
    cardId: string
}

interface TinyMceProps {
    focus: boolean
    setIsFocus: (value: boolean) => void
    placeholder: string
    placeHolderSx?: any
}

const customScrollbarSx = {
    '&::-webkit-scrollbar': {
        width: '6px',
        height: '6px'
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#b3bac6',
        borderRadius: '8px'
    },
    '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#919aac'
    }
}

const titleTextSx = {
    color: '#172b4d',
    fontWeight: '500'
}

const mediumTextSx = {
    fontSize: '15px',
    fontWeight: '700',
    color: '#162B4D'
}

const labelTextSx = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#44546f'
}

const smallTextSx = {
    fontSize: '12px',
    fontWeight: '400',
    color: '#44546f'
}

const dotSx = {
    fontSize: '21px',
    lineHeight: '18px'
}

const textButtonSx = {
    cursor: 'pointer',
    textDecoration: 'underline'
}

const CardDialogFC: React.FC<CardDialogProps> = ({ open, handleClose, cardId }) => {
    // const [open, setOpen] = React.useState(true)
    const userInfo = useSelector((state: any) => state.homeReducer.userInfo) as UserInfoResponse

    // const [members] = React.useState([
    //     { name: 'JD', id: 1 },
    //     { name: 'NV', id: 2 },
    //     { name: 'AH', id: 3 },
    //     { name: 'LK', id: 4 },
    //     { name: 'LK', id: 5 },
    //     { name: 'LK', id: 6 },
    //     { name: 'LK', id: 7 },
    //     { name: 'LK', id: 8 },
    //     { name: 'LK', id: 9 },
    //     { name: 'LK', id: 10 },
    //     { name: 'LK', id: 11 },
    //     { name: 'LK', id: 12 },
    //     { name: 'LK', id: 13 },
    //     { name: 'LK', id: 14 },
    //     { name: 'LK', id: 15 },
    //     { name: 'LK', id: 16 },
    //     { name: 'LK', id: 17 },
    // ])

    const [getCardDetails, { isLoading: getLoading }] = useLazyGetCardDetailsQuery()
    const [data, setData] = React.useState<any>([])

    const fetchData = async () => {
        const response = await getCardDetails(cardId).unwrap() as ApiResponse<any>
        setData(response.data)
    }

    useEffect(() => {
        if (open) {
            fetchData()
        }
        if (!open) {
            setData(null)
        }
    }, [open])

    // const handleInputChange = (event: any) => {
    //     const { objectcard, value } = event.target
    //     card.title = value
    // }

    const commentSectionRef = useRef(null)

    const [isFocusDetail, setIsFocusDetail] = React.useState(false)
    const [isFocusComment, setIsFocusComment] = React.useState(false)
    const [isShowComment, setIsShowComment] = React.useState(false)
    const [isShowHistory, setIsShowHistory] = React.useState(false)

    const [anchorEl, setAnchorEl] = React.useState(null)
    const [isOpenTemplateDialog, setIsOpenTemplateDialog] = React.useState(false)
    const [isOpenCustomFieldDialog, setIsOpenCustomFieldDialog] = React.useState(false)
    const [isOpenLabelDialog, setIsOpenLabelDialog] = React.useState(false)
    const [isOpenDateDialog, setIsOpenDateDialog] = React.useState(false)
    const [isOpenMemberDialog, setIsOpenMemberDialog] = React.useState(false)
    const [isOpenChecklistDialog, setIsOpenChecklistDialog] = React.useState(false)
    const [isOpenAttachmentDialog, setIsOpenAttachmentDialog] = React.useState(false)
    const [isOpenDeleteCardDialog, setIsOpenDeleteCardDialog] = React.useState(false)


    const [isInsideButton, setIsInsideButton] = React.useState(false)

    const handleDialogClose = () => {
        setAnchorEl(null)
        setIsOpenTemplateDialog(false)
        setIsOpenCustomFieldDialog(false)
        setIsOpenLabelDialog(false)
        setIsOpenDateDialog(false)
        setIsOpenMemberDialog(false)
        setIsOpenChecklistDialog(false)
        setIsOpenAttachmentDialog(false)
        setIsInsideButton(false)
    }

    const handleCardDelete = () => {
        setIsOpenDeleteCardDialog(false)
        handleClose()
    }

    const handleOpenMemberDialogInside = (event: any) => {
        setIsInsideButton(true)
        setAnchorEl(event.currentTarget)
        setIsOpenMemberDialog(true)
    }

    const handleOpenLabelDialogInside = (event: any) => {
        setIsInsideButton(true)
        setAnchorEl(event.currentTarget)
        setIsOpenLabelDialog(true)
    }

    const handleOpenDateDialogInside = (event: any) => {
        setIsInsideButton(true)
        setAnchorEl(event.currentTarget)
        setIsOpenDateDialog(true)
    }

    if (getLoading || data == null) {
        return (
            <></>
        )
    }

    return (
        <React.Fragment>
            <Dialog
                disableEnforceFocus={true}
                fullWidth={true}
                maxWidth='md'
                style={{ zIndex: 99 }}
                open={open}
                onClose={handleClose}
                scroll='body'
                PaperProps={{
                    sx: { borderRadius: '15px', backgroundColor: '#F0F1F4', minWidth: '900px' }
                }}
            >
                <Box className="closeIcon">
                    <CloseIcon sx={{ pr: '2px' }} onClick={handleClose} />
                </Box>

                <DialogTitle
                    className="dialogTitle"
                    sx={{
                        mb: '14px',
                        p: 0,
                    }}
                >
                    {data.coverUrl &&
                        <CoverSection
                            coverUrl={data.coverUrl}
                            cardId={cardId}
                            refetch={fetchData}
                        />
                    }
                    <TitleSection
                        title={data.title}
                        columnName={data.columnName}
                        cardId={cardId}
                        reFetch={fetchData}
                    />
                </DialogTitle>

                <DialogContent
                    className='dialog-content'
                    sx={{
                        ...customScrollbarSx,
                        mr: '4px'
                    }}
                >
                    <Box className="body" >
                        <Box className="card-details card-detail-title">
                            {data.members &&
                                <MemberSection members={data.members} handleClickOpen={handleOpenMemberDialogInside} />
                            }
                            {data.selectedLabels &&
                                <LabelSection selectedLabels={data.selectedLabels} handleClickOpen={handleOpenLabelDialogInside} />
                            }
                            <WatchSection isWatchCard={data.isWatchCard} reFetch={fetchData} cardId={cardId} />

                            {data.fromDate && data.deadlineDate &&
                                <CardDateSection
                                    cardId={cardId}
                                    reFetch={fetchData}
                                    fromDate={data.fromDate}
                                    deadlineDate={data.deadlineDate}
                                    workingStatus={data.workingStatus}
                                    handleClickOpen={handleOpenDateDialogInside}
                                />
                            }
                        </Box>

                        {/* Desc field section */}
                        <DescriptionSection
                            isFocusDetail={isFocusDetail}
                            setIsFocusDetail={setIsFocusDetail}
                            description={data.description}
                            cardId={cardId}
                            reFetch={fetchData}
                        />

                        {/* Checklist section */}
                        {data.checkLists && data.checkLists.length > 0 &&
                            <ChecklistSection
                                cardId={cardId}
                                checkListItem={data.checkLists}
                                reFetch={fetchData}
                            />
                        }

                        {/* Custom field section */}
                        {data.selectedFieldsValue && data.selectedFieldsValue.length > 0 &&
                            <CustomFieldSection
                                customFields={data.customFields}
                                selectedFieldsValue={data.selectedFieldsValue}
                                cardId={cardId}
                                reFetch={fetchData}
                            />
                        }

                        {/* Acttachment section */}
                        {data.attachments &&
                            <AttachmentSection attachments={data.attachments} cardId={cardId} reFetch={fetchData} />
                        }

                        {/* Comment section */}
                        <Box ref={commentSectionRef}>
                            <CommentSection
                                isFocusComment={isFocusComment}
                                setIsFocusComment={setIsFocusComment}
                                isShowComment={isShowComment}
                                setIsShowComment={setIsShowComment}
                                userInfo={userInfo}
                                cardId={cardId}
                                reFetch={fetchData}
                                comments={data.comments}
                            />
                        </Box>

                        {/* History section */}
                        {/* <Box>
                            <Box className="section-details card-detail-desc">
                                <RestoreOutlinedIcon className="left-icon" sx={{ ...titleTextSx }} />
                                <Box className="section-title" sx={{ ...titleTextSx }}>Activity</Box>
                                <Box sx={{ position: 'relative' }}>
                                    <Box sx={{ position: 'absolute', top: '-2px' }}>
                                        <IconButton
                                            aria-label="delete"
                                            size="small"
                                            onClick={() => setIsShowHistory(!isShowHistory)}
                                        >
                                            {isShowHistory
                                                ? <VisibilityOutlinedIcon
                                                    fontSize="small"
                                                    sx={{ color: '#172b4d' }} />
                                                :
                                                <Box>
                                                    <VisibilityOffOutlinedIcon
                                                        fontSize="small"
                                                        sx={{ color: '#172b4d' }} />

                                                </Box>
                                            }
                                        </IconButton>
                                    </Box>
                                    <Box sx={{
                                        ml: '40px',
                                        mt: '4px',
                                        display: isShowHistory ? 'none' : 'block',
                                        ...labelTextSx
                                    }}>
                                        ...
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{
                                display: isShowHistory ? 'block' : 'none'
                            }}>
                                <ActivityHistoryItem />
                                <ActivityHistoryItem />
                                <ActivityHistoryItem />
                            </Box>
                        </Box> */}
                        <CardHistorySection
                            isShowHistory={isShowHistory}
                            setIsShowHistory={setIsShowHistory}
                            activityHistory={data.activityHistory}
                            cardId={cardId}
                        />


                    </Box>

                    <Box className="list-right-buttons">
                        <Box className="button-title" sx={{ ...labelTextSx }}>Select Template</Box>
                        <Button
                            className="button right-button"
                            variant="contained"
                            startIcon={<BoltIcon />}
                            onClick={(event) => {
                                setAnchorEl(event.currentTarget)
                                setIsOpenTemplateDialog(true)
                            }}
                        >Template</Button>
                        <Button
                            className="button right-button"
                            variant="contained"
                            startIcon={<DriveFileRenameOutlineOutlinedIcon />}
                            onClick={(event) => {
                                setAnchorEl(event.currentTarget)
                                setIsOpenCustomFieldDialog(true)
                            }}
                        >Custom Fields</Button>
                        <Button
                            className="button right-button"
                            variant="contained"
                            startIcon={<BookmarksOutlinedIcon />}
                            onClick={(event) => {
                                setAnchorEl(event.currentTarget)
                                setIsOpenLabelDialog(true)
                            }}
                        >Labels</Button>

                        <Box className="button-title" sx={{ ...labelTextSx, mt: '40px' }}>Add to card</Box>
                        <Button
                            className="button right-button"
                            variant="contained"
                            startIcon={<PersonOutlineOutlinedIcon />}
                            onClick={(event) => {
                                setAnchorEl(event.currentTarget)
                                setIsOpenMemberDialog(true)
                            }}
                        >Members</Button>
                        <Button
                            className="button right-button"
                            variant="contained"
                            startIcon={<TaskAltOutlinedIcon />}
                            onClick={(event) => {
                                setAnchorEl(event.currentTarget)
                                setIsOpenChecklistDialog(true)
                            }}
                        >Checklist</Button>
                        <Button
                            className="button right-button"
                            variant="contained"
                            startIcon={<ScheduleOutlinedIcon />}
                            onClick={(event) => {
                                setAnchorEl(event.currentTarget)
                                setIsOpenDateDialog(true)
                            }}
                        >Dates</Button>
                        <Button
                            className="button right-button"
                            variant="contained"
                            startIcon={<AttachFileOutlinedIcon />}
                            onClick={(event) => {
                                setAnchorEl(event.currentTarget)
                                setIsOpenAttachmentDialog(true)
                            }}
                        >Attachment</Button>
                        <Button
                            className="button right-button"
                            variant="contained"
                            startIcon={<SubdirectoryArrowRightOutlinedIcon />}
                            onClick={() => {
                                // setIsShowComment(true)
                                setIsFocusComment(true)
                                commentSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
                            }}
                        >Comment</Button>
                        {/* <Button
                            className="button right-button"
                            variant="contained"
                            startIcon={<VideoLabelOutlinedIcon />}
                        >Cover</Button> */}
                        <UploadCoverSection
                            cardId={cardId}
                            reFetch={fetchData}
                        />

                        <Box className="button-title" sx={{ ...labelTextSx, mt: '40px' }}>Actions</Box>
                        <Button
                            className="button right-button"
                            variant="contained"
                            startIcon={<DeleteForeverOutlinedIcon />}
                            onClick={() => {
                                setIsOpenDeleteCardDialog(true)
                            }}
                        >Delete card</Button>
                    </Box>

                </DialogContent>

                <DialogActions>
                    {/* <Button type="submit">Subscribe</Button> */}
                </DialogActions>

                <Box>
                    <TemplateDialog
                        id='template-dialog'
                        open={isOpenTemplateDialog}
                        anchorEl={anchorEl}
                        onClose={handleDialogClose}
                        cardId={cardId}
                        defaultTemplateId={data.templateId}
                        reFetch={fetchData}
                    />
                    <CustomFieldDialog
                        id='custom-field-dialog'
                        open={isOpenCustomFieldDialog}
                        anchorEl={anchorEl}
                        onClose={handleDialogClose}
                        templateId={data.templateId}
                        cardId={cardId}
                        selectedFieldsValue={data.selectedFieldsValue}
                        reFetch={fetchData}
                    />
                    <LabelDialog
                        id='label-dialog'
                        open={isOpenLabelDialog}
                        anchorEl={anchorEl}
                        onClose={handleDialogClose}
                        templateId={data.templateId}
                        cardId={cardId}
                        selectedLabels={data.selectedLabels}
                        reFetch={fetchData}
                        insideButton={isInsideButton}
                    />
                    <MemberDialog
                        id='member-dialog'
                        open={isOpenMemberDialog}
                        anchorEl={anchorEl}
                        onClose={handleDialogClose}
                        cardId={cardId}
                        members={data.members === null ? [] : data.members}
                        reFetch={fetchData}
                        insideButton={isInsideButton}
                    />
                    <CheckListDialog
                        id='checklist-dialog'
                        open={isOpenChecklistDialog}
                        anchorEl={anchorEl}
                        onClose={handleDialogClose}
                        cardId={cardId}
                        checkListValue={data.checkLists}
                        reFetch={fetchData}
                    />
                    <DateRangeDialog
                        id='dates-dialog'
                        open={isOpenDateDialog}
                        anchorEl={anchorEl}
                        onClose={handleDialogClose}
                        cardId={cardId}
                        insideButton={isInsideButton}
                        fromDate={data.fromDate}
                        deadlineDate={data.deadlineDate}
                        reFetch={fetchData}
                    />
                    <AttachmentDialog
                        id='attachment-dialog'
                        open={isOpenAttachmentDialog}
                        anchorEl={anchorEl}
                        onClose={handleDialogClose}
                        cardId={cardId}
                        reFetch={fetchData}
                    />
                    <DeleteCardDialog
                        id={'delete-card-dialog'}
                        open={isOpenDeleteCardDialog}
                        onClose={handleCardDelete}
                        cardId={cardId}
                    />
                </Box>
            </Dialog>
        </React.Fragment>
    )
}

export default CardDialogFC