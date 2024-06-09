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
import { EditCommentContentReq, UploadAttachmentReq } from '~/core/services/board-card-services.model'
import { useDeleteCardCommentMutation, useEditCommentContentMutation, useUploadAttachmentMutation } from '~/core/redux/api/board-card.api'
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
    const [uploadAttachment, { isLoading: isLoadingUploadAttach }] = useUploadAttachmentMutation()
    const [editCommentContent, { isLoading: isLoadEditContent }] = useEditCommentContentMutation()
    const [deleteComment, { isLoading: isLoadDeleteComment }] = useDeleteCardCommentMutation()

    const [isEditing, setIsEditing] = React.useState(false)
    const [isEditAttachMent, setIsEditAttachMent] = React.useState(false)
    const [isLoadingDeleteAttach, setIsLoadingDeleteAttach] = React.useState(false)

    const handleEdit = async (value: string) => {
        if (!value || value === commentItem.content) return

        try {
            await editCommentContent({
                content: value,
                id: commentItem.id
            } as EditCommentContentReq)
            await reFetch()
        } catch (error) {
            console.error('Error editing comment:', error)
        }
    }

    const handleDeleteComment = async () => {
        try {
            await deleteComment({ id: commentItem.id })
            await reFetch()
        } catch (error) {
            console.error('Error deleting comment:', error)
        }
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

    const [editorValue, setEditorValue] = useState(commentItem.content)

    // useEffect(() => {
    //     setEditorValue(commentItem.content)
    // }, [isEditing])

    const isApiLoading = isLoadingUploadAttach || isLoadEditContent || isLoadDeleteComment || isLoadingDeleteAttach

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
                    value={editorValue}
                    handleSave={handleEdit}
                    preventClick={true}
                />
                <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                {commentItem.editable &&
                    isEditing === false &&
                    <Box sx={{ display: 'flex', mt: '4px' }}>
                        <Box
                            sx={{
                                ...smallTextSx,
                                cursor: isApiLoading ? 'normal' : 'pointer',
                                textDecoration: isApiLoading ? 'none' : 'underline'
                            }}
                            onClick={handleButtonClick}
                        >
                            {isApiLoading
                                ? `Processing${'.'.repeat(dots)}`
                                : <AttachmentOutlinedIcon sx={{ fontSize: '16px' }} />
                            }
                        </Box>
                        <Box sx={{ display: isApiLoading ? 'none' : 'flex' }}>
                            <Box sx={{ ...dotSx }}>&nbsp;•&nbsp;</Box>
                            <Box
                                sx={{ ...smallTextSx, ...textButtonSx }}
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </Box>
                            <Box sx={{ ...dotSx }}>&nbsp;•&nbsp;</Box>
                            <Box
                                sx={{ ...smallTextSx, ...textButtonSx }}
                                onClick={handleDeleteComment}
                            >
                                Delete comment
                            </Box>
                            <Box sx={{ ...dotSx }}>&nbsp;•&nbsp;</Box>
                            <Box
                                sx={{ ...smallTextSx, ...textButtonSx }}
                                onClick={() => setIsEditAttachMent(!isEditAttachMent)}
                            >
                                {isEditAttachMent ? 'Cancel delete attachment' : 'Delete attachment'}
                            </Box>
                        </Box>
                    </Box>
                }
                <Box sx={{
                    display: 'flex',
                    mt: '6px'
                }}>
                    {commentItem.attachments &&
                        commentItem.attachments.map((attachment: any, index: number) => (
                            <CommentAttachment
                                key={index}
                                isEditing={isEditAttachMent}
                                attachment={attachment}
                                setIsLoadingDeleteAttach={setIsLoadingDeleteAttach}
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