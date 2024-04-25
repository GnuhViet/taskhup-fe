import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_ROOT } from '~/core/utils/constants'
import { setCredentials, logOut } from '~/core/redux/slices/authSlice'
import { RootState } from '../store'

const baseQuery = fetchBaseQuery({
    baseUrl: API_ROOT,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).authReducer.token.accessToken
        const authorToken = (getState() as RootState).authReducer.token.authorToken
        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }
        if (authorToken) {
            headers.set('X-author', `${authorToken.authorToken}`)
        }
        return headers
    }
})

// Re-fresh token if 403 error
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result?.error?.status === 403) {
        // get the refresh token from the store
        const refreshToken = api.getState().authReducer.token.refreshToken
        // if no refresh token, log out
        if (!refreshToken) {
            api.dispatch(logOut())
            return result
        }
        // send refresh token to post api/v1/auth/refresh
        const refreshResult = await baseQuery({
            url: '/api/v1/auth/refresh',
            method: 'POST',
            body: { refreshToken }
        }, api, extraOptions)

        // if refresh token is expired, log out
        if (refreshResult?.error?.status === 401) {
            api.dispatch(logOut())
            return result
        }

        // set new token
        if (refreshResult?.data) {
            // store the new token
            api.dispatch(setCredentials(refreshResult.data))
            // retry the original query with new access token
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logOut())
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    refetchOnMountOrArgChange: true,
    endpoints: builder => ({})
})