import React from 'react'
import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'


export interface AttachmentDialogProps {
    id: string
    open: boolean
    anchorEl: HTMLElement | null
    onClose: () => void
    cardId: string
}

const borderBottom = {
    borderBottom: '1px solid #DCDFE4'
}

const titleSx = {
    frontSize: '20px',
    fontWeight: '500',
    maxWidth: '150px'
}

const buttonSx = {
    color: 'white',
    backgroundColor: '#0c66e4',
    height: '32px',
    '&:hover': {
        backgroundColor: '#0055CC',
        border: 'none'
    }
}

const AttachmentDialog: React.FC<AttachmentDialogProps> = ({ id, open, anchorEl, onClose, cardId }) => {

    return (
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
            slotProps={{
                paper: {
                    style: {
                        width: '320px',
                        borderRadius: '8px',
                        boxShadow: '0',
                        marginTop: '6px'
                    }
                }
            }}
            style={{ zIndex: 999 }}
        >
            <Box sx={{
                m: '12px 24px'
            }}>
                <Box sx={{ justifyContent: 'center', width: '100%', display: 'flex', fontWeight: '500', color: '#44546f' }}>Attachment</Box>
                <Box>
                    <Box>
                        <Box sx={{
                            mt: '8px',
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            <Box sx={{ fontSize: '12px', fontWeight: '500', color: '#44546f' }}>Attach a file from your computer</Box>
                        </Box>
                    </Box>
                    <Button
                        className="button right-button"
                        variant="contained"
                        sx={{
                            width: '100%',
                            color: '#44546f',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >Choose a file</Button>
                    <Box>
                        <Box sx={{
                            mt: '8px',
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            <Box sx={{ fontSize: '12px', fontWeight: '500', color: '#44546f' }}>Display name</Box>
                        </Box>
                    </Box>
                    <Box sx={{ p: '2px 0 4px 0', mb: '12px' }}>
                        <TextField
                            placeholder='Display name'
                            size='small'
                            sx={{ width: '100%', height: '32px' }}
                        />
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Box>
                        <Button
                            variant="text"
                            sx={{ height: '32px', mr: '12px' }}
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{ ...buttonSx }}
                            onClick={() => {
                                onClose()
                            }}
                        >
                            Insert
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Popover >
    )
}

export default AttachmentDialog