import React, { useRef } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined'
import SquareAvatar from '~/components/Common/SquareAvatar'
import { useGetWorkSpaceInfoQuery } from '~/core/redux/api/workspace.api'
import { ApiResponse } from '~/core/services/api.model'
import ApiLoadingOverlay from '~/components/Common/ApiLoadingOverlay'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'


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

const columns: GridColDef<(typeof rows)[number]>[] = [
    {
        field: 'id',
        headerName: 'ID',
        flex: 1
    },
    {
        field: 'title',
        headerName: 'Title',
        // width: 150,
        editable: true,
        flex: 1
    },
    {
        field: 'shortDescription',
        headerName: 'Short description',
        // width: 150,
        editable: true,
        flex: 1
    },
    {
        field: 'startDate',
        headerName: 'Start date',
        editable: true,
        width: 160,
        valueGetter: (value, row) => {
            if (!row.startDate) return ''
            return new Date(row.startDate).toLocaleDateString()
        }
    },
    {
        field: 'endDate',
        headerName: 'End date',
        sortable: false,
        width: 160,
        valueGetter: (value, row) => {
            if (!row.endDate) return ''
            return new Date(row.startDate).toLocaleDateString()
        }
    }
]

const BoardGridFC = () => {
    const pageContentRef = useRef()
    const { data: apiResponse, isSuccess: isLoadingInfoSuccess } = useGetWorkSpaceInfoQuery({})
    const response = apiResponse as ApiResponse<any>
    const workspaceInfo = response?.data

    const workspaceId = useParams().workspaceId
    const workspace = useSelector((state: any) => state.homeReducer.workspace)

    const [rows, setRows] = React.useState<any>(null)

    const buildRowData = async () => {
        const currentWS = workspace.find((item: any) => item.id === workspaceId)
        setRows(currentWS?.boards)
        console.log(currentWS?.boards)
    }

    React.useEffect(() => {
        if (!workspace) return
        buildRowData()
    }, [workspace, rows])

    if (!isLoadingInfoSuccess || rows === null) {
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

            <Box className="home-sticky-container" >
                <Box sx={{ display: 'block', mt: '40px' }}>
                    <Box
                        sx={{
                            fontSize: '20px'
                        }}
                    >Board table</Box>
                    <Box
                        sx={{
                            width: '1250px'
                        }}
                    >
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 5
                                    }
                                }
                            }}
                            pageSizeOptions={[5]}
                            checkboxSelection
                            disableRowSelectionOnClick
                            autoHeight
                            style={{ minHeight: 200 }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default BoardGridFC