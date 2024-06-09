import React, { useEffect } from 'react'
import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FilePresentIcon from '@mui/icons-material/FilePresent'
import SingleLineTextBoxToolTip from '~/components/Common/SingleLineTextBoxToolTip'
import { toast } from 'react-toastify'
import { Tooltip } from '@mui/material'
import { useUploadAttachmentMutation } from '~/core/redux/api/board-card.api'
import { UploadAttachmentReq } from '~/core/services/board-card-services.model'
import ApiLoadingOverlay from '~/components/Common/ApiLoadingOverlay'
import { formatBytes } from '~/core/utils/common-used'

export interface AttachmentDialogProps {
    id: string
    open: boolean
    anchorEl: HTMLElement | null
    onClose: () => void
    cardId: string
    reFetch: () => void
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

const textSx = {
    fontSize: '12px',
    fontWeight: '500',
    color: '#44546f'
}

const AttachmentDialog: React.FC<AttachmentDialogProps> = ({ id, open, anchorEl, onClose, cardId, reFetch }) => {
    const [uploadAttachment, { isLoading }] = useUploadAttachmentMutation()

    const [displayName, setDisplayName] = React.useState('' as string)
    const [file, setFile] = React.useState(null)

    useEffect(() => {
        setFile(null)
        setDisplayName('')
    }, [open])

    const fileInputRef = React.useRef(null)

    const handleButtonClick = () => {
        fileInputRef.current.click()
    }

    const handleFileChange = async (event: any) => {
        const file = event.target.files[0]
        const maxSizeMB = 25
        const maxSizeBytes = maxSizeMB * 1024 * 1024

        if (file.size > maxSizeBytes) {
            toast.error(
                'File size exceeds the 25MB limit. Please select a smaller file.',
                {
                    position: 'bottom-right'
                }
            )
            event.target.value = null
            return
        }

        setFile(file)
        event.target.value = null
    }

    const handleRemoveFile = () => {
        if (isLoading) return
        setFile(null)
    }

    const handleUploadFile = async () => {
        try {
            if (!file) return

            const request = {
                file: file,
                displayName: displayName,
                type: 'CARD_ATTACH',
                refId: cardId
            } as UploadAttachmentReq

            await uploadAttachment(request).unwrap()
            await reFetch()
            toast.success('File uploaded successfully.', {
                position: 'bottom-right'
            })
            onClose()
        } catch (error) {
            toast.error(
                'An error occurred while uploading the file. Please try again.',
                {
                    position: 'bottom-right'
                }
            )
        }
    }

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
                            <Box sx={{ fontSize: '12px', fontWeight: '500', color: '#44546f' }}>
                                {file
                                    ? 'Attached File'
                                    : 'Attach a file from your computer'
                                }

                            </Box>
                        </Box>
                    </Box>
                    <input
                        ref={fileInputRef}
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <Box>
                        {file
                            ?
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <Box sx={{ display: 'flex' }}>
                                    <Tooltip title={file.name} placement="top">
                                        <Box>
                                            <FilePresentIcon
                                                sx={{
                                                    m: '4px',
                                                    fontSize: '70px',
                                                    color: '#44546f'
                                                }}
                                            />
                                        </Box>
                                    </Tooltip>
                                    <Box sx={{ mt: '12px', ...textSx }}>
                                        <Box sx={{ display: 'flex' }}>
                                            <Box>File:&nbsp;</Box>
                                            <SingleLineTextBoxToolTip
                                                id={`attach-file-name-${file.name}-${file.size}`}
                                                text={file.name}
                                                sx={{ width: '130px', ...textSx }}
                                            />
                                        </Box>
                                        <Box sx={{ display: 'flex' }}>
                                            <Box>Size:&nbsp;</Box>
                                            <Box>{formatBytes(file?.size)}</Box>
                                        </Box>
                                        <Box sx={{ display: 'flex' }}>
                                            <Box>Type:&nbsp;</Box>
                                            <Box>{file?.name.split('.').pop()}</Box>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        fontSize: '12px',
                                        fontWeight: '500',
                                        color: '#44546f',
                                        cursor: isLoading ? 'none' : 'pointer',
                                        mt: '35px',
                                        '&:hover': {
                                            textDecoration: isLoading ? 'none' : 'underline'
                                        }
                                    }}
                                    onClick={handleRemoveFile}
                                >Remove</Box>
                            </Box>
                            :
                            <Button
                                className="button right-button"
                                variant="contained"
                                sx={{
                                    width: '100%',
                                    color: '#44546f',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                                onClick={handleButtonClick}
                            >Choose a file</Button>
                        }

                    </Box>
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
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Box>
                        <Button
                            variant="text"
                            sx={{ height: '32px', mr: '12px' }}
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{
                                ...buttonSx,
                                boxShadow: isLoading ? 'inset 0 0 0 1000px rgba(0, 0, 0, 0.2)' : 'none',
                            }}
                            onClick={handleUploadFile}
                        >
                            {isLoading
                                ? <Box>
                                    <ApiLoadingOverlay
                                        size='28px'
                                        processSx={{
                                            color: 'white'
                                        }}
                                    />
                                </Box>
                                : 'Upload'
                            }
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Popover >
    )
}

export default AttachmentDialog