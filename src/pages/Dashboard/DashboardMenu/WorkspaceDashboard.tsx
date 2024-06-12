import React from 'react'
import Box from '@mui/material/Box'
import ApiLoadingOverlay from '~/components/Common/ApiLoadingOverlay'
import TaskWorkingStatusByBoardChart from '../Charts/Workspace/TaskWorkingStatusByBoardChart'
import MemberWorkingStatusByWorkspace from '../Charts/Workspace/MemberWorkingStatusByWorkspace'
import BoardTaskCountChart from '../Charts/Workspace/BoardTaskCountChart'
import WorkspaeTimelineChart from '../Charts/Workspace/WorkspaeTimelineChart'

interface BoardDashboardProps {
    listBoardInfo: any
}

const headingSx = {
    fontSize: '18px',
    fontWeight: '500',
    color: '#172b4d',
    mb: '12px'
}

const chartSx = {
    transition: 'box-shadow 0.3s ease-in-out',
    boxShadow: '0px 0px 4px 4px rgba(0, 0, 0, 0.2)',
    p: '20px',
    m: '14px',
    borderRadius: '14px'
}

const WorkspaceDashboard: React.FC<BoardDashboardProps> = ({ listBoardInfo }) => {

    if (!listBoardInfo) {
        return (
            <ApiLoadingOverlay />
        )
    }

    return (
        <Box>
            <Box sx={{ display: 'flex' }}>
                <Box sx={{ width: '33.3333333333%', ...chartSx }}>
                    <Box sx={{ pb: '14px' }}>
                        <Box sx={headingSx}>Task Finish Status by Board</Box>
                    </Box>
                    <TaskWorkingStatusByBoardChart listBoardInfo={listBoardInfo} />
                </Box>
                <Box sx={{ width: '33.3333333333%', ...chartSx }}>
                    <Box sx={{ pb: '14px' }}>
                        <Box sx={headingSx}>Member Working Status by Workspace</Box>
                    </Box>
                    <MemberWorkingStatusByWorkspace listBoardInfo={listBoardInfo} />
                </Box>
                <Box sx={{ width: '33.3333333333%', ...chartSx }}>
                    <Box sx={{ pb: '14px' }}>
                        <Box sx={headingSx}>Task Allocation by Board</Box>
                    </Box>
                    <BoardTaskCountChart listBoardInfo={listBoardInfo} />
                </Box>
            </Box>

            <Box sx={{ ...chartSx, height: '940px' }}>
                <Box sx={{ pb: '14px' }}>
                    <Box sx={headingSx}>Workspace Timeline</Box>
                    {/* <Box sx={textSx}>asdfasdfasdf</Box> */}
                </Box>
                <WorkspaeTimelineChart listBoardInfo={listBoardInfo} />
            </Box>
        </Box>
    )
}

export default WorkspaceDashboard