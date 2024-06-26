import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Board } from '~/core/model/board.model'
import { Card } from '~/core/model/card.model'
import { Column } from '~/core/model/column.model'
import { boardApi } from '~/core/redux/api/board.api'
import { mapOrder } from '~/core/utils/sorts'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/core/utils/formatters'
import {
    BoardCardCreateResp,
    BoardCardMoveReq,
    BoardColumnCreateResp,
    BoardColumnMoveReq,
    OpenCardDetailRequest
} from '~/core/services/board-services.model'
import { mapObject } from '~/core/utils/mapper'
import { boardTemplateApi } from '../api/board-template.api'

export interface BoardState {
    board: Board
    boardId: string
    disableDrag: boolean
    openCardDetail: boolean
    openCardDetailId: string
    boardTemplate: any
    boardBackground: string
}

const initialState: BoardState = {
    board: {} as Board,
    boardId: null,
    disableDrag: false,
    openCardDetail: false,
    openCardDetailId: null,
    boardTemplate: null,
    boardBackground: null
}

export const boardSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        setBoard: (state, action: PayloadAction<string>) => {
            state.boardId = action.payload
            // state.board = {} as Board
            // console.log('finish set board!!')
        },
        save: (state, action: PayloadAction<Board>) => {
            state.board = action.payload
        },
        addColumn: (state, action: PayloadAction<BoardColumnCreateResp>) => {
            const column = mapObject<Column>(action.payload, new Column())
            column.cards = [generatePlaceholderCard(column)]
            column.cardOrderIds = [generatePlaceholderCard(column).id]
            state.board.columns.push(column)
        },
        updateColum: (state, action: PayloadAction<Column[]>) => {
            state.board.columns = action.payload
        },
        addCard: (state, action: PayloadAction<BoardCardCreateResp>) => {
            state.board.columns.forEach(column => {
                if (column.id === action.payload.columnId) {
                    if (column.cards.length === 1 && column.cards[0].id === 'placeholder-card') {
                        column.cards = []
                        column.cardOrderIds = []
                    }
                    const card = mapObject<Card>(action.payload, new Card())
                    const cardDetail = { } as Card

                    cardDetail.id = card.id
                    cardDetail.title = card.title
                    cardDetail.cover = null
                    cardDetail.fromDate = null
                    cardDetail.deadlineDate = null
                    cardDetail.workingStatus = null
                    cardDetail.isWatchCard = 0
                    cardDetail.commentCount = 0
                    cardDetail.attachmentCount = 0
                    cardDetail.checkListsItems = '[]'
                    cardDetail.selectedLabels = []
                    cardDetail.members = []
                    cardDetail.boardId = card.boardId
                    cardDetail.columnId = card.columnId


                    column.cards = [...column.cards, { ...cardDetail }]
                    column.cardOrderIds = [...column.cardOrderIds, card.id]
                }
            })
        },
        updateColumnOrderResponse: (state, action: PayloadAction<BoardColumnMoveReq>) => {
            const columnOrderIds = action.payload.columnOrderIds
            const board = state.board
            const sortedColumns = mapOrder([...board.columns], [...columnOrderIds], 'id')

            state.board.columnOrderIds = columnOrderIds
            state.board.columns = sortedColumns
        },
        updateCardOrderResponse: (state, action: PayloadAction<BoardCardMoveReq>) => {
            const response = action.payload
            try {
                if (response.fromColumnId == response.toColumnId) {
                    const column = state.board.columns.find(column => column.id === response.fromColumnId)
                    column.cardOrderIds = response.cardOrderIds
                    column.cards = mapOrder(column.cards, response.cardOrderIds, 'id')
                }
                else if (response.fromColumnId !== response.toColumnId) {
                    const fromColumn = state.board.columns.find(column => column.id === response.fromColumnId)
                    const toColumn = state.board.columns.find(column => column.id === response.toColumnId)

                    fromColumn.cardOrderIds = [...fromColumn.cardOrderIds].filter(cardId => cardId !== response.cardId)
                    toColumn.cardOrderIds = [...response.cardOrderIds]

                    const oldCard = fromColumn.cards.find(card => card.id === response.cardId)
                    oldCard.columnId = response.toColumnId

                    fromColumn.cards = fromColumn.cards.filter(card => card.id !== response.cardId)
                    toColumn.cards = [...toColumn.cards.filter(card => card.id !== response.cardId), oldCard]

                    fromColumn.cards = mapOrder(fromColumn.cards, fromColumn.cardOrderIds, 'id')
                    toColumn.cards = mapOrder(toColumn.cards, toColumn.cardOrderIds, 'id')

                    if (isEmpty(fromColumn.cards)) {
                        fromColumn.cards = [generatePlaceholderCard(fromColumn)]
                        fromColumn.cardOrderIds = [generatePlaceholderCard(fromColumn).id]
                    }
                }
            } catch (error) {
                console.log('error!! --- ', error)
            }

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
        },
        setDisableDrag: (state, action: PayloadAction<boolean>) => {
            state.disableDrag = action.payload
        },
        setOpenCardDialog: (state, action: PayloadAction<OpenCardDetailRequest>) => {
            state.openCardDetail = action.payload.open
            state.openCardDetailId = action.payload.cardId
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(boardApi.endpoints.getBoardByCode.matchFulfilled, (state, action) => {

            state.board = null

            const board = JSON.parse(JSON.stringify({ ...action.payload as Board })) // make object not readonly

            board.columnOrderIds = String(board.columnOrderIds).split(',')
            board.columns = mapOrder(board.columns, board.columnOrderIds, 'id')
            board.columns.forEach((column: Column) => {
                // Khi f5 trang web thì cần xử lý vấn đề kéo thả vào một column rỗng (Nhớ lại video 37.2, code hiện tại là video 69)
                if (isEmpty(column.cards)) {
                    column.cards = [generatePlaceholderCard(column)]
                    column.cardOrderIds = [generatePlaceholderCard(column).id]
                } else {
                    column.cardOrderIds = String(column.cardOrderIds).split(',')
                    // Sắp xếp thứ tự các cards luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con (video 71 đã giải thích lý do ở phần Fix bug quan trọng)
                    column.cards = mapOrder(column.cards, column.cardOrderIds, 'id')
                }
            })

            state.board = board
            state.boardBackground = board.color
        }),
            builder.addMatcher(boardTemplateApi.endpoints.getBoardTemplate.matchFulfilled, (state, action) => {
                state.boardTemplate = action.payload?.data
            }),
            builder.addMatcher(boardApi.endpoints.getBoardInfomation.matchFulfilled, (state, action) => {
                state.boardBackground = action.payload?.data?.color
            })
    }
})

// Action creators are generated for each case reducer function
export const {
    setBoard,
    save,
    addColumn,
    updateColum,
    addCard,
    updateColumnOrder,
    updateColumnOrderResponse,
    updateCardOrderResponse,
    messageReceived,
    setDisableDrag,
    websocketReady,
    setOpenCardDialog
} = boardSlice.actions

export default boardSlice.reducer