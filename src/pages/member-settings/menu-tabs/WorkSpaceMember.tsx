import React, { useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircleAvatar from '~/components/Common/CircleAvatar'
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import CircularProgress from '@mui/material/CircularProgress'
import { useCreateInviteLinkMutation } from '~/core/redux/api/invite.api'
import { InviteLinkCreateReq } from '~/core/services/invite-services.model'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useGetWorkspaceMemberQuery, useUnDisableMemberFromWsMutation } from '~/core/redux/api/workspace.api'
import { ApiResponse } from '~/core/services/api.model'
import { convertDate } from '~/core/utils/data-utils'
import { useGetWorkspaceRolesQuery } from '~/core/redux/api/role.api'
import { getContrastTextColor } from '~/core/utils/common-used'
import RoleSelectPopover from './Popover/RoleSelecPopover'
import TextBoxToolTip from '~/components/Common/TextBoxToolTip'
import { useSelector } from 'react-redux'
import ConfirmDisableFC from './Dialog/ConfirmDisableFC'
import SettingsBackupRestoreOutlinedIcon from '@mui/icons-material/SettingsBackupRestoreOutlined'

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

const borderBottom = {
    borderBottom: '1px solid #DCDFE4'
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


const WorkSpaceMember = () => {
    const [unDisableMember, { isLoading: isLoadingUnDisable }] = useUnDisableMemberFromWsMutation()
    const currentLoginUserName = useSelector((state: any) => state.homeReducer.userInfo.username)
    const { data: apiResponseRole, error, isLoading: isLoadingRole } = useGetWorkspaceRolesQuery({})
    const responseRole = apiResponseRole as ApiResponse<any>

    const [fillterName, setFillterName] = useState(null)
    const { workspaceId } = useParams()
    const [createLink, { isLoading }] = useCreateInviteLinkMutation()
    const { data: apiResponse, isLoading: isLoadingGetMember, refetch: refectMember } = useGetWorkspaceMemberQuery({})
    const response = apiResponse as ApiResponse<any>

    const [anchorElPermission, setAnchorElPermission] = React.useState(null)
    const openPermission = Boolean(anchorElPermission)
    const handleClose = () => {
        setAnchorElPermission(null)
    }

    const [openDiaglogConfirmDisable, setOpenDiaglogConfirmDisable] = useState(false)

    const createInviteLinkMember = async () => {
        try {
            const request = {} as InviteLinkCreateReq
            request.type = 'WORKSPACE'
            request.destinationId = workspaceId
            const resp = await createLink(request).unwrap() as any
            if (resp.data) {
                const link = 'http://localhost:5173/invite/' + resp.data
                navigator.clipboard.writeText(link)
                toast.success('Invite link copied to clipboard, link will expire in 1 days.', {
                    position: 'bottom-right'
                })
            }
        } catch (e) {
            console.log(e)
        }
    }

    const [selectedMemberRole, setSelectedMemberRole] = useState(null)
    const [selectedMember, setSelectedMember] = useState(null)

    const handleActiveMember = async () => {
        try {
            await unDisableMember({ memberId: selectedMember?.userId })
            refectMember()
            toast.success('Member has been enabled', {
                position: 'bottom-right'
            })
        } catch (error) {
            console.error(error)
        }
    }

    if (isLoadingGetMember || isLoadingRole) {
        return (
            <Box>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box>
            <Box sx={{ ...borderBottom, pb: '14px' }}>
                <Box sx={headingSx}>Workspace members ({response.data.length})</Box>
                <Box sx={textSx}>Workspace members can view and join all Workspace visible boards and create new boards in the Workspace. Adding new members will automatically update your billing.</Box>
            </Box>
            <Box sx={{ ...borderBottom, p: '24px 0 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ maxWidth: '450px' }}>
                    <Box sx={headingSx}>Invite members to join you</Box>
                    <Box sx={textSx}>Anyone with an invite link can join this paid Workspace. You’ll be billed for each member that joins. You can also disable and create a new invite link for this Workspace at any time.</Box>
                </Box>
                <Button
                    sx={{ ...buttonSx, mr: 0 }}
                    variant='contained'
                    startIcon={<GroupAddOutlinedIcon />}
                    onClick={createInviteLinkMember}
                >Invite with link</Button>
            </Box>
            <Box sx={{ ...borderBottom, p: '24px 0 12px 0' }}>
                <TextField
                    placeholder='Filter by name...'
                    size='small'
                    sx={{ width: '450px' }}
                    onChange={(e) => setFillterName(e.target.value)}
                />
            </Box>
            <Box>
                {(fillterName
                    ? response?.data?.filter(item => item.fullName.toLowerCase().includes(fillterName.toLowerCase()))
                    : response?.data
                )?.map((item, index) => (
                    <Box key={index} sx={{ ...borderBottom, p: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CircleAvatar
                                sx={{
                                    minWidth: '42px',
                                    minHeight: '42px',
                                    width: '42px',
                                    height: '42px',
                                    fontSize: '16px',
                                    mr: '12px',
                                    background: item.avatarUrl ? null : '#172B4D'
                                }}
                                src={item.avatarUrl}
                                alt={item.fullName.charAt(0).toUpperCase()}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{
                                    fontSize: '16px', fontWeight: '800', color: '#172B4D',
                                    textDecoration: item.status === 'DISABLED' ? 'line-through' : 'none'
                                }}>
                                    {item.fullName}
                                    {item.userName === currentLoginUserName && '  ( You )'}
                                </Box>
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
                            {(() => {
                                const role = responseRole.data.find(role => role.id === item.roleId)
                                return (
                                    <>
                                        <Button
                                            sx={{
                                                ...buttonSx,
                                                minWidth: '150px',
                                                maxWidth: '150px',
                                                backgroundColor: role.color,
                                                cursor: 'default',
                                                color: getContrastTextColor(role.color),
                                                '&:hover': {
                                                    backgroundColor: role.color
                                                }
                                            }}
                                            variant='contained'
                                        >
                                            <TextBoxToolTip sx={{ color: getContrastTextColor(role.color) }} id={role.id} text={role.name} breakOnLine={1} />
                                            {/* {role.name} */}
                                        </Button>
                                        <Button
                                            sx={{ ...buttonSx }}
                                            variant='contained'
                                            startIcon={<BadgeOutlinedIcon sx={{ mb: '4px' }} />}
                                            disabled={
                                                role.id.includes('owner')
                                                || currentLoginUserName === item.userName
                                                || item.status === 'DISABLED'
                                            }
                                            onClick={(e) => {
                                                setAnchorElPermission(e.currentTarget)
                                                setSelectedMemberRole(role)
                                                setSelectedMember(item)
                                            }}
                                        >
                                            Role
                                        </Button>
                                        <Button
                                            sx={{ ...buttonSx, mr: 0 }}
                                            variant='contained'
                                            startIcon={
                                                item.status === 'DISABLED'
                                                    ? <SettingsBackupRestoreOutlinedIcon />
                                                    : <CloseOutlinedIcon />
                                            }
                                            disabled={
                                                role.id.includes('owner')
                                                || currentLoginUserName === item.userName
                                            }
                                            onClick={() => {
                                                setSelectedMember(item)
                                                if (item.status === 'DISABLED') {
                                                    handleActiveMember()
                                                    return
                                                }
                                                setOpenDiaglogConfirmDisable(true)
                                            }}
                                        >
                                            {
                                                item.status === 'DISABLED'
                                                    ? 'Enable'
                                                    : 'Disable'
                                            }&nbsp;...
                                        </Button>
                                        <RoleSelectPopover
                                            id='role-select-popover'
                                            roleItem={responseRole.data}
                                            selectedRole={selectedMemberRole}
                                            selectedMember={selectedMember}
                                            open={openPermission}
                                            anchorEl={anchorElPermission}
                                            onClose={handleClose}
                                            refecthMember={refectMember}
                                        />
                                    </>
                                )
                            })()}
                        </Box>
                    </Box>
                ))}
            </Box>
            <ConfirmDisableFC
                memberId={selectedMember?.userId}
                open={openDiaglogConfirmDisable}
                handleClose={() => setOpenDiaglogConfirmDisable(false)}
                refecthData={refectMember}
            />
        </Box>
    )
}

export default WorkSpaceMember