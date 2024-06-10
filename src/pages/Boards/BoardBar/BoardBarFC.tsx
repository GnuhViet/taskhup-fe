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
import React, { useEffect, useState } from 'react'
import { useGetWorkspaceMemberQuery, useLazyGetWorkspaceMemberQuery } from '~/core/redux/api/workspace.api'
import { ApiResponse } from '~/core/services/api.model'
import ApiLoadingOverlay from '~/components/Common/ApiLoadingOverlay'
import { useNavigate, useParams } from 'react-router-dom'
import TemplateDialogFC from './Dialog/Template/TemplateDialogFC'
import BoardInfoDialog from './Dialog/BoardInfo/BoardInfoDialogFC'

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
    const [wsMember, setWsMember] = React.useState<any[]>([])
    const [getMember, { isLoading }] = useLazyGetWorkspaceMemberQuery()
    const workspaceId = useParams().workspaceId
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [openBoardInfo, setOpenBoardInfo] = React.useState(false)
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

    const fetchWsMember = async () => {
        try {
            const response = await getMember({}).unwrap() as ApiResponse<any>
            setWsMember(response.data)
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        fetchWsMember()
    }, [board])

    return (
        <>
            <Box sx={{ position: 'absolute', width: '100%' }}>
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
                    // bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
                    boxShadow: 'inset 0 0 0 1000px rgba(0, 0, 0, 0.4)'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Tooltip title={board?.description}>
                            <Chip
                                sx={MENU_STYLES}
                                icon={<DashboardIcon />}
                                label={board?.title}
                                onClick={() => handleClickOpen(setOpenBoardInfo)}
                                clickable
                            />
                        </Tooltip>
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
                            onClick={() => navigate(`/w/${workspaceId}/member`)}
                        >
                            Invite
                        </Button>
                        {isLoading &&
                            <ApiLoadingOverlay />
                        }
                        <AvatarGroup
                            max={4}
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
                            {wsMember &&
                                wsMember.map((member) => (
                                    <Tooltip key={member.userId} title={member.fullName}>
                                        <Avatar
                                            alt={member.fullName}
                                            src={member.avatarUrl}
                                        />
                                    </Tooltip>
                                ))
                            }
                        </AvatarGroup>
                    </Box>

                </Box>
                <BoardInfoDialog open={openBoardInfo} handleClose={() => handleClose(setOpenBoardInfo)} />
                <TemplateDialogFC open={openTempate} handleClose={() => handleClose(setOpenTemplate)} />
            </Box>
        </>
    )
}

export default BoardBarFC
