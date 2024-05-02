import { apiSlice } from '~/core/redux/api/base.api'
// import { WorkSpaceCreateReq } from '~/core/services/workspace-services.model'

const API_URL = '/api/v1/role'

export const roleApi = apiSlice.injectEndpoints({
    endpoints: (builder: any) => ({
        getWorkspaceRoles: builder.query({
            query: () => ({
                url: API_URL,
                method: 'GET'
            })
        }),
        // createWorkspace: builder.mutation({
        //     query: (data: WorkSpaceCreateReq) => ({
        //         url: API_URL,
        //         method: 'POST',
        //         body: data
        //     })
        // })
    })
})

export const {
    // useCreateWorkspaceMutation,
    useGetWorkspaceRolesQuery
} = roleApi