import React from 'react'
import Box from '@mui/material/Box'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import ProgressBar from '~/components/Common/ProgressBar'
import Checkbox from '@mui/joy/Checkbox'

const titleTextSx = {
    color: '#172b4d',
    fontWeight: '500'
}

export interface ChecklistSectionProps {
    cardId: string
    checkListItem: ChecklistItem[]
}

export interface ChecklistItem {
    id: string
    title: string
    checked: boolean
}

const ChecklistSection: React.FC<ChecklistSectionProps> = ({ cardId, checkListItem }) => {
    const caculateProgress = (): number => {
        const total = checkListItem.length
        const checked = checkListItem.filter(item => item.checked).length
        return (checked / total) * 100
    }

    const handleCheckItem = (id: string) => {
        checkListItem = checkListItem.map((item: ChecklistItem) => {
            if (item.id === id) {
                item.checked = !item.checked
            }
            return item
        })
    }

    return (
        <Box>
            <Box className="section-details card-detail-desc">
                <TaskAltOutlinedIcon className="left-icon" sx={{ ...titleTextSx }} />
                <Box className="section-title" sx={{ ...titleTextSx }}>Checklist</Box>
            </Box>
            <Box sx={{ ml: '40px' }}>
                <ProgressBar value={caculateProgress()} />
                <Box sx={{ mt: '12px', display: 'flex', flexDirection: 'column' }}>
                    {checkListItem.map((item: ChecklistItem) => (
                        <Checkbox
                            sx={{ mb: '8px' }}
                            key={item.id}
                            label={item.title}
                            checked={item.checked}
                            onChange={() => handleCheckItem(item.id)}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    )
}

export default ChecklistSection