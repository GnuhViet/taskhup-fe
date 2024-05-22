import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Typography from '@mui/material/Typography'
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined'
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined'
import CreateWorkSpaceDialog from '../modal/CreateWorkSpaceDialog'
import CreateBoardPopover from '~/components/Home/boards/createboard/CreateBoardPopover'

const CreateMenu: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [anchorElClone, setAnchorElClone] = React.useState(null)
    const open = Boolean(anchorEl)

    const [openPopover, setOpenPopover] = React.useState(false)
    const popOverId = 'header-create-board-popover'

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget)
        setAnchorElClone(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const [openCreateWorkspaceDialog, setOpenCreateWorkspaceDialog] = React.useState(false)

    return (
        <>
            <Box>
                <Button
                    sx={{
                        color: 'white',
                        border: 'none',
                        backgroundColor: '#0c66e4',
                        height: '32px',
                        mt: '3px',
                        '&:hover': {
                            backgroundColor: '#0055CC',
                            border: 'none'
                        }
                    }}
                    variant="outlined"
                    aria-controls={open ? 'basic-menu-workspaces' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    // startIcon={<LibraryAddIcon sx={{ color: '#ffffff' }} />}
                >
                    Create
                </Button>
                <Menu
                    id="basic-menu-workspaces"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button-workspaces'
                    }}
                    slotProps={{
                        paper: {
                            style: {
                                width: '280px'
                            }
                        }
                    }}
                >
                    <MenuItem style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }} onClick={() => { setOpenPopover(true); handleClose() }} >
                        <Box sx={{ display: 'flex', mb: '4px' }}>
                            <ListItemIcon>
                                <SpaceDashboardOutlinedIcon fontSize='small' />
                            </ListItemIcon>
                            <ListItemText sx={{ fontSize: 'inherit' }}>Create Board</ListItemText>
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 'inherit', whiteSpace: 'initial' }} >
                            A board is made up of cards ordered on lists. Use it to manage projects, track information, or organize anything.
                        </Typography>
                    </MenuItem>
                    <MenuItem style={{ display: 'block', fontSize: '12px' }} onClick={() => { setOpenCreateWorkspaceDialog(true); handleClose() }}>
                        <Box sx={{ display: 'flex', mb: '4px' }}>
                            <ListItemIcon>
                                <HomeWorkOutlinedIcon fontSize='small' />
                            </ListItemIcon>
                            <ListItemText sx={{ fontSize: 'inherit' }}>Create Workspace</ListItemText>
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 'inherit', whiteSpace: 'initial' }} >
                            A Workspace is a group of boards and people. Use it to organize your company, side hustle, family, or friends.
                        </Typography>
                    </MenuItem>
                </Menu>
            </Box>
            {console.log('popoverid', popOverId)}
            <CreateBoardPopover id={popOverId} open={openPopover} anchorEl={anchorElClone} onClose={() => setOpenPopover(false)} />
            <CreateWorkSpaceDialog open={openCreateWorkspaceDialog} handleClose={() => setOpenCreateWorkspaceDialog(false)} />
        </>
    )
}

export default CreateMenu
