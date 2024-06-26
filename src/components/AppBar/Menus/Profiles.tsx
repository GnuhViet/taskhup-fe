import React from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import { useDispatch, useSelector } from 'react-redux'
import { logOut } from '~/core/redux/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { UserInfoResponse } from '~/core/services/user-services.model'

const Profiles: React.FC = () => {
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const dispatch = useDispatch()

    const userInfo = useSelector((state: any) => state.homeReducer.userInfo) as UserInfoResponse


    return (
        <Box>
            <Tooltip title="Account settings">
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ padding: 0 }}
                    aria-controls={open ? 'basic-menu-profiles' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar
                        sx={{ width: 36, height: 36 }}
                        alt={userInfo?.fullName}
                        src={userInfo?.avatar}
                    />
                </IconButton>
            </Tooltip>
            <Menu
                id="basic-menu-profiles"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button-profiles'
                }}
            >
                <MenuItem onClick={() => navigate('/profile')}>
                    <Avatar
                        sx={{ width: 28, height: 28, mr: 2 }}
                        alt={userInfo?.fullName}
                        src={userInfo?.avatar}
                    /> Profile
                </MenuItem>
                {/* <MenuItem>
                    <Avatar sx={{ width: 28, height: 28, mr: 2 }} /> My account
                </MenuItem> */}
                <Divider />
                {/* <MenuItem>
                    <ListItemIcon>
                        <PersonAdd fontSize="small" />
                    </ListItemIcon>
                    Add another account
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem> */}
                <MenuItem onClick={() => dispatch(logOut())}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </Box>
    )
}

export default Profiles
