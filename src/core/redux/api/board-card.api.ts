import { apiSlice } from '~/core/redux/api/base.api'
import { SelectFieldRequest, SelectLabelRequest, SelectTemplateRequest, UpdateCheckListRequest, UpdateCheckListValueReq, UpdateFieldValueRequest, UpdateWatchCardReq } from '~/core/services/board-card-services.model'

const API_URL = '/api/v1/board-card'

export const boardCardApi = apiSlice.injectEndpoints({
    endpoints: (builder: any) => ({
        getCardDetails: builder.query({
            query: (cardId: string) => ({
                url: `${API_URL}/card-details`,
                method: 'POST',
                body: {
                    boardCardId: cardId
                }
            })
        }),
        selectTemplate: builder.mutation({
            query: (data: SelectTemplateRequest) => ({
                url: `${API_URL}/select-template`,
                method: 'POST',
                body: data
            })
        }),
        selectLabel: builder.mutation({
            query: (data: SelectLabelRequest) => ({
                url: `${API_URL}/select-label`,
                method: 'POST',
                body: data
            })
        }),
        selectField: builder.mutation({
            query: (data: SelectFieldRequest) => ({
                url: `${API_URL}/select-field`,
                method: 'POST',
                body: data
            })
        }),
        updateFieldValue: builder.mutation({
            query: (data: UpdateFieldValueRequest) => ({
                url: `${API_URL}/update-field-value`,
                method: 'POST',
                body: data
            })
        }),
        updateMembers: builder.mutation({
            query: (data: UpdateFieldValueRequest) => ({
                url: `${API_URL}/update-members`,
                method: 'POST',
                body: data
            })
        }),
        updateWatchCard: builder.mutation({
            query: (data: UpdateWatchCardReq) => ({
                url: `${API_URL}/update-watch`,
                method: 'POST',
                body: data
            })
        }),
        updateCheckList: builder.mutation({
            query: (data: UpdateCheckListRequest) => ({
                url: `${API_URL}/update-checklist`,
                method: 'POST',
                body: data
            })
        }),
        updateCheckListValue: builder.mutation({
            query: (data: UpdateCheckListValueReq) => ({
                url: `${API_URL}/update-checklist-value`,
                method: 'POST',
                body: data
            })
        })
    })
})

export const {
    useLazyGetCardDetailsQuery,
    useSelectTemplateMutation,
    useSelectLabelMutation,
    useSelectFieldMutation,
    useUpdateFieldValueMutation,
    useUpdateMembersMutation,
    useUpdateWatchCardMutation,
    useUpdateCheckListMutation,
    useUpdateCheckListValueMutation
} = boardCardApi