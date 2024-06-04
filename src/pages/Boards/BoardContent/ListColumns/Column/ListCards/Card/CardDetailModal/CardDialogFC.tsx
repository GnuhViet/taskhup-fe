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
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import VideoLabelOutlinedIcon from '@mui/icons-material/VideoLabelOutlined'
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined'
import SubjectOutlinedIcon from '@mui/icons-material/SubjectOutlined'
import CloseIcon from '@mui/icons-material/Close'
import Textarea from '@mui/joy/Textarea'
import Box from '@mui/material/Box'

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

interface CardDialogProps {
    open: boolean
    handleClose: () => void
    card: any
}

interface CircleAvatarProps {
    key: number
    name: string
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

const CardDialogFC: React.FC<CardDialogProps> = ({ open, handleClose, card }) => {
    // const [open, setOpen] = React.useState(true)
    const userInfo = useSelector((state: any) => state.homeReducer.userInfo) as UserInfoResponse
    const [objectcard, setCard] = React.useState(card)

    const [members] = React.useState([
        { name: 'JD', id: 1 }, { name: 'NV', id: 2 }, { name: 'AH', id: 3 }, { name: 'LK', id: 4 }
    ])

    const handleInputChange = (event: any) => {
        const { objectcard, value } = event.target
        card.title = value
    }

    const [isFocusDetail, setIsFocusDetail] = React.useState(false)
    const [isFocusComment, setIsFocusComment] = React.useState(false)

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

    return (
        <React.Fragment>
            <Dialog
                disableEnforceFocus={true}
                fullWidth={true}
                maxWidth='md'
                style={{ zIndex: 99 }}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: { borderRadius: '15px', backgroundColor: '#F0F1F4' },
                    onSubmit: (event: any) => {
                        event.preventDefault()
                        const formData = new FormData(event.currentTarget)
                        const formJson = Object.fromEntries((formData).entries())
                        const email = formJson.email
                        console.log(email)
                        handleClose()
                    }
                }}
            >
                <Box className="closeIcon">
                    <CloseIcon sx={{ pr: '2px' }} onClick={handleClose} />
                </Box>

                <DialogTitle sx={{ mb: '14px' }} className="dialogTitle">
                    <SubtitlesOutlinedIcon className="left-icon subtitlesIcon" sx={{ ...titleTextSx }} />
                    <Box>
                        <Textarea
                            value={'Trello Tip: 🌊Slide your Q\'s into this handy list so your team keeps on flowing. list so your team keeps on flowing'}
                            variant="plain"
                            className="textarea-title"
                            sx={{ ...titleTextSx }}
                        />
                        <DialogContentText className='sub-title' sx={{ color: '#44546f' }}>
                             in list <a style={{ color: 'inherit' }} href="#">Questions For Next Meeting</a>
                        </DialogContentText>
                    </Box>
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
                            <Box className="field member-field">
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
                                                mr: '6px'
                                            }}
                                        />
                                    ))}
                                    <Box className="add-icon">+</Box>
                                </Box>
                            </Box>
                            <Box className="field noti-field">
                                <Box className="field-title" sx={{ ...labelTextSx }}>Notifications</Box>
                                <Box className="field-content">
                                    <Button className="button add-button" variant="contained" startIcon={<RemoveRedEyeOutlinedIcon />}>
                                        Watch
                                    </Button>
                                </Box>
                            </Box>
                        </Box>

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

                        <Box className="section-details card-detail-desc">
                            <DriveFileRenameOutlineOutlinedIcon className="left-icon" sx={{ ...titleTextSx }} />
                            <Box className="section-title" sx={{ ...titleTextSx }}>Custom Fields</Box>
                        </Box>
                        <Box sx={{ ml: '40px' }}>
                        </Box>

                        <Box className="section-details card-detail-desc">
                            <AttachFileOutlinedIcon className="left-icon" sx={{ ...titleTextSx }} />
                            <Box className="section-title" sx={{ ...titleTextSx }}>Attachments</Box>
                        </Box>
                        <Box sx={{ ml: '40px' }}>
                            <AttachmentItem />
                            {/* <AttachmentItem /> */}
                            {/* <AttachmentItem /> */}
                        </Box>

                        <Box className="section-details card-detail-desc">
                            <InsertCommentOutlinedIcon className="left-icon" sx={{ ...titleTextSx }} />
                            <Box className="section-title" sx={{ ...titleTextSx }}>Comments</Box>
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                            <CircleAvatar
                                src={userInfo?.avatar}
                                alt={userInfo?.fullName}
                                sx={{
                                    width: '32px',
                                    height: '32px',
                                    mr: '10px',
                                    mt: '4px'
                                }}
                            />
                            <Box sx={{ width: '100%' }}>
                                <TinyMceWrap
                                    focus={isFocusComment}
                                    setIsFocus={setIsFocusComment}
                                    placeholder="Write a comment..."
                                    placeHolderSx={{ height: '40px' }}
                                />
                            </Box>
                        </Box>
                    </Box>

                    <Box className="list-right-buttons">
                        <Box className="button-title" sx={{ ...labelTextSx }}>Add to card</Box>
                        <Button className="button right-button" variant="contained" startIcon={<PersonOutlineOutlinedIcon />}>Members</Button>
                        <Button className="button right-button" variant="contained" startIcon={<BookmarksOutlinedIcon />}>Labels</Button>
                        <Button className="button right-button" variant="contained" startIcon={<TaskAltOutlinedIcon />}>Checklist</Button>
                        <Button className="button right-button" variant="contained" startIcon={<ScheduleOutlinedIcon />}>Dates</Button>
                        <Button className="button right-button" variant="contained" startIcon={<AttachFileOutlinedIcon />}>Attachment</Button>
                        <Button className="button right-button" variant="contained" startIcon={<LocationOnOutlinedIcon />}>Location</Button>
                        <Button className="button right-button" variant="contained" startIcon={<VideoLabelOutlinedIcon />}>Cover</Button>
                        <Button className="button right-button" variant="contained" startIcon={<DriveFileRenameOutlineOutlinedIcon />}>Custom Fields</Button>
                    </Box>

                </DialogContent>

                <DialogActions>
                    {/* <Button type="submit">Subscribe</Button> */}
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default CardDialogFC