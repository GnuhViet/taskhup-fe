import React, { useEffect } from 'react'

import Box from '@mui/material/Box'
import Input from '@mui/joy/Input'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ReplayIcon from '@mui/icons-material/Replay'
import IconButton from '@mui/material/IconButton'
import DateTimePickerPopOver from '~/components/Common/DateTimePickerPopOver'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { isBlank } from '~/core/utils/data-utils'
dayjs.extend(customParseFormat)

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

export interface DateTimeInputProps {
    id: string
    defaultValue: string
    handleValueChange: (value: string) => void
}

const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm'

const DateTimeInput: React.FC<DateTimeInputProps> = ({ id, defaultValue, handleValueChange }) => {
    const inputRef = React.useRef(null)
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [open, setOpen] = React.useState(false)

    const [inputValue, setInputValue] = React.useState(defaultValue)
    const [isValidDate, setIsValidDate] = React.useState(true)

    const handleInputBlur = (value: string) => {
        const date = dayjs(value, DATE_TIME_FORMAT, true)
        setIsValidDate(date.isValid())
        if (date.isValid()) {
            handleValueChange(value)
        }
    }

    return (
        <Box sx={{ position: 'relative' }}>
            <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={() => handleInputBlur(inputValue)}
                sx={{ pr: '28px !important', ...bgColorSx }}
                placeholder='dd/mm/yyyy hh:mm'
                error={!isValidDate}
            />
            <Box sx={{ position: 'absolute', top: '4px', right: '2px' }}>
                <IconButton
                    size='small'
                    onClick={() => {
                        if (!isValidDate) {
                            // set input value to default value
                            setInputValue(defaultValue)
                            setIsValidDate(true)
                        }
                        setOpen(true)
                        setAnchorEl(inputRef.current)
                    }}
                >
                    <CalendarMonthIcon fontSize="inherit" sx={{ color: '#172b4d' }} />
                </IconButton>
            </Box>
            <Box sx={{
                display: isValidDate ? 'none' : 'block',
                position: 'absolute',
                top: '4px',
                right: '30px'
            }}>
                <IconButton
                    size='small'
                    onClick={() => {
                        if (!isValidDate) {
                            setInputValue(defaultValue)
                            setIsValidDate(true)
                        }
                    }}
                >
                    <ReplayIcon fontSize="inherit" sx={{ color: '#172b4d' }} />
                </IconButton>
            </Box>
            <DateTimePickerPopOver
                id={`date-time-input-datetime-picker-popover-${id}`}
                open={open}
                anchorEl={anchorEl}
                onClose={() => setOpen(false)}
                value={isBlank(inputValue) ? dayjs().format(DATE_TIME_FORMAT) : inputValue}
                handleValueChange={(value) => {
                    setInputValue(value)
                    handleValueChange(value)
                    setOpen(false)
                }}
            />
        </Box>
    )
}

export default DateTimeInput