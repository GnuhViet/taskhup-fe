import React from 'react'

import HomeFC from '~/pages/Home/HomeFC'

import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ErrorPage from './pages/Error/ErrorPage'

import RequireAuth from '~/pages/Auth/RequireAuth'
import BoardComponentWrap from './pages/Boards/BoardComponentWrap'
import LoginFC from './pages/Auth/LoginFC'
import RegisterFC from '~/pages/Auth/RegisterFC'
import MemberFC from '~/pages/member/MemberFC'
import RequireRole from './pages/Auth/RequireRole'
import WorkspaceSettingFC from './pages/workspace-settings/WorkspaceSettingFC'

const router = createBrowserRouter([
    {
        path: '/',
        errorElement: <ErrorPage />,
        // element: <Layout />,
        children: [
            // { path: '', element: <Public/> },
            { path: '/login', element: <LoginFC /> },
            { path: '/register', element: <RegisterFC /> },
            {
                element: <RequireAuth />,
                children: [
                    { path: '/home', element: <HomeFC /> },
                    { path: '/error', element: <ErrorPage /> },
                    {
                        element: <RequireRole />,
                        path: '/w/:workspaceId',
                        children: [
                            { path: 'settings', element: <WorkspaceSettingFC/> },
                            { path: 'member', element: <MemberFC /> },
                            { path: 'board', element: <BoardComponentWrap /> }
                            // { path: '/boards', element: <BoardComponentWrap /> }
                        ]
                    }
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
