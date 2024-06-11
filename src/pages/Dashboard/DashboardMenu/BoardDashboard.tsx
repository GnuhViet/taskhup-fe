import React from 'react'
import Box from '@mui/material/Box'
import ApiLoadingOverlay from '~/components/Common/ApiLoadingOverlay'
import TaskTimelineChart from '../Charts/TaskTimelineChart'
import TaskWorkingStatusChart from '../Charts/TaskWorkingStatusChart'
import MemberWorkingStatusChart from '../Charts/MemberWorkingStatusChart'
import TaskCountChart from '../Charts/TaskCountChart'

interface BoardDashboardProps {
    selectedBoard: any
}

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

const chartSx = {
    transition: 'box-shadow 0.3s ease-in-out',
    boxShadow: '0px 0px 4px 4px rgba(0, 0, 0, 0.2)',
    p: '20px',
    m: '14px',
    borderRadius: '14px'
}

const BoardDashboard: React.FC<BoardDashboardProps> = ({ selectedBoard }) => {

    if (!selectedBoard) {
        return (
            <ApiLoadingOverlay />
        )
    }

    return (
        <Box>
            <Box sx={{ display: 'flex' }}>
                <Box sx={{ width: '33.3333333333%', ...chartSx }}>
                    <Box sx={{ pb: '14px' }}>
                        <Box sx={headingSx}>Task Finish Status by Function</Box>
                    </Box>
                    <TaskWorkingStatusChart boardInfo={selectedBoard} />
                </Box>
                <Box sx={{ width: '33.3333333333%', ...chartSx }}>
                    <Box sx={{ pb: '14px' }}>
                        <Box sx={headingSx}>Member Working Status by Total Task</Box>
                    </Box>
                    <MemberWorkingStatusChart boardInfo={selectedBoard} />
                </Box>
                <Box sx={{ width: '33.3333333333%', ...chartSx }}>
                    <Box sx={{ pb: '14px' }}>
                        <Box sx={headingSx}>Task Allocation by Function</Box>
                    </Box>
                    <TaskCountChart boardInfo={selectedBoard} />
                </Box>
            </Box>

            <Box sx={{ ...chartSx, height: '940px' }}>
                <Box sx={{ pb: '14px' }}>
                    <Box sx={headingSx}>Task Timeline</Box>
                    {/* <Box sx={textSx}>asdfasdfasdf</Box> */}
                </Box>
                <TaskTimelineChart boardInfo={selectedBoard} />
            </Box>
        </Box>
    )
}

export default BoardDashboard