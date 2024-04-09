import React from 'react'

import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'

export interface TextBoxToolTipProps {
    sx?: any
    id: string
    text: string
}

const overflowDotSx = {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
}

const TextBoxToolTip: React.FC<TextBoxToolTipProps> = ({ sx, text, id }) => {
    const [isEllipsis, setIsEllipsis] = React.useState(false)

    React.useEffect(() => {
        const element = document.getElementById(`tooltip-text-item-${id}`)
        if (element) {
            setIsEllipsis(element.scrollWidth > element.clientWidth)
        }
    }, [id])

    return (
        <Box sx={{ ...sx, ...overflowDotSx }} id={`tooltip-text-item-${id}`}>
            {isEllipsis ? (
                <Tooltip title={text}>
                    <span>{text}</span>
                </Tooltip>
            ) : (
                <span>{text}</span>
            )}
        </Box>
    )
}

export default TextBoxToolTip