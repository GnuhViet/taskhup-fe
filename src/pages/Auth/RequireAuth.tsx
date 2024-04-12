import { useLocation, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AppBar from '~/components/AppBar/AppBar'

const RequireAuth = () => {
    const token = useSelector((state: any) => state.authReducer.token.accessToken)
    const location = useLocation()

    return (
        token
            ?
            <>
                <AppBar />
                <Outlet />
            </>
            : <Navigate to="/" state={{ from: location }} replace />
    )
}
export default RequireAuth