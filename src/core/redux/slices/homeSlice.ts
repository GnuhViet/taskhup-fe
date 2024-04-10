import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { boardApi } from '../api/board.api'
import { Board } from '~/core/model/board.model'

export interface BoardState {
    selectedButtonId: string
    board: Board[]
}

const initialState: BoardState = {
    selectedButtonId: '-1',
    board: []
}

export const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        setSelectedButtonId: (state, action: PayloadAction<string>) => {
            state.selectedButtonId = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(boardApi.endpoints.getAllBoard.matchFulfilled, (state, action) => {
            const board = action.payload?.data
            state.board = board
        })
    }
})

export const {
    setSelectedButtonId
} = homeSlice.actions

export default homeSlice.reducer