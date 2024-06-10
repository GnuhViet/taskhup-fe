import { apiSlice } from '~/core/redux/api/base.api'
import { CreateCommentReq, DeleteAttachmentReq, DeleteCommentReq, EditCommentContentReq, RemoveCardCoverReq, SelectFieldRequest, SelectLabelRequest, SelectTemplateRequest, UpdateCardCoverReq, UpdateCardDateReq, UpdateCardTitleRequest, UpdateCheckListRequest, UpdateCheckListValueReq, UpdateDescriptionReq, UpdateFieldValueRequest, UpdateWatchCardReq, UpdateWorkingStatusReq, UploadAttachmentReq } from '~/core/services/board-card-services.model'

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
        getCardAllHistory: builder.query({
            query: (cardId: string) => ({
                url: `${API_URL}/card-history`,
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
        }),
        updateCardCover: builder.mutation({
            query: (data: UpdateCardCoverReq) => {
                const formData = new FormData()
                formData.append('file', data.file)
                formData.append('boardCardId', data.boardCardId)

                return {
                    url: `${API_URL}/update-cover`,
                    method: 'POST',
                    body: formData
                }
            }
        }),
        removeCardCover: builder.mutation({
            query: (data: RemoveCardCoverReq) => {
                return {
                    url: `${API_URL}/remove-cover`,
                    method: 'POST',
                    body: data
                }
            }
        }),
        updateCardDate: builder.mutation({
            query: (data: UpdateCardDateReq) => ({
                url: `${API_URL}/update-card-date`,
                method: 'POST',
                body: data
            })
        }),
        updateWorkingStatus: builder.mutation({
            query: (data: UpdateWorkingStatusReq) => ({
                url: `${API_URL}/update-working-status`,
                method: 'POST',
                body: data
            })
        }),
        updateDescription: builder.mutation({
            query: (data: UpdateDescriptionReq) => ({
                url: `${API_URL}/update-description`,
                method: 'POST',
                body: data
            })
        }),
        updateCardTitle: builder.mutation({
            query: (data: UpdateCardTitleRequest) => ({
                url: `${API_URL}/update-title`,
                method: 'POST',
                body: data
            })
        }),
        uploadAttachment: builder.mutation({
            query: (data: UploadAttachmentReq) => {
                const formData = new FormData()
                formData.append('file', data.file)
                formData.append('displayName', data.displayName)
                formData.append('type', data.type)
                formData.append('refId', data.refId)

                return {
                    url: `${API_URL}/upload-attachment`,
                    method: 'POST',
                    body: formData
                }
            }
        }),
        deleteAttachment: builder.mutation({
            query: (data: DeleteAttachmentReq) => ({
                url: `${API_URL}/delete-upload-attachment`,
                method: 'POST',
                body: data
            })
        }),
        createComment: builder.mutation({
            query: (data: CreateCommentReq) => ({
                url: `${API_URL}/create-comment`,
                method: 'POST',
                body: data
            })
        }),
        editCommentContent: builder.mutation({
            query: (data: EditCommentContentReq) => ({
                url: `${API_URL}/edit-comment-content`,
                method: 'POST',
                body: data
            })
        }),
        deleteCardComment: builder.mutation({
            query: (data: DeleteCommentReq) => ({
                url: `${API_URL}/delete-comment`,
                method: 'POST',
                body: data
            })
        })
    })
})

export const {
    useLazyGetCardDetailsQuery,
    useLazyGetCardAllHistoryQuery,
    useSelectTemplateMutation,
    useSelectLabelMutation,
    useSelectFieldMutation,
    useUpdateFieldValueMutation,
    useUpdateMembersMutation,
    useUpdateWatchCardMutation,
    useUpdateCheckListMutation,
    useUpdateCheckListValueMutation,
    useUpdateCardCoverMutation,
    useRemoveCardCoverMutation,
    useUpdateCardDateMutation,
    useUpdateWorkingStatusMutation,
    useUpdateDescriptionMutation,
    useUpdateCardTitleMutation,
    useUploadAttachmentMutation,
    useDeleteAttachmentMutation,
    useCreateCommentMutation,
    useEditCommentContentMutation,
    useDeleteCardCommentMutation
} = boardCardApi