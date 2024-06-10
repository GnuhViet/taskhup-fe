import React from 'react'
import { Card as MuiCard, Tooltip } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
// import SimpleModal from './CardDetailModal/CardDialogFC'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '~/core/model/card.model'
import { useDispatch } from 'react-redux'
import { setDisableDrag, setOpenCardDialog } from '~/core/redux/slices/boardSlice'
import Box from '@mui/material/Box'
import moment from 'moment'
import { ReactComponent as CheckboxIcon } from '~/assets/checkbox.svg'
import { ReactComponent as CommentIcon } from '~/assets/comment.svg'
import { ReactComponent as EyeIcon } from '~/assets/eye.svg'
import { ReactComponent as AttachmentIcon } from '~/assets/attachment.svg'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { isBlank } from '~/core/utils/data-utils'
import CircleAvatar from '~/components/Common/CircleAvatar'
import AvatarGroup from '@mui/material/AvatarGroup'


interface CardFCProps {
    card: Card
}

const iconTextSx = {
    fontWeight: '400',
    fontSize: '14px',
    color: '#44546f',
    lineHeight: '18px'
}

const tooltipOffset = {
    popper: {
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, -5]
                }
            }
        ]
    }
}

const itemWrapSx = {
    display: 'flex',
    alignItems: 'center',
    mr: '12px',
    mb: '8px',
    p: '0 4px'
}

const dateWrapSx = {
    display: 'flex',
    alignItems: 'center',
    mr: '12px',
    mb: '8px'
}

function countTrueValues(jsonString: string): string {
    if (isBlank(jsonString)) return '0/0'
    // Chuyển chuỗi JSON thành đối tượng JavaScript
    const data = JSON.parse(jsonString)

    // Đếm số giá trị 'checked' là true
    const trueCount = data.reduce((acc: any, item: any) => acc + (item.checked === true ? 1 : 0), 0)

    // Tổng số phần tử trong mảng
    const totalCount = data.length

    // Trả về chuỗi theo định dạng "trueCount/totalCount"
    return `${trueCount}/${totalCount}`
}

const formatDate = (dateString: string) => {
    if (isBlank(dateString)) return ''

    const hasTime = dateString.includes(':')
    const isMidnight = dateString.endsWith('00:00')
    const date = moment(dateString, 'YYYY-MM-DDTHH:mm:ss')
    const now = moment()

    if (date.year() === now.year()) {
        // If the date is in the current year, format it as 'MMM D at HH:mm' if it has time, or 'MMM D' if it doesn't
        // If the time is '00:00', remove it // 'MMM D [at] HH:mm'
        return date.format(hasTime && !isMidnight ? 'MMM D' : 'MMM D')
    } else {
        // Otherwise, use the original format
        // If the time is '00:00', remove it
        return date.format(hasTime && !isMidnight ? format : 'DD/MM/YYYY')
    }
}

const compareDate = (inputDate: string) => {
    const now = moment()
    const date = moment(inputDate, 'YYYY-MM-DDTHH:mm:ss')

    const diff = now.diff(date, 'days')

    if (diff < 0) {
        // The current date is less than the input date
        return -1
    } else if (diff <= 1) {
        // The current date is within 1 day of the input date
        return 1
    } else {
        // The current date is more than the input date
        return 0
    }
}

const CurrentStatus = ({ status, card }) => {

    const currentType = {
        0: { title: 'Overdue', color: '#ae2a19', backgroundColor: '#FFD5D2', tooltip: 'This card is past due.' },
        1: { title: 'Due soon', color: '#172b4d', backgroundColor: '#F5CD47', tooltip: 'This card is due in less than twenty-fours hours.' },
        2: { title: 'Complete', color: '#ffffff', backgroundColor: '#1F845B', tooltip: 'This card is complete.' },
        4: { title: 'In progress', color: '#44546f', backgroundColor: 'transparent', tooltip: 'This card is due later.' }
    }

    return (
        <Box
            sx={{
                width: 'fit-content',
                height: '18px',
                lineHeight: '19px',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: currentType[status].backgroundColor,
                color: currentType[status].color,
                borderRadius: '3px',
                p: '14px 4px 12px 4px'
            }}
        >
            <Tooltip title={currentType[status].tooltip}>
                <Box
                    sx={{
                        display: 'flex'
                    }}
                >
                    <AccessTimeOutlinedIcon sx={{ fontSize: '16px', color: 'inherit' }} />
                    <Box sx={{
                        fontWeight: '400',
                        fontSize: '14px',
                        color: 'inherit',
                        lineHeight: '18px'
                    }}>
                        &nbsp;{`${formatDate(card?.fromDate)} -  ${formatDate(card?.deadlineDate)}`}
                    </Box>
                </Box>
            </Tooltip>
        </Box>
    )
}

const LabelItem = ({ label }) => {
    return (
        <Tooltip title={label?.title}>
            <Box
                sx={{
                    width: '38px',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: label?.colorCode,
                    cursor: 'pointer',
                    '&:hover': {
                        boxShadow: 'inset 0 0 0 1000px rgba(0, 0, 0, 0.3)'
                    }
                }}
            />
        </Tooltip>
    )
}

