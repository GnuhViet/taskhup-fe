import React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { setDisableDrag } from '~/core/redux/slices/boardSlice'
import { useDispatch } from 'react-redux'
import { UpdateColumTitleReq } from '~/core/services/board-services.model'
import { SubmitHandler, useForm } from 'react-hook-form'
import Typography from '@mui/material/Typography'
import { useLazyGetBoardByCodeQuery, useUpdateColumnTitleMutation } from '~/core/redux/api/board.api'
import { useParams } from 'react-router-dom'

export interface DialogProps {
    open: boolean
    onClose: () => void
    oldTitle: string
    columnId: string
}

const EditTitleDialog: React.FC<DialogProps> = (
    { open, onClose, oldTitle, columnId }
) => {
    const boardId = useParams().boardId
    const [triggerGetBoard, { isLoading: isRefetchingBoard }] = useLazyGetBoardByCodeQuery()

    const dispatch = useDispatch()

    const handleClose = async () => {
        await dispatch(setDisableDrag(false))
        onClose()
    }

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<UpdateColumTitleReq>({
        defaultValues: {
            title: oldTitle
        }
    })

    React.useEffect(() => {
        if (open) {
            setValue('title', oldTitle)
        } else {
            setValue('title', '')
        }
    }, [open])

    const [updateTitle, { isLoading: isUpdating }] = useUpdateColumnTitleMutation()

    const onSubmit: SubmitHandler<UpdateColumTitleReq> = async (data) => {
        try {
            await updateTitle(
                { title: data.title, columnId: columnId }
            ).unwrap()
            await triggerGetBoard(boardId)
        } catch (error) {
            console.log(error)
        }

        handleClose()
    }

    return (
        <>
            <Dialog
                disableEnforceFocus={true}
                open={open}
                onClose={handleClose}
                style={{
                    zIndex: 9999
                }}
            >
                <DialogTitle>Edit column tilte</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
                        <TextField
                            sx={{ width: '400px' }}
                            margin="dense"
                            label="Title"
                            fullWidth
                            variant="standard"
                            spellCheck={false}
                            {...register('title',
                                { required: 'Title is required', maxLength: { value: 60, message: 'Title max length is 60 character' } }
                            )}
                        />
                        {errors?.title &&
                            <Typography variant="caption" color="error">
                                &nbsp;{errors?.title?.message}
                            </Typography>
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type='submit' >Save</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}

export default EditTitleDialog