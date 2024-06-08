import React from 'react'
import Box from '@mui/material/Box'
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined'
import Textarea from '@mui/joy/Textarea'
import DialogContentText from '@mui/material/DialogContentText'

const titleTextSx = {
    color: '#172b4d',
    fontWeight: '500'
}

const TitleSection = () => {
    const [value, setValue] = React.useState('Trello Tip: 🌊Slide your Q\'s into this handy list so your team keeps on flowing. list so your team keeps on flowing')

    return (
        <Box
            className="title-section"
            sx={{ p: '16px 24px' }}
        >
            <SubtitlesOutlinedIcon className="left-icon subtitlesIcon" sx={{ ...titleTextSx }} />
            <Box>
                <Textarea
                    value={value}
                    variant="plain"
                    className="textarea-title"
                    sx={{ ...titleTextSx }}
                    spellCheck={false}
                    onChange={(e) => setValue(e.target.value)}
                />
                <DialogContentText className='sub-title' sx={{ color: '#44546f' }}>
                    in list <a style={{ color: 'inherit' }} href="#">Questions For Next Meeting</a>
                </DialogContentText>
            </Box>
        </Box>
    )
}

export default TitleSection