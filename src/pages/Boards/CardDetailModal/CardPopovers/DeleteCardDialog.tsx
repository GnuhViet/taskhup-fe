import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { useDeleteBoardCardMutation } from '~/core/redux/api/board.api'
import { toast } from 'react-toastify'
import ApiLoadingOverlay from '~/components/Common/ApiLoadingOverlay'


export interface DialogProps {
    id: string
    open: boolean
    onClose: () => void
    cardId: string
}

const DeleteCardDialog: React.FC<DialogProps> = (
    { id, open, onClose, cardId }
) => {
    const [deleteCard, { isLoading }] = useDeleteBoardCardMutation()

    const handleDeleteCard = async () => {
        try {
            await deleteCard(cardId)
            toast.success('Card deleted successfully', {
                position: 'bottom-right'
            })
        } catch (error) {
            console.log(error)
        }

        onClose()
    }

    return (
        <Dialog
            id={id}
            open={open}
            onClose={() => {
                if (isLoading) return
                onClose()
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {'Are you sure you want to delete this card?'}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    When you delete a card, it will be removed from the board
                    and all its <strong>contents will be lost</strong> and <strong>cannot be recovered.</strong>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isLoading}>Disagree</Button>
                <Button onClick={handleDeleteCard} autoFocus disabled={isLoading}>
                    {isLoading
                        ? <ApiLoadingOverlay size='23px' />
                        : 'Agree'
                    }
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteCardDialog