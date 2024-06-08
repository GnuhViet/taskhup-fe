import React, { useEffect, useRef } from 'react'
import Input from '@mui/joy/Input'
import Checkbox from '@mui/joy/Checkbox'
import Option from '@mui/joy/Option'
import Select, { SelectStaticProps } from '@mui/joy/Select'
import Box from '@mui/material/Box'
import ListIcon from '@mui/icons-material/List'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import IconButton from '@mui/material/IconButton'
import CloseRounded from '@mui/icons-material/CloseRounded'
import DateTimePickerPopOver from '~/components/Common/DateTimePickerPopOver'
import DateTimeInput from '~/components/Common/DateTimeInput'

const labelTextSx = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#44546f'
}

const bgColorSx = {
    backgroundColor: '#E2E4EA',
    borderRadius: '3px',
    // border: '1px solid #dfe1e6',
    border: 'none',
    '&:hover': {
        backgroundColor: '#CFD3DB'
    },
    '&.Mui-focused': {
        backgroundColor: '#FFFFFF'
    }
}

export interface CustomFieldItemProps {
    item: CustomFieldItemModel
    defaultValue: any
    onValueChange: (itemId: any, value: any) => void
}

export interface OptionItem {
    id: number
    title: string
    color: string
}

export class CustomFieldItemModel {
    id: string
    title: string
    type: string // TEXT, DATE, DROPDOWN, CHECKBOX
    option: OptionItem[]
    templateId: string
}

interface ItemProps {
    item: CustomFieldItemModel;
    value: any;
    setValue: (value: any) => void;
    handleValueChange: (value: any) => void;
}

const InputType: React.FC<ItemProps> = ({ item, value, setValue, handleValueChange }) => {
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyItems: 'center', mb: '4px' }}>
                <TextFieldsIcon sx={{ ...labelTextSx, fontSize: '20px' }} />
                <Box sx={{ ...labelTextSx, mt: '1px', ml: '6px' }}>{item.title}</Box>
            </Box>
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={() => handleValueChange(value)}
                sx={{ ...bgColorSx }}
                placeholder={`Add ${item.title}...`}
            />
        </Box>
    )
}

const CheckBoxType: React.FC<ItemProps> = ({ item, value, setValue, handleValueChange }) => {
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyItems: 'center', mb: '4px' }}>
                <CheckCircleOutlineIcon sx={{ ...labelTextSx, fontSize: '20px' }} />
                <Box sx={{ ...labelTextSx, mt: '1px', ml: '6px' }}>{item.title}</Box>
            </Box>
            <Box sx={{ height: '34px', display: 'flex', alignItems: 'center' }}>
                <Checkbox
                    checked={value === 'true'}
                    onChange={(e) => {
                        setValue(e.target.checked ? 'true' : 'false')
                        handleValueChange(e.target.checked ? 'true' : 'false')
                    }}
                    label={`${item.title}`}
                />
            </Box>
        </Box>
    )
}

const DropDownType: React.FC<ItemProps> = ({ item, value, setValue, handleValueChange }) => {
    const [selectedOption, setSelectedOption] = React.useState(item.option.find((option) => option.id === value))
    const action: SelectStaticProps['action'] = React.useRef(null)
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyItems: 'center', mb: '4px' }}>
                <ListIcon sx={{ ...labelTextSx, fontSize: '20px' }} />
                <Box sx={{ ...labelTextSx, mt: '1px', ml: '6px' }}>{item.title}</Box>
            </Box>
            <Box sx={{ height: '34px', display: 'flex', alignItems: 'center' }}>
                <Select
                    action={action}
                    placeholder="Choose one…"
                    sx={{
                        width: '100%',
                        borderRadius: '3px',
                        border: 'none',
                        backgroundColor: value ? selectedOption?.color : '#E2E4EA',
                        '&:hover': {
                            backgroundColor: value ? selectedOption?.color : '#CFD3DB',
                            boxShadow: value ? 'inset 0 0 0 1000px rgba(0, 0, 0, 0.1)' : 'none'
                        }
                    }}
                    value={value}
                    onChange={(e, newValue) => {
                        setValue(newValue)
                        setSelectedOption(item.option.find((option) => option.id === newValue))
                        handleValueChange(newValue)
                    }}
                    {...(value && {
                        endDecorator: (
                            <IconButton
                                size="small"
                                onMouseDown={(event) => {
                                    event.stopPropagation()
                                }}
                                onClick={() => {
                                    setValue(null)
                                    handleValueChange(null)
                                    action.current?.focusVisible()
                                }}
                                sx={{
                                    color: '#172b4d',
                                    '&:hover': {
                                        boxShadow: 'inset 0 0 0 1000px rgba(0, 0, 0, 0.13)'
                                    }
                                }}
                            >
                                <CloseRounded sx={{ fontSize: '14px' }} />
                            </IconButton>
                        ),
                        indicator: null
                    })}
                >
                    {item.option.map((option) => (
                        <Option
                            key={option.id}
                            value={option.id}
                        >
                            {option.title}
                        </Option>
                    ))}
                </Select>
            </Box>
        </Box>
    )
}

const DateTimePickerType: React.FC<ItemProps> = ({ item, value, setValue, handleValueChange }) => {
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyItems: 'center', mb: '4px' }}>
                <CalendarMonthIcon sx={{ ...labelTextSx, fontSize: '20px' }} />
                <Box sx={{ ...labelTextSx, mt: '1px', ml: '6px' }}>{item.title}</Box>
            </Box>
            <Box sx={{ position: 'relative' }}>
                <DateTimeInput
                    id={item.id}
                    defaultValue={value}
                    handleValueChange={(value: string) => {
                        setValue(value)
                        handleValueChange(value)
                    }}
                />
            </Box>
        </Box>
    )
}

const CustomFieldItem: React.FC<CustomFieldItemProps> = ({ item, defaultValue, onValueChange }) => {
    const [value, setValue] = React.useState(defaultValue)

    const handleValueChange = (value: any) => {
        onValueChange(item.id, value)
    }

    return (
        <Box>
            {(() => {
                switch (item.type) {
                    case 'DROPDOWN':
                        return <DropDownType item={item} value={value} setValue={setValue} handleValueChange={handleValueChange} />
                    case 'TEXT':
                        return <InputType item={item} value={value} setValue={setValue} handleValueChange={handleValueChange} />
                    case 'DATE':
                        return <DateTimePickerType item={item} value={value} setValue={setValue} handleValueChange={handleValueChange} />
                    case 'CHECKBOX':
                        return <CheckBoxType item={item} value={value} setValue={setValue} handleValueChange={handleValueChange} />
                    default:
                        return null
                }
            })()}
        </Box>
    )
}

export default CustomFieldItem