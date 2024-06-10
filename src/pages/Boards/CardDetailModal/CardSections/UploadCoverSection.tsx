import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import VideoLabelOutlinedIcon from '@mui/icons-material/VideoLabelOutlined'
import { useUpdateCardCoverMutation } from '~/core/redux/api/board-card.api'
import { toast } from 'react-toastify'
import ApiLoadingOverlay from '~/components/Common/ApiLoadingOverlay'
import { Height } from '@mui/icons-material'

export interface UploadCoverSectionProps {
    cardId: string
    reFetch: () => void
}

const UploadCoverSection: React.FC<UploadCoverSectionProps> = ({ cardId, reFetch }) => {
    const [updateCardCover, { isLoading }] = useUpdateCardCoverMutation()


    const fileInputRef = React.useRef(null)

    const handleButtonClick = () => {
        fileInputRef.current.click()
    }

    const handleFileChange = async (event: any) => {
        const file = event.target.files[0]
        try {
            await updateCardCover({
                boardCardId: cardId,
                file: file
            })
            toast.success('Update card cover successfully', {
                position: 'bottom-right'
            })
            await reFetch()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Box>
            <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
            />
            <Button
                className="button right-button"
                variant="contained"
                startIcon={<VideoLabelOutlinedIcon />}
                onClick={handleButtonClick}
            >
                {isLoading
                    ? <Box>
                        <ApiLoadingOverlay
                            size='28px'
                        />
                    </Box>
                    : 'Upload Cover'
                }
            </Button>
        </Box>
    )
}

export default UploadCoverSection