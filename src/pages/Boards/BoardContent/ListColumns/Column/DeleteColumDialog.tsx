import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { useDeleteBoardCardMutation, useDeleteBoardColumnMutation, useLazyGetBoardByCodeQuery } from '~/core/redux/api/board.api'
import { toast } from 'react-toastify'
import ApiLoadingOverlay from '~/components/Common/ApiLoadingOverlay'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setDisableDrag } from '~/core/redux/slices/boardSlice'


export interface DialogProps {
    id: string
    open: boolean
    onClose: () => void
    columnId: string
}

const DeleteColumDialog: React.FC<DialogProps> = (
    { id, open, onClose, columnId }
) => {
    const boardId = useParams().boardId
    const [deleteColumn, { isLoading }] = useDeleteBoardColumnMutation()
    const [triggerGetBoard, { isLoading: isRefetchingBoard }] = useLazyGetBoardByCodeQuery()

    const dispatch = useDispatch()

    const handleClose = async () => {
        await dispatch(setDisableDrag(false))
        onClose()
    }

    const handleConfirmDelete = async () => {
        try {
            await deleteColumn(columnId)
            toast.success('Colum deleted successfully', {
                position: 'bottom-right'
            })

            await triggerGetBoard(boardId).unwrap()
        } catch (error) {
            console.log(error)
        }

        handleClose()
    }

    return (
        <Dialog
            id={id}
            open={open}
            onClose={() => {
                if (isLoading || isRefetchingBoard) return
                handleClose()
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {'Are you sure you want to delete this colum?'}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    When you delete a column, it will be removed from the board
                    and all its <strong>cards and cards contents will be lost</strong> and <strong>cannot be recovered.</strong>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={isLoading || isRefetchingBoard}>Disagree</Button>
                <Button onClick={handleConfirmDelete} autoFocus disabled={isLoading || isRefetchingBoard}>
                    {isLoading || isRefetchingBoard
                        ? <ApiLoadingOverlay size='23px' />
                        : 'Agree'
                    }
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteColumDialog