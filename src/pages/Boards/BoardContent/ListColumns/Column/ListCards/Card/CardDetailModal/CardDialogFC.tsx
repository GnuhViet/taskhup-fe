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

import React from 'react'
import './CardDetailModal.scss'

interface CardDialogProps {
    open: boolean
    handleClose: () => void
    card: any
}

interface CircleAvatarProps {
    key: number
    name: string
}

const CardDialogFC: React.FC<CardDialogProps> = ({ open, handleClose, card }) => {
  // const [open, setOpen] = React.useState(true)
  const [objectcard, setCard] = React.useState(card)

  const [members] = React.useState([
    { name: 'JD', id: 1 }, { name: 'NV', id: 2 }, { name: 'AH', id: 3 }, { name: 'LK', id: 4 }
  ])

  const handleInputChange = (event: any) => {
    const { objectcard, value } = event.target
    card.title = value
  }

  const CircleAvatar: React.FC<CircleAvatarProps> = ({ key, name }) => {
    return (
      <>
        <img src={key + 'URL'} alt={'ALT'}/> //TODO: Add URL
        <div className="circle-avatar">
          <span>{name}</span>
        </div>
      </>
    )
  }

  return (
    <React.Fragment>
      <Dialog
        fullWidth={true}
        maxWidth='md'
        style={{ zIndex: 9999 }}
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
          <SubtitlesOutlinedIcon className="left-icon subtitlesIcon" />
          <Box>
            <Textarea value={'Trello Tip: 🌊Slide your Q\'s into this handy list so your team keeps on flowing. list so your team keeps on flowing'} variant="plain" className="textarea-title" />
            <DialogContentText className='sub-title'> in list <a style={{ color: 'inherit' }} href="#">Questions For Next Meeting</a></DialogContentText>
          </Box>
        </DialogTitle>

        <DialogContent className='dialog-content'>
          {/* <DialogContentText> test text from card
          </DialogContentText> */}
          {/* <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          /> */}

          <Box className="body">
            <Box className="card-details card-detail-title">
              <Box className="field member-field">
                <Box className="field-title">Members</Box>
                <Box className="field-content">
                  {members.map(member => (
                    <CircleAvatar key={member.id} name={member.name} />
                  ))}
                  <Box className="add-icon">+</Box>
                </Box>
              </Box>
              <Box className="field noti-field">
                <Box className="field-title">Notifications</Box>
                <Box className="field-content">
                  <Button className="button add-button" variant="contained" startIcon={<RemoveRedEyeOutlinedIcon />}>
                    Watch
                  </Button>
                </Box>
              </Box>
            </Box>

            <Box className="section-details card-detail-desc">
              <SubjectOutlinedIcon className="left-icon" />
              <Box className="section-title">Description</Box>
            </Box>
          </Box>

          <Box className="list-right-buttons">
            <Box className="button-title">Add to card</Box>
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
          <Button type="submit">Subscribe</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default CardDialogFC