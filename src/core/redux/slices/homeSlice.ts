import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { boardApi } from '../api/board.api'
import { Board } from '~/core/model/board.model'
import { WorkSpace } from '~/core/model/workspace.model'
import { workspaceApi } from '../api/workspace.api'
import { GetWorkSpaceResp } from '~/core/services/workspace-services.model'
import { ApiResponse } from '~/core/services/api.model'
import { BoardCreateResp, RecentBoardReq } from '~/core/services/board-services.model'
import { mapObject } from '~/core/utils/mapper'
import { set } from 'lodash'
import { userApi } from '../api/user.api'
import { UserInfoResponse } from '~/core/services/user-services.model'
import { enableMapSet } from 'immer'
import { isBlank } from '~/core/utils/data-utils'

enableMapSet()

export interface BoardState {
    selectedButtonId: string
    workspace: WorkSpace[]
    currentActiveWorkspaceId: string
    userInfo: UserInfoResponse
    starredBoard: any[]
    recentBoard: Board[]
    isPrefetchWorkspace: boolean
}

const initialState: BoardState = {
    selectedButtonId: '-1',
    workspace: [],
    currentActiveWorkspaceId: '',
    userInfo: null,
    starredBoard: [],
    recentBoard: null,
    isPrefetchWorkspace: false
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
        },
        addRecentBoard: (state, action: PayloadAction<RecentBoardReq>) => {
            const recentBoard = { ...action.payload } as RecentBoardReq

            let boardItem = {} as any

            state.workspace.forEach((workspace) => {
                workspace.boards.forEach((board) => {
                    if (board.id === recentBoard.boardId) {
                        boardItem = { ...board }
                    }
                })
            })

            if (!boardItem) return

            boardItem.workspaceId = recentBoard.workspaceId

            if (isBlank(boardItem.id)) return

            // Convert Set to Array
            try {
                const recentBoardArray = [...state.recentBoard]

                // Remove the null from the array if it exists
                if (recentBoardArray[0] === null) recentBoardArray.shift()

                if (recentBoardArray.length > 0) {
                    // Check if the board already exists in the Set
                    const existingIndex = recentBoardArray.findIndex(board => board.id === recentBoard.boardId)

                    // If it exists, remove it from its current position
                    if (existingIndex > -1) {
                        recentBoardArray.splice(existingIndex, 1)
                    }
                }

                // Add the new board to the start of the array
                recentBoardArray.unshift(boardItem)

                // If the array's length exceeds 6, remove the last element
                if (recentBoardArray.length > 6) {
                    recentBoardArray.pop()
                }

                // save to local storage
                localStorage.setItem('recent-board', JSON.stringify(recentBoardArray))
                // Convert the array back to a Set and assign it to state.recentBoard
                state.recentBoard = [...recentBoardArray]
            } catch (error) {
                console.error(error)
            }

        },
        loadRecentBoard: (state) => {
            const recentBoardArray = JSON.parse(localStorage.getItem('recent-board')) || []
            state.recentBoard = [...recentBoardArray]
        },
        setPrefetchWorkspace: (state) => {
            state.isPrefetchWorkspace = true
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

            const listStarredBoard = [] as Board[]
            resp.joinedWorkSpaces.forEach((workspace) => {
                workspace.boards.forEach((board) => {
                    if (board.isStarred) {
                        listStarredBoard.push({
                            ...board,
                            workspaceId: workspace.id
                        } as any)
                    }
                })
            })

            resp.guestWorkSpaces.forEach((workspace) => {
                workspace.boards.forEach((board) => {
                    if (board.isStarred) {
                        listStarredBoard.push({
                            ...board,
                            workspaceId: workspace.id
                        } as any)
                    }
                })
            })

            state.workspace = workspace
            state.starredBoard = listStarredBoard
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
    addCreatedBoard,
    addRecentBoard,
    loadRecentBoard,
    setPrefetchWorkspace,
} = homeSlice.actions

export default homeSlice.reducer