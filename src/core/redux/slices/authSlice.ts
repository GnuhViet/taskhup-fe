import { createSlice } from '@reduxjs/toolkit'
import { Token } from '~/core/model/token.model'
import { AuthenticationResponse } from '~/core/services/auth-services.model'

export interface AuthState {
    token: Token
}

const initialState: AuthState = {
    token: {} as Token
}

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setCredentials: (state, action) => {
            const token = action.payload as AuthenticationResponse
            state.token.accessToken = token.accessToken
            state.token.refreshToken = token.refreshToken

            localStorage.setItem('auth-token', JSON.stringify(token))
        },
        logOut: (state) => {
            state.token.accessToken = null
            state.token.refreshToken = null
            localStorage.removeItem('auth-token')
        }
    }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

// export const selectCurrentUser = (state: any) => state.authReducer.token..user
// export const selectCurrentToken = (state: any) => state.auth.token