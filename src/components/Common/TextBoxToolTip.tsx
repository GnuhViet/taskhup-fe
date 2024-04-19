import React from 'react'

import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'

export interface TextBoxToolTipProps {
    sx?: any
    id: string
    text: string
    breakOnLine?: number
}

const overflowDotSx = {
    overflow: 'hidden',
    // whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical'
}

const slotProps = { popper: { modifiers: [{ name: 'offset', options: { offset: [-30, -30] } }] } }

const TextBoxToolTip: React.FC<TextBoxToolTipProps> = ({ sx, text, id, breakOnLine }) => {
    const [isEllipsis, setIsEllipsis] = React.useState(false)

    React.useEffect(() => {
        const element = document.getElementById(`tooltip-text-item-${id}`)
        if (element) {
            setIsEllipsis(element.scrollHeight > element.clientHeight)
        }
    }, [id])

    return (
        <>
            <Box sx={{ ...sx, ...overflowDotSx, WebkitLineClamp: breakOnLine ? breakOnLine : 1 }} id={`tooltip-text-item-${id}`}>
                {isEllipsis ? (
                    <Tooltip title={text} enterDelay={800} slotProps={slotProps}>
                        <span>{text}</span>
                    </Tooltip>
                ) : (
                    <span>{text}</span>
                )}
            </Box>
        </>

    )
}

export default TextBoxToolTip