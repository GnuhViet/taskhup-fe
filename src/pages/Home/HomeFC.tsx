import Box from '@mui/material/Box'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import { skipToken } from "@reduxjs/toolkit/query"
import './HomeFC.scss'
import SideBarButton from '~/components/Home/sidebar/SideBarButton'
import List from '@mui/material/List'
import SideBarExpandButton from '~/components/Home/sidebar/SideBarExpandsButton'
import BoardItem from '~/components/Home/boards/BoardItem'
import { useGetAllBoardQuery } from '~/core/redux/api/board.api'
import { Board } from '~/core/model/board.model'
import { redirect } from 'react-router-dom'
import WorkSpaceItem from '~/components/Home/workspace/WorkSpaceItem'
import { useGetUserWorkSpaceQuery } from '~/core/redux/api/workspace.api'
import { GetWorkSpaceResp } from '~/core/services/workspace-services.model'
import { ApiResponse } from '~/core/services/api.model'
import { WorkSpace } from '~/core/model/workspace.model'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

const iconSx = {
    fontSize: '16px'
}

const sectionTitleSx = {
    m: '20px 0 20px 0',
    fontSize: '16px',
    fontWeight: '600'
}

const workspaceItemSx = {
    pb: '20px'
}

const HomeFC = () => {
    const workspace = useSelector((state: any) => state.homeReducer.workspace)

    const { error, isLoading } = useGetUserWorkSpaceQuery({})
    // const response = data as ApiResponse<GetWorkSpaceResp>

    if (error) {
        // do something
    }

    if (isLoading) return <div>Loading...</div>

    return (
        <> {console.log('home re-render!!', workspace)}
            <Box className="home-container">
                <Box className="home-sticky-container">
                    <Box className="home-left-sidebar-container">
                        <List className="top-button">
                            <SideBarButton id={'board-button'} text={'Boards'} icon={<TrelloIcon style={iconSx} />} />
                            <SideBarButton id={'template-button'} text={'Template'} icon={<InsightsOutlinedIcon sx={iconSx} />} />
                            <SideBarButton id={'home-button'} text={'Home'} icon={<HomeOutlinedIcon sx={iconSx} />} />
                        </List>
                        <List className="work-spaces" sx={{ overflow: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                            <Box className="title">WordSpaces</Box>

                            <SideBarExpandButton workSpaceId='w1' text={'Home'} icon={<HomeOutlinedIcon sx={iconSx} />} />
                            <SideBarExpandButton workSpaceId='w2' text={'Home'} icon={<HomeOutlinedIcon sx={iconSx} />} />
                            <SideBarExpandButton workSpaceId='w3' text={'Home'} icon={<HomeOutlinedIcon sx={iconSx} />} />
                            <SideBarExpandButton workSpaceId='w4' text={'Home'} icon={<HomeOutlinedIcon sx={iconSx} />} />
                        </List>
                    </Box>
                    {/* <Box className="all-boards">
                        {board.data?.map((board: Board) =>
                            <BoardItem
                                id={`${board.id}`}
                                title={board.title}
                                desc={board.description}
                                starred={false}
                                backgroundUrl='https://trello-backgrounds.s3.amazonaws.com/SharedBackground/480x336/24baa6609b89fb8eb0cc0aceb70eaf36/photo-1557682250-33bd709cbe85.jpg'
                                key = { board.id } />
                        )}
                        <BoardItem id={`${board.id}`} title='bảng của tôi mot hai ba bon nam sau bay tam asdfasdfasafdadsf' desc='đây là description của box'
                            starred={false} backgroundUrl='https://trello-backgrounds.s3.amazonaws.com/SharedBackground/480x336/24baa6609b89fb8eb0cc0aceb70eaf36/photo-1557682250-33bd709cbe85.jpg' />

                    </Box> */}
                    {/* <Box className="home-content">
                        <WorkSpaceItem />
                    </Box> */}

                    <Box className="home-content">
                        <Box>
                            <Box sx={sectionTitleSx}>YOUR WORKSPACES</Box>
                            {
                                workspace
                                && workspace
                                    .map((workspace: WorkSpace) => (
                                        workspace.type === 'JOINED'
                                            ?
                                            <Box sx={workspaceItemSx} key={workspace.id}>
                                                <WorkSpaceItem workspace={workspace} />
                                            </Box>
                                            : null
                                    ))
                            }
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default HomeFC