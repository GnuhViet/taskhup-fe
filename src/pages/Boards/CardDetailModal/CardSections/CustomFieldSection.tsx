import React from 'react'
import Box from '@mui/material/Box'
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined'
import CustomFieldItem from '../CardItems/CustomFieldItem'
import { useUpdateFieldValueMutation } from '~/core/redux/api/board-card.api'

const titleTextSx = {
    color: '#172b4d',
    fontWeight: '500'
}

export interface CustomFieldSectionProps {
    customFields: any[]
    selectedFieldsValue: any[]
    cardId: string
    reFetch: () => void
}

const CustomFieldSection: React.FC<CustomFieldSectionProps> = ({ customFields, selectedFieldsValue, cardId, reFetch }) => {
    const [updateFieldValue, { isLoading: isUpdating }] = useUpdateFieldValueMutation()

    const handleValueChange = async (id: any, value: any) => {
        const oldValue = selectedFieldsValue.find(s => s.fieldId === id).value
        if (oldValue === value) return

        try {
            await updateFieldValue({
                customFieldValue: {
                    fieldId: id,
                    value: value
                },
                boardCardId: cardId
            }).unwrap()

            await reFetch()
        } catch (error) {
            console.log('error', error)
        }
    }

    if (!customFields || !selectedFieldsValue) return (<></>)

    return (
        <Box>
            <Box className="section-details card-detail-desc">
                <DriveFileRenameOutlineOutlinedIcon className="left-icon" sx={{ ...titleTextSx }} />
                <Box className="section-title" sx={{ ...titleTextSx }}>Custom Fields</Box>
            </Box>
            <Box sx={{
                ml: '40px',
                gridTemplateColumns: 'repeat(3, 199px)',
                gridGap: '16px',
                display: 'grid'
            }}>
                {customFields?.filter((field) => selectedFieldsValue.map(s => s.fieldId).includes(field.id))
                    .map((field) => (
                        <CustomFieldItem
                            key={field.id}
                            item={{
                                id: field.id,
                                title: field.title,
                                type: field.type,
                                options: field.options?.map((option: any, index: number) => ({
                                    id: `${index + 1}`,
                                    title: option.title,
                                    color: option.color
                                })),
                                templateId: field.templateId
                            }}
                            defaultValue={selectedFieldsValue.find(s => s.fieldId === field.id)?.value || ''}
                            onValueChange={handleValueChange}
                        />
                    ))}
            </Box>
        </Box>
    )
}

export default CustomFieldSection