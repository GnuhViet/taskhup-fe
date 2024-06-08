import React from 'react'
import Box from '@mui/material/Box'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import ProgressBar from '~/components/Common/ProgressBar'
import Checkbox from '@mui/joy/Checkbox'
import ApiLoadingOverlay from '~/components/Common/ApiLoadingOverlay'
import { useUpdateCheckListValueMutation } from '~/core/redux/api/board-card.api'
import { UpdateCheckListValueReq } from '~/core/services/board-card-services.model'
import { Tooltip } from '@mui/material'

const titleTextSx = {
    color: '#172b4d',
    fontWeight: '500'
}

export interface ChecklistSectionProps {
    cardId: string
    checkListItem: ChecklistItem[]
    reFetch: () => void
}

export interface ChecklistItem {
    id: string
    title: string
    checked: boolean
}

const ChecklistSection: React.FC<ChecklistSectionProps> = ({ cardId, checkListItem, reFetch }) => {
    const [updateCheckListValue, { isLoading: updateCheckListLoading }] = useUpdateCheckListValueMutation()

    if (!checkListItem) {
        return <ApiLoadingOverlay />
    }

    const caculateProgress = (): number => {
        const total = checkListItem.length
        const checked = checkListItem.filter(item => item.checked).length
        return (checked / total) * 100
    }

    const handleCheckItem = async (id: string) => {
        try {
            await updateCheckListValue({
                id: id,
                checked: !checkListItem.find(item => item.id === id)?.checked,
                boardCardId: cardId
            } as UpdateCheckListValueReq).unwrap()

            await reFetch()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Box>
            <Box className="section-details card-detail-desc">
                <TaskAltOutlinedIcon className="left-icon" sx={{ ...titleTextSx }} />
                <Box className="section-title" sx={{ ...titleTextSx }}>Checklist</Box>
            </Box>
            <Box sx={{ ml: '40px' }}>
                <Tooltip title={`${Math.ceil(caculateProgress())}%`} placement="bottom">
                    <Box>
                        <ProgressBar value={caculateProgress()} />
                    </Box>
                </Tooltip>
                <Box sx={{ mt: '12px', display: 'flex', flexDirection: 'column' }}>
                    {checkListItem.map((item: ChecklistItem) => (
                        <Checkbox
                            sx={{ mb: '8px', width: 'fit-content' }}
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