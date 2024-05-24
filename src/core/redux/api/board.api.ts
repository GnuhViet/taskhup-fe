import { API_ROOT } from '~/core/utils/constants'
const API_URL = 'api/v1/board'

import { apiSlice } from '~/core/redux/api/base.api'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Board } from '../../model/board.model'
import { create } from 'lodash'
import { BoardCreateReq } from '~/core/services/board-services.model'

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
        getBoardByCode: builder.query({
            query: (code: string) => ({
                url: `${API_URL}/${code}`,
                method: 'GET'
            })
        }),
        getUserWorkspaceBoard: builder.query({
            query: (workspaceId: string) => ({
                url: `${API_URL}/workspace-boards/${workspaceId}`,
                method: 'GET'
            })
        }),
        getAllBoard: builder.query({
            query: () => ({
                url: `${API_URL}`,
                method: 'GET'
            })
        }),
        createBoard: builder.mutation({
            query: (data: BoardCreateReq) => ({
                url: `${API_URL}`,
                method: 'POST',
                body: data
            })
        })
    })
})

// export const {
//     useLoginMutation
// } = authApiSlice

export const {
    useGetBoardByCodeQuery,
    useLazyGetBoardByCodeQuery,
    useGetAllBoardQuery,
    useCreateBoardMutation
} = boardApi