import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined'
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined'
import SquareAvatar from '~/components/Common/SquareAvatar'
import { useGetWorkSpaceInfoQuery } from '~/core/redux/api/workspace.api'
import { ApiResponse } from '~/core/services/api.model'
import CircularProgress from '@mui/material/CircularProgress'
import ApiLoadingOverlay from '~/components/Common/ApiLoadingOverlay'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const avatarSx = {
    minWidth: '60px',
    minHeight: '60px',
    width: '60px',
    height: '60px',
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

const DashboardFC = () => {
    const { data: apiResponse, isSuccess: isLoadingInfoSuccess } = useGetWorkSpaceInfoQuery({})
    const response = apiResponse as ApiResponse<any>
    const workspaceInfo = response?.data

    const { workspaceId } = useParams()

    const [currentWorkspaceBoard, setCurrentWorkspaceBoard] = React.useState<any>(null)

    const workspace = useSelector((state: any) => state.homeReducer.workspace)

    React.useEffect(() => {
        if (workspaceId) {
            const board = workspace?.find((item: any) => item.id === workspaceId)?.boards
            setCurrentWorkspaceBoard(board)

            console.log('currentWorkspaceBoard', board)
        }
    }, [workspaceId, workspace])



    if (!isLoadingInfoSuccess) {
        return (
            <ApiLoadingOverlay />
        )
    }

    return (
        <Box className="home-container" sx={{ overflow: 'hidden' }}>
            <Box className="section-workspace-header" sx={{ overflow: 'hidden' }}>
                <Box className="section-header-content" sx={{ minWidth: '1050px!important' }}>
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

            <Box className="home-sticky-container" sx={{}}>
                
            </Box>
        </Box>
    )
}

export default DashboardFC