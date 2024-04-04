import { API_ROOT } from '~/core/utils/constants'
const API_URL = 'api/v1/board'

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Board } from '../../model/board.model'

export type Channel = 'redux' | 'general'

export const boardApi = createApi({
    reducerPath: 'boardApi',
    baseQuery: fetchBaseQuery({ baseUrl: API_ROOT }),
    endpoints: (builder) => ({
        getBoardByCode: builder.query<Board, string>({
            query: (code) => ({
                url: `${API_URL}/${code}`,
                method: 'GET'
            })
        })
    })
})

export const { useGetBoardByCodeQuery } = boardApi