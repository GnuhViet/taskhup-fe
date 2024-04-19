import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { boardApi } from '../api/board.api'
import { Board } from '~/core/model/board.model'
import { WorkSpace } from '~/core/model/workspace.model'
import { workspaceApi } from '../api/workspace.api'
import { GetWorkSpaceResp } from '~/core/services/workspace-services.model'
import { ApiResponse } from '~/core/services/api.model'

export interface BoardState {
    selectedButtonId: string
    workspace: WorkSpace[]
    board: Board[]
    newWorkspaceCreated: boolean
}

const initialState: BoardState = {
    selectedButtonId: '-1',
    workspace: [],
    board: [],
    newWorkspaceCreated: false
}

export const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        setSelectedButtonId: (state, action: PayloadAction<string>) => {
            state.selectedButtonId = action.payload
        },
        addCreatedWorkSpace: (state, action: PayloadAction<WorkSpace>) => {
            const workspace = { ...action.payload } as WorkSpace
            workspace.type = 'JOINED'
            state.workspace = [...state.workspace, workspace]
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(boardApi.endpoints.getAllBoard.matchFulfilled, (state, action) => {
            const board = action.payload?.data
            state.board = board
        })
        builder.addMatcher(workspaceApi.endpoints.getUserWorkSpace.matchFulfilled, (state, action) => {
            const apiResp = action.payload as ApiResponse<GetWorkSpaceResp>

            const resp = { ...apiResp?.data } as GetWorkSpaceResp
            const workspace = [...resp.joinedWorkSpaces, ...resp.guestWorkSpaces]
            state.workspace = workspace
        })
    }
})

export const {
    setSelectedButtonId,
    addCreatedWorkSpace
} = homeSlice.actions

export default homeSlice.reducer