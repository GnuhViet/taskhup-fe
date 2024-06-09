import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import CallMadeOutlinedIcon from '@mui/icons-material/CallMadeOutlined'
import ObjectFitAvatar from '~/components/Common/ObjectFitAvatar'
import SingleLineTextBoxToolTip from '~/components/Common/SingleLineTextBoxToolTip'
import { isBlank } from '~/core/utils/data-utils'
import { formatBytes } from '~/core/utils/common-used'
import VideoThumnail from '~/components/Common/VideoThumnail'
import FilePresentOutlinedIcon from '@mui/icons-material/FilePresentOutlined'
import { useDeleteAttachmentMutation } from '~/core/redux/api/board-card.api'
import ApiLoadingOverlay from '~/components/Common/ApiLoadingOverlay'

const mediumTextSx = {
    fontSize: '15px',
    fontWeight: '700',
    color: '#162B4D'
}

const smallTextSx = {
    fontSize: '12px',
    fontWeight: '400',
    color: '#44546f'
}

const dotSx = {
    fontSize: '21px',
    lineHeight: '18px'
}

const textButtonSx = {
    cursor: 'pointer',
    textDecoration: 'underline'
}

export interface AttachmentItemProps {
    attachment: any
    cardId: string
    reFetch: () => void
}

const AttachmentItem: React.FC<AttachmentItemProps> = ({ attachment, cardId, reFetch }) => {
    const [deleteAttachment, { isLoading }] = useDeleteAttachmentMutation()

    const handleClickDelete = async () => {
        try {
            await deleteAttachment({ attachmentId: attachment.id })
            await reFetch()
        } catch (error) {
            console.error('Error deleting attachment:', error)
        }
    }

    const [dots, setDots] = useState(1)

    useEffect(() => {
        const timer = setInterval(() => {
            setDots((prevDots) => (prevDots % 5) + 1)
        }, 200)

        return () => clearInterval(timer)
    }, [])

    return (
        <Box sx={{
            display: 'flex',
            '&:hover': {
                backgroundColor: '#E2E4EA'
            },
            mb: '16px'
        }}>
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
                            return <VideoThumnail src={attachment.downloadUrl} />
                        default:
                            return (
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
                                        '&:hover': {
                                            boxShadow: 'inset 0 0 0 1000px rgba(0, 0, 0, 0.3)',
                                            fontSize: '54px',
                                            '& div': { // Target the SVG inside the Box (the PlayCircleFilledWhiteOutlinedIcon)
                                                transform: 'translate(-50%, -50%) scale(1.5)'
                                            }
                                        }
                                    }}
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
                            )
                    }
                })()}
            </Box>
            <Box sx={{ p: '0 20px' }}>
                <Box sx={{ m: '6px 0' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SingleLineTextBoxToolTip
                            sx={{ ...mediumTextSx, maxWidth: '460px' }}
                            id={`AttachItem-${attachment.id}`}
                            text={isBlank(attachment.displayName) ? attachment.originFileName : attachment.displayName}
                        />
                        &nbsp;&nbsp;
                        <Tooltip title="Open in new tab" arrow>
                            <CallMadeOutlinedIcon
                                sx={{ fontSize: '15px', color: '#162B4D', cursor: 'pointer' }}
                                onClick={() => window.open(attachment.downloadUrl, '_blank')}
                            />
                        </Tooltip>
                    </Box>

                    <Box sx={{ ...smallTextSx }}>Size: {formatBytes(attachment.fileSize)}</Box>
                    <Box sx={{ display: 'flex' }}>
                        <Box sx={{ ...smallTextSx }}>
                            Added on {attachment.upadteAt}
                        </Box>
                        <Box sx={{ ...dotSx }}>&nbsp;•&nbsp;</Box>
                        <Box sx={{ ...smallTextSx, ...textButtonSx }} onClick={() => window.open(attachment.downloadUrl, '_blank')}>
                            Download
                        </Box>
                        <Box sx={{ ...dotSx }}>&nbsp;•&nbsp;</Box>
                        <Box sx={{
                            ...smallTextSx,
                            cursor: isLoading ? 'default' : 'pointer',
                            textDecoration: isLoading ? 'none' : 'underline',
                            position: 'relative'
                        }} onClick={handleClickDelete}>
                            {isLoading
                                ? `Deleting${'.'.repeat(dots)}`
                                : 'Delete'
                            }
                        </Box>
                    </Box>

                </Box>
            </Box>
        </Box>
    )
}

export default AttachmentItem