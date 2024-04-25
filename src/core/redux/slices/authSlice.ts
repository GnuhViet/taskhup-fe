import { createSlice } from '@reduxjs/toolkit'
import { AuthorToken, Token } from '~/core/model/token.model'
import { AuthenticationResponse } from '~/core/services/auth-services.model'

export interface AuthState {
    token: Token
    authorTokenStore: AuthorToken[]
}

const initialState: AuthState = {
    token: {} as Token,
    authorTokenStore: []
}

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setCredentials: (state, action) => {
            const token = action.payload as AuthenticationResponse
            state.token.accessToken = token.accessToken
            state.token.refreshToken = token.refreshToken
            state.token.authorToken = null
            localStorage.setItem('auth-token', JSON.stringify(token))
        },
        logOut: (state) => {
            state.token.accessToken = null
            state.token.refreshToken = null
            state.token.authorToken = null
            localStorage.removeItem('auth-token')
        },
        setAuthorToken: (state, action) => {
            state.token.authorToken = action.payload as AuthorToken
        },
        addAuthorToken: (state, action) => {
            const token = action.payload as AuthorToken
            state.authorTokenStore = [...state.authorTokenStore, token]
        }
    }
})

export const {
    setCredentials,
    setAuthorToken,
    addAuthorToken,
    logOut
} = authSlice.actions

export default authSlice.reducer

// export const selectCurrentUser = (state: any) => state.authReducer.token..user
// export const selectCurrentToken = (state: any) => state.auth.token