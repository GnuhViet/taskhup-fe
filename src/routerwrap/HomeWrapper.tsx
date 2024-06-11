import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation } from 'react-router-dom'
import { useLazyGetUserWorkSpaceQuery } from '~/core/redux/api/workspace.api'
import { setPrefetchWorkspace } from '~/core/redux/slices/homeSlice'

const HomeWrapper = () => {
    const [triggerGetWp] = useLazyGetUserWorkSpaceQuery()
    const isPrefetchWorkspace = useSelector((state: any) => state.homeReducer.isPrefetchWorkspace)
    const dispatch = useDispatch()
    const location = useLocation()

    const fetchWs = async () => {
        await triggerGetWp({})
        await dispatch(setPrefetchWorkspace())
    }

    React.useEffect(() => {
        if (location.pathname.includes('/home')) {
            dispatch(setPrefetchWorkspace())
            return
        }

        if (!isPrefetchWorkspace) {
            fetchWs()
        }
    }, [isPrefetchWorkspace])

    return (
        <Outlet />
    )
}
export default HomeWrapper