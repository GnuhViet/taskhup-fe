import React from 'react'

import Box from '@mui/material/Box'
import CircleAvatar from '~/components/Common/CircleAvatar'
import moment from 'moment'

const mediumTextSx = {
    fontSize: '15px',
    fontWeight: '700',
    color: '#162B4D'
}

const smallTextSx = {
    fontSize: '12px',
    fontWeight: '400',
    color: '#44546f'
}

const textButtonSx = {
    cursor: 'pointer',
    textDecoration: 'underline'
}

export interface ActivityHistoryItemProps {
    historyItem: any
}

const actionDescriptions = {
    UPDATE_TITLE: 'Updated',
    SELECT_TEMPLATE: 'Selected',
    SELECT_LABEL: 'Selected',
    SELECT_FIELD: 'Selected',
    UPDATE_FIELD: 'Updated',
    UPDATE_MEMBER: 'Updated',
    UPDATE_CHECKLIST: 'Updated',
    UPDATE_CHECKLIST_VALUE: 'Updated',
    UPDATE_COVER: 'Changed',
    REMOVE_COVER: 'Removed',
    UPDATE_DATE: 'Updated',
    UPDATE_WORKING_STATUS: 'Updated',
    UPDATE_DESCRIPTION: 'Updated',
    UPLOAD_ATTACHMENT_CARD: 'Attached',
    UPLOAD_ATTACHMENT_COMMENT: 'Attached',
    DELETE_ATTACHMENT_CARD: 'Delete',
    DELETE_ATTACHMENT_COMMENT: 'Delete',
    CREATE_COMMENT: 'Add',
    DELETE_COMMENT: 'Deleted'
}

