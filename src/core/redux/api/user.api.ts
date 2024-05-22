import { apiSlice } from '~/core/redux/api/base.api'
import { UpdateInfoRequest } from '~/core/services/user-services.model'

const API_URL = '/api/v1/user'

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder: any) => ({
        getUserInfo: builder.query({
            query: () => ({
                url: `${API_URL}/info`,
                method: 'GET'
            })
        }),
        getUserEmailInfo: builder.query({
            query: () => ({
                url: `${API_URL}/email-info`,
                method: 'GET'
            })
        }),
        updateAvatar: builder.mutation({
            query: (data: any) => {
                const formData = new FormData()
                formData.append('file', data)
                return {
                    url: `${API_URL}/update-avatar`,
                    method: 'POST',
                    body: formData,
                    formData: true
                }
            }
        }),
        updateInfo: builder.mutation({
            query: (data: UpdateInfoRequest) => ({
                url: `${API_URL}/update-info`,
                method: 'POST',
                body: data
            })
        })
    })
})

export const {
    useGetUserInfoQuery,
    useLazyGetUserInfoQuery,
    useGetUserEmailInfoQuery,
    useUpdateAvatarMutation,
    useUpdateInfoMutation
} = userApi