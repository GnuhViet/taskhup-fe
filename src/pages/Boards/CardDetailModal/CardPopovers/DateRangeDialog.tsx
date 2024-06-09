import React, { useEffect } from 'react'
import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import { DateRange } from 'react-date-range'
import Select, { SelectStaticProps } from '@mui/joy/Select'
import Option from '@mui/joy/Option'
import IconButton from '@mui/material/IconButton'
import CloseRounded from '@mui/icons-material/CloseRounded'
import Button from '@mui/material/Button'
import Input from '@mui/joy/Input'

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { isBlank } from '~/core/utils/data-utils'
import { useUpdateCardDateMutation } from '~/core/redux/api/board-card.api'
dayjs.extend(customParseFormat)

export interface DateRangeDialogProps {
    id: string
    open: boolean
    anchorEl: HTMLElement | null
    onClose: () => void
    reFetch: () => void
    cardId: string
    fromDate: string
    deadlineDate: string
    insideButton: boolean
}

const borderBottom = {
    borderBottom: '1px solid #DCDFE4'
}

const titleSx = {
    frontSize: '20px',
    fontWeight: '500',
    maxWidth: '150px'
}

const buttonSx = {
    color: 'white',
    backgroundColor: '#0c66e4',
    height: '32px',
    '&:hover': {
        backgroundColor: '#0055CC',
        border: 'none'
    }
}

export interface MemberItemmProps {
    item: any
}

const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm'
const DATE_FORMAT = 'DD/MM/YYYY'
const TIME_FORMAT = 'HH:mm'

const DateRangeDialog: React.FC<DateRangeDialogProps> = (
    { id, open, anchorEl, onClose, reFetch, cardId, fromDate, deadlineDate, insideButton }
) => {
    const [updateCardDate, { isLoading }] = useUpdateCardDateMutation()

    const action: SelectStaticProps['action'] = React.useRef(null)

    const [state, setState] = React.useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ])

    useEffect(() => {
        if (open) {
            const startDayjs = dayjs(fromDate, DATE_FORMAT)
            const deadlineDayjs = dayjs(deadlineDate, DATE_TIME_FORMAT)

            setState([
                {
                    startDate: startDayjs.isValid() ? startDayjs.toDate() : new Date(),
                    endDate: deadlineDayjs.isValid() ? deadlineDayjs.toDate() : new Date(),
                    key: 'selection'
                }
            ])

            setTimeValue(deadlineDayjs.isValid() ? deadlineDayjs.format(TIME_FORMAT) : '')
        }

        if (!open) {
            setTimeValue('')
            setValue(null)
            setIsErrorTime(false)
        }
    }, [open, fromDate, deadlineDate])

    const options = [
        { id: 1, title: 'At time of end date' },
        { id: 2, title: '5 Minutes before' },
        { id: 3, title: '10 Minutes before' },
        { id: 4, title: '15 Minutes before' },
        { id: 5, title: '1 Hour before' },
        { id: 6, title: '2 Hour before' },
        { id: 7, title: '1 Day before' },
        { id: 8, title: '2 Day before' }
    ]

    const [value, setValue] = React.useState<number | null>(null)

    const timeInputRef = React.useRef<HTMLInputElement>(null)
    const [timeValue, setTimeValue] = React.useState('')
    const [isErrorTime, setIsErrorTime] = React.useState(false)

    const handleSetTimeValue = (event: any) => {
        const newTime = event.target.value
        const isValid = dayjs(newTime, TIME_FORMAT, true).isValid()

        setTimeValue(newTime)

        if (isBlank(newTime)) {
            setIsErrorTime(false)
            return
        }

        if (!isValid) {
            setIsErrorTime(true)
        } else {
            setIsErrorTime(false)
        }
    }

    const handleClose = async () => {

        const request = {
            fromDate: dayjs(state[0].startDate).format(DATE_FORMAT),
            deadlineDate:
                isBlank(timeValue)
                    ? dayjs(state[0].endDate).format(DATE_FORMAT)
                    : dayjs(state[0].endDate).format(DATE_FORMAT) + ' ' + timeValue,
            reminder: value
        }

        if (request.fromDate === fromDate && request.deadlineDate === deadlineDate) {
            onClose()
            return
        }

        try {
            await updateCardDate({ boardCardId: cardId, ...request }).unwrap()
            await reFetch()
        } catch (error) {
            console.log('error', error)
        }

        onClose()
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
            transformOrigin={
                insideButton
                    ? { vertical: 'top', horizontal: 'center' }
                    : { vertical: 'top', horizontal: 'right' }
            }
            slotProps={{
                paper: {
                    style: {
                        width: '378px',
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
                <Box sx={{ justifyContent: 'center', width: '100%', display: 'flex', fontWeight: '500', color: '#44546f' }}>Dates Select</Box>
                <Box sx={{
                    ...borderBottom,
                    mt: '8px',
                    pb: '8px',
                    display: 'flex',
                    justifyContent: 'center',
                    minHeight: '400px'
                }}>
                    <DateRange
                        editableDateInputs={true}
                        onChange={(item: any) => setState([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={state}
                    />
                </Box>
                {/* <Box sx={{ ...borderBottom, p: '8px 0 4px 0', mb: '6px' }}>
                    <TextField
                        placeholder='Label name'
                        size='small'
                        sx={{ width: '100%' }}
                        onChange={(e) => setFillterName(e.target.value)}
                    />
                    <FormHelperText>Type name to search</FormHelperText>
                </Box> */}

                <Box sx={{
                    mt: '8px',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <Box sx={{ fontSize: '12px', fontWeight: '500', color: '#44546f' }}>Set end time</Box>
                </Box>
                <Input
                    ref={timeInputRef}
                    value={timeValue}
                    onChange={handleSetTimeValue}
                    placeholder={TIME_FORMAT}
                    error={isErrorTime}
                />

                <Box sx={{
                    mt: '8px',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <Box sx={{ fontSize: '12px', fontWeight: '500', color: '#44546f' }}>Set due date reminder</Box>
                </Box>
                <Box>
                    <Select
                        action={action}
                        placeholder="Choose one…"
                        sx={{
                            width: '100%',
                            borderRadius: '3px',
                            backgroundColor: 'transparent',
                            // '&:hover': {
                            //     backgroundColor: 'transparent',
                            //     border: '#509BFF 2px solid'
                            // }
                        }}
                        value={value}
                        onChange={(e, newValue) => {
                            setValue(newValue)
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
                        {options.map((option) => (
                            <Option
                                key={option.id}
                                value={option.id}
                            >
                                {option.title}
                            </Option>
                        ))}
                    </Select>
                    <Box sx={{
                        color: '#44546f',
                        fontSize: '13px',
                        m: '8px 0',
                        textAlign: 'justify'
                    }}>
                        Reminders will be sent to all members and watchers of this card.
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                                if (isErrorTime) {
                                    const inputElement = timeInputRef.current?.querySelector('input')
                                    inputElement?.focus()
                                    return
                                }
                                handleClose()
                            }}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Popover >
    )
}

export default DateRangeDialog