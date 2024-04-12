import BoardComponent from '~/pages/Boards/_id'
import React from 'react'
import { StompSessionProvider } from 'react-stomp-hooks'
import AppBar from '~/components/AppBar/AppBar'
import HomeFC from '~/pages/Home/HomeFC'

import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ErrorPage from './pages/Error/ErrorPage'
import Layout from '~/pages/Auth/Layout'
import Public from '~/pages/Auth/Public'
import Login from '~/pages/Auth/login'
import RequireAuth from '~/pages/Auth/RequireAuth'
import BoardComponentWrap from './pages/Boards/BoardComponentWrap'
import LoginFC from './pages/Auth/Login/LoginFC'

const router = createBrowserRouter([
    {
        path: '/',
        errorElement: <ErrorPage />,
        // element: <Layout />,
        children: [
            // { path: '', element: <Public/> },
            { path: '', element: <LoginFC /> },
            {
                element: <RequireAuth />,
                children: [
                    { path: '/home', element: <HomeFC /> },
                    { path: '/board', element: <BoardComponentWrap /> },
                    { path: '/error', element: <ErrorPage /> }
                ]
            }
        ]
    }
])

const App: React.FC = () => {
    return (
        <>
            {/* React Router Dom /boards /boards/{board_id} */}
            {/* Board Details */}

            <RouterProvider router={router} />

            {/* <RouterProvider router={router} /> */}
            {/* <Box sx={{ display: 'none' }}>
                <BoardComponent />
            </Box> */}
        </>
    )
}

export default App
