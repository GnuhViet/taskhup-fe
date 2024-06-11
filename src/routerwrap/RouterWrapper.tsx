import React from 'react'
import { useLocation, Outlet, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addRecentBoard } from '../core/redux/slices/homeSlice'
import { RecentBoardReq } from '../core/services/board-services.model'

const RouterWrapper = () => {
    const location = useLocation()
    const dispatch = useDispatch()

    const { workspaceId, boardId } = useParams()

    const routingHandler = async () => {
        // console.log('The route has changed to', location.pathname)

        // Check if the current path includes '/w/' and '/b/'
        if (location.pathname.includes(`/w/${workspaceId}/b/${boardId}`)) {
            dispatch(addRecentBoard(
                {
                    workspaceId: workspaceId,
                    boardId: boardId
                } as RecentBoardReq
            ))
        }
    }

    React.useEffect(() => {
        routingHandler()
    }, [location])

    return (
        <Outlet />
    )
}
export default RouterWrapper