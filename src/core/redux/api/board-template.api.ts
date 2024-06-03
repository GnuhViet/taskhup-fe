import { update } from 'lodash'
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
        }),
        getLabels: builder.query({
            query: (data: string) => ({
                url: `${API_URL}/labels/${data}`,
                method: 'GET'
            })
        }),
        createLabel: builder.mutation({
            query: (data: any) => ({
                url: `${API_URL}/labels/create`,
                method: 'POST',
                body: data
            })
        }),
        updateLabel: builder.mutation({
            query: (data: any) => ({
                url: `${API_URL}/labels/update`,
                method: 'POST',
                body: data
            })
        }),
        deleteLabel: builder.mutation({
            query: (data: any) => ({
                url: `${API_URL}/labels/delete`,
                method: 'POST',
                body: data
            })
        })
    })
})

export const {
    useGetBoardTemplateQuery,
    useCreateBoardTemplateMutation,
    useDeleteBoardTemplateMutation,
    useGetLabelsQuery,
    useCreateLabelMutation,
    useUpdateLabelMutation,
    useDeleteLabelMutation
} = boardTemplateApi