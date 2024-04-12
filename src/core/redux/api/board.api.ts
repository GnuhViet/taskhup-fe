import { API_ROOT } from '~/core/utils/constants'
const API_URL = 'api/v1/board'

import { apiSlice } from '~/core/redux/api/base.api'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Board } from '../../model/board.model'

export type Channel = 'redux' | 'general'

// export const boardApi = createApi({
//     reducerPath: 'boardApi',
//     baseQuery: fetchBaseQuery({ baseUrl: API_ROOT }),
//     refetchOnMountOrArgChange: true,

//     endpoints: (builder) => ({
//         getBoardByCode: builder.query<Board, string>({
//             query: (code) => ({
//                 url: `${API_URL}/${code}`,
//                 method: 'GET'
//             })
//         }),
//         getAllBoard: builder.query<Board[], void>({
//             query: () => ({
//                 url: `${API_URL}`,
//                 method: 'GET'
//             })
//         })
//     })
// })

export const boardApi = apiSlice.injectEndpoints({
    endpoints: (builder: any) => ({
        login: builder.mutation({
            query: (credentials: any) => ({ //TODO request type
                url: '/api/v1/auth/login',
                method: 'POST',
                body: {
                    username: credentials.user,
                    password: credentials.pwd
                }
            })
        }),
        getBoardByCode: builder.query({
            query: (code: string) => ({
                url: `${API_URL}/${code}`,
                method: 'GET'
            })
        }),
        getAllBoard: builder.query({
            query: () => ({
                url: `${API_URL}`,
                method: 'GET'
            })
        })
    })
})

// export const {
//     useLoginMutation
// } = authApiSlice

export const {
    useGetBoardByCodeQuery,
    useGetAllBoardQuery
} = boardApi