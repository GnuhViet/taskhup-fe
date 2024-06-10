import React from 'react'
import Box from '@mui/material/Box'
import ObjectFitAvatar from '~/components/Common/ObjectFitAvatar'
import Button from '@mui/material/Button'
import VideoLabelOutlinedIcon from '@mui/icons-material/VideoLabelOutlined'
import { useRemoveCardCoverMutation } from '~/core/redux/api/board-card.api'

export interface SectionProps {
    coverUrl: string
    cardId: string
    refetch: () => void
}

const CoverSection: React.FC<SectionProps> = ({ coverUrl, cardId, refetch }) => {
    const [removeCover, { isLoading }] = useRemoveCardCoverMutation()

    const handleRemoveCover = async () => {
        try {
            await removeCover({ boardCardId: cardId })
            await refetch()
        } catch (error) {
            console.log(error)
        }
    }

    if (isLoading) return (
        <></>
    )

    return (
        <Box
            sx={{
                minHeight: '200px',
                position: 'relative'
            }}
        >
            <ObjectFitAvatar
                src={coverUrl}
                alt={null}
                sx={{
                    width: '100%',
                    height: '200px',
                    borderRadius: '3px'
                }}
                disableHoverShadown={true}
            />
            <Button
                variant="text"
                sx={{
                    color: '#fff',
                    height: '32px',
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    '&:hover': {
                        boxShadow: 'inset 0 0 0 1000px rgba(0, 0, 0, 0.6)'
                    }
                }}
                startIcon={<VideoLabelOutlinedIcon />}
                onClick={handleRemoveCover}
            >Remove cover</Button>
        </Box>
    )
}

export default CoverSection