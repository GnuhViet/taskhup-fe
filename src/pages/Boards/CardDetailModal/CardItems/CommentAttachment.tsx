import React from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import ObjectFitAvatar from '~/components/Common/ObjectFitAvatar'
import { useDeleteAttachmentMutation } from '~/core/redux/api/board-card.api'
import VideoThumnail from '~/components/Common/VideoThumnail'

export interface CommentAttachmentProps {
    isEditing: boolean
    attachment: any
    reFetch: () => void
    setIsLoadingDeleteAttach: (isLoading: boolean) => void
}

const CommentAttachment: React.FC<CommentAttachmentProps> = ({ attachment, isEditing, reFetch, setIsLoadingDeleteAttach }) => {
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

    const handleOpenInNewTab = () => {
        if (isEditing) return
        window.open(attachment.downloadUrl, '_blank')
    }

    React.useEffect(() => {
        setIsLoadingDeleteAttach(isLoading)
    }, [isLoading])

    return (
        <Box
            sx={{
                mr: '12px',
                width: '112px',
                height: '80px',
                cursor: 'pointer',
                position: 'relative'
            }}
            onClick={handleClickDelete}
        >
            <Box>
                {(() => {
                    switch (attachment.resourceType) {
                        case 'image':
                            return <ObjectFitAvatar
                                src={attachment.downloadUrl}
                                alt={null}
                                sx={{
                                    width: '112px',
                                    height: '80px',
                                    borderRadius: '3px'
                                }}
                            />
                        case 'video':
                            return <VideoThumnail src={attachment.downloadUrl} disableHover={isEditing} />
                        default:
                            return (
                                <Tooltip title={isEditing ? null : 'Click to download'} arrow>
                                    <Box
                                        sx={{
                                            width: '112px',
                                            height: '80px',
                                            borderRadius: '3px',
                                            overflow: 'hidden',
                                            position: 'relative',
                                            boxShadow: 'inset 0 0 0 1000px rgba(0, 0, 0, 0.2)',
                                            cursor: 'pointer',
                                            fontSize: '34px',
                                            '&:hover': isEditing ? {} :
                                                {
                                                    boxShadow: 'inset 0 0 0 1000px rgba(0, 0, 0, 0.3)',
                                                    fontSize: '54px',
                                                    '& div': { // Target the SVG inside the Box (the PlayCircleFilledWhiteOutlinedIcon)
                                                        transform: 'translate(-50%, -50%) scale(1.5)'
                                                    }
                                                }
                                        }}
                                        onClick={() => handleOpenInNewTab()}
                                    >
                                        <Box
                                            sx={{
                                                fontSize: '38px',
                                                position: 'absolute',
                                                top: '46%',
                                                left: '51%',
                                                transform: 'translate(-50%, -50%)',
                                                color: '#44546f',
                                                transition: 'transform 0.3s ease-in-out'
                                            }}
                                        >
                                            {attachment?.originFileName?.split('.').pop()}
                                        </Box>
                                    </Box>
                                </Tooltip>
                            )
                    }
                })()}
            </Box>
            {isEditing &&
                <Tooltip title="Remove" arrow>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '0',
                            width: '100%',
                            height: '100%',
                            '&:hover': {
                                boxShadow: 'inset 0 0 0 1000px rgba(0, 0, 0, 0.3)'
                            }
                        }}
                    >
                        <Box
                            sx={{
                                '&:hover': {
                                    '& svg': {
                                        transform: 'translate(-50%, -50%) scale(1.5)'
                                    }
                                }
                            }}
                        >
                            <CloseOutlinedIcon
                                sx={{
                                    width: '50%',
                                    height: '50%',
                                    fontSize: '20px',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    color: '#fff',
                                    transition: 'transform 0.3s ease-in-out'
                                }}
                            />
                        </Box>
                    </Box>
                </Tooltip>
            }

        </Box>
    )
}

export default CommentAttachment