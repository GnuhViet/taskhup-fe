import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { boardApi } from '../api/board.api'
import { Board } from '~/core/model/board.model'
import { WorkSpace } from '~/core/model/workspace.model'
import { workspaceApi } from '../api/workspace.api'
import { GetWorkSpaceResp } from '~/core/services/workspace-services.model'
import { ApiResponse } from '~/core/services/api.model'
import { BoardCreateResp } from '~/core/services/board-services.model'
import { mapObject } from '~/core/utils/mapper'
import { set } from 'lodash'
import { userApi } from '../api/user.api'
import { UserInfoResponse } from '~/core/services/user-services.model'

export interface BoardState {
    selectedButtonId: string
    workspace: WorkSpace[]
    currentActiveWorkspaceId: string
    userInfo: UserInfoResponse
    // board: Board[]
}

const initialState: BoardState = {
    selectedButtonId: '-1',
    workspace: [],
    currentActiveWorkspaceId: '',
    userInfo: null
    // board: [],
}

export const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        setSelectedButtonId: (state, action: PayloadAction<string>) => {
            state.selectedButtonId = action.payload
        },
        setCurrentActiveWorkspaceId: (state, action: PayloadAction<string>) => {
            state.currentActiveWorkspaceId = action.payload
        },
        addCreatedWorkSpace: (state, action: PayloadAction<WorkSpace>) => {
            const workspace = { ...action.payload } as WorkSpace
            workspace.type = 'JOINED'
            state.workspace = [...state.workspace, workspace]
        },
        addCreatedBoard: (state, action: PayloadAction<BoardCreateResp>) => {
            const board = { ...action.payload } as BoardCreateResp
            state.workspace.forEach((workspace) => {
                if (workspace.id === board.workspaceId) {
                    workspace.boards = [...workspace.boards, mapObject<Board>(board, new Board())]
                }
            })
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(boardApi.endpoints.getAllBoard.matchFulfilled, (state, action) => {
            // const board = action.payload?.data
            // state.board = board
        })
        builder.addMatcher(workspaceApi.endpoints.getUserWorkSpace.matchFulfilled, (state, action) => {
            const apiResp = action.payload as ApiResponse<GetWorkSpaceResp>

            const resp = { ...apiResp?.data } as GetWorkSpaceResp
            const workspace = [...resp.joinedWorkSpaces, ...resp.guestWorkSpaces]
            state.workspace = workspace
        })
        builder.addMatcher(userApi.endpoints.getUserInfo.matchFulfilled, (state, action) => {
            const apiResp = action.payload as ApiResponse<UserInfoResponse>

            const resp = { ...apiResp?.data } as UserInfoResponse
            state.userInfo = resp
        })
    }
})

export const {
    setSelectedButtonId,
    addCreatedWorkSpace,
    addCreatedBoard
} = homeSlice.actions

export default homeSlice.reducer