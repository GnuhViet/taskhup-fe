import { apiSlice } from '~/core/redux/api/base.api'
import { AuthenticationRequest } from '~/core/services/auth-services.model'

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder: any) => ({
        login: builder.mutation({
            query: (credentials: AuthenticationRequest) => ({ //TODO request type
                url: '/api/v1/auth/login',
                method: 'POST',
                body: credentials
            })
        })
    }),
    overrideExisting: true
})

export const {
    useLoginMutation
} = authApiSlice