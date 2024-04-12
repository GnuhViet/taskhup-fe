import { configureStore } from '@reduxjs/toolkit'
import { boardApi } from './api/board.api'
import boardSlice from './slices/boardSlice'
import authSlice from './slices/authSlice'
import homeSlice from './slices/homeSlice'
import { apiSlice } from '~/core/redux/api/base.api'

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        boardReducer: boardSlice,
        authReducer: authSlice,
        homeReducer: homeSlice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch