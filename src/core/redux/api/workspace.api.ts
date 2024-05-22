import { apiSlice } from '~/core/redux/api/base.api'
import { JoinRequestADRequest, WorkSpaceCreateReq } from '~/core/services/workspace-services.model'

const API_URL = '/api/v1/workspace'

export const workspaceApi = apiSlice.injectEndpoints({
    endpoints: (builder: any) => ({
        createWorkspace: builder.mutation({
            query: (data: WorkSpaceCreateReq) => ({
                url: API_URL,
                method: 'POST',
                body: data
            })
        }),
        getUserWorkSpace: builder.query({
            query: () => ({
                url: API_URL,
                method: 'GET'
            })
        }),
        getWorkspaceMember: builder.query({
            query: () => ({
                url: `${API_URL}/members`,
                method: 'GET'
            })
        }),
        getWorkspaceJoinRequest: builder.query({
            query: () => ({
                url: `${API_URL}/join-request`,
                method: 'GET'
            })
        }),
        acceptWorkspaceMember: builder.mutation({
            query: (data: JoinRequestADRequest) => ({
                url: `${API_URL}/join-request/accept`,
                method: 'POST',
                body: data
            })
        }),
        denyWorkspaceMember: builder.mutation({
            query: (data: JoinRequestADRequest) => ({
                url: `${API_URL}/join-request/deny`,
                method: 'POST',
                body: data
            })
        })
    })
})

export const {
    useCreateWorkspaceMutation,
    useGetUserWorkSpaceQuery,
    useGetWorkspaceMemberQuery,
    useGetWorkspaceJoinRequestQuery,
    useAcceptWorkspaceMemberMutation,
    useDenyWorkspaceMemberMutation
} = workspaceApi