import Box from '@mui/material/Box'
import './WorkspaceSettingFC.scss'
import SideBarButton from '~/components/Home/sidebar/SideBarButton'
import List from '@mui/material/List'
import { useDispatch, useSelector } from 'react-redux'
import SquareAvatar from '~/components/Common/SquareAvatar'
import React, { useEffect } from 'react'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined'
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import CircleAvatar from '~/components/Common/CircleAvatar'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import CreateRoleDialog from './Dialogs/CreateRoleDialog'

import { Can } from '~/core/utils/access-control'
import RoleSettingFC from './menu-tabs/RoleSettingFC'
import { setSelectedButtonId } from '~/core/redux/slices/homeSlice'


const headingSx = {
    fontSize: '18px',
    fontWeight: '500',
    color: '#172b4d',
    mb: '12px'
}

const textSx = {
    fontSize: '13px',
    fontWeight: '300',
    color: '#172b4d'
}

const borderBottom = {
    borderBottom: '1px solid #DCDFE4'
}

const avatarSx = {
    minWidth: '60px',
    minHeight: '60px',
    fontSize: '32px',
    mr: '12px'
}

const buttonSx = {
    color: '#172B4D',
    backgroundColor: '#F0F1F4',
    boxShadow: 'none !important',
    height: '32px',
    frontSize: '14px',
    frontWeight: '300',
    alignItems: 'center',
    mr: '14px',
    '&:hover': {
        backgroundColor: '#DCDFE4'
    }
}
const WorkspaceSettingFC = () => {
    const selectedButtonId = useSelector((state: any) => state.homeReducer.selectedButtonId)
    const [open, setOpen] = React.useState(false)

    return (
        <>
            <Box className="home-container" sx={{ overflow: 'hidden' }}>
                <Box className="section-workspace-header" sx={{ overflow: 'hidden' }}>
                    <Box className="section-header-content">
                        <Box className="workspace-title">
                            <Box className="title-main">
                                <SquareAvatar sx={avatarSx} src={null} alt='T' />
                                <Box className="title-info">
                                    <Box className='title-name'>NAME HERE</Box>
                                    <Box className='title-description'>DESCP HERE</Box>
                                </Box>
                            </Box>
                            <Box className="title-link-section">
                                <ExploreOutlinedIcon sx={{ fontSize: '22px', mr: '4px', cursor: 'default' }} />
                                <Link className="link-text">
                                    abcdef.com
                                </Link>
                            </Box>
                        </Box>
                        <Box>
                            <Button
                                onClick={() => setOpen(true)}
                                sx={{
                                    ...buttonSx,
                                    mr: 0,
                                    backgroundColor: '#0C66E4',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#0055CC'
                                    }
                                }}
                                variant='contained'
                                startIcon={<GroupAddOutlinedIcon
                                />}>Invite Workspace members</Button>
                        </Box>
                    </Box>
                    <Box sx={{
                        borderBottom: '#DCDFE4 1px solid',
                        minWidth: '1600px'
                    }}
                    />
                </Box>

                <Box className="home-sticky-container" sx={{ }}>
                    <Box className="home-left-sidebar-container">
                        <List className="top-button">
                            <Box className="title">Settings</Box>
                            <SideBarButton id={'workspace-setting-info-button'} text={'Information'} defaultSelected />
                            <SideBarButton id={'workspace-setting-role-button'} text={'Role'} />
                        </List>
                        <List className="work-spaces" sx={{ overflow: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                            <SideBarButton id={'workspace-join-request-button'} text={'Delete this workspace'} />
                        </List>
                    </Box>


                    <Box className="workspace-member-content" sx={{ pt: '66px', minHeight: 'calc(100vh - 160px - 48px - 48px)', minWidth: '790px' }}>
                        {/*{selectedButtonId === 'workspace-member-button' && (*/}
                        {/*    <>workspace-member-button</>*/}
                        {/*)}*/}
                        {/*{selectedButtonId === 'workspace-guest-button' && (*/}
                        {/*    <>workspace-guest-button</>*/}
                        {/*)}*/}
                        {/*{selectedButtonId === 'workspace-join-request-button' && (*/}
                        {/*    <>workspace-join-request-button</>*/}
                        {/*)}*/}

                        {console.log('render workspace setting', selectedButtonId)}

                        {(() => {
                            switch (selectedButtonId) {
                            case 'workspace-setting-info-button':
                                return <>
                                    <Box>
                                        <Box sx={{ ...borderBottom, pb: '14px' }}>
                                            <Box sx={headingSx}>Workspace members (1)</Box>
                                            <Box sx={textSx}>Workspace members can view and join all Workspace visible boards and create new boards in the Workspace. Adding new members will automatically update your billing.</Box>
                                        </Box>
                                        <Box sx={{ ...borderBottom, p: '24px 0 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ maxWidth: '450px' }}>
                                                <Box sx={headingSx}>Invite members to join you</Box>
                                                <Box sx={textSx}>Anyone with an invite link can join this paid Workspace. You’ll be billed for each member that joins. You can also disable and create a new invite link for this Workspace at any time.</Box>
                                            </Box>
                                            <Button sx={{ ...buttonSx, mr: 0 }} variant='contained' startIcon={<GroupAddOutlinedIcon />}>Invite with link</Button>
                                        </Box>
                                        <Box sx={{ ...borderBottom, p: '24px 0 12px 0' }}>
                                            <TextField
                                                placeholder='Filter by name...'
                                                size='small'
                                                sx={{ width: '450px' }}
                                            />
                                        </Box>
                                        <Box>
                                            {new Array(10).fill(null).map((item, index) => (
                                                <Box key={index} sx={{ ...borderBottom, p: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <CircleAvatar sx={{ minWidth: '42px', minHeight: '42px', fontSize: '16px', mr: '12px', background: '#172B4D' }} src={null} alt='V' />
                                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <Box sx={{ fontSize: '16px', fontWeight: '800', color: '#172B4D' }}>Việt Hưng Nguyễn</Box>
                                                            <Box sx={{ fontSize: '14px', fontWeight: '400', color: '#44546f', display: 'flex' }}>
                                                                <Box>@vithngnguyn16</Box>
                                                                <Box sx={{ fontSize: '20px', display: 'flex', alignItems: 'center', lineHeight: '14px' }}>
                                                                                                                &nbsp;•&nbsp;
                                                                </Box>
                                                                <Box>Joined 1 month ago</Box>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                    <Box>
                                                        <Button sx={{ ...buttonSx }} variant='contained'>View boards (3)</Button>
                                                        <Button sx={{ ...buttonSx }} variant='contained' startIcon={<BadgeOutlinedIcon sx={{ mb: '4px' }} />}>Role</Button>
                                                        <Button sx={{ ...buttonSx, mr: 0 }} variant='contained' startIcon={<CloseOutlinedIcon />}>Leave&nbsp;...</Button>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                </>
                            case 'workspace-setting-role-button':
                                return <RoleSettingFC/>
                            case 'workspace-join-request-button':
                                return <>
                                    <Box>
                                        <Box sx={{ ...borderBottom, pb: '14px' }}>
                                            <Box sx={headingSx}>Join requests (0)</Box>
                                            <Box sx={textSx}>These people have requested to join this Workspace. Adding new Workspace members will automatically update your bill.</Box>
                                        </Box>
                                        <Box sx={{ ...borderBottom, p: '12px 0 12px 0' }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: '20px',
                                                fontStyle: 'italic', fontSize: '14px', fontWeight: '400', color: '#44546f'
                                            }}>
                                                <span>There are no join requests.</span>
                                            </Box>
                                            <TextField
                                                placeholder='Filter by name...'
                                                size='small'
                                                sx={{ width: '450px' }}
                                            />
                                            <Box sx={{ display: 'flex', mt: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <FormControlLabel control={<Checkbox />} label="Select all (0)" />
                                                <Box>
                                                    <Button sx={{ ...buttonSx }} variant='contained' disabled>Add selected to Workspace</Button>
                                                    <Button sx={{ ...buttonSx }} variant='contained' disabled>Delete selected requests</Button>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </>
                            default:
                                return null
                            }
                        })()}
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default WorkspaceSettingFC