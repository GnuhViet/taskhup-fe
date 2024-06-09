import React, { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined'
import Textarea from '@mui/joy/Textarea'
import DialogContentText from '@mui/material/DialogContentText'
import { useUpdateCardTitleMutation } from '~/core/redux/api/board-card.api'
import { isBlank } from '~/core/utils/data-utils'
import IconButton from '@mui/material/IconButton'
import ReplayIcon from '@mui/icons-material/Replay'

const titleTextSx = {
    color: '#172b4d',
    fontWeight: '500'
}

export interface SectionProps {
    title: string
    columnName: string
    cardId: string
    reFetch: () => void
}

const TitleSection: React.FC<SectionProps> = ({ title, columnName, cardId, reFetch }) => {
    //'Trello Tip: 🌊Slide your Q\'s into this handy list so your team keeps on flowing. list so your team keeps on flowing'
    const [value, setValue] = React.useState(title)
    const [updateTitle, { isLoading }] = useUpdateCardTitleMutation()
    const [isTitleBlank, setIsTitleBlank] = React.useState(isBlank(title))
    const textareaRef = useRef(null)

    useEffect(() => {
        setValue(title)
        setIsTitleBlank(isBlank(title))
    }, [title])

    const handleBlur = async () => {
        if (value === title) return

        if (isBlank(value)) {
            setIsTitleBlank(true)
            const inputElement = textareaRef.current?.querySelector('textarea')
            inputElement?.focus()
            return
        }

        try {
            await updateTitle({ boardCardId: cardId, title: value }).unwrap()
            await reFetch()
        } catch (error) {
            console.log('error', error)
        }
    }

    return (
        <Box
            className="title-section"
            sx={{ p: '16px 24px' }}
        >
            <SubtitlesOutlinedIcon className="left-icon subtitlesIcon" sx={{ ...titleTextSx }} />
            <Box>
                <Box sx={{ position: 'relative' }}>
                    <Box sx={{ display: 'none' }}>{title}</Box>
                    <Textarea
                        ref={textareaRef}
                        value={value}
                        variant="plain"
                        className="textarea-title"
                        sx={{ ...titleTextSx }}
                        spellCheck={false}
                        onChange={(e) => setValue(e.target.value)}
                        error={isTitleBlank}
                        onBlur={handleBlur}
                    />
                    <Box sx={{
                        display: !isTitleBlank ? 'none' : 'block',
                        position: 'absolute',
                        top: '0px',
                        right: '30px'
                    }}>
                        <IconButton
                            size='small'
                            onClick={() => {
                                if (isTitleBlank) {
                                    setValue(title)
                                    setIsTitleBlank(false)
                                }
                            }}
                        >
                            <ReplayIcon fontSize="inherit" sx={{ color: '#172b4d' }} />
                        </IconButton>
                    </Box>
                </Box>

                <Box>
                    {isTitleBlank && (
                        <DialogContentText sx={{ color: '#f44336' }}>
                            {'Title can\'t be empty'}
                        </DialogContentText>
                    )}
                </Box>
                <DialogContentText className='sub-title' sx={{ color: '#44546f' }}>
                    in list <a style={{ color: 'inherit' }} href="#">{columnName}</a>
                </DialogContentText>
            </Box>
        </Box>
    )
}

export default TitleSection