// Boards list
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { StompSessionProvider } from 'react-stomp-hooks'
import { useGetBoardByCodeQuery, useLazyGetBoardByCodeQuery } from '~/core/redux/api/board.api'
import { setBoard } from '~/core/redux/slices/boardSlice'
import BoardComponent from '~/pages/Boards/_id'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'


const BoardComponentWrap = () => {
    const token = useSelector((state: any) => state.authReducer.token.accessToken)
    const dispatch = useDispatch()
    const boardId = useParams().boardId
    const { isLoading } = useGetBoardByCodeQuery(boardId)

    const beforeStompConnect = useCallback(function () {
        this.connectHeaders = {
            'Authorization': 'Bearer ' + token
        }

        dispatch(setBoard(boardId))
    }, [token, boardId, dispatch])

    if (isLoading) {
        return <>
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
    }

    return (
        <StompSessionProvider
            url={'http://localhost:8080/ws-endpoint'}
            beforeConnect={beforeStompConnect}
        >
            <BoardComponent />
        </StompSessionProvider>
    )
}

export default BoardComponentWrap