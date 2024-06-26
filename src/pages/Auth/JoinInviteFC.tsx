import { useLocation, Navigate, useParams } from 'react-router-dom'
import { useJoinWorkspaceQuery } from '~/core/redux/api/invite.api'

const JoinInviteFC = () => {
    const { id } = useParams()
    const location = useLocation()
    const { error, isLoading, isSuccess } = useJoinWorkspaceQuery(id)

    if (isLoading) return <div>Loading...</div>
    if (error) {
        // redicrect to home
        return <Navigate to="/home" replace />
    }

    return (
        isSuccess &&
            <Navigate to="/login" state={{ from: location }} replace />
    )
}
export default JoinInviteFC