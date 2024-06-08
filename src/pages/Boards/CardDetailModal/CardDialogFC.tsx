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

    const [members] = React.useState([
        { name: 'JD', id: 1 },
        { name: 'NV', id: 2 },
        { name: 'AH', id: 3 },
        { name: 'LK', id: 4 },
        { name: 'LK', id: 5 },
        { name: 'LK', id: 6 },
        { name: 'LK', id: 7 },
        { name: 'LK', id: 8 },
        { name: 'LK', id: 9 },
        { name: 'LK', id: 10 },
        { name: 'LK', id: 11 },
        { name: 'LK', id: 12 },
        { name: 'LK', id: 13 },
        { name: 'LK', id: 14 },
        { name: 'LK', id: 15 },
        { name: 'LK', id: 16 },
        { name: 'LK', id: 17 },
    ])

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

    const TinyMceWrap: React.FC<TinyMceProps> = ({ focus, setIsFocus, placeholder, placeHolderSx }) => {
        return (
            <>
                {focus ? (
                    <Box sx={{ position: 'relative' }}>
                        <TinyMce />
                        <Box sx={{ mt: '8px', ml: '2px' }}>
                            <Button
                                variant="contained"
                                sx={{
                                    height: '32px',
                                    width: '54px',
                                    borderRadius: '3px',
                                    mr: '6px'
                                }}
                            >Save</Button>
                            <Button
                                variant="text"
                                onClick={() => setIsFocus(false)}
                            >Cancel</Button>
                        </Box>
                    </Box>
                ) : (
                    <Box
                        onClick={(e) => setIsFocus(true)}
                        sx={{
                            ...placeHolderSx,
                            cursor: 'pointer',
                            backgroundColor: '#E2E4EA',
                            borderRadius: '3px',
                            // height: '90px',
                            border: '1px solid #dfe1e6',
                            '&:hover': {
                                backgroundColor: '#CFD3DB'
                            }
                        }}
                    >
                        <Box sx={{
                            p: '8px 12px',
                            ...labelTextSx,
                            fontSize: '16px',
                            fontWeight: '400'
                        }}>
                            {placeholder}
                        </Box>
                    </Box>
                )}
            </>
        )
    }

    const [anchorEl, setAnchorEl] = React.useState(null)
    const [isOpenTemplateDialog, setIsOpenTemplateDialog] = React.useState(false)
    const [isOpenCustomFieldDialog, setIsOpenCustomFieldDialog] = React.useState(false)
    const [isOpenLabelDialog, setIsOpenLabelDialog] = React.useState(false)
    const [isOpenDateDialog, setIsOpenDateDialog] = React.useState(false)
    const [isOpenMemberDialog, setIsOpenMemberDialog] = React.useState(false)
    const [isOpenChecklistDialog, setIsOpenChecklistDialog] = React.useState(false)
    const [isOpenAttachmentDialog, setIsOpenAttachmentDialog] = React.useState(false)


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
                    sx: { borderRadius: '15px', backgroundColor: '#F0F1F4', minWidth: '900px' },
                    // onSubmit: (event: any) => {
                    //     event.preventDefault()
                    //     const formData = new FormData(event.currentTarget)
                    //     const formJson = Object.fromEntries((formData).entries())
                    //     const email = formJson.email
                    //     console.log(email)
                    //     handleClose()
                    // }
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
                    <CoverSection />
                    <TitleSection />
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
                            {/* <Box className="field member-field">
                                <Box className="field-title" sx={{ ...labelTextSx }}>Members</Box>
                                <Box className="field-content">
                                    {members.map(member => (
                                        <CircleAvatar
                                            key={member.id}
                                            src={'https://www.w3schools.com/howto/img_avatar.png'}
                                            alt='T'
                                            sx={{
                                                width: '32px',
                                                height: '32px',
                                                m: '0 6px 6px 0'
                                            }}
                                        />
                                    ))}
                                    <Box className="add-icon">+</Box>
                                </Box>
                            </Box> */}
                            {data.members &&
                                <MemberSection members={data.members} handleClickOpen={handleOpenMemberDialogInside} />
                            }
                            {data.selectedLabels &&
                                <LabelSection selectedLabels={data.selectedLabels} handleClickOpen={handleOpenLabelDialogInside} />
                            }
                            <WatchSection isWatchCard={data.isWatchCard} reFetch={fetchData} cardId={cardId} />
                            {/* <Box className="field noti-field">
                                <Box className="field-title" sx={{ ...labelTextSx }}>Notifications</Box>
                                <Box className="field-content">
                                    <Button className="button add-button" variant="contained" startIcon={<RemoveRedEyeOutlinedIcon />}>
                                        Watch
                                    </Button>
                                </Box>
                            </Box> */}
                        </Box>

                        {/* Desc field section */}
                        <Box>
                            <Box className="section-details card-detail-desc">
                                <SubjectOutlinedIcon className="left-icon" sx={{ ...titleTextSx }} />
                                <Box className="section-title" sx={{ ...titleTextSx }}>Description</Box>
                            </Box>
                            <Box sx={{ ml: '40px' }}>
                                <TinyMceWrap
                                    focus={isFocusDetail}
                                    setIsFocus={setIsFocusDetail}
                                    placeholder="Add a more detailed description..."
                                    placeHolderSx={{ height: '90px' }}
                                />
                            </Box>
                        </Box>

                        {/* Checklist section */}
                        <ChecklistSection
                            cardId={cardId}
                            checkListItem={data.checkLists}
                            reFetch={fetchData}
                        />

                        {/* Custom field section */}
                        {/* <Box>
                            <Box className="section-details card-detail-desc">
                                <DriveFileRenameOutlineOutlinedIcon className="left-icon" sx={{ ...titleTextSx }} />
                                <Box className="section-title" sx={{ ...titleTextSx }}>Custom Fields</Box>
                            </Box>
                            <Box sx={{
                                ml: '40px',
                                gridTemplateColumns: 'repeat(3, 199px)',
                                gridGap: '16px',
                                display: 'grid'
                            }}>
                                <CustomFieldItem
                                    item={{
                                        id: '1',
                                        title: 'Xin chao',
                                        type: 'TEXT',
                                        option: [],
                                        templateId: '1'
                                    }}
                                    defaultValue='Hello world'
                                    onValueChange={(id, value) => console.log(id, value)}
                                />
                                <CustomFieldItem
                                    item={{
                                        id: '2',
                                        title: 'Xin chao',
                                        type: 'CHECKBOX',
                                        option: [],
                                        templateId: '1'
                                    }}
                                    defaultValue='true'
                                    onValueChange={(id, value) => console.log(id, value)}
                                />
                                <CustomFieldItem
                                    item={{
                                        id: '3',
                                        title: 'Xin chao',
                                        type: 'DROPDOWN',
                                        option: [
                                            { id: 1, title: 'Option 1', color: '#FEA362' },
                                            { id: 2, title: 'Option 2', color: '#9F8FEF' },
                                            { id: 3, title: 'Option 3', color: '#F87168' }
                                        ],
                                        templateId: '1'
                                    }}
                                    defaultValue={1}
                                    onValueChange={(id, value) => console.log(id, value)}
                                />
                                <CustomFieldItem
                                    item={{
                                        id: '4',
                                        title: 'Xin chao',
                                        type: 'DATE',
                                        option: null,
                                        templateId: '1'
                                    }}
                                    defaultValue={'22/12/2024 12:21'}
                                    onValueChange={(id, value) => console.log(id, value)}
                                />
                            </Box>
                        </Box> */}
                        <CustomFieldSection
                            customFields={data.customFields}
                            selectedFieldsValue={data.selectedFieldsValue}
                            cardId={cardId}
                            reFetch={fetchData}
                        />

                        {/* Acttachment section */}
                        <Box>
                            <Box className="section-details card-detail-desc">
                                <AttachFileOutlinedIcon className="left-icon" sx={{ ...titleTextSx }} />
                                <Box className="section-title" sx={{ ...titleTextSx }}>Attachments</Box>
                            </Box>
                            <Box sx={{ ml: '40px' }}>
                                <AttachmentItem />
                                {/* <AttachmentItem /> */}
                                {/* <AttachmentItem /> */}
                            </Box>
                        </Box>

                        {/* Comment section */}
                        <Box ref={commentSectionRef}>
                            <Box className="section-details card-detail-desc">
                                <SubdirectoryArrowRightOutlinedIcon className="left-icon" sx={{ ...titleTextSx }} />
                                <Box className="section-title" sx={{ ...titleTextSx }}>Comments</Box>
                                <Box sx={{ position: 'relative' }}>
                                    <Box sx={{ position: 'absolute', top: '-2px' }}>
                                        <IconButton
                                            aria-label="delete"
                                            size="small"
                                            onClick={() => setIsShowComment(!isShowComment)}
                                        >
                                            {isShowComment
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
                                        display: isShowComment ? 'none' : 'block',
                                        ...labelTextSx
                                    }}>
                                        4 comment from Việt Hưng Nguyễn, Tran Van A,... (2+ more)
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', mb: '16px' }}>
                                <Box sx={{
                                    mr: '10px',
                                    mt: '4px'
                                }}>
                                    <CircleAvatar
                                        src={userInfo?.avatar}
                                        alt={userInfo?.fullName}
                                        sx={{
                                            width: '32px',
                                            height: '32px'
                                        }}
                                    />
                                </Box>
                                <Box sx={{ width: '100%' }}>
                                    <TinyMceWrap
                                        focus={isFocusComment}
                                        setIsFocus={setIsFocusComment}
                                        placeholder="Write a comment..."
                                        placeHolderSx={{ height: '40px' }}
                                    />
                                </Box>
                            </Box>
                            <Box sx={{
                                display: isShowComment ? 'block' : 'none'
                            }}>
                                <CommentItem />
                                <CommentItem />
                                <CommentItem />
                            </Box>
                        </Box>

                        {/* History section */}
                        <Box>
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
                        </Box>
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
                        <Button
                            className="button right-button"
                            variant="contained"
                            startIcon={<VideoLabelOutlinedIcon />}
                        >Cover</Button>
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
                        members={data.members}
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
                        cardId='123'
                    />
                    <AttachmentDialog
                        id='attachment-dialog'
                        open={isOpenAttachmentDialog}
                        anchorEl={anchorEl}
                        onClose={handleDialogClose}
                        cardId='123'
                    />
                </Box>
            </Dialog>
        </React.Fragment>
    )
}

export default CardDialogFC