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

const slotProps = { popper: { modifiers: [{ name: 'offset', options: { offset: [-30, -30] } }] } }

const SingleLineTextBoxToolTip: React.FC<SingleLineTextBoxToolTipProps> = ({ sx, text, id }) => {
    const [isEllipsis, setIsEllipsis] = React.useState(false)

    React.useEffect(() => {
        const element = document.getElementById(`single-line-tooltip-text-item-${id}`)
        if (element) {
            setIsEllipsis(element.scrollWidth > element.clientWidth)
        }
    }, [id])

    return (
        <>
            <Box sx={{ ...sx, ...overflowDotSx }} id={`single-line-tooltip-text-item-${id}`}>
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

export default SingleLineTextBoxToolTip