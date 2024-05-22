import Box from '@mui/material/Box'
import SideBarButton from '~/components/Home/sidebar/SideBarButton'
import List from '@mui/material/List'
import { useSelector } from 'react-redux'
import SquareAvatar from '~/components/Common/SquareAvatar'
import React from 'react'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined'
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined'
import InformationFC from './menu-tabs/InfomationFC'
import VerifyMailFC from './menu-tabs/VerifyMailFC'
import ChangePasswordFC from './menu-tabs/ChangePasswordFC'
import { useGetUserInfoQuery } from '~/core/redux/api/user.api'
import { ApiResponse } from '~/core/services/api.model'
import CircularProgress from '@mui/material/CircularProgress'

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
const ProfileFC = () => {
    const selectedButtonId = useSelector((state: any) => state.homeReducer.selectedButtonId)
    const [open, setOpen] = React.useState(false)

    return (
        <>
            <Box className="home-container" sx={{ overflow: 'hidden' }}>

                <Box className="home-sticky-container" sx={{ }}>
                    <Box className="home-left-sidebar-container">
                        <List className="top-button">
                            <Box className="title">Settings</Box>
                            <SideBarButton id={'profile-setting-info-button'} text={'Infomation'} defaultSelected />
                            <SideBarButton id={'profile-setting-verify-button'} text={'Verify gmail'} />
                            <SideBarButton id={'profile-setting-password-button'} text={'Change Password'} />
                            <SideBarButton id={'profile-setting-payment-button'} text={'Payment'} />
                        </List>
                        <List className="work-spaces" sx={{ overflow: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                            <SideBarButton id={'workspace-join-request-button'} text={'Disable this account'} />
                        </List>
                    </Box>


                    <Box className="workspace-member-content" sx={{ pt: '66px', minHeight: 'calc(100vh - 160px - 48px - 48px)', minWidth: '790px' }}>

                        {console.log('render profile setting', selectedButtonId)}

                        {(() => {
                            switch (selectedButtonId) {
                            case 'profile-setting-info-button':
                                return <InformationFC />
                            case 'profile-setting-verify-button':
                                return <VerifyMailFC />
                            case 'profile-setting-password-button':
                                return <ChangePasswordFC />
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

export default ProfileFC