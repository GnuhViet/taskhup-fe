import React from 'react'
import Box from '@mui/material/Box'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import AttachmentItem from '../CardItems/AttachmentItem'

const titleTextSx = {
    color: '#172b4d',
    fontWeight: '500'
}

export interface SectionProps {
    attachments: any[]
    cardId: string
    reFetch: () => void
}

const AttachmentSection: React.FC<SectionProps> = ({ attachments, cardId, reFetch }) => {
    return (
        <Box>
            <Box className="section-details card-detail-desc">
                <AttachFileOutlinedIcon className="left-icon" sx={{ ...titleTextSx }} />
                <Box className="section-title" sx={{ ...titleTextSx }}>Attachments</Box>
            </Box>
            <Box sx={{ ml: '40px' }}>
                {attachments.map((attachment, index) => (
                    <AttachmentItem key={index} attachment={attachment} cardId={cardId} reFetch={reFetch} />
                ))}
                {/* <AttachmentItem /> */}
                {/* <AttachmentItem /> */}
            </Box>
        </Box>
    )
}

export default AttachmentSection