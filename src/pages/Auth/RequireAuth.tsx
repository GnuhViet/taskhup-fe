import { useLocation, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AppBar from '~/components/AppBar/AppBar'
import Box from '@mui/material/Box'

const RequireAuth = () => {
    const token = useSelector((state: any) => state.authReducer.token.accessToken)
    const location = useLocation()

    return (
        token
            ?
            <Box>
                <AppBar />
                <Box sx={{
                    overflow: 'auto',
                    maxHeight: 'calc(100vh - 48px)'
                }}>
                    <Outlet />
                </Box>
            </Box>
            : <Navigate to="/" state={{ from: location }} replace />
    )
}
export default RequireAuth