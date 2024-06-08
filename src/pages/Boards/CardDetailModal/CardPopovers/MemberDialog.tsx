import React, { useEffect } from 'react'
import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import Checkbox from '@mui/material/Checkbox'
import TextBoxToolTip from '~/components/Common/TextBoxToolTip'
import { ApiResponse } from '~/core/services/api.model'
import { useLazyGetWorkspaceMemberQuery } from '~/core/redux/api/workspace.api'
import CircleAvatar from '~/components/Common/CircleAvatar'
import { Tooltip } from '@mui/material'
import { useUpdateMembersMutation } from '~/core/redux/api/board-card.api'
import { UpdateMemberRequest } from '~/core/services/board-card-services.model'

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

export interface MemberDialogProps {
    id: string
    open: boolean
    anchorEl: HTMLElement | null
    onClose: () => void
    cardId: string
    members: any[]
    reFetch: () => void
    insideButton: boolean
}

export interface MemberItemProps {
    item: any
}

const MemberDialog: React.FC<MemberDialogProps> = ({ id, open, anchorEl, onClose, cardId, members, reFetch, insideButton }) => {
    const [getWsMember, { isLoading: getLoading }] = useLazyGetWorkspaceMemberQuery()
    const [updateMember, { isLoading: updateLoading }] = useUpdateMembersMutation()
    const [data, setData] = React.useState<any>([])
    const [fillterName, setFillterName] = React.useState('')

    const fetchData = async () => {
        const response = await getWsMember({}).unwrap() as ApiResponse<any>
        setData(response.data)
    }

    useEffect(() => {
        if (open) {
            fetchData()
        }
    }, [open])

    const [listSelectedIds, setListSelectedIds] = React.useState<string[]>([])

    useEffect(() => {
        if (members) {
            setListSelectedIds([...members.map((item: any) => item.id)])
        } else {
            setListSelectedIds([])
        }
    }, [members])

    const handleClose = async () => {
        if (
            JSON.stringify(listSelectedIds.sort()) !== JSON.stringify(members?.map((item: any) => item.id).sort())
        ) {
            try {
                await updateMember({
                    members: listSelectedIds,
                    boardCardId: cardId
                } as UpdateMemberRequest).unwrap()

                await reFetch()
            } catch (err) {
                console.log(err)
            }
        }

        onClose()
    }

    if (getLoading || updateLoading) return <div>Loading...</div>

    const MemberItem: React.FC<MemberItemProps> = ({ item }) => {
        return (
            <Box sx={{ p: '2px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 'auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Checkbox
                        sx={checkBoxSx}
                        checked={listSelectedIds?.includes(item.userId)}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setListSelectedIds([...listSelectedIds, item.userId])
                            } else {
                                setListSelectedIds(listSelectedIds?.filter((id) => id !== item.userId))
                            }
                        }}
                    />
                    <Box sx={{
                        display: 'flex',
                        borderRadius: '2px',
                        height: '34px',
                        paddingLeft: '8px',
                        alignItems: 'center',
                        width: '100%',
                        backgroundColor: '#F7F8F9'
                    }}
                    >
                        <Tooltip title={item.userName} placement='right-end'>
                            <Box>
                                <CircleAvatar
                                    src={item.avatarUrl}
                                    alt={item?.fullName.charAt(0).toUpperCase()}
                                    sx={{
                                        width: '24px',
                                        height: '24px',
                                        mr: '8px'
                                    }}
                                />
                            </Box>
                        </Tooltip>
                        <TextBoxToolTip sx={{
                            ...titleSx
                        }} id='1asd' text={item.fullName} breakOnLine={1} />
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
            onClose={handleClose}
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
                        width: '320px',
                        borderRadius: '8px',
                        boxShadow: '0',
                        marginTop: '6px'
                    }
                }
            }}
            style={{ zIndex: 999 }}
        >
            <Box sx={{
                m: '12px 24px'
            }}>
                <Box sx={{ justifyContent: 'center', width: '100%', display: 'flex', fontWeight: '500', color: '#44546f' }}>Member Settings</Box>
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
                    <Box sx={{ fontSize: '12px', fontWeight: '500', color: '#44546f' }}>Members</Box>
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
                                key={item.userName}
                                sx={{
                                    display: item.fullName.toLowerCase().includes(fillterName.toLowerCase()) ? 'block' : 'none'
                                }}
                            >
                                <MemberItem item={item} />
                            </Box>
                        )
                    })}
                </Box>
            </Box>
        </Popover>
    )
}

export default MemberDialog