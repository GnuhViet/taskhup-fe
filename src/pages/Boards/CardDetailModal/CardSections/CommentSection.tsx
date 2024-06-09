import React, { useEffect } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import SubdirectoryArrowRightOutlinedIcon from '@mui/icons-material/SubdirectoryArrowRightOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import CircleAvatar from '~/components/Common/CircleAvatar'
import TinyMceWrap from '~/components/Common/TinyMceWrap'
import CommentItem from '../CardItems/CommentItem'
import { useCreateCommentMutation } from '~/core/redux/api/board-card.api'
import { create } from 'lodash'

const titleTextSx = {
    color: '#172b4d',
    fontWeight: '500'
}

const labelTextSx = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#44546f'
}

export interface SectionProps {
    isShowComment: boolean
    setIsShowComment: (isShow: boolean) => void
    isFocusComment: boolean
    setIsFocusComment: (isFocus: boolean) => void
    comments: any[]
    userInfo: any
    cardId: string
    reFetch: () => void
}

const CommentSection: React.FC<SectionProps> = (
    {
        isShowComment,
        setIsShowComment,
        isFocusComment,
        setIsFocusComment,
        userInfo,
        cardId,
        reFetch,
        comments
    }
) => {

    const [createComment, { isLoading }] = useCreateCommentMutation()

    const handleAddNewComment = async (value: string) => {
        try {
            await createComment({
                boardCardId: cardId,
                content: value
            }).unwrap()

            await reFetch()
        } catch (error) {
            console.log('error', error)
        }
    }

    const [value, setValue] = React.useState('')

    useEffect(() => {
        setValue('')
    }, [isShowComment])

    return (
        <Box>
            <Box className="section-details card-detail-desc">
                <SubdirectoryArrowRightOutlinedIcon className="left-icon" sx={{ ...titleTextSx }} />
                <Box className="section-title" sx={{ ...titleTextSx }}>Comments</Box>
                <Box sx={{ position: 'relative' }}>
                    <Box sx={{ position: 'absolute', top: '-2px' }}>
                        <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() => setIsShowComment(!isShowComment)}
                        >
                            {isShowComment
                                ? <VisibilityOutlinedIcon
                                    fontSize="small"
                                    sx={{ color: '#172b4d' }} />
                                :
                                <Box>
                                    <VisibilityOffOutlinedIcon
                                        fontSize="small"
                                        sx={{ color: '#172b4d' }} />

                                </Box>
                            }
                        </IconButton>
                    </Box>
                    <Box sx={{
                        ml: '40px',
                        mt: '4px',
                        display: isShowComment ? 'none' : 'block',
                        ...labelTextSx
                    }}>
                        4 comment from Việt Hưng Nguyễn, Tran Van A,... (2+ more)
                    </Box>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', mb: '16px' }}>
                <Box sx={{
                    mr: '10px',
                    mt: '4px'
                }}>
                    <CircleAvatar
                        src={userInfo?.avatar}
                        alt={userInfo?.fullName}
                        sx={{
                            width: '32px',
                            height: '32px'
                        }}
                    />
                </Box>
                <Box sx={{ width: '100%' }}>
                    <TinyMceWrap
                        focus={isFocusComment}
                        setIsFocus={setIsFocusComment}
                        placeholder="Write a comment..."
                        placeHolderSx={{ height: '40px' }}
                        value={value}
                        handleSave={handleAddNewComment}
                    />
                </Box>
            </Box>
            <Box sx={{
                display: isShowComment ? 'block' : 'none'
            }}>
                {comments &&
                    comments.map((comment, index) => (
                        <CommentItem
                            key={index}
                            commentItem={comment}
                            cardId={cardId}
                            reFetch={reFetch}
                        />
                    ))
                }
            </Box>
        </Box>
    )
}

export default CommentSection