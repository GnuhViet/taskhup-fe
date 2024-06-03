import { API_ROOT } from '~/core/utils/constants'
const API_URL = 'api/v1/board'

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Board } from '../../model/board.model'

export const boardApi = createApi({
    reducerPath: 'boardApi',
    baseQuery: fetchBaseQuery({ baseUrl: API_ROOT }),
    refetchOnMountOrArgChange: true,
    endpoints: (builder) => ({
        getBoardByCode: builder.query<Board, string>({
            query: (code) => ({
                url: `${API_URL}/${code}`,
                method: 'GET'
            })
        }),
        getAllBoard: builder.query<Board[], void>({
            query: () => ({
                url: `${API_URL}`,
                method: 'GET'
            })
        })
    })
})

export const { useGetBoardByCodeQuery, useGetAllBoardQuery } = boardApi