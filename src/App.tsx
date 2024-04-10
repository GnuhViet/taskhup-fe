import BoardComponent from '~/pages/Boards/_id'
import React from 'react'
import { StompSessionProvider } from 'react-stomp-hooks'
import AppBar from '~/components/AppBar/AppBar'
import HomeFC from '~/pages/Home/HomeFC'

import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ErrorPage from './pages/Error/ErrorPage'

const router = createBrowserRouter([
    {
        path: '/',
        errorElement: <ErrorPage />,
        children: [
            { path: '', element: <HomeFC /> },
            { path: '/board', element: <BoardComponent /> },
            { path: '/error', element: <ErrorPage /> }
        ]
    }
])

const App: React.FC = () => {
    return (
        <>
            {/* React Router Dom /boards /boards/{board_id} */}
            {/* Board Details */}
            <AppBar />
            <StompSessionProvider url={'http://localhost:8080/ws-endpoint'}>
                <RouterProvider router={router} />
            </StompSessionProvider>
            {/* <Box sx={{ display: 'none' }}>
                <BoardComponent />
            </Box> */}
        </>
    )
}

export default App