const CardFC: React.FC<CardFCProps> = ({ card }) => {
    //<editor-fold desc="Hook & State">
    const dispatch = useDispatch()

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: card.id,
        data: { ...card }
    })

    const dndKitCardStyles = {
        // touchAction: 'none', // Dành cho sensor default dạng PointerSensor
        // Nếu sử dụng CSS.Transform như docs sẽ lỗi kiểu stretch
        // https://github.com/clauderic/dnd-kit/issues/117
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : undefined,
        border: isDragging ? '1px solid #2ecc71' : undefined
    }
    //</editor-fold>

    const handleClickOpen = async () => {
        await dispatch(setOpenCardDialog({
            open: true,
            cardId: card.id
        }))
        await dispatch(setDisableDrag(true))
    }

    const shouldShowCardActions = () => {
        return card?.isWatchCard !== 0
            || card?.commentCount !== 0
            || card?.fromDate !== null
            || card?.deadlineDate !== null
            || card?.attachmentCount !== 0
            || countTrueValues(card?.checkListsItems) !== '0/0'
    }

    return (
        <Box>
            <MuiCard
                ref={setNodeRef} style={dndKitCardStyles} {...attributes} {...listeners}
                sx={{
                    cursor: 'pointer',
                    boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                    overflow: 'unset',
                    display: card?.FE_PlaceholderCard ? 'none' : 'block',
                    outline: '1px solid transparent',
                    borderRadius: '8px',
                    '&:hover': {
                        outlineColor: (theme) => theme.palette.primary.main,
                        outlineWidth: '2px'
                    }
                    // overflow: card?.FE_PlaceholderCard ? 'hidden' : 'unset',
                    // height: card?.FE_PlaceholderCard ? '0px' : 'unset'
                }}
                onClick={handleClickOpen}
            >
                {card?.cover &&
                    <CardMedia sx={{ height: 140, borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} image={card?.cover} />
                }

                {(card?.selectedLabels && card?.selectedLabels.length > 0) &&
                    <Box
                        sx={{ p: '12px 12px 0 12px' }}
                    >
                        <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {card?.selectedLabels.map((label, index) => (
                                <LabelItem key={index} label={label} />
                            ))}
                        </Box>
                    </Box>
                }

                <Box sx={{ position: 'relative' }}>
                    <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                        <Typography>{card?.title}</Typography>
                    </CardContent>
                    {shouldShowCardActions() &&
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            p: '0 12px 12px 12px',
                        }}>
                            {card?.isWatchCard !== 0 &&
                                <Tooltip title='You are watching this card.'>
                                    <Box sx={itemWrapSx}>
                                        <EyeIcon />
                                    </Box>
                                </Tooltip>
                            }
                            {(card?.fromDate !== null || card?.deadlineDate !== null) &&
                                <Box sx={dateWrapSx}>
                                    {
                                        card?.workingStatus == 1
                                            ? <CurrentStatus status={2} card={card} />
                                            : compareDate(card?.deadlineDate) >= 0
                                                ? <CurrentStatus status={compareDate(card?.deadlineDate)} card={card} />
                                                : <CurrentStatus status={4} card={card} />
                                    }
                                </Box>
                            }
                            {card?.commentCount !== 0 &&
                                <Tooltip title='Comments'>
                                    <Box sx={itemWrapSx}>
                                        <CommentIcon />
                                        <Box sx={iconTextSx}>
                                            &nbsp;{card?.commentCount}
                                        </Box>
                                    </Box>
                                </Tooltip>
                            }
                            {card?.attachmentCount !== 0 &&
                                <Tooltip title='Attachments'>
                                    <Box sx={itemWrapSx}>
                                        <AttachmentIcon />
                                        <Box sx={iconTextSx}>
                                            &nbsp;{card?.attachmentCount}
                                        </Box>
                                    </Box>
                                </Tooltip>
                            }
                            {countTrueValues(card?.checkListsItems) !== '0/0' &&
                                <Tooltip title='Checklist items'>
                                    <Box sx={itemWrapSx}>
                                        <CheckboxIcon />
                                        <Box sx={iconTextSx}>
                                            &nbsp;{countTrueValues(card?.checkListsItems)}
                                        </Box>
                                    </Box>
                                </Tooltip>
                            }
                        </Box>
                    }
                    {card?.members &&
                        <Box sx={{ position: 'absolute', right: '6px', bottom: '6px' }}>
                            <AvatarGroup
                                max={2}
                                sx={{
                                    gap: '2px',
                                    '& .MuiAvatar-root': {
                                        width: 24,
                                        height: 24,
                                        fontSize: 12,
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer',
                                        '&:first-of-type': { bgcolor: '#8b9aac' }
                                    }
                                }}
                            >
                                {card?.members.map((member, index) => (
                                    <Tooltip key={index} title={`${member.fullName} (${member.username})`}>
                                        <Box sx={{ ml: '4px' }}>
                                            <CircleAvatar
                                                src={member.avatarUrl}
                                                alt={member.fullName}
                                                sx={{ width: '24px', height: '24px' }}
                                            />
                                        </Box>
                                    </Tooltip>
                                ))}
                            </AvatarGroup>
                        </Box>
                    }
                </Box>
            </MuiCard>
        </Box>
    )
}

export default CardFC