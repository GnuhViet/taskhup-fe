import Container from '@mui/material/Container'
import BoardBarFC from './BoardBar/BoardBarFC'
import BoardContentFC from './BoardContent/BoardContentFC'

// import { mockData } from '~/apis/mock-data'
import React from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { handleSocketEvent } from '~/core/services/board-services'
import { useSubscription } from 'react-stomp-hooks'
import CardDialogFC from './BoardContent/ListColumns/Column/ListCards/Card/CardDetailModal/CardDialogFC'
import { setDisableDrag, setOpenCardDialog } from '~/core/redux/slices/boardSlice'

const BoardComponent: React.FC = () => {

    const dispatch = useDispatch()
    // const board = useSelector((state: any) => state.boardReducer.board)
    const boardId = useSelector((state: any) => state.boardReducer.boardId)
    const boardState = useSelector((state: any) => state.boardReducer)

    const open = boardState.openCardDetail
    const cardId = boardState.openCardDetailId

    useSubscription(`/topic/board/${boardId}`, (message) => {
        handleSocketEvent(message, dispatch)
    })

    const board = boardState.board

    const handleClose = () => {
        dispatch(setOpenCardDialog({
            open: false,
            cardId: null
        }))
        dispatch(setDisableDrag(false))
    }

    return (
        <Container disableGutters maxWidth={false} sx={{ height: 'auto' }}>
            <>
                <BoardBarFC board={board} />
                <BoardContentFC />
                <CardDialogFC open={open} handleClose={handleClose} cardId={cardId} />
            </>
        </Container>
    )
}

export default BoardComponent
