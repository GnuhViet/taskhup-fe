import React, { useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import { useAcceptWorkspaceMemberMutation, useDenyWorkspaceMemberMutation, useGetWorkspaceJoinRequestQuery } from '~/core/redux/api/workspace.api'
import CircularProgress from '@mui/material/CircularProgress'
import CircleAvatar from '~/components/Common/CircleAvatar'
import { convertDate } from '~/core/utils/data-utils'
import { ApiResponse } from '~/core/services/api.model'
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined'
import PersonRemoveAlt1OutlinedIcon from '@mui/icons-material/PersonRemoveAlt1Outlined'
import { JoinRequestADRequest } from '~/core/services/workspace-services.model'
import { toast } from 'react-toastify'

const borderBottom = {
    borderBottom: '1px solid #DCDFE4'
}

const headingSx = {
    fontSize: '18px',
    fontWeight: '500',
    color: '#172b4d',
    mb: '12px'
}

const textSx = {
    fontSize: '13px',
    fontWeight: '300',
    color: '#172b4d'
}

const buttonSx = {
    color: '#172B4D',
    backgroundColor: '#F0F1F4',
    boxShadow: 'none !important',
    height: '32px',
    frontSize: '14px',
    frontWeight: '300',
    alignItems: 'center',
    mr: '14px',
    '&:hover': {
        backgroundColor: '#DCDFE4'
    }
}

const JoinRequest = () => {
    const { data: apiResponse, isLoading, refetch } = useGetWorkspaceJoinRequestQuery({})

    const [accept, { isLoadingAccept }] = useAcceptWorkspaceMemberMutation()
    const [deny, { isLoadingDeny }] = useDenyWorkspaceMemberMutation()

    const [fillterName, setFillterName] = useState(null)
    const [selectedItems, setSelectedItems] = useState([])
    const handleCheck = (id) => {
        setSelectedItems(prevSelectedItems =>
            prevSelectedItems.includes(id)
                ? prevSelectedItems.filter(itemId => itemId !== id)
                : [...prevSelectedItems, id]
        )
    }
    const handleCheckAll = () => {
        if (selectedItems.length === response?.data?.length) {
            setSelectedItems([])
        } else {
            setSelectedItems(response?.data?.map(item => item.userId))
        }
    }

    const response = apiResponse as ApiResponse<any>

    if (isLoading) {
        return (
            <Box>
                <CircularProgress />
            </Box>
        )
    }

    const onAccept = async () => {
        try {
            const request = {} as JoinRequestADRequest
            request.userIds = selectedItems
            const resp = await accept(request).unwrap() as any
            if (resp.data) {
                refetch()
                toast.success('Member accepted.', {
                    position: 'bottom-right'
                })
            }
        } catch (e) {
            console.log(e)
        }
    }

    const onDeny = async () => {
        try {
            const request = {} as JoinRequestADRequest
            request.userIds = selectedItems
            const resp = await deny(request).unwrap() as any
            if (resp.data) {
                refetch()
                toast.success('Member accepted.', {
                    position: 'bottom-right'
                })
            }
        } catch (e) {
            console.log(e)
        }
    }

    const onAcceptSingle = async (id: string) => {
        try {
            const request = {} as JoinRequestADRequest
            request.userIds = [id]
            const resp = await accept(request).unwrap() as any
            if (resp.data) {
                refetch()
                toast.success('Member accepted.', {
                    position: 'bottom-right'
                })
            }
        } catch (e) {
            console.log(e)
        }
    }

    const onDenySingle = async (id: string) => {
        try {
            const request = {} as JoinRequestADRequest
            request.userIds = [id]
            const resp = await deny(request).unwrap() as any
            if (resp.data) {
                refetch()
                toast.success('Member accepted.', {
                    position: 'bottom-right'
                })
            }
        } catch (e) {
            console.log(e)
        }
    }


    return (
        <Box>
            <Box sx={{ ...borderBottom, pb: '14px' }}>
                <Box sx={headingSx}>Join requests ({response?.data?.length})</Box>
                <Box sx={textSx}>These people have requested to join this Workspace. Adding new Workspace members will automatically update your bill.</Box>
            </Box>
            <Box sx={{ ...borderBottom, p: '12px 0 12px 0' }}>
                {
                    !response?.data?.length && (
                        <Box sx={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', mb: '20px',
                            fontStyle: 'italic', fontSize: '14px', fontWeight: '400', color: '#44546f'
                        }}>
                            <span>There are no join requests.</span>
                        </Box>
                    )
                }
                <TextField
                    placeholder='Filter by name...'
                    size='small'
                    sx={{ width: '450px' }}
                    onChange={(e) => setFillterName(e.target.value)}
                />
                <Box sx={{ display: 'flex', mt: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={selectedItems.length === response?.data?.length}
                                onChange={() => handleCheckAll()}
                            />
                        }
                        label={`Select all (${fillterName
                            ? response?.data?.filter(item => item.fullName.includes(fillterName)).length
                            : response?.data.length
                            })`}
                    />
                    <Box>
                        <Button
                            sx={{ ...buttonSx }}
                            variant='contained'
                            disabled={selectedItems.length === 0}
                            onClick={() => onAccept()}
                        >Add selected to Workspace</Button>
                        <Button
                            sx={{ ...buttonSx }}
                            variant='contained'
                            disabled={selectedItems.length === 0}
                            onClick={() => onDeny()}
                        >Delete selected requests</Button>
                    </Box>
                </Box>
            </Box>
            {
                (fillterName
                    ? response?.data?.filter(item => item.fullName.includes(fillterName))
                    : response?.data
                )?.map((item: any, index) => (
                    <Box key={index} sx={{ ...borderBottom, p: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedItems.includes(item.userId)} // Assuming each item has a unique 'id' property
                                        onChange={() => handleCheck(item.userId)}
                                    />
                                }
                                label=""
                            />
                            <CircleAvatar sx={{ minWidth: '42px', minHeight: '42px', fontSize: '16px', mr: '12px', background: '#5243AA' }} src={null} alt='V' />
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ fontSize: '16px', fontWeight: '800', color: '#172B4D' }}>{item.fullName}</Box>
                                <Box sx={{ fontSize: '14px', fontWeight: '400', color: '#44546f', display: 'flex' }}>
                                    <Box>{item.userName}</Box>
                                    <Box sx={{ fontSize: '20px', display: 'flex', alignItems: 'center', lineHeight: '14px' }}>
                                        &nbsp;•&nbsp;
                                    </Box>
                                    <Box>Joined on {convertDate(item.joinDate)}</Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box>
                            <Button
                                sx={{ ...buttonSx }}
                                variant='contained'
                                startIcon={<PersonAddAlt1OutlinedIcon sx={{ mb: '4px' }} />}
                                onClick={() => onAcceptSingle(item.userId)}
                            >Accept</Button>
                            <Button
                                sx={{ ...buttonSx, mr: 0 }}
                                variant='contained'
                                startIcon={<PersonRemoveAlt1OutlinedIcon />}
                                onClick={() => onDenySingle(item.userId)}
                            >Delete&nbsp;...</Button>
                        </Box>
                    </Box>
                ))
            }
        </Box>
    )
}

export default JoinRequest