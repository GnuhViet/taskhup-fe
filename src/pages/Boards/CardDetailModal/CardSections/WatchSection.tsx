import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useUpdateWatchCardMutation } from '~/core/redux/api/board-card.api';
import ApiLoadingOverlay from '~/components/Common/ApiLoadingOverlay';

const labelTextSx = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#44546f'
}

export interface WatchSectionProps {
    cardId: string
    isWatchCard: boolean
    reFetch: () => void
}

const WatchSection: React.FC<WatchSectionProps> = ({ cardId, isWatchCard, reFetch }) => {
    const [updateWatchCard, { isLoading: updateWatchCardLoading }] = useUpdateWatchCardMutation()

    const handleWatchCard = async () => {
        try {
            await updateWatchCard(
                { boardCardId: cardId, isWatch: !isWatchCard }).unwrap()
            await reFetch()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Box className="field noti-field">
            <Box className="field-title" sx={{ ...labelTextSx }}>Notifications</Box>
            <Box className="field-content">
                {isWatchCard ? (
                    <Button
                        className="button remove-button"
                        variant="contained"
                        startIcon={<VisibilityOffOutlinedIcon />}
                        onClick={handleWatchCard}
                    >
                        {updateWatchCardLoading
                            ? <ApiLoadingOverlay />
                            : <>Unwatch</>
                        }
                    </Button>
                ) : (
                    <Button
                        className="button add-button"
                        variant="contained"
                        startIcon={<VisibilityOutlinedIcon />}
                        onClick={handleWatchCard}
                    >
                        {updateWatchCardLoading
                            ? <ApiLoadingOverlay />
                            : <>Watch</>
                        }
                    </Button>
                )}
            </Box>
        </Box>
    )
}

export default WatchSection