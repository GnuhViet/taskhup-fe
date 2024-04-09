import BoardComponent from '~/pages/Boards/_id'
import React from 'react'
import { StompSessionProvider } from 'react-stomp-hooks'
import AppBar from '~/components/AppBar/AppBar'
import HomeFC from '~/pages/Home/HomeFC'
import Box from '@mui/material/Box'

const App: React.FC = () => {
    return (
        <>
            {/* React Router Dom /boards /boards/{board_id} */}
            {/* Board Details */}
            <StompSessionProvider url={'http://localhost:8080/ws-endpoint'}>
                <AppBar/>
                <HomeFC/>
                <Box sx={{ display: 'none' }}>
                    <BoardComponent />
                </Box>
            </StompSessionProvider>
        </>
    )
}

export default App
