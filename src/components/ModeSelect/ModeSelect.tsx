import React from 'react'

import { useColorScheme } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Box from '@mui/material/Box'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'

const ModeSelect: React.FC = () => {
    const { mode, setMode } = useColorScheme()

    const handleChange = (event: any) => {
        const selectedMode = event.target.value
        setMode(selectedMode)
    }

    return (
        <FormControl size="small" sx={{ minWidth: '120px' }}>
            <InputLabel
                id="label-select-dark-light-mode"
                sx={{
                    color: 'black'
                    // '&.Mui-focused': { color: 'white' }
                }}
            >
                Mode
            </InputLabel>
            <Select
                labelId="label-select-dark-light-mode"
                id="select-dark-light-mode"
                value={mode}
                label="Mode"
                onChange={handleChange}
                sx={{
                    color: 'black',
                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
                    '.MuiSvgIcon-root': { color: 'black' }
                }}
            >
                <MenuItem value="light">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LightModeIcon fontSize="small" /> Light
                    </Box>
                </MenuItem>
                <MenuItem value="dark">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DarkModeOutlinedIcon fontSize="small" /> Dark
                    </Box>
                </MenuItem>
                <MenuItem value="system">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SettingsBrightnessIcon fontSize="small" /> System
                    </Box>
                </MenuItem>
            </Select>
        </FormControl>
    )
}

export default ModeSelect
