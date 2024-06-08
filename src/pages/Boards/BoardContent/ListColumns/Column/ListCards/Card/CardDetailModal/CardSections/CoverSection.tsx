import React from 'react'
import Box from '@mui/material/Box'
import ObjectFitAvatar from '~/components/Common/ObjectFitAvatar'

export interface SectionProps {
    cardItem: any
    refetch: () => void
}

const CoverSection = () => {
    return (
        <Box>
            <ObjectFitAvatar
                src={'https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg'}
                alt={null}
                sx={{
                    width: '100%',
                    height: '200px',
                    borderRadius: '3px'
                }}
            />
        </Box>
    )
}

export default CoverSection