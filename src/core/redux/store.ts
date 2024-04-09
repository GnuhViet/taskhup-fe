import { configureStore } from '@reduxjs/toolkit'
import { boardApi } from './api/board.api'
import boardSlice from './slices/boardSlice'
import homeSlice from './slices/homeSlice'

export const store = configureStore({
    reducer: {
        boardReducer: boardSlice,
        [boardApi.reducerPath]: boardApi.reducer,
        homeReducer: homeSlice
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(boardApi.middleware)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch