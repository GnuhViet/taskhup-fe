import Box from '@mui/material/Box'
import Color, { Palette } from 'color-thief-react'
import React from 'react'
import ApiLoadingOverlay from './ApiLoadingOverlay'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'

export interface ObjectFitAvatarProps {
    src: string
    alt: string
    sx?: any
}

const boxSx = {
    width: '32px',
    height: '32px',
    borderRadius: '3px'
}

const boxTextSx = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    background: 'linear-gradient(to bottom, #C9372C , #FEA362)',
    color: 'white'
}

function lightenHexColor(hex: string, lightenFactor) {
    // Remove '#' if present
    hex = hex.replace(/^#/, '')

    // Convert hex to RGB
    let r = parseInt(hex.substring(0, 2), 16)
    let g = parseInt(hex.substring(2, 4), 16)
    let b = parseInt(hex.substring(4, 6), 16)

    // Function to increase brightness
    function lightenChannel(channel: any) {
        return Math.min(255, Math.floor(channel + (255 - channel) * lightenFactor))
    }

    // Apply lightening
    r = lightenChannel(r)
    g = lightenChannel(g)
    b = lightenChannel(b)

    // Convert back to hex and pad with zeroes if necessary
    function toHex(channel: any) {
        const hex = channel.toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

const ObjectFitAvatar: React.FC<ObjectFitAvatarProps> = ({ src, alt, sx }) => {
    const [open, setOpen] = React.useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    if (src === null) {
        const firstChar = alt.charAt(0)
        return (
            <Box sx={{ ...boxSx, ...boxTextSx, ...sx }}>
                {firstChar}
            </Box>
        )
    }

    const LoadingOverlay = () => {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    justifyItems: 'center',
                    textAlign: 'center',
                    // backgroundColor: '#E2E4EA',
                    boxShadow: 'inset 0 0 0 1000px rgba(0, 0, 0, 0.1)',
                    ...sx
                }}
            >
                <ApiLoadingOverlay />
            </Box>
        )
    }

    return (
        <Box>
            <Box onClick={handleOpen} sx={{ cursor: 'pointer' }}>
                <Palette src={src} crossOrigin="anonymous" format="hex" colorCount={10}>
                    {({ data, loading }) => {
                        if (loading) return <LoadingOverlay />
                        return (
                            <Box sx={{ ...sx, boxSx, backgroundColor: lightenHexColor(data[data.length - 1], 0.5) }}>
                                <img
                                    src={src}
                                    alt={alt}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }}
                                />
                            </Box>
                        )
                    }}
                </Palette >
            </Box>
            <Box>
                <Modal
                    open={open}
                    onClose={handleClose}
                    sx={{
                        zIndex: '999',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Box>
                        <CloseOutlinedIcon
                            sx={{
                                fontSize: '30px',
                                position: 'absolute',
                                top: '10px',
                                right: '40px',
                                cursor: 'pointer',
                                color: '#c7cbd6',
                                transition: 'transform 0.3s ease-in-out',
                                transformOrigin: 'center center', // Add this line
                                '&:hover': {
                                    transform: 'scale(1.6)',
                                    color: '#fff'
                                }
                            }}
                            onClick={handleClose}
                        />
                        <Box
                            sx={{
                                width: 'fit-content',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onClick={handleClose}
                        >
                            <img
                                src={src}
                                alt={alt}
                                style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                                onClick={null}
                            />
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </Box>

    )
}

export default ObjectFitAvatar