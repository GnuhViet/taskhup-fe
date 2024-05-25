import React, { useRef, useState } from 'react'

import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import FormLabel from '@mui/joy/FormLabel'

import { Can } from '~/core/utils/access-control'
import { getContrastTextColor } from '~/core/utils/common-used'
import TextBoxToolTip from '~/components/Common/TextBoxToolTip'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import { FormGroup } from '@mui/material'
import { useChangeMemberRoleMutation } from '~/core/redux/api/role.api'
import { toast } from 'react-toastify'
import TextField from '@mui/material/TextField'
import { AbilityContext } from '~/core/utils/access-control'

export interface RoleSelecPopoverProps {
    id: string
    roleItem: any[]
    selectedRole: any
    selectedMember: any
    open: boolean
    anchorEl: HTMLElement
    onClose?: () => void
    refecthMember?: () => void
}

export interface RoleSwitchProps {
    item: any
    label: string
    helperText: string
    subHelperText?: string
}

export interface RoleItemProps {
    item: any
}


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

const customScrollbarSx = {
    '&::-webkit-scrollbar': {
        ml: '12px',
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
}

const RoleSelectPopover: React.FC<RoleSelecPopoverProps> = ({ id, roleItem, selectedRole, selectedMember, open, anchorEl, onClose, refecthMember }) => {
    const [changeRole, { isLoading }] = useChangeMemberRoleMutation()
    const ability = React.useContext(AbilityContext)

    const handleChangeRole = async (roleId: string) => {
        try {
            await changeRole({
                roleId: roleId,
                memberId: selectedMember.userId
            }).unwrap()
            // toast.success('Change role successfully', {
            //     position: 'bottom-right'
            // })
            refecthMember()
        } catch (error) {
            console.log(error)
        }
    }

    const [fillterName, setFillterName] = useState('')

    const formRef = useRef(null)

    const RoleItem: React.FC<RoleItemProps> = ({ item }) => {
        return (
            <Box sx={{ p: '2px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 'auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>

                    <FormControlLabel
                        style={{ width: '50px', margin: 0 }}
                        value={item.id}
                        control={
                            <Radio
                                sx={checkBoxSx}
                                disabled={
                                    item.id === 'default-role-owner'
                                }
                            />
                        }
                        label={null}
                        disabled={ability.cannot('edit', 'role')}
                    />
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: `${item.color}`,
                        borderRadius: '2px',
                        height: '34px',
                        paddingLeft: '8px',
                        width: '100%',
                        justifyContent: 'center'
                    }}
                    >
                        <TextBoxToolTip sx={{
                            ...titleSx,
                            color: getContrastTextColor(item.color)
                        }} id={item.id} text={item.name} breakOnLine={1} />
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
            onClose={() => {
                onClose()
                setFillterName('')
            }}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
            slotProps={{
                paper: {
                    style: {
                        minWidth: '300px',
                        borderRadius: '8px',
                        // border: '1px solid #B2B9C4',
                        boxShadow: '0',
                        marginTop: id === 'header-create-board-popover' ? '8px' : '0'
                    }
                }
            }}
            style={{ zIndex: 99 }}
        >
            <Box sx={{ m: '12px 24px' }}>
                <form ref={formRef}>
                    <FormLabel sx={{ ...borderBottom, fontSize: '16px', width: '100%', mb: '14px', pb: '6px', display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex' }}>
                            Select user role&nbsp;&nbsp;
                        </Box>
                        <Can I="edit" a="role">
                            <Box></Box>
                        </Can>
                    </FormLabel>
                    <FormLabel>
                        <Box sx={{ ...borderBottom, width: '100%', pb: '6px', mb: '14px' }}>
                            <TextField
                                placeholder='Filter by name...'
                                size='small'
                                sx={{ width: '100%' }}
                                onChange={(e) => setFillterName(e.target.value)}
                            />
                        </Box>
                    </FormLabel>
                    <FormGroup
                    >
                        <RadioGroup
                            defaultValue={selectedRole?.id}
                            onChange={(event) => {
                                handleChangeRole(event.target.value)
                            }}
                        >
                            {(() => {
                                const fillterItem = (fillterName
                                    ? roleItem.filter((temp) => temp.name.toLowerCase().includes(fillterName.toLowerCase()))
                                    : roleItem
                                )
                                return (
                                    <Box sx={{
                                        minHeight: '170px',
                                        maxHeight: '170px',
                                        overflowY: 'auto',
                                        ...customScrollbarSx,
                                        pr: fillterItem.length > 4 ? '4px' : '0'
                                    }}>
                                        {fillterItem.map((item, index) => (
                                            <RoleItem key={index} item={item} />
                                        ))}
                                    </Box>
                                )
                            })()}
                        </RadioGroup>
                    </FormGroup>
                </form>
            </Box>
        </Popover >
    )
}

export default RoleSelectPopover