import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBarFC from './BoardBar/BoardBarFC'
import BoardContentFC from './BoardContent/BoardContentFC'
import { mapOrder } from '~/core/utils/sorts'

// import { mockData } from '~/apis/mock-data'
import {
    fetchBoardDetailsAPI,
    createNewColumnAPI,
    createNewCardAPI,
    updateBoardDetailsAPI,
    updateColumnDetailsAPI,
    moveCardToDifferentColumnAPI,
    deleteColumnDetailsAPI
} from '~/core/redux/api'
import { generatePlaceholderCard } from '~/core/utils/formatters'
import { isEmpty } from 'lodash'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'
import React from 'react'
import { Column } from '~/core/model/column.model'
import { Card } from '~/core/model/card.model'

import { useGetBoardByCodeQuery } from '~/core/redux/api/board.api'
import { useDispatch, useSelector } from 'react-redux'
import { getAllBoard, getBoard, handleSocketEvent } from '~/core/services/board-services'
import { addColumn, save } from '~/core/redux/slices/boardSlice'
import { StompSessionProvider, useSubscription } from 'react-stomp-hooks'

const BoardComponent: React.FC = () => {

    const dispatch = useDispatch()
    // const board = useSelector((state: any) => state.boardReducer.board)
    const boardId = useSelector((state: any) => state.boardReducer.boardId)
    const token = useSelector((state: any) => state.authReducer.token.accessToken)
    const boardState = useSelector((state: any) => state.boardReducer)

    // useEffect(() => {
    //   getBoard('6943ab14-fe4e-4b0f-8df0-383a89606436').then((response) => {
    //     console.log('response: ', response)
    //     dispatch(save(response))
    //   })
    // }, [])

    const { data: board, error, isLoading } = useGetBoardByCodeQuery(boardId)


    // useEffect(() => {
    //     if (board) {
    //         console.log('boardResp: ', board)
    //         // board = boardResp;
    //         // dispatch(save(boardResp))
    //     }
    // }, [board])

    useSubscription(`/topic/board/${boardId}`, (message) => {
        handleSocketEvent(message, dispatch)
    })

    // useSubscription('/app/board/73133675-cf43-4ef0-b5e5-6d1564ef0355', (message) => {
    //   console.log('message: ', message)
    // })

    // useEffect(() => {
    //   // Tạm thời fix cứng boardId, flow chuẩn chỉnh về sau khi học nâng cao trực tiếp với mình là chúng ta sẽ sử dụng react-router-dom để lấy chuẩn boardId từ URL về.
    //   // const boardId = '65f2cb946e52e4ce0f5ebd54'
    //   // // Call API
    //   // fetchBoardDetailsAPI(boardId).then(board => {

    //   //   // Sắp xếp thứ tự các column luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con (video 71 đã giải thích lý do ở phần Fix bug quan trọng)
    //   //   board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

    //   //   board.columns.forEach((column: Column) => {
    //   //     // Khi f5 trang web thì cần xử lý vấn đề kéo thả vào một column rỗng (Nhớ lại video 37.2, code hiện tại là video 69)
    //   //     if (isEmpty(column.cards)) {
    //   //       column.cards = [generatePlaceholderCard(column)]
    //   //       column.cardOrderIds = [generatePlaceholderCard(column)._id]
    //   //     } else {
    //   //       // Sắp xếp thứ tự các cards luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con (video 71 đã giải thích lý do ở phần Fix bug quan trọng)
    //   //       column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
    //   //     }
    //   //   })

    //   //   setBoard(board)
    //   // })
    //   // setBoard(data)
    // }, [])


    // Func này có nhiệm vụ gọi API tạo mới ColumnFC và làm lại dữ liệu State Board
    // const createNewColumn = async (newColumnData: Column) => {
    //   const createdColumn = await createNewColumnAPI({
    //     ...newColumnData,
    //     boardId: board.id
    //   })
    //
    //   // Khi tạo column mới thì nó sẽ chưa có card, cần xử lý vấn đề kéo thả vào một column rỗng (Nhớ lại video 37.2, code hiện tại là video 69)
    //   createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    //   createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]
    //
    //   // Cập nhật state board
    //   // Phía Front-end chúng ta phải tự làm đúng lại state data board (thay vì phải gọi lại api fetchBoardDetailsAPI)
    //   // Lưu ý: cách làm này phụ thuộc vào tùy lựa chọn và đặc thù dự án, có nơi thì BE sẽ hỗ trợ trả về luôn toàn bộ Board dù đây có là api tạo ColumnFC hay Card đi chăng nữa. => Lúc này FE sẽ nhàn hơn.
    //   const newBoard = { ...board }
    //   newBoard.columns.push(createdColumn)
    //   newBoard.columnOrderIds.push(createdColumn._id)
    //   // setBoard(newBoard)
    // }

    // Func này có nhiệm vụ gọi API tạo mới Card và làm lại dữ liệu State Board
    // const createNewCard = async (newCardData: Card) => {
    //   const createdCard = await createNewCardAPI({
    //     ...newCardData,
    //     boardId: board.id
    //   })
    //
    //   // Cập nhật state board
    //   // Phía Front-end chúng ta phải tự làm đúng lại state data board (thay vì phải gọi lại api fetchBoardDetailsAPI)
    //   // Lưu ý: cách làm này phụ thuộc vào tùy lựa chọn và đặc thù dự án, có nơi thì BE sẽ hỗ trợ trả về luôn toàn bộ Board dù đây có là api tạo ColumnFC hay Card đi chăng nữa. => Lúc này FE sẽ nhàn hơn.
    //   const newBoard = { ...board }
    //   const columnToUpdate = newBoard.columns.find((column: Column) => column._id === createdCard.columnId)
    //   if (columnToUpdate) {
    //     // Nếu column rỗng: bản chất là đang chứa một cái Placeholder card (Nhớ lại video 37.2, hiện tại là video 69)
    //     if (columnToUpdate.cards.some((card: { FE_PlaceholderCard: any }) => card.FE_PlaceholderCard)) {
    //       columnToUpdate.cards = [createdCard]
    //       columnToUpdate.cardOrderIds = [createdCard._id]
    //     } else {
    //       // Ngược lại ColumnFC đã có data thì push vào cuối mảng
    //       columnToUpdate.cards.push(createdCard)
    //       columnToUpdate.cardOrderIds.push(createdCard._id)
    //     }
    //   }
    //   // setBoard(newBoard)
    // }

    /**
     * Func này có nhiệm vụ gọi API và xử lý khi kéo thả ColumnFC xong xuôi
     * Chỉ cần gọi API để cập nhật mảng columnOrderIds của Board chứa nó (thay đổi vị trí trong board)
     */
    // const moveColumns = (dndOrderedColumns: any) => {
    //     // Update cho chuẩn dữ liệu state Board
    //     const dndOrderedColumnsIds = dndOrderedColumns.map((c: any) => c._id)
    //     const newBoard = { ...board }
    //     newBoard.columns = dndOrderedColumns
    //     newBoard.columnOrderIds = dndOrderedColumnsIds
    //     // setBoard(newBoard)
    //
    //     // Gọi API update Board
    //     updateBoardDetailsAPI(newBoard.id, { columnOrderIds: dndOrderedColumnsIds })
    // }

    /**
     * Khi di chuyển card trong cùng ColumnFC:
     * Chỉ cần gọi API để cập nhật mảng cardOrderIds của ColumnFC chứa nó (thay đổi vị trí trong mảng)
     */
    // const moveCardInTheSameColumn = (dndOrderedCards: any, dndOrderedCardIds: any, columnId: any) => {
    //     // Update cho chuẩn dữ liệu state Board
    //     const newBoard = { ...board }
    //     const columnToUpdate = newBoard.columns.find((column: any) => column._id === columnId)
    //     if (columnToUpdate) {
    //         columnToUpdate.cards = dndOrderedCards
    //         columnToUpdate.cardOrderIds = dndOrderedCardIds
    //     }
    //     // setBoard(newBoard)

    //     // Gọi API update ColumnFC
    //     updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
    // }

    // /**
    //  * Khi di chuyển card sang ColumnFC khác:
    //  * B1: Cập nhật mảng cardOrderIds của ColumnFC ban đầu chứa nó (Hiểu bản chất là xóa cái _id của Card ra khỏi mảng)
    //  * B2: Cập nhật mảng cardOrderIds của ColumnFC tiếp theo (Hiểu bản chất là thêm _id của Card vào mảng)
    //  * B3: Cập nhật lại trường columnId mới của cái Card đã kéo
    //  * => Làm một API support riêng.
    //  */
    // const moveCardToDifferentColumn = (currentCardId: any, prevColumnId: any, nextColumnId: any, dndOrderedColumns: any[]) => {
    //     // Update cho chuẩn dữ liệu state Board
    //     const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    //     const newBoard = { ...board }
    //     newBoard.columns = dndOrderedColumns
    //     newBoard.columnOrderIds = dndOrderedColumnsIds
    //     // setBoard(newBoard)

    //     // Gọi API xử lý phía BE
    //     let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    //     // Xử lý vấn đề khi kéo Card cuối cùng ra khỏi ColumnFC, ColumnFC rỗng sẽ có placeholder card, cần xóa nó đi trước khi gửi dữ liệu lên cho phía BE. (Nhớ lại video 37.2)
    //     if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

    //     moveCardToDifferentColumnAPI({
    //         currentCardId,
    //         prevColumnId,
    //         prevCardOrderIds,
    //         nextColumnId,
    //         nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    //     })
    // }

    // Xử lý xóa một ColumnFC và Cards bên trong nó
    // const deleteColumnDetails = (columnId: any) => {
    //     // Update cho chuẩn dữ liệu state Board
    //     const newBoard = { ...board }
    //     newBoard.columns = newBoard.columns.filter((c: { id: any }) => c.id !== columnId)
    //     newBoard.columnOrderIds = newBoard.columnOrderIds.filter((_id: any) => _id !== columnId)
    //     // setBoard(newBoard)

    //     // Gọi API xử lý phía BE
    //     deleteColumnDetailsAPI(columnId).then(res => {
    //         toast.success(res?.deleteResult)
    //     })
    // }

    if (error) {
        toast.error(error.message)
    }

    if (isLoading) {
        return (
            <>
                {console.log('loading!!!!!!!!!: ', isLoading)}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    width: '100vw',
                    height: '100vh'
                }}>
                    <CircularProgress />
                    <Typography>Loading Board...</Typography>
                </Box>
            </>
        )
    }

    return (
        <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
            <>
                {console.log('board: ', board)}
                <BoardBarFC board={board} />
                <BoardContentFC
                // board={board}

                // createNewColumn={createNewColumn}
                // createNewCard={createNewCard}
                // moveColumns={moveColumns}
                // moveCardInTheSameColumn={moveCardInTheSameColumn}
                // moveCardToDifferentColumn={moveCardToDifferentColumn}
                // deleteColumnDetails={deleteColumnDetails}
                />
            </>
        </Container>
    )
}

export default BoardComponent
