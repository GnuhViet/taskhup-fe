import React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import ActivityHistoryItem from '../CardItems/ActivityHistoryItem'
import Button from '@mui/material/Button'
import { useLazyGetCardAllHistoryQuery } from '~/core/redux/api/board-card.api'
import { ApiResponse } from '~/core/services/api.model'
import { set } from 'lodash'
import ApiLoadingOverlay from '~/components/Common/ApiLoadingOverlay'

const titleTextSx = {
    color: '#172b4d',
    fontWeight: '500'
}

const labelTextSx = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#44546f'
}

export interface SectionProps {
    isShowHistory: boolean
    setIsShowHistory: (value: boolean) => void
    activityHistory: any[]
    cardId: string
}

const CardHistorySection: React.FC<SectionProps> = ({ isShowHistory, setIsShowHistory, activityHistory, cardId }) => {
    const [getAllHistory, { isLoading: isLoadingHistory }] = useLazyGetCardAllHistoryQuery()

    const [isShowAll, setIsShowAll] = React.useState(false)
    const [allAtcivity, setAllActivity] = React.useState<any[]>([])

    const fetchHistory = async () => {
        try {
            const resp = await getAllHistory(cardId).unwrap() as ApiResponse<any>
            setAllActivity(resp.data)
        } catch (error) {
            console.log('Error: ', error)
        }
    }

    React.useEffect(() => {
        if (allAtcivity.length !== 0) return
        if (isShowAll) {
            fetchHistory()
        }
    }, [isShowAll])

    React.useEffect(() => {
        setIsShowAll(false)
    }, [activityHistory])

    return (
        <Box>
            <Box className="section-details card-detail-desc">
                <RestoreOutlinedIcon className="left-icon" sx={{ ...titleTextSx }} />
                <Box className="section-title" sx={{ ...titleTextSx }}>Activity</Box>
                <Box sx={{ position: 'relative' }}>
                    <Box sx={{ position: 'absolute', top: '-2px' }}>
                        <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() => setIsShowHistory(!isShowHistory)}
                        >
                            {isShowHistory
                                ? <VisibilityOutlinedIcon
                                    fontSize="small"
                                    sx={{ color: '#172b4d' }} />
                                :
                                <Box>
                                    <VisibilityOffOutlinedIcon
                                        fontSize="small"
                                        sx={{ color: '#172b4d' }} />

                                </Box>
                            }
                        </IconButton>
                    </Box>
                    <Box sx={{
                        ml: '40px',
                        mt: '4px',
                        display: isShowHistory ? 'none' : 'block',
                        ...labelTextSx
                    }}>
                        ...
                    </Box>
                </Box>
            </Box>
            <Box sx={{
                display: isShowHistory ? 'block' : 'none'
            }}>
                {activityHistory &&
                    <>
                        {isShowAll
                            ?
                            <Box>
                                {allAtcivity.map((activity, index) => (
                                    <ActivityHistoryItem key={index} historyItem={activity} />
                                ))}
                                <Button
                                    className="button right-button"
                                    variant="contained"
                                    onClick={() => setIsShowAll(false)}
                                >
                                    Show less
                                </Button>
                            </Box>
                            :
                            <Box>
                                {activityHistory.map((activity, index) => (
                                    <ActivityHistoryItem key={index} historyItem={activity} />
                                ))}
                                {activityHistory.length > 0
                                    ?
                                    <>
                                        {
                                            activityHistory.length >= 9 &&
                                            <Button
                                                className="button right-button"
                                                variant="contained"
                                                onClick={() => setIsShowAll(true)}
                                            >
                                                {isLoadingHistory
                                                    ?
                                                    <ApiLoadingOverlay size='28px' />
                                                    : <>Show all history...</>
                                                }
                                            </Button>
                                        }
                                    </>
                                    :
                                    <Box>
                                        <Box sx={{ ...labelTextSx, ml: '40px' }}>No activity yet</Box>
                                    </Box>
                                }
                            </Box>
                        }
                    </>
                }

            </Box>
        </Box>
    )
}

export default CardHistorySection