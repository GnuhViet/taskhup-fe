import React from 'react'
import Box from '@mui/material/Box'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedButtonId } from '~/core/redux/slices/homeSlice'

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
    // border: '1px solid black',
    minWidth: 'unset',
    width: '24px',
    height: '24px',
    pt: '4px',
    alignItems: 'center'
}

const textSx = {
    // pt: '4px'
}

export interface SideBarButtonProps {
    id: string
    sx?: any
    text: string
    icon: React.ReactNode
}

const SideBarButton: React.FC<SideBarButtonProps> = ({ id, sx, text, icon }) => {
    const dispatch = useDispatch()
    const selectedButtonId = useSelector((state: any) => state.homeReducer.selectedButtonId)

    const handleClick = () => {
        dispatch(setSelectedButtonId(id))
    }

    return (
        <ListItemButton sx={buttonSx} selected={selectedButtonId === id} onClick={handleClick}>
            <Box sx={{ display: 'flex', ...sx }}>
                <ListItemIcon sx={itemSx}>{icon}</ListItemIcon>
                <ListItemText sx={textSx}
                    primaryTypographyProps={{ fontWeight: selectedButtonId === id ? 'bold' : '400' }}
                    primary={text} />
            </Box>
        </ListItemButton>
    )
}

export default SideBarButton