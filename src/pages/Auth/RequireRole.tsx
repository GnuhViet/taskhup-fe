import { Outlet, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AuthorToken } from '~/core/model/token.model'
import { useAuthorMutation } from '~/core/redux/api/auth.api'
import { Actions, AuthorRequest, AuthorResponse } from '~/core/services/auth-services.model'
import { addAuthorToken, setAuthorToken } from '~/core/redux/slices/authSlice'
import { useEffect } from 'react'
import { ApiResponse } from '~/core/services/api.model'

import { AbilityContext, getAbility } from '~/core/utils/access-control'
import { jwtDecode } from 'jwt-decode'


const RequireRole = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { workspaceId } = useParams()
    const accessToken = useSelector((state: any) => state.authReducer.token.accessToken)
    const authorToken = (useSelector((state: any) => state.authReducer.token.authorToken) as AuthorToken)
    const authorTokenStore = (useSelector((state: any) => state.authReducer.authorTokenStore) as AuthorToken[])
    const [author, { isLoading }] = useAuthorMutation()

    const fetchData = async (request: AuthorRequest) => {
        const response = await author(request).unwrap() as ApiResponse<AuthorResponse>

        const authorToken = {} as AuthorToken
        authorToken.workspaceId = workspaceId
        authorToken.authorToken = response.data.authorToken

        await dispatch(setAuthorToken(authorToken))
        await dispatch(addAuthorToken(authorToken))
    }

    if (accessToken === undefined || accessToken === null) {
        navigate('/login')
    }


    useEffect(() => {
        if (authorToken === undefined || authorToken === null) {
            const request = {} as AuthorRequest
            request.workspaceId = workspaceId
            request.accessToken = accessToken
            fetchData(request)
            return
        }

        if (authorToken && authorToken.workspaceId !== workspaceId) {
            const findToken = authorTokenStore.find((token) => token.workspaceId === workspaceId)
            if (findToken) {
                dispatch(setAuthorToken(findToken))
            } else {
                const request = {} as AuthorRequest
                request.workspaceId = workspaceId
                request.accessToken = accessToken
                fetchData(request)
            }
        }


    }, [workspaceId])

    if (isLoading) {
        return <div>Loading...</div>
    }

    const buildAbility = (authorToken: AuthorToken) => {
        if (!authorToken) return null
        const decodeToken = jwtDecode(authorToken?.authorToken)
        const actions = decodeToken?.role?.actions

        const permission: { [key: string]: string[] } = {}

        actions.forEach((action: string) => {
            switch (action) {
            case Actions.EDIT_WORKSPACE:
                permission['workspace'] = ['edit']
                break
            case Actions.MANAGE_USER:
                permission['user'] = ['manage']
                break
            case Actions.EDIT_ROLE:
                permission['role'] = ['edit']
                break
            case Actions.EDIT_BOARD:
                permission['board'] = ['edit']
                break
            case Actions.DELETE_BOARD:
                permission['board'] = ['delete']
                break
            case Actions.EDIT_CARD_TEMPLATE:
                permission['cardTemplate'] = ['edit']
                break
            case Actions.EDIT_CARD:
                permission['card'] = ['edit']
                break
            default:
                break
            }
        })
        return getAbility(permission)
    }

    // const decodeToken = jwtDecode(authorToken?.authorToken)

    return (
        <AbilityContext.Provider value={buildAbility(authorToken)}>
            <Outlet />
        </AbilityContext.Provider>  
    )
}
export default RequireRole