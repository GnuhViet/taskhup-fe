import React, { useRef } from 'react'
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
import { useLazyGetBoardByCodeQuery, useLazyGetBoardInfomationQuery } from '~/core/redux/api/board.api'
import { Board } from '~/core/model/board.model'
import TimelineCharst from './Charts/Board/TaskTimelineChart'
import SideBarButton from '~/components/Home/sidebar/SideBarButton'
import List from '@mui/material/List'
import BoardDashboard from './DashboardMenu/BoardDashboard'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import WorkspaceDashboard from './DashboardMenu/WorkspaceDashboard'

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
    const pageContentRef = useRef()
    const { data: apiResponse, isSuccess: isLoadingInfoSuccess } = useGetWorkSpaceInfoQuery({})
    const [getBoardInfo, { isLoading: isLoadingBoardInfo }] = useLazyGetBoardByCodeQuery()
    const response = apiResponse as ApiResponse<any>
    const workspaceInfo = response?.data
    const { workspaceId } = useParams()
    const workspace = useSelector((state: any) => state.homeReducer.workspace)

    const [listBoardInfo, setListBoardInfo] = React.useState<any>(null)

    const selectedButtonId = useSelector((state: any) => state.homeReducer.selectedButtonId)

    const fetchBoardInfo = async (boards: any[]) => {
        const boardInfoList = []

        for (const board of boards) {
            const boardId = board.id
            const resp = await getBoardInfo(boardId).unwrap() as ApiResponse<Board>
            const boardInfo = resp

            boardInfoList.push(boardInfo)
        }

        setListBoardInfo(boardInfoList)
        // console.log(boardInfoList)
    }

    React.useEffect(() => {
        if (workspaceId) {
            const board = workspace?.find((item: any) => item.id === workspaceId)?.boards

            if (board === null) return
            if (board === undefined) return

            fetchBoardInfo(board)
        }
    }, [workspaceId, workspace])

    const [selectedBoard, setSelectedBoard] = React.useState<any>(null)

    if (!isLoadingInfoSuccess || isLoadingBoardInfo) {
        return (
            <ApiLoadingOverlay />
        )
    }

    const downloadPDF = () => {
        const input = pageContentRef.current
        html2canvas(input as HTMLElement).then((canvas) => {
            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF('p', 'mm', 'a4', true)
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = pdf.internal.pageSize.getHeight()
            const imgWidth = canvas.width
            const imgHeight = canvas.height
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight, imgHeight)
            const imgX = (pdfWidth - imgWidth * ratio) / 2
            const imgY = 30
            pdf.addImage(
                imgData,
                'PNG',
                imgX,
                imgY,
                imgWidth * ratio,
                imgHeight * ratio
            )
            pdf.save('dashboard.pdf')
        })
    }

    return (
        <Box
            ref={pageContentRef}
            className="home-container"
            sx={{
                overflow: 'hidden'
                // backgroundColor: '#F2F3F4'
            }}
        >
            <Box className="section-workspace-header"
                sx={{
                    overflow: 'hidden',
                    backgroundColor: 'white',
                    borderRadius: '0 0 50px 50px'
                }}>
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
                            startIcon={<FileDownloadOutlinedIcon />}
                            onClick={downloadPDF}
                        >Export PDF</Button>
                    </Box>
                </Box>
                <Box
                    sx={{
                        borderBottom: '#DCDFE4 1px solid',
                        minWidth: '1600px'
                    }}
                />
            </Box>

            {/* <Box className="home-sticky-container" sx={{ display: 'flex', flexDirection: 'column !important' }}>
                {listSeriesArray?.map((series: any, index: number) => (
                    <Box key={index}>
                        <TimelineCharst
                            series={series}
                        />
                    </Box>
                ))}
            </Box> */}
            <Box className="home-sticky-container" >
                <Box className="home-left-sidebar-container">
                    <List className="top-button">
                        <Box className="title">Dashboard</Box>
                        <SideBarButton id={`workspace-dashboard-item-${workspaceId}`} text={'Workspace dashboard'} defaultSelected />
                    </List>
                    <List className="work-spaces" sx={{ overflow: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                        {listBoardInfo
                            ?.filter((board: any) => board.startDate && board.endDate)
                            .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                            .map((board: any, index: number) => (
                                <Box key={index} onClick={() => setSelectedBoard(board)}>
                                    <SideBarButton id={`single-board-dashboard-${board.id}`} text={board.title} />
                                </Box>
                            ))}
                    </List>
                </Box>

                <Box className="workspace-member-content"
                    sx={{
                        pt: '66px',
                        minHeight: 'calc(100vh - 160px - 48px - 48px)',
                        minWidth: '790px !important',
                        maxWidth: '1200px !important'
                    }}>
                    {selectedButtonId === `workspace-dashboard-item-${workspaceId}`
                        ? <WorkspaceDashboard
                            listBoardInfo={listBoardInfo}
                        />
                        : <BoardDashboard
                            selectedBoard={selectedBoard}
                        />
                    }
                </Box>
            </Box>
        </Box>
    )
}

export default DashboardFC