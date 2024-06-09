import React from 'react'
import Box from '@mui/material/Box'
import ObjectFitAvatar from '~/components/Common/ObjectFitAvatar'

export interface SectionProps {
    coverUrl: string
}

const CoverSection: React.FC<SectionProps> = ({ coverUrl }) => {
    return (
        <Box
            sx={{
                minHeight: '200px'
            }}
        >
            <ObjectFitAvatar
                src={coverUrl}
                alt={null}
                sx={{
                    width: '100%',
                    height: '200px',
                    borderRadius: '3px'
                }}
                disableHoverShadown={true}
            />
        </Box>
    )
}

export default CoverSection