import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AppBarDropDownItem from '~/components/Common/AppBarDropDownItem'
import { useSelector } from 'react-redux'
import { Board } from '~/core/model/board.model'

import { ReactComponent as StarredBoardIcon } from '~/assets/starred-board.svg'

const Starred: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const starredBoard = useSelector((state: any) => state.homeReducer.starredBoard) as Board[]

    return (
        <Box>
            <Button
                sx={{
                    color: 'black',
                    height: '32px',
                    mt: '3px',
                    '&:hover': {
                        boxShadow: 'inset 0 0 0 1000px rgba(0, 0, 0, 0.2)'
                    }
                }}
                id="basic-button-recent"
                aria-controls={open ? 'basic-menu-recent' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                endIcon={<ExpandMoreIcon />}
            >
                Starred
            </Button>
            <Menu
                id="basic-menu-recent"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button-recent'
                }}
            >
                {(starredBoard && starredBoard.length > 0)
                    ? starredBoard.map((item: any, index: number) => (
                        <MenuItem key={`starred-menu-item-${index}`}>
                            <AppBarDropDownItem item={{
                                id: item.id,
                                title: item.title,
                                description: item.shortDescription,
                                type: 'board',
                                starred: item.isStarred,
                                workspaceId: item.workspaceId,
                                backgroundUrl: 'https://res.cloudinary.com/dhqx90jaa/image/upload/v1718077281/ywbz7jsardpfpygmim4r.jpg',
                                backgroundColor: item.color
                            }} />
                        </MenuItem>
                    ))
                    : <Box
                        sx={{
                            width: '280px',
                            height: '188px',
                            padding: '0 10px',
                        }}
                    >
                        <StarredBoardIcon />
                        <Box sx={{
                            textAlign: 'center',
                            color: '#44546f',
                            fontSize: '14px',
                            fontWeight: '400',
                            lineHeight: '20px'
                        }}>
                            Star important boards to access them quickly and easily.
                        </Box>
                    </Box>
                }

            </Menu>
        </Box>
    )
}

export default Starred
