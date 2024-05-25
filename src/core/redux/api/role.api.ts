import { apiSlice } from '~/core/redux/api/base.api'
import { ChangeMemberRoleReq, RoleCreateReq, RoleUpdateReq } from '~/core/services/role-services.model'
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
        createRole: builder.mutation({
            query: (data: RoleCreateReq) => ({
                url: `${API_URL}/create`,
                method: 'POST',
                body: data
            })
        }),
        updateRole: builder.mutation({
            query: (data: RoleUpdateReq) => ({
                url: `${API_URL}/update`,
                method: 'POST',
                body: data
            })
        }),
        changeMemberRole: builder.mutation({
            query: (data: ChangeMemberRoleReq) => ({
                url: `${API_URL}/change-member-role`,
                method: 'POST',
                body: data
            })
        })
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
    useGetWorkspaceRolesQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useChangeMemberRoleMutation
} = roleApi