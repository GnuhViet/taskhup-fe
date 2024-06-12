import Box from '@mui/material/Box'
import './MemberFC.scss'
import SideBarButton from '~/components/Home/sidebar/SideBarButton'
import List from '@mui/material/List'
import { useGetWorkSpaceInfoQuery } from '~/core/redux/api/workspace.api'
import { useSelector } from 'react-redux'
import SquareAvatar from '~/components/Common/SquareAvatar'
import React from 'react'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined'
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import CloseIcon from '@mui/icons-material/Close'
import AddLinkIcon from '@mui/icons-material/AddLink'
import DialogActions from '@mui/material/DialogActions'
import Textarea from '@mui/joy/Textarea'
import Input from '@mui/joy/Input'
import { SendEmailInviteLinkReq } from '~/core/services/invite-services.model'
import { useParams } from 'react-router-dom'
import { useSendLinkViaEmailMutation } from '~/core/redux/api/invite.api'
import { toast } from 'react-toastify'
import JoinRequest from './menu-tabs/JoinRequest'
import WorkSpaceMember from './menu-tabs/WorkSpaceMember'
import CircleAvatar from '~/components/Common/CircleAvatar'
import CircularProgress from '@mui/material/CircularProgress'
import { SubmitHandler, useForm } from 'react-hook-form'
import Typography from '@mui/material/Typography'
import { ApiResponse } from '~/core/services/api.model'
import { isBlank } from '~/core/utils/data-utils'

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

