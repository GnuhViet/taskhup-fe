import React, { useEffect } from 'react'
import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import ListIcon from '@mui/icons-material/List'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import TextBoxToolTip from '~/components/Common/TextBoxToolTip'
import Checkbox from '@mui/material/Checkbox'
import { useLazyGetFieldsQuery } from '~/core/redux/api/board-template.api'
import { ApiResponse } from '~/core/services/api.model'

const borderBottom = {
    borderBottom: '1px solid #DCDFE4'
}

const titleSx = {
    frontSize: '20px',
    fontWeight: '500',
    maxWidth: '150px'
}

const checkBoxSx = {
    p: '6px 4px',
    m: '0 2px'
}

export interface CustomFieldDialogProps {
    id: string
    open: boolean
    anchorEl: HTMLElement | null
    onClose: () => void
    templateId: string
    cardId: string
}

export interface FieldItemProps {
    item: any
}

const CustomFieldDialog: React.FC<CustomFieldDialogProps> = ({ id, open, anchorEl, onClose, templateId, cardId }) => {
    const [getField, { isLoading: getLoading }] = useLazyGetFieldsQuery()

    const [data, setData] = React.useState<any>([])
    const [fillterName, setFillterName] = React.useState('')

    const fetchData = async () => {
        const response = await getField(templateId).unwrap() as ApiResponse<any>
        const newData = response.data.map((item: any) => {
            if (item.type === 'DROPDOWN') {
                return {
                    ...item,
                    options: item?.options.map((option: any, index: any) => ({
                        ...option,
                        id: index
                    }))
                }
            } else {
                return item
            }
        })
        setData(newData)
    }

    useEffect(() => {
        if (open) {
            fetchData()
        }
    }, [open])

    if (getLoading) {
        return <div>Loading...</div>
    }

    const FieldItem: React.FC<FieldItemProps> = ({ item }) => {
        return (
            <Box sx={{ p: '2px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 'auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Checkbox
                        sx={checkBoxSx}
                    />
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#F7F8F9',
                        borderRadius: '2px',
                        height: '34px',
                        paddingLeft: '8px',
                        width: '100%'
                    }}
                    >
                        {(() => {
                            switch (item.type) {
                                case 'DROPDOWN':
                                    return <ListIcon sx={{ fontSize: '20px', color: '#5E6C84' }} />
                                case 'TEXT':
                                    return <TextFieldsIcon sx={{ fontSize: '20px', color: '#5E6C84' }} />
                                case 'DATE':
                                    return <CalendarMonthIcon sx={{ fontSize: '20px', color: '#5E6C84' }} />
                                case 'CHECKBOX':
                                    return <CheckCircleOutlineIcon sx={{ fontSize: '20px', color: '#5E6C84' }} />
                                default:
                                    return null
                            }
                        })()}
                        <TextBoxToolTip sx={{
                            ...titleSx,
                            ml: '8px'
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
                <Box sx={{ justifyContent: 'center', width: '100%', display: 'flex', fontWeight: '500', color: '#44546f' }}>Field Select</Box>
                <Box sx={{ ...borderBottom, p: '8px 0 4px 0', mb: '6px' }}>
                    <TextField
                        placeholder='Field name'
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
                    <Box sx={{ fontSize: '12px', fontWeight: '500', color: '#44546f' }}>Fields</Box>
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
                                <FieldItem item={item} />
                            </Box>
                        )
                    })}
                </Box>
            </Box>
        </Popover >
    )
}

export default CustomFieldDialog