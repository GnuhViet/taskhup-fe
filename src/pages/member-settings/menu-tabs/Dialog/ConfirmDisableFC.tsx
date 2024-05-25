import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { useDisableMemberFromWsMutation } from '~/core/redux/api/workspace.api'

export interface ConfirmDisableFCProps {
    memberId: string
    open: boolean
    handleClose: () => void
    refecthData: () => void
}

const ConfirmDisableFC: React.FC<ConfirmDisableFCProps> = ({ open, handleClose, memberId, refecthData }) => {
    const [disableMember, { isLoading }] = useDisableMemberFromWsMutation()

    const handleAgree = async () => {
        try {
            await disableMember({ memberId: memberId })
            refecthData()
            handleClose()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Disable workspace member?
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Box sx={{ mb: '8px' }}>
                        When a member is disabled from the workspace
                    </Box>
                    &nbsp;•&nbsp;&nbsp;They will not be able to see this workspace
                    <br />&nbsp;•&nbsp;&nbsp;The data related to the disabled member will still exist
                    <br />&nbsp;•&nbsp;&nbsp;It is necessary to re-invite to activate the member.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Disagree</Button>
                <Button onClick={handleAgree} autoFocus>
                    Agree
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDisableFC