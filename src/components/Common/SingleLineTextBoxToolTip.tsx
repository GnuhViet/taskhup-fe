import React from 'react'

import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'

export interface SingleLineTextBoxToolTipProps {
    sx?: any
    id: string
    text: string
    breakOnLine?: number
}

const overflowDotSx = {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
}

const slotProps = { popper: { modifiers: [{ name: 'offset', options: { offset: [-10, 0] } }] } }

const SingleLineTextBoxToolTip: React.FC<SingleLineTextBoxToolTipProps> = ({ sx, text, id }) => {
    const [isEllipsis, setIsEllipsis] = React.useState(false)
    const elementRef = React.useRef(null)

    React.useEffect(() => {
        if (elementRef.current) {
            setIsEllipsis(elementRef.current.scrollWidth > elementRef.current.clientWidth)
        }
    }, [id])

    return (
        <>
            <Box ref={elementRef} sx={{ ...sx, ...overflowDotSx }} >
                {isEllipsis ? (
                    <Tooltip title={text} slotProps={slotProps} placement="bottom-start">
                        <span>{text}</span>
                    </Tooltip>
                ) : (
                    <span>{text}</span>
                )}
            </Box>
        </>

    )
}

export default SingleLineTextBoxToolTip