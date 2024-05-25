import Container from '@mui/material/Container'
import BoardBarFC from './BoardBar/BoardBarFC'
import BoardContentFC from './BoardContent/BoardContentFC'

// import { mockData } from '~/apis/mock-data'
import React from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { handleSocketEvent } from '~/core/services/board-services'
import { useSubscription } from 'react-stomp-hooks'

const BoardComponent: React.FC = () => {

    const dispatch = useDispatch()
    // const board = useSelector((state: any) => state.boardReducer.board)
    const boardId = useSelector((state: any) => state.boardReducer.boardId)
    const boardState = useSelector((state: any) => state.boardReducer)

    useSubscription(`/topic/board/${boardId}`, (message) => {
        handleSocketEvent(message, dispatch)
    })

    const board = boardState.board

    return (
        <Container disableGutters maxWidth={false} sx={{ height: 'auto' }}>
            <>
                <BoardBarFC board={board} />
                <BoardContentFC
                />
            </>
        </Container>
    )
}

export default BoardComponent