const avatarSx = {
    minWidth: '60px',
    minHeight: '60px',
    width: '60px',
    height: '60px',
    fontSize: '32px',
    mr: '12px'
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
const MemberFC = () => {
    const [createInviteLink, { isLoading: isLoadingInvite }] = useSendLinkViaEmailMutation()
    const { data: apiResponse, isSuccess: isLoadingInfoSuccess } = useGetWorkSpaceInfoQuery({})
    const response = apiResponse as ApiResponse<any>
    const workspaceInfo = response?.data
    const { workspaceId } = useParams()
    const selectedButtonId = useSelector((state: any) => state.homeReducer.selectedButtonId)
    const [open, setOpen] = React.useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<SendEmailInviteLinkReq>({
        defaultValues: {
            email: null,
            content: null,
            destinationId: workspaceId
        }
    })

    const onSubmit: SubmitHandler<SendEmailInviteLinkReq> = async (data) => {
        if (isBlank(data.content)) {
            data.content = 'Join this Trello Workspace to start collaborating with me!'
        }
        try {
            await createInviteLink(data).unwrap()
            toast.success('Invite sent successfully', {
                position: 'bottom-right'
            })
        } catch (error) {
            toast.error('Invite link send failed', {
                position: 'bottom-right'
            })
        }
    }

    if (!isLoadingInfoSuccess || isLoadingInvite) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '1000px' }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <>
            <Box className="home-container" sx={{ overflow: 'hidden' }}>
                <Box className="section-workspace-header" sx={{ overflow: 'hidden' }}>
                    <Box className="section-header-content" sx={{ minWidth: '1050px!important' }}>
                        <Box className="workspace-title">
                            <Box className="title-main">
                                <SquareAvatar sx={avatarSx} src={workspaceInfo?.avatarUrl} alt={workspaceInfo.title.charAt(0)} />
                                <Box className="title-info">
                                    <Box className='title-name'>{workspaceInfo.title}</Box>
                                    <Box className='title-description'>{workspaceInfo.description}</Box>
                                </Box>
                            </Box>
                            {workspaceInfo.website && (
                                <Box className="title-link-section">
                                    <ExploreOutlinedIcon sx={{ fontSize: '22px', mr: '4px', cursor: 'default' }} />
                                    <Link className="link-text">
                                        {workspaceInfo.website}
                                    </Link>
                                </Box>
                            )}

                        </Box>
                        <Box>
                            <Button
                                onClick={() => setOpen(true)}
                                sx={{
                                    ...buttonSx,
                                    mr: 0,
                                    backgroundColor: '#0C66E4',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#0055CC'
                                    }
                                }}
                                variant='contained'
                                startIcon={<GroupAddOutlinedIcon
                                />}>Invite Workspace members</Button>
                        </Box>
                    </Box>
                    <Box sx={{
                        borderBottom: '#DCDFE4 1px solid',
                        minWidth: '1600px'
                    }}
                    />
                </Box>

                <Box className="home-sticky-container" sx={{}}>
                    <Box className="home-left-sidebar-container">
                        <List className="top-button">
                            <Box className="title">Collaborators</Box>
                            <SideBarButton id={'workspace-member-button'} text={'Workspace members'} defaultSelected />
                            {/* <SideBarButton id={'workspace-guest-button'} text={'Guests'} /> */}
                        </List>
                        <List className="work-spaces" sx={{ overflow: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                            <SideBarButton id={'workspace-join-request-button'} text={'Join requests'} />
                        </List>
                    </Box>


                    <Box className="workspace-member-content" sx={{ pt: '66px', minHeight: 'calc(100vh - 160px - 48px - 48px)', minWidth: '790px' }}>
                        {/*{selectedButtonId === 'workspace-member-button' && (*/}
                        {/*    <>workspace-member-button</>*/}
                        {/*)}*/}
                        {/*{selectedButtonId === 'workspace-guest-button' && (*/}
                        {/*    <>workspace-guest-button</>*/}
                        {/*)}*/}
                        {/*{selectedButtonId === 'workspace-join-request-button' && (*/}
                        {/*    <>workspace-join-request-button</>*/}
                        {/*)}*/}

                        {(() => {
                            switch (selectedButtonId) {
                                case 'workspace-member-button':
                                    return <>
                                        <WorkSpaceMember />
                                    </>
                                case 'workspace-guest-button':
                                    return <>
                                        <Box>
                                            <Box sx={{ ...borderBottom, pb: '14px' }}>
                                                <Box sx={headingSx}>Guests (1)</Box>
                                                <Box sx={textSx}>Guests are not included in your Premium account. Guests can only view and edit the boards to which they’ve been added.</Box>
                                            </Box>
                                            <Box sx={{ ...borderBottom, p: '24px 0 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ maxWidth: '600px' }}>
                                                    <Box sx={headingSx}>Single-board guests (1)</Box>
                                                    <Box sx={textSx}>Single-board guests are members of only one Workspace board and free on your Premium plan.</Box>
                                                </Box>
                                                <Button sx={{ ...buttonSx, mr: 0 }} variant='contained' startIcon={<GroupAddOutlinedIcon />}>Invite with link</Button>
                                            </Box>
                                            <Box sx={{ ...borderBottom, p: '24px 0 12px 0' }}>
                                                <TextField
                                                    placeholder='Filter by name...'
                                                    size='small'
                                                    sx={{ width: '450px' }}
                                                />
                                            </Box>
                                            <Box>
                                                {new Array(4).fill(null).map((item, index) => (
                                                    <Box key={index} sx={{ ...borderBottom, p: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <CircleAvatar sx={{ minWidth: '42px', minHeight: '42px', fontSize: '16px', mr: '12px', background: '#5243AA' }} src={null} alt='V' />
                                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                                <Box sx={{ fontSize: '16px', fontWeight: '800', color: '#172B4D' }}>Việt Hưng Nguyễn</Box>
                                                                <Box sx={{ fontSize: '14px', fontWeight: '400', color: '#44546f', display: 'flex' }}>
                                                                    <Box>@vithngnguyn16</Box>
                                                                    <Box sx={{ fontSize: '20px', display: 'flex', alignItems: 'center', lineHeight: '14px' }}>
                                                                        &nbsp;•&nbsp;
                                                                    </Box>
                                                                    <Box>Joined 1 month ago</Box>
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                        <Box>
                                                            <Button sx={{ ...buttonSx }} variant='contained'>View boards (3)</Button>
                                                            <Button sx={{ ...buttonSx }} variant='contained' startIcon={<BadgeOutlinedIcon sx={{ mb: '4px' }} />}>Role</Button>
                                                            <Button sx={{ ...buttonSx, mr: 0 }} variant='contained' startIcon={<CloseOutlinedIcon />}>Leave&nbsp;...</Button>
                                                        </Box>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Box>
                                    </>
                                case 'workspace-join-request-button':
                                    return <>
                                        <JoinRequest />
                                    </>
                                default:
                                    return null
                            }
                        })()}
                    </Box>
                </Box>
            </Box>

            <Dialog
                fullWidth={true}
                maxWidth='sm'
                style={{ zIndex: 9999 }}
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: { borderRadius: '15px', backgroundColor: '#F0F1F4' }
                }}
            >
                <Box className="closeIcon">
                    <CloseIcon sx={{ pr: '2px' }} onClick={() => setOpen(false)} />
                </Box>

                <DialogTitle sx={{ mb: '14px' }} >
                    Invite to Workspace
                </DialogTitle>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Input
                            fullWidth
                            placeholder='Member email address'
                            sx={{ background: 'transparent', border: '2px #D5D9DF solid', borderRadius: '0' }}
                            {...register('email', {
                                required: 'Field is required',
                                maxLength: {
                                    value: 50,
                                    message: 'Field is too long'
                                },
                                pattern: {
                                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                                    message: 'Invalid email'
                                }
                            })}
                        />
                        {errors.email && (
                            <Typography variant="caption" color="error">
                                {errors.email.message}
                            </Typography>
                        )}
                        <Textarea
                            placeholder='Join this Trello Workspace to start collaborating with me!'
                            variant="outlined"
                            minRows={4}
                            sx={{ background: 'transparent', mt: '16px', border: '2px #D5D9DF solid', borderRadius: '0' }}
                            {...register('content')}
                        />
                        <Box sx={{ backgroundColor: '#FFF7D6', mt: '16px', pt: '16px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#172b4d', paddingLeft: '22px' }}>1 new member license</span>
                            <ul style={{ margin: '10px 0 16px 0', fontSize: '12px', fontWeight: '300', color: '#626f86' }}>
                                <li>You will be charged $0.00 now</li>
                                <li>Your monthly bill will increase by $12.50 on May 20, 2024</li>
                            </ul>
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ p: '0 24px 18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ fontSize: '14px', fontWeight: '300', color: '#172b4d' }}>Invite someone to this Workspace with a link:</Box>
                        <Button sx={{
                            ...buttonSx,
                            mr: 0,
                            backgroundColor: '#DCDFE4',
                            '&:hover': {
                                backgroundColor: '#bac0ca'
                            }
                        }} variant='contained' startIcon={<AddLinkIcon />} type='submit'>
                            Send invite link via email
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}

export default MemberFC