import Box from '@mui/material/Box'
import React from 'react'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded'
import TextBoxToolTip from '~/components/Common/TextBoxToolTip'


const boxSx = {
    width: '194px',
    height: '96px',
    borderRadius: '3px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#F4F5F7',
    backgroundPosition: '50%',
    backgroundSize: 'cover',
    cursor: 'pointer'
}

const starIconSx = {
    fontSize: '20px',
    color: '#BD9815'
}

export interface BoardItemProps {
    id: string
    title: string
    desc?: string
    starred: boolean
    backgroundUrl?: string
    backgroundColor?: string
}

const BoardItem: React.FC<BoardItemProps> = ({ id, title, desc, starred, backgroundUrl, backgroundColor }) => {
    const [isHovered, setIsHovered] = React.useState(false)

    const handleOver = () => {
        setIsHovered(true)
    }

    const handleOut = () => {
        setIsHovered(false)
    }

    return (
        <Box sx={{ ...boxSx, backgroundImage: `url(${backgroundUrl})` }}>
            <Box sx={{ m: '8px 8px 0px 8px', fontWeight: 'bold' }}>
                <TextBoxToolTip sx={{ color: 'white' }} id={`title-${id}`} text={title} />
            </Box>
            <Box sx={{ m: '0px 8px 8px 8px', display: 'flex', justifyContent: 'space-between' }}>
                <TextBoxToolTip sx={{ color: 'white', width: starred ? '85%' : '100%' }} id={`desc-${id}`} text={desc} />
                <Box onMouseOver={() => handleOver()} onMouseOut={() => handleOut()}>
                    {starred && isHovered
                        ? <StarBorderRoundedIcon sx={{ ...starIconSx }} />
                        : <StarRateRoundedIcon sx={starIconSx} />
                    }
                </Box>
            </Box>
        </Box>
    )
}

export default BoardItem