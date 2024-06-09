import React, { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import CircleAvatar from '~/components/Common/CircleAvatar'
import { useSelector } from 'react-redux'
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined'
import ObjectFitAvatar from '~/components/Common/ObjectFitAvatar'
import dayjs from 'dayjs'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { Tooltip } from '@mui/material'
import TinyMceWrap from '~/components/Common/TinyMceWrap'
import CommentAttachment from './CommentAttachment'
import { UploadAttachmentReq } from '~/core/services/board-card-services.model'
import { useUploadAttachmentMutation } from '~/core/redux/api/board-card.api'
import { toast } from 'react-toastify'

const mediumTextSx = {
    fontSize: '15px',
    fontWeight: '700',
    color: '#162B4D'
}

const labelTextSx = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#44546f'
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

export interface CommentItemProps {
    commentItem: any
    cardId: string
    reFetch: () => void
}

const CommentItem: React.FC<CommentItemProps> = ({ commentItem, cardId, reFetch }) => {
    const [uploadAttachment, { isLoading }] = useUploadAttachmentMutation()

    const [isEditing, setIsEditing] = React.useState(false)

    const handleEdit = (value: string) => {
        console.log('Edit comment', value)
    }

    const fileInputRef = React.useRef(null)

    const handleButtonClick = () => {
        fileInputRef.current.click()
    }

    const handleFileChange = async (event: any) => {
        const file = event.target.files[0]
        try {
            if (!file) return

            const request = {
                file: file,
                displayName: null,
                type: 'COMMENT_ATTACH',
                refId: commentItem.id
            } as UploadAttachmentReq

            await uploadAttachment(request).unwrap()
            await reFetch()
            toast.success('File uploaded successfully.', {
                position: 'bottom-right'
            })
        } catch (error) {
            toast.error(
                'An error occurred while uploading the file. Please try again.',
                {
                    position: 'bottom-right'
                }
            )
        }
        event.target.value = ''
    }

    const [dots, setDots] = useState(1)

    useEffect(() => {
        const timer = setInterval(() => {
            setDots((prevDots) => (prevDots % 5) + 1)
        }, 200)

        return () => clearInterval(timer)
    }, [])


    return (
        <Box sx={{ display: 'flex', mb: '16px' }}>
            <Box sx={{
                mr: '10px',
                mt: '4px'
            }}>
                <CircleAvatar
                    src={commentItem?.avatarUrl}
                    alt={commentItem?.fullName}
                    sx={{
                        width: '32px',
                        height: '32px'
                    }}
                />
            </Box>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: '4px' }}>
                    <Box sx={{ ...mediumTextSx }}>{commentItem.fullName}</Box>
                    <Box sx={{ ...smallTextSx, ml: '8px', mt: '2px' }}>
                        Added on {dayjs(commentItem.createAt).format('DD/MM/YYYY [at] HH:mm')}
                    </Box>
                </Box>
                <TinyMceWrap
                    focus={isEditing}
                    setIsFocus={setIsEditing}
                    placeholder="Add a more detailed description..."
                    placeHolderSx={{ minHeight: '24px' }}
                    value={commentItem.content}
                    handleSave={handleEdit}
                    preventClick={true}
                />
                <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileChange}
                />
                {commentItem.editable &&
                    isEditing === false &&
                    <Box sx={{ display: 'flex', mt: '4px' }}>
                        <Box
                            sx={{
                                ...smallTextSx,
                                cursor: isLoading ? 'normal' : 'pointer',
                                textDecoration: isLoading ? 'none' :'underline'
                            }}
                            onClick={handleButtonClick}
                        >
                            {isLoading
                                ? `Uploading${'.'.repeat(dots)}`
                                : <AttachmentOutlinedIcon sx={{ fontSize: '16px' }} />
                            }
                        </Box>
                        <Box sx={{ display: isLoading ? 'none' : 'flex' }}>
                            <Box sx={{ ...dotSx }}>&nbsp;•&nbsp;</Box>
                            <Box
                                sx={{ ...smallTextSx, ...textButtonSx }}
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </Box>
                            <Box sx={{ ...dotSx }}>&nbsp;•&nbsp;</Box>
                            <Box sx={{ ...smallTextSx, ...textButtonSx }}>
                                Delete
                            </Box>
                        </Box>
                    </Box>
                }
                <Box sx={{
                    display: 'flex',
                    mt: isEditing ? '16px' : '0'
                }}>
                    {commentItem.attachments &&
                        commentItem.attachments.map((attachment: any, index: number) => (
                            <CommentAttachment
                                key={index}
                                isEditing={isEditing}
                                attachment={attachment}
                                reFetch={reFetch}
                            />
                        ))
                    }
                </Box>
            </Box>
        </Box>
    )
}

export default CommentItem