import { useState } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import ColumnFC from './Column/ColumnFC'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import React from 'react'
import { Column } from '~/core/model/column.model'
import { useStompClient } from 'react-stomp-hooks'
import { useSelector } from 'react-redux'
import { BoardColumnCreateReq } from '~/core/services/board-services.model'

interface ListColumnsFCProps {
    // columns: Column[]
    deleteColumnDetails: (columnId: string) => void
}

const ListColumnsFC: React.FC<ListColumnsFCProps> = ({ deleteColumnDetails }) => {
    const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
    const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)
    const boardId = useSelector((state: any) => state.boardReducer.boardId)
    const columns = useSelector((state: any) => state.boardReducer.board.columns)

    const [newColumnTitle, setNewColumnTitle] = useState('')

    const stompClient = useStompClient()

    const addNewColumn = () => {
        if (!newColumnTitle) {
            toast.error('Please enter ColumnFC Title!')
            return
        }

        // Tạo dữ liệu ColumnFC để gọi API
        const newColumnData = {
            title: newColumnTitle
        } as BoardColumnCreateReq

        if (stompClient) {
            stompClient.publish({
                destination: `/app/board/${boardId}/createColumn`,
                body: JSON.stringify(newColumnData)
            })
        }
        // Đóng trạng thái thêm ColumnFC mới & Clear Input
        toggleOpenNewColumnForm()
        setNewColumnTitle('')
    }

    /**
     * Thằng SortableContext yêu cầu items là một mảng dạng ['id-1', 'id-2'] chứ không phải [{id: 'id-1'}, {id: 'id-2'}]
     * Nếu không đúng thì vẫn kéo thả được nhưng không có animation
     * https://github.com/clauderic/dnd-kit/issues/183#issuecomment-812569512
     */
    return (
        <SortableContext items={columns?.map((c: any) => c.id)} strategy={horizontalListSortingStrategy}>
            <Box sx={{
                bgcolor: 'inherit',
                width: '100%',
                height: '100%',
                display: 'flex',
                overflowX: 'auto',
                overflowY: 'hidden',
                '&::-webkit-scrollbar-track': { m: 2 }
            }}
            >
                {columns?.map((column: Column) => <ColumnFC
                    key={column.id}
                    column={column}
                    deleteColumnDetails={deleteColumnDetails}
                />)}

                {/* Box Add new column CTA */}
                {!openNewColumnForm
                    ? <Box onClick={toggleOpenNewColumnForm} sx={{
                        minWidth: '250px',
                        maxWidth: '250px',
                        mx: 2,
                        borderRadius: '6px',
                        height: 'fit-content',
                        // bgcolor: 'black'
                        bgcolor: '#ffffff3d',
                        '&:hover': {
                            bgcolor: '#ffffff4d',
                            boxShadow: 'inset 0 0 0 1000px rgba(0, 0, 0, 0.4)'
                        }
                    }}>
                        <Button
                            startIcon={<NoteAddIcon/>}
                            sx={{
                                color: 'white',
                                width: '100%',
                                justifyContent: 'flex-start',
                                pl: 2.5,
                                py: 1
                            }}
                        >
                            Add new column
                        </Button>
                    </Box>
                    : <Box sx={{
                        minWidth: '250px',
                        maxWidth: '250px',
                        mx: 2,
                        p: 1,
                        borderRadius: '6px',
                        height: 'fit-content',
                        bgcolor: '#ffffff3d',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                    }}>
                        <TextField
                            label="Enter column title..."
                            type="text"
                            size="small"
                            variant="outlined"
                            autoFocus
                            value={newColumnTitle}
                            onChange={(e) => setNewColumnTitle(e.target.value)}
                            sx={{
                                '& label': { color: 'white' },
                                '& input': { color: 'white' },
                                '& label.Mui-focused': { color: 'white' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'white' },
                                    '&:hover fieldset': { borderColor: 'white' },
                                    '&.Mui-focused fieldset': { borderColor: 'white' }
                                }
                            }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Button
                                onClick={addNewColumn}
                                variant="contained" color="success" size="small"
                                sx={{
                                    boxShadow: 'none',
                                    border: '0.5px solid',
                                    borderColor: (theme) => theme.palette.success.main,
                                    '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                                }}
                            >Add Column</Button>
                            <CloseIcon
                                fontSize="small"
                                sx={{
                                    color: 'white',
                                    cursor: 'pointer',
                                    '&:hover': { color: (theme) => theme.palette.warning.light }
                                }}
                                onClick={toggleOpenNewColumnForm}
                            />
                        </Box>
                    </Box>
                }
            </Box>
        </SortableContext>
    )
}

export default ListColumnsFC
