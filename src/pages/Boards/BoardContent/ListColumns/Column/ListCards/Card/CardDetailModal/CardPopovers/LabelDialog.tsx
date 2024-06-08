import React, { useEffect } from 'react'
import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import Checkbox from '@mui/material/Checkbox'
import TextBoxToolTip from '~/components/Common/TextBoxToolTip'
import { getContrastTextColor } from '~/core/utils/common-used'
import { useLazyGetLabelsQuery } from '~/core/redux/api/board-template.api'
import { ApiResponse } from '~/core/services/api.model'

const borderBottom = {
    borderBottom: '1px solid #DCDFE4'
}

const checkBoxSx = {
    p: '6px 4px',
    m: '0 2px'
}

const titleSx = {
    frontSize: '20px',
    fontWeight: '500',
    maxWidth: '150px'
}

export interface LabelDialogProps {
    id: string
    open: boolean
    anchorEl: HTMLElement | null
    onClose: () => void
    templateId: string
    cardId: string
}

export interface LabelItemProps {
    item: any
}

const LabelDialog: React.FC<LabelDialogProps> = ({ id, open, anchorEl, onClose, templateId, cardId }) => {
    const [triggerGetLabels, { isLoading: getLoading }] = useLazyGetLabelsQuery()
    const [data, setData] = React.useState<any>([])
    const [fillterName, setFillterName] = React.useState('')

    const fetchData = async () => {
        const response = await triggerGetLabels(templateId).unwrap() as ApiResponse<any>
        setData(response.data)
    }

    useEffect(() => {
        if (open) {
            fetchData()
        }
    }, [open])

    if (getLoading) return <div>Loading...</div>

    const LabelItem: React.FC<LabelItemProps> = ({ item }) => {
        return (
            <Box sx={{ p: '2px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 'auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Checkbox
                        sx={checkBoxSx}
                    />
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: `${item.colorCode}`,
                        borderRadius: '2px',
                        height: '34px',
                        paddingLeft: '8px',
                        width: '100%',
                        justifyContent: 'center'
                    }}
                    >
                        <TextBoxToolTip sx={{
                            ...titleSx,
                            color: getContrastTextColor(item.colorCode)
                        }} id='1asd' text={item.title} breakOnLine={1} />
                    </Box>
                </Box>
            </Box>
        )
    }

    return (
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
            slotProps={{
                paper: {
                    style: {
                        width: '320px',
                        borderRadius: '8px',
                        boxShadow: '0'
                    }
                }
            }}
            style={{ zIndex: 999 }}
        >
            <Box sx={{
                m: '12px 24px'
            }}>
                <Box sx={{ justifyContent: 'center', width: '100%', display: 'flex', fontWeight: '500', color: '#44546f' }}>Label Settings</Box>
                <Box sx={{ ...borderBottom, p: '8px 0 4px 0', mb: '6px' }}>
                    <TextField
                        placeholder='Label name'
                        size='small'
                        sx={{ width: '100%' }}
                        onChange={(e) => setFillterName(e.target.value)}
                    />
                    <FormHelperText>Type name to search</FormHelperText>
                </Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <Box sx={{ fontSize: '12px', fontWeight: '500', color: '#44546f' }}>Labels</Box>
                </Box>
                <Box sx={{
                    ...borderBottom,
                    pb: '8px',
                    mb: '6px',
                    maxHeight: '300px',
                    overflowY: 'scroll',
                    '&::-webkit-scrollbar': {
                        width: '6px',
                        height: '6px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#dcdde1',
                        borderRadius: '8px'
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#A8A8A8'
                    }
                }}>
                    {data.map((item: any) => {
                        return (
                            <Box
                                key={item.id}
                                sx={{
                                    display: item.title.toLowerCase().includes(fillterName.toLowerCase()) ? 'block' : 'none'
                                }}
                            >
                                <LabelItem item={item} />
                            </Box>
                        )
                    })}
                </Box>
            </Box>
        </Popover>
    )
}

export default LabelDialog