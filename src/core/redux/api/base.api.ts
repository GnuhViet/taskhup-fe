import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_ROOT } from '~/core/utils/constants'
import { setCredentials, logOut } from '~/core/redux/slices/authSlice'
import { RootState } from '../store'

const baseQuery = fetchBaseQuery({
    baseUrl: API_ROOT,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).authReducer.token.accessToken
        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    const result = await baseQuery(args, api, extraOptions)

    // if (result?.error?.originalStatus === 403) {
    //     console.log('sending refresh token')
    //     // send refresh token to get new access token
    //     const refreshResult = await baseQuery('/refresh', api, extraOptions)
    //     console.log(refreshResult)
    //     if (refreshResult?.data) {
    //         const user = api.getState().auth.user
    //         // store the new token
    //         api.dispatch(setCredentials({ ...refreshResult.data, user }))
    //         // retry the original query with new access token
    //         result = await baseQuery(args, api, extraOptions)
    //     } else {
    //         api.dispatch(logOut())
    //     }
    // }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    refetchOnMountOrArgChange: true,
    endpoints: builder => ({})
})