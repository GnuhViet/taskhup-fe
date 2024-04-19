import { apiSlice } from '~/core/redux/api/base.api'
import { WorkSpaceCreateReq } from '~/core/services/workspace-services.model'

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
        })
    })
})

export const {
    useCreateWorkspaceMutation,
    useGetUserWorkSpaceQuery
} = workspaceApi