import { apiSlice } from '~/core/redux/api/base.api'
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
        })
    })
})

export const {
    useCreateInviteLinkMutation,
    useGetInviteLinkQuery,
    useJoinWorkspaceQuery
} = inviteApi