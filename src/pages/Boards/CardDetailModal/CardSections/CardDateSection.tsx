import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ApiLoadingOverlay from '~/components/Common/ApiLoadingOverlay'
import moment from 'moment'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import CheckBox from '@mui/joy/Checkbox'
import { useUpdateFieldValueMutation, useUpdateWorkingStatusMutation } from '~/core/redux/api/board-card.api'

const labelTextSx = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#44546f'
}

export interface SectionProps {
    cardId: string
    reFetch: () => void
    fromDate: string
    deadlineDate: string
    workingStatus: number
    handleClickOpen: (event: any) => void
}

const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm'

const formatDate = (dateString: string) => {
    const hasTime = dateString.includes(':')
    const format = hasTime ? DATE_TIME_FORMAT : 'DD/MM/YYYY'
    const date = moment(dateString, format)
    const now = moment()

    if (date.year() === now.year()) {
        // If the date is in the current year, format it as 'MMM D at HH:mm' if it has time, or 'MMM D' if it doesn't
        return date.format(hasTime ? 'MMM D [at] HH:mm' : 'MMM D')
    } else {
        // Otherwise, use the original format
        return date.format(format)
    }
}

const compareDate = (inputDate: string) => {
    const now = moment()
    const date = moment(inputDate, DATE_TIME_FORMAT)

    const diff = now.diff(date, 'days')

    if (diff < 0) {
        // The current date is less than the input date
        return -1
    } else if (diff <= 1) {
        // The current date is within 1 day of the input date
        return 1
    } else {
        // The current date is more than the input date
        return 0
    }
}

const CurrentStatus = ({ status }) => {

    const currentType = {
        0: { title: 'Overdue', color: '#ae2e24', backgroundColor: '#FFECEB' },
        1: { title: 'Due soon', color: '#172b4d', backgroundColor: '#F5CD47' },
        2: { title: 'Complete', color: '#ffffff', backgroundColor: '#1F845B' }
    }

    return (
        <Box
            sx={{
                width: 'fit-content',
                height: '18px',
                lineHeight: '19px',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: currentType[status].backgroundColor,
                color: currentType[status].color,
                borderRadius: '3px',
                mb: '2px',
                ml: '8px',
                p: '0 4px'
            }}
        >
            {currentType[status].title}
        </Box>
    )
}

const CardDateSection: React.FC<SectionProps> = ({ cardId, reFetch, fromDate, deadlineDate, workingStatus, handleClickOpen }) => {
    const [updateWorkingStatus, { isLoading }] = useUpdateWorkingStatusMutation()

    const handleCheckBox = async () => {
        try {
            await updateWorkingStatus({
                boardCardId: cardId,
                workingStatus: workingStatus == 1 ? 0 : 1
            })

            await reFetch()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Box className="field noti-field">
            <Box className="field-title" sx={{ ...labelTextSx }}>Dates</Box>
            <Box
                className="field-content"
                sx={{ display: 'flex', alignItems: 'center' }}
            >
                <CheckBox
                    sx={{ mr: '8px' }}
                    checked={workingStatus == 1}
                    onChange={handleCheckBox}
                />
                <Button
                    className="button remove-button"
                    variant="contained"
                    endIcon={<KeyboardArrowDownIcon />}
                    onClick={handleClickOpen}
                >
                    {formatDate(fromDate) + '  -  ' + formatDate(deadlineDate)}
                    {
                        workingStatus == 1
                            ? <CurrentStatus status={2} />
                            : compareDate(deadlineDate) >= 0
                                ? <CurrentStatus status={compareDate(deadlineDate)} />
                                : <></>
                    }
                </Button>
            </Box>
        </Box>
    )
}

export default CardDateSection