import React from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import ObjectFitAvatar from '~/components/Common/ObjectFitAvatar'
import { useDeleteAttachmentMutation } from '~/core/redux/api/board-card.api'

export interface CommentAttachmentProps {
    isEditing: boolean
    attachment: any
    reFetch: () => void
}

const CommentAttachment: React.FC<CommentAttachmentProps> = ({ attachment, isEditing, reFetch }) => {
    const [deleteAttachment, { isLoading }] = useDeleteAttachmentMutation()

    const handleClickDelete = async () => {
        if (!isEditing) return

        try {
            await deleteAttachment({ attachmentId: attachment.id })
            await reFetch()
        } catch (error) {
            console.error('Error deleting attachment:', error)
        }
    }

    return (
        <Box
            sx={{
                mr: '12px',
                width: '112px',
                height: '80px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                fontSize: '34px',
                boxShadow: 'inset 0 0 0 1000px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                    fontSize: '54px',
                    boxShadow: 'inset 0 0 0 1000px rgba(0, 0, 0, 0.8)',
                    '& svg': {
                        transform: 'translate(-50%, -50%) scale(1.5)'
                    }
                }
            }}
            onClick={handleClickDelete}
        >
            <Box>
                <ObjectFitAvatar
                    src={attachment.downloadUrl}
                    alt={null}
                    sx={{
                        width: '112px',
                        height: '80px',
                        borderRadius: '3px'
                    }}
                />
                {isEditing &&
                    <Tooltip title="Remove" arrow>
                        <Box>
                            <CloseOutlinedIcon
                                sx={{
                                    fontSize: '38px',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    color: '#fff',
                                    transition: 'transform 0.3s ease-in-out'
                                }}
                            />
                        </Box>
                    </Tooltip>
                }
            </Box>
        </Box>
    )
}

export default CommentAttachment