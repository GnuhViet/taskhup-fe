import { apiSlice } from '~/core/redux/api/base.api'
import { BoardTemplateCreateRequest } from '~/core/services/board-template-services.model'

const API_URL = '/api/v1/board-template'

export const boardTemplateApi = apiSlice.injectEndpoints({
    endpoints: (builder: any) => ({
        getBoardTemplate: builder.query({
            query: (boardId: string) => ({
                url: `${API_URL}/${boardId}`,
                method: 'GET'
            })
        }),
        createBoardTemplate: builder.mutation({
            query: (data: BoardTemplateCreateRequest) => ({
                url: `${API_URL}/create`,
                method: 'POST',
                body: data
            })
        }),
        deleteBoardTemplate: builder.mutation({
            query: (data: string) => ({
                url: `${API_URL}/delete/${data}`,
                method: 'POST',
                body: data
            })
        })
    })
})

export const {
    useGetBoardTemplateQuery,
    useCreateBoardTemplateMutation,
    useDeleteBoardTemplateMutation
} = boardTemplateApi