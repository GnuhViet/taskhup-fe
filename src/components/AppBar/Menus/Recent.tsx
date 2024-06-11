import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AppBarDropDownItem from '~/components/Common/AppBarDropDownItem'
import { useSelector } from 'react-redux'
import { Board } from '~/core/model/board.model'

import { ReactComponent as NoDataIcon } from '~/assets/no-data.svg'

const Recent: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    const recentBoard = useSelector((state: any) => state.homeReducer.recentBoard) as Board[]

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
                Recent
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
                {(recentBoard && recentBoard.length > 0)
                    ? recentBoard.map((item: any, index: number) => (
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
                            width: '200px',
                            height: '100px',
                            padding: '0 10px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <NoDataIcon />

                        <Box sx={{
                            textAlign: 'center',
                            color: '#44546f',
                            fontSize: '14px',
                            fontWeight: '400',
                            lineHeight: '20px',
                            mt: '8px'
                        }}>
                            {'You don\'t have any recent activity yet.'}
                        </Box>
                    </Box>
                }

            </Menu>
        </Box>
    )
}

export default Recent
