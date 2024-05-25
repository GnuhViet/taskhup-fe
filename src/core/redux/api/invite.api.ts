import { apiSlice } from '~/core/redux/api/base.api'
import { SendEmailInviteLinkReq } from '~/core/services/invite-services.model'
import { WorkSpaceCreateReq } from '~/core/services/workspace-services.model'

const API_URL = '/api/v1/invite'

export const inviteApi = apiSlice.injectEndpoints({
    endpoints: (builder: any) => ({
        createInviteLink: builder.mutation({
            query: (data: WorkSpaceCreateReq) => ({
                url: `${API_URL}/create`,
                method: 'POST',
                body: data
            })
        }),
        joinWorkspace: builder.query({
            query: (id: string) => ({
                url: `${API_URL}/join/${id}`,
                method: 'GET'
            })
        }),
        getInviteLink: builder.query({
            query: () => ({
                url: API_URL,
                method: 'GET'
            })
        }),
        sendLinkViaEmail: builder.mutation({
            query: (data: SendEmailInviteLinkReq) => ({
                url: `${API_URL}/send-email`,
                method: 'POST',
                body: data
            })
        })
    })
})

export const {
    useCreateInviteLinkMutation,
    useGetInviteLinkQuery,
    useJoinWorkspaceQuery,
    useSendLinkViaEmailMutation
} = inviteApi