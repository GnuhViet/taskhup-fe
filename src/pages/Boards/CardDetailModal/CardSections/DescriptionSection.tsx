import React from 'react'
import Box from '@mui/material/Box'
import SubjectOutlinedIcon from '@mui/icons-material/SubjectOutlined'
import TinyMceWrap from '~/components/Common/TinyMceWrap'
import { useUpdateDescriptionMutation } from '~/core/redux/api/board-card.api'
import { isBlank } from '~/core/utils/data-utils'

const titleTextSx = {
    color: '#172b4d',
    fontWeight: '500'
}

export interface SectionProps {
    isFocusDetail: boolean
    setIsFocusDetail: (value: boolean) => void
    description: string
    cardId: string
    reFetch: () => void
}

const DescriptionSection: React.FC<SectionProps> = ({ isFocusDetail, setIsFocusDetail, description, cardId, reFetch }) => {
    const [updateDesc, { isLoading }] = useUpdateDescriptionMutation()

    const saveDesc = async (value: string) => {
        if (value === description) return

        try {
            await updateDesc({ boardCardId: cardId, description: value })
            await reFetch()
        } catch (error) {
            console.log('Error:', error)
        }
    }

    React.useEffect(() => {
        if (isBlank(description)) {
            setIsFocusDetail(true)
        } else {
            setIsFocusDetail(false)
        }
    }, [description])

    return (
        <Box>
            <Box className="section-details card-detail-desc">
                <SubjectOutlinedIcon className="left-icon" sx={{ ...titleTextSx }} />
                <Box className="section-title" sx={{ ...titleTextSx }}>Description</Box>
            </Box>
            <Box sx={{ ml: '40px' }}>
                <TinyMceWrap
                    focus={isFocusDetail}
                    setIsFocus={setIsFocusDetail}
                    placeholder="Add a more detailed description..."
                    placeHolderSx={{ minHeight: '90px' }}
                    value={description}
                    handleSave={saveDesc}
                />
            </Box>
        </Box>
    )
}

export default DescriptionSection