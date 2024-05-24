import React from 'react'
import Box from '@mui/material/Box'
import './WorkspaceSettingFC.scss'
import SideBarButton from '~/components/Home/sidebar/SideBarButton'
import List from '@mui/material/List'
import { useSelector } from 'react-redux'
import SquareAvatar from '~/components/Common/SquareAvatar'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined'

import RoleSettingFC from './menu-tabs/RoleSettingFC'
import WorkSpaceInfoFC from './menu-tabs/InfomationFC'
import { useGetWorkSpaceInfoQuery } from '~/core/redux/api/workspace.api'
import { ApiResponse } from '~/core/services/api.model'
import CircularProgress from '@mui/material/CircularProgress'
import MovingOutlinedIcon from '@mui/icons-material/MovingOutlined'

const avatarSx = {
    minWidth: '60px',
    minHeight: '60px',
    maxWidth: '60px',
    maxHeight: '60px',
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

const upgradeButtonSx = {
    color: '#44546f',
    backgroundColor: '#F3F0FF',
    frontWeight: '',
    '&:hover': {
        backgroundColor: '#DFD8FD'
    }
}

const WorkspaceSettingFC = () => {
    const { data: apiResponse, isSuccess: isLoadingInfoSuccess } = useGetWorkSpaceInfoQuery({})
    const response = apiResponse as ApiResponse<any>
    const workspaceInfo = response?.data

    const selectedButtonId = useSelector((state: any) => state.homeReducer.selectedButtonId)

    if (!isLoadingInfoSuccess) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <>
            <Box className="home-container" sx={{ overflow: 'hidden' }}>
                <Box className="section-workspace-header" sx={{ overflow: 'hidden' }}>
                    <Box className="section-header-content">
                        <Box className="workspace-title">
                            <Box className="title-main">
                                <SquareAvatar sx={avatarSx} src={workspaceInfo?.avatarUrl} alt={workspaceInfo.title.charAt(0)} />
                                <Box className="title-info">
                                    <Box className='title-name'>{workspaceInfo.title}</Box>
                                    <Box className='title-description'>{workspaceInfo.description}</Box>
                                </Box>
                            </Box>
                            {workspaceInfo.website && (
                                <Box className="title-link-section">
                                    <ExploreOutlinedIcon sx={{ fontSize: '22px', mr: '4px', cursor: 'default' }} />
                                    <Link className="link-text">
                                        {workspaceInfo.website}
                                    </Link>
                                </Box>
                            )}

                        </Box>
                        <Box>
                            <Button
                                sx={{ ...buttonSx, ...upgradeButtonSx }}
                                variant='contained'
                                startIcon={<MovingOutlinedIcon />}
                            >Upgrade</Button>
                        </Box>
                    </Box>
                    <Box sx={{
                        borderBottom: '#DCDFE4 1px solid',
                        minWidth: '1600px'
                    }}
                    />
                </Box>

                <Box className="home-sticky-container" sx={{}}>
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
                        {console.log('render workspace setting', selectedButtonId)}

                        {(() => {
                            switch (selectedButtonId) {
                            case 'workspace-setting-info-button':
                                return <WorkSpaceInfoFC />
                            case 'workspace-setting-role-button':
                                return <RoleSettingFC />
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