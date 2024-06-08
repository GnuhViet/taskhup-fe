import React from 'react'
import Box from '@mui/material/Box'
import CircleAvatar from '~/components/Common/CircleAvatar'
import Tooltip from '@mui/material/Tooltip'
import { IconButton } from '@mui/material'

const labelTextSx = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#44546f'
}

export interface SectionProps {
    members: any[]
    handleClickOpen: (event: any) => void
}

const MemberSection: React.FC<SectionProps> = ({ members, handleClickOpen }) => {
    return (
        <Box className="field member-field">
            <Box className="field-title" sx={{ ...labelTextSx }}>Members</Box>
            <Box className="field-content">
                {members?.map(member => (
                    <Box key={member.id}>
                        <Tooltip
                            title={member.fullName}
                            placement="bottom"
                        >
                            <Box>
                                <CircleAvatar
                                    src={member.avatarUrl}
                                    alt={member.fullName.charAt(0)}
                                    sx={{
                                        width: '32px',
                                        height: '32px',
                                        m: '0 6px 6px 0'
                                    }}
                                />
                            </Box>
                        </Tooltip>
                    </Box>
                ))}
                <Box
                    className="add-icon"
                    onClick={(event) => handleClickOpen(event)}
                >+</Box>
            </Box>
        </Box>
    )
}

export default MemberSection