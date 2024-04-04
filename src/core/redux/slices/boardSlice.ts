import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Board } from '~/core/model/board.model'
import { Card } from '~/core/model/card.model'
import { Column } from '~/core/model/column.model'
import { boardApi } from '~/core/redux/api/board.api'
import { mapOrder } from '~/core/utils/sorts'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/core/utils/formatters'
import { BoardCardCreateResp, BoardColumnCreateResp, BoardColumnMoveReq } from '~/core/services/board-services.model'
import { mapObject } from '~/core/utils/mapper'

export interface BoardState {
    board: Board
    boardId: string
}

const initialState: BoardState = {
    board: {} as Board,
    boardId: '8b23da02-016c-463c-9988-d8ac4fce6718'
}

export const boardSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        save: (state, action: PayloadAction<Board>) => {
            state.board = action.payload
        },
        addColumn: (state, action: PayloadAction<BoardColumnCreateResp>) => {
            const column = mapObject<Column>(action.payload, new Column())
            column.cards = [generatePlaceholderCard(column)]
            column.cardOrderIds = [generatePlaceholderCard(column).id]
            state.board.columns.push(column)
        },
        addCard: (state, action: PayloadAction<BoardCardCreateResp>) => {
            state.board.columns.forEach(column => {
                if (column.id === action.payload.boardColumnId) {
                    if (column.cards.length === 1 && column.cards[0].id === 'placeholder-card') {
                        column.cards = []
                        column.cardOrderIds = []
                    }
                    const card = mapObject<Card>(action.payload, new Card())
                    column.cards = [...column.cards, card]
                    column.cardOrderIds = [...column.cardOrderIds, card.id]
                }
            })
        },
        updateColumnOrderResponse: (state, action: PayloadAction<BoardColumnMoveReq>) => {
            const columnOrderIds = action.payload.columnOrderIds
            const board = state.board
            const sortedColumns = mapOrder([...board.columns], [...columnOrderIds].join(','), 'id')

            state.board.columnOrderIds = columnOrderIds
            state.board.columns = sortedColumns
        },
        updateColumnOrder: (state, action: PayloadAction<Column[]>) => {
            state.board.columnOrderIds = action.payload.map(column => column.id)
            state.board.columns = action.payload
        },
        messageReceived(state, action) {
            // handler
        },
        websocketReady(state, action) {
            // state.readyState = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(boardApi.endpoints.getBoardByCode.matchFulfilled, (state, action) => {
            const board = action.payload
            board.columns = mapOrder(board.columns, board.columnOrderIds, 'id')
            board.columns.forEach((column: Column) => {
                // Khi f5 trang web thì cần xử lý vấn đề kéo thả vào một column rỗng (Nhớ lại video 37.2, code hiện tại là video 69)
                if (isEmpty(column.cards)) {
                    column.cards = [generatePlaceholderCard(column)]
                    column.cardOrderIds = [generatePlaceholderCard(column).id]
                } else {
                    // Sắp xếp thứ tự các cards luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con (video 71 đã giải thích lý do ở phần Fix bug quan trọng)
                    column.cards = mapOrder(column.cards, column.cardOrderIds, 'id')
                }
            })

            state.board = board
        })
    }
})

// Action creators are generated for each case reducer function
export const {
    save,
    addColumn,
    addCard,
    updateColumnOrder,
    updateColumnOrderResponse,
    messageReceived,
    websocketReady
} = boardSlice.actions

export default boardSlice.reducer