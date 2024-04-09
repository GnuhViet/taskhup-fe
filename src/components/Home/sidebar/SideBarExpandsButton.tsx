import React, { useEffect } from 'react'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'

import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'

import SideBarButton from './SideBarButton'
import { useSelector } from 'react-redux'

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
    workSpaceId: string
    text: string
    onClick?: () => void
    icon: React.ReactNode
}


const SideBarExpandButton: React.FC<SideBarExpandButtonProps> = ({ workSpaceId, text, icon }) => {
    const selectedButtonId = useSelector((state: any) => state.homeReducer.selectedButtonId)

    const [open, setOpen] = React.useState(false)
    const [selected, setSelected] = React.useState(false)

    const handleOpen = () => {
        // const nextState = !open
        // if (nextState === false) {
        //     if (selectedButtonId.includes(workSpaceId)) {
        //         setSelected(true)
        //     }
        // }

        // if (nextState === true) {
        //     setSelected(false)
        // }

        setOpen(!open)
    }

    useEffect(() => {
        if (open === false) {
            if (selectedButtonId.includes(workSpaceId)) {
                setSelected(true)
                return
            }
        }

        if (open === true) {
            setSelected(false)
        }
    }, [open])

    return (
        <>
            <ListItemButton sx={buttonSx} selected={selected} onClick={handleOpen}>
                <ListItemIcon sx={itemSx}>{icon}</ListItemIcon>
                <ListItemText sx={textSx}
                    primaryTypographyProps={{ fontWeight: selected ? 'bold' : '400' }}
                    primary={text} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <SideBarButton id={`${workSpaceId}-boards-button`}
                        sx={collapseButtonSx} text={'Boards'} icon={<TrelloIcon sx={iconSx} />} />
                    <SideBarButton id={`${workSpaceId}-highlight-button`}
                        sx={collapseButtonSx} text={'Highlights'} icon={<InsightsOutlinedIcon sx={iconSx} />} />
                    <SideBarButton id={`${workSpaceId}-view-button`}
                        sx={collapseButtonSx} text={'Views'} icon={<InsightsOutlinedIcon sx={iconSx} />} />
                    <SideBarButton id={`${workSpaceId}-member-button`}
                        sx={collapseButtonSx} text={'Members'} icon={<InsightsOutlinedIcon sx={iconSx} />} />
                    <SideBarButton id={`${workSpaceId}-settings-button`}
                        sx={collapseButtonSx} text={'Settings'} icon={<InsightsOutlinedIcon sx={iconSx} />} />
                </List>
            </Collapse>
        </>



    )
}

export default SideBarExpandButton