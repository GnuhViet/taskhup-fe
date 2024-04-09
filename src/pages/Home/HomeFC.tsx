import React from 'react'
import { useDispatch } from 'react-redux'

import Box from '@mui/material/Box'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'

import './HomeFC.scss'
import SideBarButton from '~/components/Home/sidebar/SideBarButton'
import List from '@mui/material/List'
import SideBarExpandButton from '~/components/Home/sidebar/SideBarExpandsButton'
import BoardItem from '~/components/Home/boards/BoardItem'

const iconSx = {
    fontSize: '16px'
}


const HomeFC = () => {

    return (
        <>
            <Box className="home-container">
                <Box className="home-sticky-container">
                    <Box className="home-left-sidebar-container">
                        <List className="top-button">
                            <SideBarButton id={'board-button'} text={'Boards'} icon={<TrelloIcon style={iconSx} />} />
                            <SideBarButton id={'template-button'} text={'Template'} icon={<InsightsOutlinedIcon sx={iconSx} />} />
                            <SideBarButton id={'home-button'} text={'Home'} icon={<HomeOutlinedIcon sx={iconSx} />} />
                        </List>
                        <List className="work-spaces">
                            <Box className="title">WordSpaces</Box>

                            <SideBarExpandButton workSpaceId='w1' text={'Home'} icon={<HomeOutlinedIcon sx={iconSx} />} />
                            <SideBarExpandButton workSpaceId='w2' text={'Home'} icon={<HomeOutlinedIcon sx={iconSx} />} />
                            <SideBarExpandButton workSpaceId='w3' text={'Home'} icon={<HomeOutlinedIcon sx={iconSx} />} />
                            <SideBarExpandButton workSpaceId='w4' text={'Home'} icon={<HomeOutlinedIcon sx={iconSx} />} />
                        </List>
                    </Box>
                    <Box className="all-boards">
                        <BoardItem id='1' title='bảng của tôi mot hai ba bon nam sau' desc='đây là description của box' starred={true} backgroundUrl='https://trello-backgrounds.s3.amazonaws.com/SharedBackground/480x336/24baa6609b89fb8eb0cc0aceb70eaf36/photo-1557682250-33bd709cbe85.jpg' />
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default HomeFC