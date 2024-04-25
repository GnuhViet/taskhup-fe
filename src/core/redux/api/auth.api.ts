import { apiSlice } from '~/core/redux/api/base.api'
import { AuthenticationRequest, AuthorRequest, RegisterRequest } from '~/core/services/auth-services.model'

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder: any) => ({
        login: builder.mutation({
            query: (credentials: AuthenticationRequest) => ({
                url: '/api/v1/auth/login',
                method: 'POST',
                body: credentials
            })
        }),
        author: builder.mutation({
            query: (credentials: AuthorRequest) => ({
                url: '/api/v1/auth/author-workspace',
                method: 'POST',
                body: credentials
            })
        }),
        register: builder.mutation({
            query: (credentials: RegisterRequest) => ({
                url: '/api/v1/auth/register',
                method: 'POST',
                body: credentials
            })
        })
    }),
    overrideExisting: true
})

export const {
    useLoginMutation,
    useAuthorMutation,
    useRegisterMutation
} = authApiSlice