import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface BoardState {
    selectedButtonId: string
}

const initialState: BoardState = {
    selectedButtonId: '-1'
}

export const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        setSelectedButtonId: (state, action: PayloadAction<string>) => {
            state.selectedButtonId = action.payload
        }
    }
})

export const {
    setSelectedButtonId
} = homeSlice.actions

export default homeSlice.reducer