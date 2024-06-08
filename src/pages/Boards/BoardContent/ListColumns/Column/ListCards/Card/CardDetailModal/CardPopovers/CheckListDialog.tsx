import React, { useEffect } from 'react'
import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import Checkbox from '@mui/material/Checkbox'
import TextBoxToolTip from '~/components/Common/TextBoxToolTip'
import { getContrastTextColor } from '~/core/utils/common-used'
import { useLazyGetLabelsQuery } from '~/core/redux/api/board-template.api'
import { ApiResponse } from '~/core/services/api.model'
import { useLazyGetWorkspaceMemberQuery } from '~/core/redux/api/workspace.api'
import CircleAvatar from '~/components/Common/CircleAvatar'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import { Tooltip } from '@mui/material'
import { isBlank } from '~/core/utils/data-utils'
import { toast } from 'react-toastify'

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

export interface CheckListDialogProps {
    id: string
    open: boolean
    anchorEl: HTMLElement | null
    onClose: () => void
    cardId: string
}

export interface ItemProps {
    item: any
}

const CheckListDialog: React.FC<CheckListDialogProps> = ({ id, open, anchorEl, onClose, cardId }) => {
    // const [getWsMember, { isLoading: getLoading }] = useLazyGetWorkspaceMemberQuery()
    const [data, setData] = React.useState<any>([])
    const [itemName, setItemName] = React.useState('')
    const [clickedAddOptions, setClickedAddOptions] = React.useState(false)
    const [fillterName, setFillterName] = React.useState('')

    // const fetchData = async () => {
    //     const response = await getWsMember({}).unwrap() as ApiResponse<any>
    //     setData(response.data)
    // }

    useEffect(() => {
        // if (open) {
        //     fetchData()
        // }
        setData([
            { id: '1', title: 'checklist item 1', checked: false },
            { id: '2', title: 'checklist item 2', checked: true },
            { id: '3', title: 'checklist item 3', checked: false }
        ])
    }, [open])

    // if (getLoading) return <div>Loading...</div>

    const ChecklistItem: React.FC<ItemProps> = ({ item }) => {
        return (
            <Box sx={{ p: '2px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 'auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
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
                        <TextBoxToolTip sx={{
                            ...titleSx
                        }} id='1asd' text={item.title} breakOnLine={1} />
                    </Box>
                </Box>
                <Box>
                    <Checkbox
                        sx={{
                            ...checkBoxSx,
                            cursor: 'pointer'
                        }}
                        icon={<DeleteIcon />}
                        checkedIcon={<DeleteIcon />}
                        onClick={() => {}
                            // templateItem.usedIn === 0
                            //     ? (async () => {
                            //         switch (actionsShow) {
                            //             case 'edit':
                            //                 setCurrentMenu('edit')
                            //                 break
                            //             case 'delete':
                            //                 try {
                            //                     await deleteField(
                            //                         { id: item.id, templateId: templateItem?.id }
                            //                     ).unwrap()
                            //                     await fetchData()
                            //                 } catch (error) {
                            //                     toast.error('Delete label failed', {
                            //                         position: 'bottom-right'
                            //                     })
                            //                 }
                            //                 break
                            //             default:
                            //                 break
                            //         }
                            //         setSelectedField(item)
                            //     })()
                            //     : null
                        }
                    />
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
                <Box sx={{ justifyContent: 'center', width: '100%', display: 'flex', fontWeight: '500', color: '#44546f' }}>Checklist Settings</Box>
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
                    <Box sx={{ fontSize: '12px', fontWeight: '500', color: '#44546f' }}>Checklists</Box>
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
                                <ChecklistItem item={item} />
                            </Box>
                        )
                    })}
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <TextField
                        placeholder='Add item ...'
                        size='small'
                        sx={{ width: '73%' }}
                        onChange={(e) => {
                            const value = e.target.value
                            if (!value.includes('-') && !value.includes(',')) {
                                setItemName(value)
                            }
                        }}
                        error={clickedAddOptions && !itemName}
                    />
                    <Button
                        className="button right-button"
                        sx={{
                            width: '15%',
                            backgroundColor: '#0079BF',
                            height: '37px !important'
                        }}
                        variant="contained"
                        onClick={() => {
                            setClickedAddOptions(true)
                            if (isBlank(itemName)) return
                            setData([...data, { id: '4', title: itemName, checked: false }])
                        }}
                    >Add</Button>
                </Box>
            </Box>
        </Popover>
    )
}

export default CheckListDialog