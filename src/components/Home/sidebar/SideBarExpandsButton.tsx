import React, { useEffect } from 'react'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'

import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
// import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import MovingOutlinedIcon from '@mui/icons-material/MovingOutlined'

import SideBarButton from './SideBarButton'
import { useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import { WorkSpace } from '~/core/model/workspace.model'
import SquareAvatar from '~/components/Common/SquareAvatar'
import TextBoxToolTip from '~/components/Common/TextBoxToolTip'
import { useNavigate } from 'react-router-dom'

const avatarSx = {
    minWidth: '32px',
    minHeight: '32px',
    width: '32px',
    height: '32px',
    // mr: '12px'
}

const buttonSx = {
    borderRadius: '8px',
    height: '36px',
    mb: '4px',
    '&.Mui-selected': {
        backgroundColor: '#E9F2FF',
        color: '#0C66E4',
        '& .MuiListItemIcon-root': {
            color: 'rgb(23, 43, 77)'
        }
    },
    '&:hover': {
        backgroundColor: '#DCDFE4'
    }
}

const itemSx = {
    minWidth: 'unset',
    width: '24px',
    height: '24px',
    alignItems: 'center'
}

const textSx = {
    // pt: '4px'
}

const iconSx = {
    fontSize: '16px'
}

const collapseButtonSx = {
    pl: '25px'
}

export interface SideBarExpandButtonProps {
    workSpaceItem: WorkSpace
    onClick?: () => void
    // icon: React.ReactNode
}


const SideBarExpandButton: React.FC<SideBarExpandButtonProps> = ({ workSpaceItem }) => {
    const navigate = useNavigate()
    const selectedButtonId = useSelector((state: any) => state.homeReducer.selectedButtonId)

    const [open, setOpen] = React.useState(false)
    const [selected, setSelected] = React.useState(false)

    const handleOpen = () => {
        setOpen(!open)
    }

    useEffect(() => {
        if (open === false) {
            if (selectedButtonId.includes(workSpaceItem.id)) {
                setSelected(true)
                return
            } else {
                setSelected(false)
                return
            }
        }

        if (open === true) {
            setSelected(false)
        }
    }, [open, selectedButtonId, workSpaceItem.id])

    return (
        <Box sx={{ maxWidth: '276px' }}>
            <ListItemButton sx={buttonSx} selected={selected} onClick={handleOpen}>
                <ListItemIcon sx={itemSx}>
                    <SquareAvatar
                        sx={avatarSx}
                        src={workSpaceItem.avatarUrl}
                        alt={workSpaceItem.title.charAt(0).toUpperCase()}
                    />
                </ListItemIcon>
                <ListItemText
                    sx={textSx}
                    primary={
                        <TextBoxToolTip
                            sx={{ fontWeight: selected ? 'bold' : '400', maxWidth: '260px', pl: '16px' }}
                            text={workSpaceItem.title}
                            id={`${workSpaceItem.id}-title`}
                            breakOnLine={1}
                        />
                    }
                />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <Box onClick={() => navigate(`/w/${workSpaceItem.id}/board-grid`)}>
                        <SideBarButton id={`${workSpaceItem.id}-boards-button`}
                            sx={collapseButtonSx} text={'Boards'} icon={<Box sx={iconSx}><TrelloIcon /></Box>} />
                    </Box >
                    <Box onClick={() => navigate(`/w/${workSpaceItem.id}/dashboard`)}>
                        <SideBarButton id={`${workSpaceItem.id}-views-button`}
                            sx={collapseButtonSx} text={'Views'} icon={<GridViewOutlinedIcon sx={iconSx} />} />
                    </Box >
                    <Box onClick={() => navigate(`/w/${workSpaceItem.id}/member`)}>
                        <SideBarButton id={`${workSpaceItem.id}-members-button`}
                            sx={collapseButtonSx} text={'Members'} icon={<PermIdentityOutlinedIcon sx={iconSx} />} />
                    </Box>
                    <Box onClick={() => navigate(`/w/${workSpaceItem.id}/settings`)}>
                        <SideBarButton id={`${workSpaceItem.id}-settings-button`}
                            sx={collapseButtonSx} text={'Settings'} icon={<SettingsOutlinedIcon sx={iconSx} />} />
                    </Box>
                    <Box >
                        <SideBarButton id={`${workSpaceItem.id}-upgrades-button`}
                            sx={collapseButtonSx} text={'Upgrade'} icon={<MovingOutlinedIcon sx={iconSx} />}
                        />
                    </Box>
                </List>
            </Collapse>
        </Box>
    )
}

export default SideBarExpandButton