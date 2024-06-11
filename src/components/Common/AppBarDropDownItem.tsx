import React from 'react'
import Box from '@mui/material/Box'
import SquareAvatar from '~/components/Common/SquareAvatar'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import { isBlank } from '~/core/utils/data-utils'
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded'
import SingleLineTextBoxToolTip from './SingleLineTextBoxToolTip'
import { useNavigate } from 'react-router-dom'

export interface ItemProps {
    item: Item
}

interface Item {
    id: string
    workspaceId: string
    title: string
    description: string
    type: string // 'workspace' | 'board'
    starred: boolean
    backgroundColor?: string
    backgroundUrl?: string
}

const boxSx = {
    width: '40px',
    height: '32px',
    borderRadius: '3px',
    backgroundColor: '#F4F5F7 !important',
    backgroundPosition: '50%',
    backgroundSize: 'cover !important',
}

const starIconSx = {
    fontSize: '20px',
    display: 'flex',
    mb: '2px',
    alignItems: 'top'
}

const AppBarDropDownItem: React.FC<ItemProps> = ({ item }) => {
    const [isStarHover, setIsStarHover] = React.useState(false)
    const [isBoardItemHover, setIsBoardItemHover] = React.useState(false)
    const navigate = useNavigate()

    const onItemClick = () => {
        if (item.type === 'workspace') {
            // navigate(`/workspace/${item.id}`)
        } else if (item.type === 'board') {
            if (isBlank(item.workspaceId) || isBlank(item.id)) return

            navigate(`/w/${item.workspaceId}/b/${item.id}`)
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '280px',
                height: '40px'
            }}
            onMouseEnter={() => setIsBoardItemHover(true)}
            onMouseLeave={() => setIsBoardItemHover(false)}
            onClick={onItemClick}

        >
            <Box sx={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                        sx={{
                            ...boxSx,
                            backgroundImage: (item.backgroundColor === '#1976d2' || isBlank(item.backgroundColor))
                                ? `url(${item.backgroundUrl}) !important`
                                : 'none',
                            background: (item.backgroundColor !== '#1976d2') ? item.backgroundColor : 'none'
                        }}
                    />
                </Box>
                <Box sx={{ ml: '12px', maxWidth: '210px', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Box sx={{ fontSize: '14px', width: '210px' }}>
                        <SingleLineTextBoxToolTip
                            id={`app-bar-drop-down-item-tile-${item.id}`}
                            text={item.title}
                            sx={{
                                fontSize: '14px',
                                maxWidth: '210px'
                            }}
                        />
                    </Box>
                    <Box sx={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.6)' }}>
                        <SingleLineTextBoxToolTip
                            id={`app-bar-drop-down-item-description-${item.id}`}
                            text={item.description}
                            sx={{
                                fontSize: '12px',
                                color: 'rgba(0, 0, 0, 0.6)'
                            }}
                        />
                    </Box>
                    {/* card count here if ws */}
                </Box>
            </Box>
            <Box
                sx={{ display: 'flex', alignItems: 'center' }}
                onMouseOver={() => setIsStarHover(true)}
                onMouseOut={() => setIsStarHover(false)}
            >
                {item.starred
                    ? isStarHover
                        ? <StarBorderRoundedIcon sx={{ ...starIconSx, color: '#E2B203', transform: 'scale(1.1)', transition: 'all 0.2s ease' }} />
                        : <StarRateRoundedIcon sx={{ ...starIconSx, color: '#E2B203' }} />
                    : isBoardItemHover
                        ? isStarHover
                            ? <StarBorderRoundedIcon sx={{ ...starIconSx, color: 'black', transition: 'all 0.2s ease', transform: 'scale(1.2)' }} />
                            : <StarBorderRoundedIcon sx={{ ...starIconSx, color: 'black', transition: 'all 0.2s ease', transform: 'translateX(0)' }} />
                        : <StarBorderRoundedIcon sx={{ ...starIconSx, color: 'black', transition: 'all 0.2s ease', transform: 'translateX(170%)' }} />
                }
            </Box>
        </Box>
    )
}

export default AppBarDropDownItem