import React, { useState } from 'react'
import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import Profiles from './Menus/Profiles'
import TextField from '@mui/material/TextField'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import CreateMenu from './Menus/Create'
import { useNavigate } from 'react-router-dom'

const AppBar: React.FC = () => {
    const [searchValue, setSearchValue] = useState('')
    const navigate = useNavigate()

    return (
        <>
            <Box sx={{
                maxHeight: '48px',
                width: '100%',
                height: (theme: any) => theme.trello.appBarHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                paddingX: 2,
                overflowX: 'auto',
                borderBottom: '1px solid #dfe1e6',
                zIndex: 50,
                backgroundColor: 'white'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AppsIcon />
                    <Box
                        sx={{
                            cursor: 'pointer',
                            minWidth: '100px',
                            minHeight: '32px',
                            borderRadius: '3px',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center center',
                            backgroundSize: '85px',
                            backgroundImage: 'url(https://trello.com/assets/d947df93bc055849898e.gif)',
                            filter: 'brightness(0) saturate(100%) invert(30%) sepia(53%) saturate(323%) hue-rotate(179deg) brightness(91%) contrast(88%)',
                            '&:hover': {
                                maxHeight: '100%',
                                boxShadow: 'inset 0 0 0 1000px rgba(0, 0, 0, 0.2)',
                                backgroundImage: 'url(https://trello.com/assets/87e1af770a49ce8e84e3.gif)'
                            }
                        }}
                        onClick={() => navigate('/home')}
                    >
                        <Box sx={{}}>
                            {/*<SvgIcon component={TrelloIcon} fontSize="small" inheritViewBox />*/}
                            {/*<Typography variant="span" sx={{*/}
                            {/*    fontSize: '1.2rem',*/}
                            {/*    fontWeight: 'bold'*/}
                            {/*}}>Trello</Typography>*/}
                        </Box>
                    </Box>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                        <Workspaces />
                        <Recent />
                        <Starred />
                        <Templates />
                        <CreateMenu />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                        id="outlined-search"
                        label="Search..."
                        type="text"
                        size="small"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <CloseIcon
                                        fontSize="small"
                                        sx={{ color: searchValue ? 'black' : 'transparent', cursor: 'pointer' }}
                                        onClick={() => setSearchValue('')}
                                    />
                                </InputAdornment>
                            )
                        }}
                        sx={{
                            minWidth: '120px',
                            maxWidth: '180px',
                            '& label': { color: 'black' },
                            '& input': { color: 'black' },
                            '& label.Mui-focused': { color: 'black' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'black' },
                                '&:hover fieldset': { borderColor: 'black' },
                                '&.Mui-focused fieldset': { borderColor: 'black' }
                            }
                        }}
                    />

                    <ModeSelect />

                    <Tooltip title="Notifications">
                        <Badge color="warning" variant="dot" sx={{ cursor: 'pointer' }}>
                            <NotificationsNoneIcon />
                        </Badge>
                    </Tooltip>

                    <Tooltip title="Help">
                        <HelpOutlineIcon sx={{ cursor: 'pointer' }} />
                    </Tooltip>

                    <Profiles />

                </Box>
            </Box>
        </>
    )
}

export default AppBar