function convertDateString(inputDate: string) {
    // Parse the input date string
    const date = new Date(inputDate)

    // Extract the day, month, year, hours, and minutes
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    // Format the date and time
    const formattedDate = `${day}/${month}/${year} at ${hours}:${minutes}`

    return formattedDate
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

function getActionDescription(action: keyof typeof actionDescriptions) {
    return actionDescriptions[action] || 'Unknown action'
}

const ActivityHistoryItem: React.FC<ActivityHistoryItemProps> = ({ historyItem }) => {
    const ActionDetail: React.FC<ActivityHistoryItemProps> = ({ historyItem }) => {
        return <Box>
            {(() => {
                switch (historyItem.type) {
                    case 'UPDATE_TITLE':
                        return <Box sx={{ display: 'flex' }}>
                            <Box sx={{ ...smallTextSx, mt: '2px' }}>
                                &nbsp;this card title to
                            </Box>
                            <Box sx={{ ...smallTextSx, mt: '2px', fontWeight: 'bold' }}>
                                &nbsp;{historyItem.toData}
                            </Box>
                        </Box>
                    case 'SELECT_TEMPLATE':
                        return <Box sx={{ display: 'flex' }}>
                            <Box sx={{ ...smallTextSx, mt: '2px' }}>
                                &nbsp;this card
                            </Box>
                            <Box sx={{ ...smallTextSx, mt: '2px', fontWeight: 'bold' }}>
                                &nbsp;template
                            </Box>
                        </Box>
                    case 'SELECT_LABEL':
                        return <Box sx={{ display: 'flex' }}>
                            <Box sx={{ ...smallTextSx, mt: '2px' }}>
                                &nbsp;this card
                            </Box>
                            <Box sx={{ ...smallTextSx, mt: '2px', fontWeight: 'bold' }}>
                                &nbsp;label
                            </Box>
                        </Box>
                    case 'SELECT_FIELD':
                        return <Box sx={{ display: 'flex' }}>
                            <Box sx={{ ...smallTextSx, mt: '2px' }}>
                                &nbsp;this card
                            </Box>
                            <Box sx={{ ...smallTextSx, mt: '2px', fontWeight: 'bold' }}>
                                &nbsp;custom field
                            </Box>
                        </Box>
                    case 'UPDATE_FIELD':
                        return <Box sx={{ display: 'flex' }}>
                            <Box sx={{ ...smallTextSx, mt: '2px', fontWeight: 'bold' }}>
                                &nbsp;{historyItem.toData}
                            </Box>
                            <Box sx={{ ...smallTextSx, mt: '2px' }}>
                                &nbsp;field value
                            </Box>
                        </Box>
                    case 'UPDATE_MEMBER':
                        return <Box sx={{ display: 'flex' }}>
                            <Box sx={{ ...smallTextSx, mt: '2px' }}>
                                &nbsp;this card
                            </Box>
                            <Box sx={{ ...smallTextSx, mt: '2px', fontWeight: 'bold' }}>
                                &nbsp;member
                            </Box>
                        </Box>
                    case 'UPDATE_CHECKLIST':
                        return <Box sx={{ display: 'flex' }}>
                            <Box sx={{ ...smallTextSx, mt: '2px' }}>
                                &nbsp;this card
                            </Box>
                            <Box sx={{ ...smallTextSx, mt: '2px', fontWeight: 'bold' }}>
                                &nbsp;checklist
                            </Box>
                        </Box>
                    case 'UPDATE_CHECKLIST_VALUE':
                        return <Box sx={{ display: 'flex' }}>
                            <Box sx={{ ...smallTextSx, mt: '2px' }}>
                                &nbsp;this card
                            </Box>
                            <Box sx={{ ...smallTextSx, mt: '2px', fontWeight: 'bold' }}>
                                &nbsp;checklist value
                            </Box>
                        </Box>
                    case 'UPDATE_COVER':
                        return <Box sx={{ display: 'flex' }}>
                            <Box sx={{ ...smallTextSx, mt: '2px' }}>
                                &nbsp;this card
                            </Box>
                            <Box sx={{ ...smallTextSx, mt: '2px', fontWeight: 'bold' }}>
                                &nbsp;cover
                            </Box>
                        </Box>
                    case 'REMOVE_COVER':
                        return <Box sx={{ display: 'flex' }}>
                            <Box sx={{ ...smallTextSx, mt: '2px' }}>
                                &nbsp;this card
                            </Box>
                            <Box sx={{ ...smallTextSx, mt: '2px', fontWeight: 'bold' }}>
                                &nbsp;cover
                            </Box>
                        </Box>
                    case 'UPDATE_DATE':
                        return <Box sx={{ display: 'flex' }}>
                            <Box sx={{ ...smallTextSx, mt: '2px' }}>
                                &nbsp;this card
                            </Box>
                            <Box sx={{ ...smallTextSx, mt: '2px', fontWeight: 'bold' }}>
                                &nbsp;date
                            </Box>
                            <Box sx={{ ...smallTextSx, mt: '2px' }}>
                                &nbsp;to
                            </Box>
                            <Box sx={{ ...smallTextSx, mt: '2px', fontWeight: 'bold' }}>
                                &nbsp;{
                                    formatDate(historyItem.toData.split('@')[0])
                                    + ' - '
                                    + formatDate(historyItem.toData.split('@')[1])
                                }
                            </Box>
                        </Box>
                    case 'UPDATE_WORKING_STATUS':
                        return <Box sx={{ display: 'flex' }}>
                            <Box sx={{ ...smallTextSx, mt: '2px' }}>
                                &nbsp;this card
                            </Box>
                            <Box sx={{ ...smallTextSx, mt: '2px', fontWeight: 'bold' }}>
                                &nbsp;working status
                            </Box>
                            <Box sx={{ ...smallTextSx, mt: '2px' }}>
                                &nbsp;to
                            </Box>
                            <Box sx={{ ...smallTextSx, mt: '2px', fontWeight: 'bold' }}>
                                &nbsp;{historyItem.toData === '1' ? 'Compledted' : 'In progress'}
                            </Box>
                        </Box>
                    case 'UPDATE_DESCRIPTION':
                        return <Box sx={{ display: 'flex' }}>
                            <Box sx={{ ...smallTextSx, mt: '2px' }}>
                                &nbsp;this card
                            </Box>
                            <Box sx={{ ...smallTextSx, mt: '2px', fontWeight: 'bold' }}>
                                &nbsp;description
                            </Box>
                        </Box>
                    case 'UPLOAD_ATTACHMENT_CARD':
                        return <Box sx={{ display: 'flex' }}>
                            <Box sx={{ ...smallTextSx, mt: '2px', fontWeight: 'bold' }}>
                                &nbsp;{historyItem.toData}
                            </Box>
                            <Box sx={{ ...smallTextSx, mt: '2px' }}>
                                &nbsp;to this card
                            </Box>
                        </Box>
                    case 'UPLOAD_ATTACHMENT_COMMENT':
                        return <Box sx={{ display: 'flex' }}>
                            <Box sx={{ ...smallTextSx, mt: '2px', fontWeight: 'bold' }}>
                                &nbsp;{historyItem.toData}
                            </Box>
                            <Box sx={{ ...smallTextSx, mt: '2px' }}>
                                &nbsp;to this card comment
                            </Box>
                        </Box>
                    case 'DELETE_ATTACHMENT_CARD':
                        return <Box sx={{ display: 'flex' }}>
                            <Box sx={{ ...smallTextSx, mt: '2px', fontWeight: 'bold' }}>
                                &nbsp;an attachment
                            </Box>
                            <Box sx={{ ...smallTextSx, mt: '2px' }}>
                                &nbsp;from this card
                            </Box>
                        </Box>
                    case 'DELETE_ATTACHMENT_COMMENT':
                        return <Box sx={{ display: 'flex' }}>
                            <Box sx={{ ...smallTextSx, mt: '2px', fontWeight: 'bold' }}>
                                &nbsp;an attachment
                            </Box>
                            <Box sx={{ ...smallTextSx, mt: '2px' }}>
                                &nbsp;from this card comment
                            </Box>
                        </Box>
                    case 'CREATE_COMMENT':
                        return <Box sx={{ display: 'flex' }}>
                            <Box sx={{ ...smallTextSx, mt: '2px', fontWeight: 'bold' }}>
                                &nbsp;a comment
                            </Box>
                            <Box sx={{ ...smallTextSx, mt: '2px' }}>
                                &nbsp;to this card
                            </Box>
                        </Box>
                    case 'DELETE_COMMENT':
                        return <Box sx={{ display: 'flex' }}>
                            <Box sx={{ ...smallTextSx, mt: '2px', fontWeight: 'bold' }}>
                                &nbsp;a comment
                            </Box>
                            <Box sx={{ ...smallTextSx, mt: '2px' }}>
                                &nbsp;from this card
                            </Box>
                        </Box>
                    default:
                        return <></>
                }
            })()}
        </Box>
    }

    return (
        <Box sx={{ display: 'flex', mb: '16px' }}>
            <Box sx={{
                mr: '10px',
                mt: '4px'
            }}>
                <CircleAvatar
                    src={historyItem.userAvatar}
                    alt={historyItem.userFullName}
                    sx={{
                        width: '32px',
                        height: '32px'
                    }}
                />
            </Box>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', mb: '4px' }}>
                    <Box sx={{ ...mediumTextSx }}>
                        {historyItem.userFullName}
                    </Box>
                    <Box sx={{ ...smallTextSx, ml: '8px', mt: '2px' }}>
                        [{getActionDescription(historyItem.type)}]
                    </Box>
                    <ActionDetail historyItem={historyItem} />
                </Box>
                <Box sx={{ display: 'flex' }}>
                    <Box sx={{ ...smallTextSx }}>
                        on {convertDateString(historyItem?.actionDate)}
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default ActivityHistoryItem