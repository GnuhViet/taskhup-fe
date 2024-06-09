import React, { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';
import Modal from '@mui/material/Modal'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'

export interface VideoThumnailProps {
    src: string
}

const VideoThumnail: React.FC<VideoThumnailProps> = ({ src }) => {
    const videoRef = useRef(null)
    const [open, setOpen] = React.useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
        <Box>
            <Box
                sx={{
                    width: '112px',
                    height: '80px',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: 'inset 0 0 0 1000px rgba(0, 0, 0, 0.2)',
                    cursor: 'pointer',
                    fontSize: '34px',
                    '&:hover': {
                        boxShadow: 'inset 0 0 0 1000px rgba(0, 0, 0, 0.6)',
                        fontSize: '54px',
                        '& svg': { // Target the SVG inside the Box (the PlayCircleFilledWhiteOutlinedIcon)
                            transform: 'translate(-50%, -50%) scale(1.5)'
                        }
                    }
                }}
                onClick={handleOpen}
            >
                <PlayCircleFilledWhiteOutlinedIcon
                    sx={{
                        fontSize: '38px',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: '#fff',
                        transition: 'transform 0.3s ease-in-out',
                    }}
                />
                <video ref={videoRef} style={{ width: '112px', height: '80px' }} src={src}></video>
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
                                height: 'fit-content',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <video
                                ref={videoRef}
                                src={src}
                                controls
                                style={{ minHeight: '700px', minWidth: 'auto' }}
                            ></video>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </Box>
    )
}

export default VideoThumnail