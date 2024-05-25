import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/core/utils/formatters'
import { useDispatch } from 'react-redux'
import { setDisableDrag } from '~/core/redux/slices/boardSlice'
import React from 'react'
import { set } from 'lodash'
import TemplateDialogFC from './Dialog/TemplateDialogFC'

const MENU_STYLES = {
    color: 'white',
    bgcolor: 'transparent',
    border: 'none',
    paddingX: '5px',
    borderRadius: '4px',
    '.MuiSvgIcon-root': {
        color: 'white'
    },
    '&:hover': {
        bgcolor: 'primary.50'
    }
}

function BoardBarFC({ board }) {
    const dispatch = useDispatch()

    const [openTempate, setOpenTemplate] = React.useState(false)
    const [openFilter, setOpenFilter] = React.useState(false)

    const handleClose = (setOpen: any) => {
        setOpen(false)
        dispatch(setDisableDrag(false))
    }

    const handleClickOpen = (setOpen: any) => {
        setOpen(true)
        dispatch(setDisableDrag(true))
    }

    return (
        <>
            <Box>
                <Box sx={{
                    width: '100%',
                    height: (theme) => theme.trello.boardBarHeight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    paddingX: 2,
                    overflowX: 'auto',
                    position: 'relative',
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
                    boxShadow: 'inset 0 0 0 1000px rgba(0, 0, 0, 0.2)'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Tooltip title={board?.description}>
                            <Chip
                                sx={MENU_STYLES}
                                icon={<DashboardIcon />}
                                label={board?.title}
                                clickable
                            />
                        </Tooltip>
                        {/* <Chip
                    sx={MENU_STYLES}
                    icon={<VpnLockIcon />}
                    label={capitalizeFirstLetter(board?.type)}
                    clickable
                /> */}
                        {/* <Chip
                    sx={MENU_STYLES}
                    icon={<AddToDriveIcon />}
                    label="Add To Google Drive"
                    clickable
                /> */}
                        <Chip
                            sx={MENU_STYLES}
                            icon={<BoltIcon />}
                            label="Template"
                            onClick={() => handleClickOpen(setOpenTemplate)}
                            clickable
                        />
                        <Chip
                            sx={MENU_STYLES}
                            icon={<FilterListIcon />}
                            label="Filters"
                            onClick={() => handleClickOpen(setOpenFilter)}
                            clickable
                        />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<PersonAddIcon />}
                            sx={{
                                color: 'white',
                                borderColor: 'white',
                                '&:hover': { borderColor: 'white' }
                            }}
                        >
                            Invite
                        </Button>

                        <AvatarGroup
                            max={7}
                            sx={{
                                gap: '10px',
                                '& .MuiAvatar-root': {
                                    width: 34,
                                    height: 34,
                                    fontSize: 16,
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    '&:first-of-type': { bgcolor: '#a4b0be' }
                                }
                            }}
                        >
                            {/* <Tooltip title="trungquandev">
                        <Avatar alt="trungquandev"
                            src="https://trungquandev.com/wp-content/uploads/2023/05/main-avatar-circle-min-trungquandev-codetq.jpeg"
                        />
                    </Tooltip>
                    <Tooltip title="trungquandev">
                        <Avatar alt="trungquandev"
                            src="https://trungquandev.com/wp-content/uploads/2021/01/trungquandev-avatar-2021.jpg"
                        />
                    </Tooltip>
                    <Tooltip title="trungquandev">
                        <Avatar alt="trungquandev"
                            src="https://trungquandev.com/wp-content/uploads/2018/04/trungquandev-avatar.jpeg"
                        />
                    </Tooltip>
                    <Tooltip title="trungquandev">
                        <Avatar alt="trungquandev"
                            src="https://trungquandev.com/wp-content/uploads/2019/03/trungquandev-avatar-01-scaled.jpg"
                        />
                    </Tooltip>
                    <Tooltip title="trungquandev">
                        <Avatar alt="trungquandev"
                            src="https://trungquandev.com/wp-content/uploads/2017/03/aboutme.jpg"
                        />
                    </Tooltip>
                    <Tooltip title="trungquandev">
                        <Avatar alt="trungquandev"
                            src="https://trungquandev.com/wp-content/uploads/2019/06/trungquandev-cat-avatar.png"
                        />
                    </Tooltip>

                    <Tooltip title="trungquandev">
                        <Avatar alt="trungquandev"
                            src="https://trungquandev.com/wp-content/uploads/2023/05/main-avatar-circle-min-trungquandev-codetq.jpeg"
                        />
                    </Tooltip>
                    <Tooltip title="trungquandev">
                        <Avatar alt="trungquandev"
                            src="https://trungquandev.com/wp-content/uploads/2021/01/trungquandev-avatar-2021.jpg"
                        />
                    </Tooltip>
                    <Tooltip title="trungquandev">
                        <Avatar alt="trungquandev"
                            src="https://trungquandev.com/wp-content/uploads/2018/04/trungquandev-avatar.jpeg"
                        />
                    </Tooltip>
                    <Tooltip title="trungquandev">
                        <Avatar alt="trungquandev"
                            src="https://trungquandev.com/wp-content/uploads/2019/03/trungquandev-avatar-01-scaled.jpg"
                        />
                    </Tooltip>
                    <Tooltip title="trungquandev">
                        <Avatar alt="trungquandev"
                            src="https://trungquandev.com/wp-content/uploads/2017/03/aboutme.jpg"
                        />
                    </Tooltip>
                    <Tooltip title="trungquandev">
                        <Avatar alt="trungquandev"
                            src="https://trungquandev.com/wp-content/uploads/2019/06/trungquandev-cat-avatar.png"
                        />
                    </Tooltip> */}
                        </AvatarGroup>
                    </Box>

                </Box>
                <TemplateDialogFC open={openTempate} handleClose={() => handleClose(setOpenTemplate)} />
            </Box>
        </>
    )
}

export default BoardBarFC
