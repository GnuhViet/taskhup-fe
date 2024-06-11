import Box from '@mui/material/Box'
import React from 'react'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded'
import TextBoxToolTip from '~/components/Common/TextBoxToolTip'
import { redirect, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setBoard } from '~/core/redux/slices/boardSlice'
import { isBlank } from '~/core/utils/data-utils'
import { useLazyGetUserWorkSpaceQuery } from '~/core/redux/api/workspace.api'
import { useUpdateStarBoardMutation } from '~/core/redux/api/board.api'
import { BoardStarReq } from '~/core/services/board-services.model'


const boxSx = {
    width: '194px',
    height: '96px',
    borderRadius: '3px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#F4F5F7 !important',
    backgroundPosition: '50%',
    backgroundSize: 'cover !important',
    cursor: 'pointer',
    transition: 'box-shadow 0.3s ease-in-out',
    boxShadow: 'none',
    '&:hover': {
        boxShadow: '0px 0px 7px 4px rgba(0, 0, 0, 0.4)'
    }
}

const starIconSx = {
    fontSize: '20px',
    display: 'flex',
    mb: '2px',
    alignItems: 'top'
}

export interface BoardItemProps {
    id: string
    title: string
    workspaceId: string
    desc?: string
    starred: boolean
    backgroundUrl?: string
    backgroundColor?: string
}

const BoardItem: React.FC<BoardItemProps> = ({ id, title, workspaceId, desc, starred, backgroundUrl, backgroundColor }) => {
    const [isBoardItemHover, setIsBoardItemHover] = React.useState(false)
    const [isStarHover, setIsStarHover] = React.useState(false)
    const navigate = useNavigate()

    const [refetch, { isLoading: isRefetching }] = useLazyGetUserWorkSpaceQuery()
    const [starBoard, { isLoading: isStarLoading }] = useUpdateStarBoardMutation()

    const onBoardClick = async () => {
        // console.log('board clicked')
        // await dispatch(setBoard(id))
        navigate(`/w/${workspaceId}/b/${id}`)
    }

    const onStarClick = async (event: any) => {
        event.stopPropagation()
        try {
            await starBoard({
                boardId: id,
                isStarred: !starred
            } as BoardStarReq).unwrap()

            await refetch({}).unwrap()
        } catch (error) {
            console.error('starBoard', error)
        }
    }

    return (
        <Box
            sx={{
                ...boxSx,
                backgroundImage: (backgroundColor === '#1976d2') ? `url(${backgroundUrl}) !important` : 'none',
                background: (backgroundColor !== '#1976d2') ? backgroundColor : 'none'
            }}
            onMouseEnter={() => setIsBoardItemHover(true)}
            onMouseLeave={() => setIsBoardItemHover(false)}
            onClick={onBoardClick}
        >
            <Box sx={{ m: '8px 8px 0px 8px', fontWeight: 'bold' }}>
                <TextBoxToolTip sx={{ fontSize: '16px', color: 'white' }} id={`title-${id}`} text={title} breakOnLine={2} />
            </Box>
            <Box sx={{ m: '0px 8px 8px 8px', display: 'flex', justifyContent: 'space-between', overflow: 'hidden', alignItems: 'flex-end' }}>
                <TextBoxToolTip sx={{ fontSize: '14px', color: 'white', width: starred ? '85%' : '100%' }} id={`desc-${id}`} text={desc} />
                <Box onMouseOver={() => setIsStarHover(true)} onMouseOut={() => setIsStarHover(false)} onClick={(event) => onStarClick(event)}>
                    {starred
                        ? isStarHover
                            ? <StarBorderRoundedIcon
                                sx={{
                                    ...starIconSx,
                                    color: backgroundColor === 'linear-gradient(to bottom right, #FF5733, #FFC300)' ? 'white' : '#E2B203',
                                    transform: 'scale(1.1)',
                                    transition: 'all 0.2s ease'
                                }} />
                            : <StarRateRoundedIcon
                                sx={{
                                    ...starIconSx,
                                    color: backgroundColor === 'linear-gradient(to bottom right, #FF5733, #FFC300)' ? 'white' : '#E2B203'
                                }} />
                        : isBoardItemHover
                            ? isStarHover
                                ? <StarBorderRoundedIcon sx={{ ...starIconSx, color: 'white', transition: 'all 0.2s ease', transform: 'scale(1.2)' }} />
                                : <StarBorderRoundedIcon sx={{ ...starIconSx, color: 'white', transition: 'all 0.2s ease', transform: 'translateX(0)' }} />
                            : <StarBorderRoundedIcon sx={{ ...starIconSx, color: 'white', transition: 'all 0.2s ease', transform: 'translateX(100%)' }} />
                    }
                </Box>
            </Box>
        </Box>
    )
}

export default BoardItem