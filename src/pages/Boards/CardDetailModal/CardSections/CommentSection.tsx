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
import { CreateCommentReq } from '~/core/services/board-card-services.model'

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

function generateCommentString(comments: any[]) {
    if (!comments) return null
    // Tạo một map để lưu trữ các id duy nhất
    const uniqueComments = new Map()

    comments.forEach(comment => {
        // Nếu id chưa có trong map thì thêm vào
        if (!uniqueComments.has(comment.createBy)) {
            uniqueComments.set(comment.createBy, comment.fullName)
        }
    })

    // Lấy danh sách các fullName duy nhất
    const uniqueNames = Array.from(uniqueComments.values())

    // Xử lý các trường hợp đặc biệt
    if (uniqueNames.length === 0) return ''
    if (uniqueNames.length === 1) return uniqueNames[0]
    if (uniqueNames.length === 2) return `${uniqueNames[0]}, ${uniqueNames[1]}`

    const n = uniqueNames.length
    const moreText = n > 2 ? `...(+${n - 2} more)` : ''
    const result = `${uniqueNames.slice(0, 2).join(', ')}${moreText}`

    return result
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
            } as CreateCommentReq).unwrap()

            await reFetch()
        } catch (error) {
            console.log('error', error)
        }
    }

    const [value, setValue] = React.useState('')

    useEffect(() => {
        setValue('')
    }, [isShowComment])

    const [commentData, setCommentData] = React.useState<any[]>(comments)

    const handleItemRefect = async () => {
        setCommentData(null)
        await reFetch()
    }

    useEffect(() => {
        setCommentData(comments)
    }, [comments])

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
                    {commentData &&
                        <Box sx={{
                            ml: '40px',
                            mt: '4px',
                            display: isShowComment ? 'none' : 'block',
                            ...labelTextSx
                        }}>
                            {commentData?.length} comment from {generateCommentString(commentData)}
                        </Box>
                    }

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
                {commentData &&
                    commentData.map((comment, index) => (
                        <CommentItem
                            key={index}
                            commentItem={comment}
                            cardId={cardId}
                            reFetch={handleItemRefect}
                        />
                    ))
                }
            </Box>
        </Box>
    )
}

export default CommentSection