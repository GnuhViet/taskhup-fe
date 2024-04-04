import BoardComponent from '~/pages/Boards/_id'
import React from 'react'
import { StompSessionProvider } from 'react-stomp-hooks'

const App: React.FC = () => {
    return (
        <>
            {/* React Router Dom /boards /boards/{board_id} */}
            {/* Board Details */}
            <StompSessionProvider url={'http://localhost:8080/ws-endpoint'}>
                <BoardComponent />
            </StompSessionProvider>
        </>
    )
}

export default App
