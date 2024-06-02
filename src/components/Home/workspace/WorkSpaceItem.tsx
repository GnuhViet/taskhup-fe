import React from 'react'

import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import SquareAvatar from '~/components/Common/SquareAvatar'
import TextBoxToolTip from '~/components/Common/TextBoxToolTip'

import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import MovingOutlinedIcon from '@mui/icons-material/MovingOutlined'
import BoardItem from '../boards/BoardItem'
import { WorkSpace } from '~/core/model/workspace.model'
import { Board } from '~/core/model/board.model'
import CreateBoardPopover from '../boards/createboard/CreateBoardPopover'
import { useNavigate } from 'react-router-dom'

const avatarSx = {
    minWidth: '32px',
    minHeight: '32px',
    width: '32px',
    height: '32px',
    mr: '12px'
}

const titleSx = {
    frontSize: '20px',
    fontWeight: '600',
    maxWidth: '260px',
    color: '#172b4d'
}

const buttonSx = {
    color: '#172B4D',
    backgroundColor: '#F0F1F4',
    boxShadow: 'none !important',
    height: '32px',
    frontSize: '14px',
    frontWeight: '300',
    mr: '6px',
    '&:hover': {
        backgroundColor: '#DCDFE4'
    }
}

const verifiedButtonSx = {
    color: '#ffffff',
    backgroundColor: '#5055d7',
    '&:hover': {
        backgroundColor: '#262ba6'
    }
}

const upgradeButtonSx = {
    color: '#44546f',
    backgroundColor: '#F3F0FF',
    frontWeight: '',
    '&:hover': {
        backgroundColor: '#DFD8FD'
    }
}

export interface WorkSpaceItemProps {
    workspace: WorkSpace
}

const WorkSpaceItem: React.FC<WorkSpaceItemProps> = ({ workspace }) => {
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    const open = Boolean(anchorEl)
    const id = open ? 'workspace-create-board-popover' : undefined

    return (
        <Box>
            <Box className='section-header' sx={{ display: 'flex', justifyContent: 'space-between', pr: '10px' }}>
                <Box className='section-header-title' sx={{ display: 'flex', alignItems: 'center' }}>
                    <SquareAvatar
                        sx={avatarSx}
                        src={workspace.avatarUrl}
                        alt={workspace.title.charAt(0).toUpperCase()}
                    />
                    <TextBoxToolTip sx={titleSx} text={workspace?.title.toUpperCase()} id={workspace?.id} breakOnLine={1} />
                </Box>
                <Box sx={{ minWidth: '592px' }}>
                    <Button sx={{ ...buttonSx }} variant='contained' startIcon={<TrelloIcon />}>Boards</Button>
                    <Button sx={{ ...buttonSx }} variant='contained' startIcon={<GridViewOutlinedIcon />}>Views</Button>
                    <Button sx={{ ...buttonSx }} variant='contained' startIcon={<PermIdentityOutlinedIcon />} onClick={() => navigate(`/w/${workspace.id}/member`)}>Members ({workspace.memberCount})</Button>
                    <Button sx={{ ...buttonSx }} variant='contained' startIcon={<SettingsOutlinedIcon />} onClick={() => navigate(`/w/${workspace.id}/settings`)}>Settings</Button>
                    <Button sx={{ ...buttonSx, ...upgradeButtonSx }} variant='contained' startIcon={<MovingOutlinedIcon />}>Upgrade</Button>
                    {/* <Button sx={{ ...buttonSx, ...verifiedButtonSx }} variant='contained' startIcon={<VerifiedOutlinedIcon />}>Ultimate</Button> */}
                </Box>
            </Box>

            <Box className='section-content' sx={{ display: 'flex', mt: '16px', flexWrap: 'wrap' }}>
                {workspace?.boards?.map((board: Board) =>
                    <Box key={board.id} sx={{ m: '0 16px 16px 0' }}>
                        <BoardItem
                            id={`${board.id}`}
                            title={board.title}
                            workspaceId={workspace.id}
                            desc={board.description}
                            starred={false}
                            backgroundUrl='https://trello-backgrounds.s3.amazonaws.com/SharedBackground/480x336/24baa6609b89fb8eb0cc0aceb70eaf36/photo-1557682250-33bd709cbe85.jpg'
                        />
                    </Box>
                )}
                {workspace.canCreateBoard &&
                    <Button sx={{ ...buttonSx, width: '194px', height: '96px', fontWeight: '300', m: '0 16px 16px 0' }} aria-describedby={id} onClick={handleClick}>
                        Create new board
                    </Button>
                }
                <CreateBoardPopover id={id} workspaceId={workspace.id} open={open} anchorEl={anchorEl} onClose={handleClose} />
            </Box>
        </Box>
    )
}

export default WorkSpaceItem