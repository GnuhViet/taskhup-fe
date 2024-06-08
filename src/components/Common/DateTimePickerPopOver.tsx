import React from 'react'
import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import Input from '@mui/joy/Input'
import dayjs, { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker'
import Button from '@mui/material/Button'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { isBlank } from '~/core/utils/data-utils'

dayjs.extend(customParseFormat)

const buttonSx = {
    color: 'white',
    backgroundColor: '#0c66e4',
    height: '32px',
    '&:hover': {
        backgroundColor: '#0055CC',
        border: 'none'
    }
}

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

export interface DateTimePickerProps {
    id: string
    open: boolean
    anchorEl: HTMLElement
    onClose?: () => void
    value: string //dd/mm/yyyy hh:mm
    handleValueChange: (value: string) => void
}

const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm'
const DATE_FORMAT = 'DD/MM/YYYY'
const TIME_FORMAT = 'HH:mm'

export interface Errors {
    date: boolean
    time: boolean
}

export interface Validate {
    isGreaterThan: string //dd/mm/yyyy hh:mm
    isLessThan: string //dd/mm/yyyy hh:mm
}

const DateTimePickerPopOver: React.FC<DateTimePickerProps> = ({ id, open, anchorEl, onClose, value, handleValueChange }) => {
    const [dateTimeValue, setDateTimeValue] = React.useState(dayjs(value, DATE_TIME_FORMAT))
    const [selectedDate, setSelectedDate] = React.useState(dayjs(dateTimeValue, DATE_FORMAT))
    const [selectedTime, setSelectedTime] = React.useState(dayjs(dateTimeValue, TIME_FORMAT))
    const [selectedDateString, setSelectedDateString] = React.useState(selectedDate.isValid() ? selectedDate.format(DATE_FORMAT) : '')
    const [selectedTimeString, setSelectedTimeString] = React.useState(selectedTime.isValid() ? selectedTime.format(TIME_FORMAT) : '')
    const dateInputRef = React.useRef<HTMLInputElement>(null)
    const timeInputRef = React.useRef<HTMLInputElement>(null)

    const [errors, setErrors] = React.useState<Errors>({
        date: false,
        time: false
    })

    React.useEffect(() => {
        setErrors({
            date: selectedDate.isValid() ? false : true,
            time: selectedTime.isValid() ? false : true
        })
    }, [selectedDateString, selectedTimeString])

    React.useEffect(() => {
        if (!open) return
        setDateTimeValue(dayjs(value, DATE_TIME_FORMAT))
        setSelectedDate(dayjs(value, DATE_FORMAT))
        setSelectedTime(dayjs(value, TIME_FORMAT))
        setSelectedDateString(dayjs(value, DATE_FORMAT).format(DATE_FORMAT))
        setSelectedTimeString(dayjs(value, TIME_FORMAT).format(TIME_FORMAT))
    }, [open])

    const handleSelectDate = (date: Dayjs) => {
        setSelectedDate(date)
        setSelectedDateString(date.format(DATE_FORMAT))
        setDateTimeValue(dayjs(`${date.format(DATE_FORMAT)} ${selectedTime.format(TIME_FORMAT)}`, DATE_TIME_FORMAT))
    }

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = event.target.value
        setSelectedDateString(newDate)
        setSelectedDate(dayjs(newDate, DATE_FORMAT))
        setDateTimeValue(dayjs(`${newDate} ${selectedTime.format(TIME_FORMAT)}`, DATE_TIME_FORMAT))
    }

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = event.target.value
        setSelectedTimeString(newTime)
        setSelectedTime(dayjs(newTime, TIME_FORMAT, true))
        setDateTimeValue(dayjs(`${selectedDate.format(DATE_FORMAT)} ${newTime}`, DATE_TIME_FORMAT, true))
    }

    return (
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left'
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
            }}
            slotProps={{
                paper: {
                    style: {
                        width: '320px',
                        borderRadius: '8px',
                        // border: '1px solid #B2B9C4',
                        boxShadow: '0',
                        marginTop: id === 'header-create-board-popover' ? '8px' : '0'
                    }
                }
            }}
            style={{ zIndex: 999 }}
        >
            <Box sx={{
                p: '18px',
                gridTemplateColumns: 'repeat(2, 134px)',
                gridGap: '16px',
                display: 'grid'
            }}>
                <Box>
                    <Box sx={{ display: 'flex', justifyItems: 'center', mb: '4px' }}>
                        <Box sx={{ ...labelTextSx }}>Date</Box>
                    </Box>
                    <Input
                        ref={dateInputRef}
                        value={selectedDateString}
                        onChange={handleDateChange}
                        placeholder={DATE_FORMAT}
                        error={errors.date}
                    />
                </Box>
                <Box>
                    <Box sx={{ display: 'flex', justifyItems: 'center', mb: '4px' }}>
                        <Box sx={{ ...labelTextSx }}>Time</Box>
                    </Box>
                    <Input
                        ref={timeInputRef}
                        value={selectedTimeString}
                        onChange={handleTimeChange}
                        placeholder={TIME_FORMAT}
                        error={errors.time}
                    />
                </Box>
            </Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDatePicker
                    value={dateTimeValue}
                    onChange={handleSelectDate}
                    views={['day', 'month', 'year']}
                    sx={{
                        '.MuiPickersToolbar-root': {
                            display: 'none'
                        },
                        '.MuiPickersLayout-actionBar': {
                            display: 'none'
                        }
                    }}
                />
            </LocalizationProvider>
            <Box sx={{ p: '18px', display: 'flex', justifyContent: 'flex-end' }}>

                <Box>
                    <Button
                        variant="text"
                        sx={{ height: '32px', mr: '12px' }}
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{ ...buttonSx }}
                        onClick={() => {
                            if (errors.date) {
                                const inputElement = dateInputRef.current?.querySelector('input')
                                inputElement?.focus()
                                return
                            }
                            if (errors.time) {
                                const inputElement = timeInputRef.current?.querySelector('input')
                                inputElement?.focus()
                                return
                            }
                            handleValueChange(dateTimeValue.format(DATE_TIME_FORMAT))
                            onClose()
                        }}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Popover >
    )
}

export default DateTimePickerPopOver