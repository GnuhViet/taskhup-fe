import React from 'react'

import Box from '@mui/material/Box'
import SingleLineTextBoxToolTip from '~/components/Common/SingleLineTextBoxToolTip'
import { getContrastTextColor } from '~/core/utils/common-used'

const labelTextSx = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#44546f'
}

export interface LabelSectionProps {
    selectedLabels: any[]
    handleClickOpen: (event: any) => void
}

const LabelSection: React.FC<LabelSectionProps> = ({ selectedLabels, handleClickOpen }) => {
    return (
        <Box className="field member-field">
            <Box className="field-title" sx={{ ...labelTextSx }}>Labels</Box>
            <Box className="field-content">
                {selectedLabels?.map(item => (
                    <Box
                        key={item.id}
                        sx = {{
                            minWidth: '40px',
                            minHeight: '32px',
                            p: '0 12px',
                            backgroundColor: item.colorCode,
                            m: '0 6px 6px 0',
                            borderRadius: '3px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            cursor: 'unset'
                        }}
                    >
                        <SingleLineTextBoxToolTip
                            id={`txtbx-tooltip-label-${item.id}`}
                            text={item.title}
                            sx={{
                                fontSize: '12px',
                                color: getContrastTextColor(item.colorCode),
                                fontWeight: '600',
                                width: '40px'
                            }}
                        />
                    </Box>
                ))}
                <Box
                    className="add-icon"
                    sx={{
                        borderRadius: '3px !important',
                    }}
                    onClick={(event) => handleClickOpen(event)}
                >+</Box>
            </Box>
        </Box>
    )
}

export default LabelSection