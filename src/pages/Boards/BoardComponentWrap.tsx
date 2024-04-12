// Boards list
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { StompSessionProvider } from 'react-stomp-hooks'
import BoardComponent from '~/pages/Boards/_id'

const BoardComponentWrap = () => {
    const token = useSelector((state: any) => state.authReducer.token.accessToken)

    const beforeStompConnect = useCallback(function () {
        this.connectHeaders = {
            'Authorization': 'Bearer ' + token
        }
    }, [token])

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