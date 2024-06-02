import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Check from '@mui/icons-material/Check'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined'
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import ButtonBase from '@mui/material/ButtonBase'
import SquareAvatar from '~/components/Common/SquareAvatar'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded'

export interface TemplateItemProps {
    item: {
        id: string
        title: string
        avatar: string
        usedIn: number
    }
}

const Recent: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const TemplateItem: React.FC<TemplateItemProps> = ({ item }) => {
        const [anchorElMember, setAnchorElMember] = React.useState(null)
        const openMember = Boolean(anchorElMember)
        const handleClose = () => {
            setAnchorElMember(null)
        }

        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '280px',
                height: '40px'
            }}>
                <Box sx={{ display: 'flex' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SquareAvatar
                            alt={item.title.charAt(0).toUpperCase()}
                            src={item.avatar}
                            sx={{
                                width: 40,
                                height: 32
                            }}
                        />
                    </Box>
                    <Box sx={{ ml: '12px' }}>
                        <Box sx={{ fontSize: '14px' }}>
                            {item.title}
                        </Box>
                        <Box sx={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.6)' }}>
                            Used in {item.usedIn} cards
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <StarBorderRoundedIcon />
                    {/* <StarRateRoundedIcon /> */}
                </Box>
            </Box>
        )
    }

    return (
        <Box>
            <Button
                sx={{ color: 'black' }}
                id="basic-button-recent"
                aria-controls={open ? 'basic-menu-recent' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                endIcon={<ExpandMoreIcon />}
            >
                Recent
            </Button>
            <Menu
                id="basic-menu-recent"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button-recent'
                }}
            >
                <MenuItem>
                    <TemplateItem item={{
                        id: 't1',
                        title: 'Template 1',
                        avatar: 'https://cdn.britannica.com/70/234870-050-D4D024BB/Orange-colored-cat-yawns-displaying-teeth.jpg',
                        usedIn: 0
                    }} />
                </MenuItem>
                {/* <MenuItem>
                    <ListItemText inset>1.15</ListItemText>
                </MenuItem>
                <MenuItem>
                    <ListItemText inset>Double</ListItemText>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <Check />
                    </ListItemIcon>
                    Custom: 1.2
                </MenuItem>
                <Divider />
                <MenuItem>
                    <ListItemText>Add space before paragraph</ListItemText>
                </MenuItem>
                <MenuItem>
                    <ListItemText>Add space after paragraph</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem>
                    <ListItemText>Custom spacing...</ListItemText>
                </MenuItem> */}
            </Menu>
        </Box>
    )
}

export default Recent
