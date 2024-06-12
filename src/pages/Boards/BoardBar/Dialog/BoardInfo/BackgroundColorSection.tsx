import React from 'react'
import Box from '@mui/material/Box'
import CheckIcon from '@mui/icons-material/Check'
import WallpaperIcon from '@mui/icons-material/Wallpaper'
import { useSelector } from 'react-redux'
import { isBlank } from '~/core/utils/data-utils'
import { useUpdateBoardBackgroundMutation } from '~/core/redux/api/board.api'
import { useParams } from 'react-router-dom'
import { AbilityContext } from '~/core/utils/access-control'

const titleTextSx = {
    color: '#172b4d',
    fontWeight: '500'
}

interface BackgroundItemProps {
    refetch(): void
}

const BackgroundColorSection: React.FC<BackgroundItemProps> = ({ refetch }) => {
    const ability = React.useContext(AbilityContext)
    const boardId = useParams().boardId
    const boardBackground = useSelector((state: any) => state.boardReducer.boardBackground)

    const [updateBg, { isLoading }] = useUpdateBoardBackgroundMutation()

    React.useEffect(() => {
        if (isBlank(boardBackground) || boardBackground === '#1976d2') return

        setSelectedColor(boardBackground)
    }, [boardBackground])

    const handleSetBg = async (color: string) => {
        if (ability.cannot('edit', 'board')) return

        setSelectedColor(color)
        if (isBlank(boardId)) return

        try {
            await updateBg({ id: boardId, color: color }).unwrap()
            refetch()
        } catch (error) {
            console.log(error)
        }
    }

    const color = {
        1: { color: 'linear-gradient(to bottom right, #FF5733, #FFC300)' },
        2: { color: 'linear-gradient(to bottom right, #3385FF, #D433FF)' },
        3: { color: 'linear-gradient(to bottom right, #FF33A1, #FF3333)' },
        4: { color: 'linear-gradient(to bottom right, #8C33FF, #FF33B1)' },
        5: { color: 'linear-gradient(to bottom right, #FF3344, #FF99FF)' },
        6: { color: 'linear-gradient(to bottom right, #A1D1FF, #B3E0FF)' },
        7: { color: 'linear-gradient(to bottom right, #FFA1C1, #FFB3D4)' },
        8: { color: 'linear-gradient(to bottom right, #D1A1FF, #E0B3FF)' },
        9: { color: 'linear-gradient(to bottom right, #FFA1A1, #FFB3B3)' },
        10: { color: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' },
        11: { color: 'linear-gradient(to bottom right, #A1A1FF, #B3B3FF)' },
        12: { color: 'linear-gradient(45deg, #9C27B0 30%, #E040FB 90%)' },
        13: { color: 'linear-gradient(45deg, #FF3D00 30%, #FF9100 90%)' },
        14: { color: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)' },
        15: { color: 'linear-gradient(to bottom right, #FFA1FF, #FFB3FF)' },
        16: { color: 'linear-gradient(45deg, #607D8B 30%, #9E9E9E 90%)' }
    }

    const [selectedColor, setSelectedColor] = React.useState(null)

    const BackgroundItem: React.FC<BackgroundItemProps> = ({ color }) => {
        return (
            <Box
                sx={{
                    width: '124px',
                    height: '62px',
                    background: color,
                    borderRadius: '8px',
                    cursor: ability.cannot('edit', 'board') ? 'normal' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                        boxShadow: ability.cannot('edit', 'board') ? 'unset' : 'inset 0 0 0 1000px rgba(0, 0, 0, 0.2)'
                    }
                }}
                onClick={() => handleSetBg(color)}
            >
                <CheckIcon
                    sx={{ display: selectedColor === color ? 'block' : 'none' }}
                />
            </Box>
        )
    }

    return (
        <Box sx={{ mb: '18px' }}>
            <Box sx={{ display: 'flex', mb: '12px', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex' }}>
                    <WallpaperIcon sx={{ ...titleTextSx, fontSize: '28px', mr: '14px' }} />
                    <Box sx={{ ...titleTextSx, fontSize: '18px', lineHeight: '28px' }}>Board background</Box>
                </Box>

                <Box
                    sx={{
                        ...titleTextSx,
                        fontSize: '18px',
                        lineHeight: '28px',
                        cursor: ability.cannot('edit', 'board') ? 'normal' : 'pointer',
                        '&:hover': {
                            textDecoration: 'underline'
                        },
                        display: selectedColor ? 'block' : 'none'
                    }}
                    onClick={() => handleSetBg(null)}
                >
                    Remove background
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(8, 1fr)',
                    gap: '10px'
                }}
            >
                {Object.keys(color).map(key => (
                    <BackgroundItem color={color[key].color} key={key} />
                ))}
            </Box>
        </Box>

    )
}

export default BackgroundColorSection