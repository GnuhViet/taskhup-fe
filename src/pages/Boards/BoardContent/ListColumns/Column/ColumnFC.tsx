import { useState } from 'react'
import { toast } from 'react-toastify'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import Cloud from '@mui/icons-material/Cloud'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Tooltip from '@mui/material/Tooltip'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddCardIcon from '@mui/icons-material/AddCard'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ListCardsFC from './ListCards/ListCardsFC'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { useConfirm } from 'material-ui-confirm'
import React from 'react'
import { Column } from '~/core/model/column.model'
import { useStompClient } from 'react-stomp-hooks'
import { useSelector } from 'react-redux'
import { BoardCardCreateReq } from '~/core/services/board-services.model'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import SingleLineTextBoxToolTip from '~/components/Common/SingleLineTextBoxToolTip'
import { max } from 'lodash'

interface ColumnFCProps {
    column: Column
    deleteColumnDetails: (columnId: string) => void
}

const ColumnFC: React.FC<ColumnFCProps> = ({ column, deleteColumnDetails }) => {
    //<editor-fold desc="Hook & State">
    const stompClient = useStompClient()
    const boardId = useSelector((state: any) => state.boardReducer.boardId)

    const disableDrag = useSelector((state: any) => state.boardReducer.disableDrag)
    const [anchorEl, setAnchorEl] = useState(null)
    const [openNewCardForm, setOpenNewCardForm] = useState(false)
    const [newCardTitle, setNewCardTitle] = useState('')

    // Xử lý xóa một ColumnFC và Cards bên trong nó
    const confirmDeleteColumn = useConfirm()

    // Cards đã được sắp xếp ở component cha cao nhất (boards/_id.jsx) (Video 71 đã giải thích lý do)
    const orderedCards = column.cards

    const open = Boolean(anchorEl)
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: { ...column },
        disabled: disableDrag
    })
    const dndKitColumnStyles = {
        // touchAction: 'none', // Dành cho sensor default dạng PointerSensor
        // Nếu sử dụng CSS.Transform như docs sẽ lỗi kiểu stretch
        // https://github.com/clauderic/dnd-kit/issues/117
        transform: CSS.Translate.toString(transform),
        transition,
        // Chiều cao phải luôn max 100% vì nếu không sẽ lỗi lúc kéo column ngắn qua một cái column dài thì phải kéo ở khu vực giữa giữa rất khó chịu (demo ở video 32). Lưu ý lúc này phải kết hợp với {...listeners} nằm ở Box chứ không phải ở div ngoài cùng để tránh trường hợp kéo vào vùng xanh.
        height: '100%',
        opacity: isDragging ? 0.5 : undefined
    }
    //</editor-fold>

    const handleClick = (event: any) => setAnchorEl(event.currentTarget)

    const handleClose = () => setAnchorEl(null)

    const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

    const addNewCard = () => {
        if (!newCardTitle) {
            toast.error('Please enter Card Title!', { position: 'bottom-right' })
            return
        }

        // Tạo dữ liệu Card để gọi API
        const newCardData = {
            title: newCardTitle,
            boardColumnId: column.id
        } as BoardCardCreateReq

        if (stompClient) {
            stompClient.publish({ destination: `/app/board/${boardId}/createCard`, body: JSON.stringify(newCardData) })
        }
        // Đóng trạng thái thêm Card mới & Clear Input
        toggleOpenNewCardForm()
        setNewCardTitle('')
    }

    const handleDeleteColumn = () => {
        confirmDeleteColumn({
            title: 'Delete ColumnFC?',
            description: 'This action will permanently delete your ColumnFC and its Cards! Are you sure?',
            confirmationText: 'Confirm',
            cancellationText: 'Cancel'
            // buttonOrder: ['confirm', 'cancel']
            // content: 'test content hehe',
            // allowClose: false,
            // dialogProps: { maxWidth: 'lg' },
            // cancellationButtonProps: { color: 'primary' },
            // confirmationButtonProps: { color: 'success', variant: 'outlined' },
            // description: 'Phải nhập chữ trungquandev thì mới được Confirm =))',
            // confirmationKeyword: 'trungquandev'
        }).then(() => {
            /**
       * Gọi lên props function deleteColumnDetails nằm ở component cha cao nhất (boards/_id.jsx)
       * Lưu ý: Về sau ở học phần MERN Stack Advance nâng cao học trực tiếp mình sẽ với mình thì chúng ta sẽ đưa dữ liệu Board ra ngoài Redux Global Store,
       * và lúc này chúng ta có thể gọi luôn API ở đây là xong thay vì phải lần lượt gọi ngược lên những component cha phía bên trên. (Đối với component con nằm càng sâu thì càng khổ :D)
       * - Với việc sử dụng Redux như vậy thì code sẽ Clean chuẩn chỉnh hơn rất nhiều.
       */
            deleteColumnDetails(column.id)
        }).catch(() => { })
    }

    // Phải bọc div ở đây vì vấn đề chiều cao của column khi kéo thả sẽ có bug kiểu kiểu flickering (video 32)
    return (
        <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
            <Box
                {...listeners}
                sx={{
                    minWidth: '300px',
                    maxWidth: '300px',
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
                    ml: 2,
                    borderRadius: '6px',
                    height: 'fit-content',
                    '*::-webkit-scrollbar': {
                        width: '8px',
                        height: '8px'
                    },
                    '*::-webkit-scrollbar-thumb': {
                        backgroundColor: '#e9eaec',
                        borderRadius: '8px'
                    },
                    '*::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#acafb9'
                    },
                    maxHeight: (theme: any) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
                }}
            >
                {/* Box ColumnFC Header */}
                <Box sx={{
                    height: (theme: any) => theme.trello.columnHeaderHeight,
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant="h6" sx={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}>
                        <SingleLineTextBoxToolTip
                            id={`collum-title-of-${column?.id}`}
                            text={column?.title}
                            sx={{
                                width: '238px'
                            }}
                        />
                    </Typography>
                    <Box>
                        <Tooltip title="More options">
                            <ExpandMoreIcon
                                sx={{ color: 'text.primary', cursor: 'pointer' }}
                                id="basic-column-dropdown"
                                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                            />
                        </Tooltip>
                        <Menu
                            id="basic-menu-column-dropdown"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-column-dropdown'
                            }}
                        >
                            <MenuItem
                                onClick={toggleOpenNewCardForm}
                                sx={{
                                    '&:hover': {
                                        color: 'success.light',
                                        '& .add-card-icon': { color: 'success.light' }
                                    }
                                }}
                            >
                                <ListItemIcon><AddCardIcon className="add-card-icon" fontSize="small" /></ListItemIcon>
                                <ListItemText>Add new card</ListItemText>
                            </MenuItem>
                            <MenuItem>
                                <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                                <ListItemText>Cut</ListItemText>
                            </MenuItem>
                            <MenuItem>
                                <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
                                <ListItemText>Copy</ListItemText>
                            </MenuItem>
                            <MenuItem>
                                <ListItemIcon><ContentPaste fontSize="small" /></ListItemIcon>
                                <ListItemText>Paste</ListItemText>
                            </MenuItem>
                            <Divider />
                            <MenuItem
                                onClick={handleDeleteColumn}
                                sx={{
                                    '&:hover': {
                                        color: 'warning.dark',
                                        '& .delete-forever-icon': { color: 'warning.dark' }
                                    }
                                }}
                            >
                                <ListItemIcon><DeleteForeverIcon className="delete-forever-icon" fontSize="small" /></ListItemIcon>
                                <ListItemText>Delete this column</ListItemText>
                            </MenuItem>
                            <MenuItem>
                                <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
                                <ListItemText>Archive this column</ListItemText>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>

                {/* List Cards */}
                <ListCardsFC cards={orderedCards} />

                {/* Box ColumnFC Footer */}
                <Box sx={{ height: (theme: any) => theme.trello.columnFooterHeight, p: 2 }}>
                    {!openNewCardForm
                        ? <Box sx={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Button startIcon={<AddCardIcon />} onClick={toggleOpenNewCardForm}>Add new card</Button>
                            <Tooltip title="Drag to move">
                                <DragHandleIcon sx={{ cursor: 'pointer' }} />
                            </Tooltip>
                        </Box>
                        : <Box sx={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <TextField
                                label="Enter card title..."
                                type="text"
                                size="small"
                                variant="outlined"
                                autoFocus
                                data-no-dnd="true"
                                value={newCardTitle}
                                onChange={(e) => setNewCardTitle(e.target.value)}
                                sx={{
                                    '& label': { color: 'text.primary' },
                                    '& input': {
                                        color: (theme) => theme.palette.primary.main,
                                        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                                    },
                                    '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                                        '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                                        '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        borderRadius: 1
                                    }
                                }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Button
                                    onClick={addNewCard}
                                    variant="contained" color="success" size="small"
                                    sx={{
                                        boxShadow: 'none',
                                        border: '0.5px solid',
                                        borderColor: (theme) => theme.palette.success.main,
                                        '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                                    }}
                                >Add</Button>
                                <CloseIcon
                                    fontSize="small"
                                    sx={{
                                        color: (theme) => theme.palette.warning.light,
                                        cursor: 'pointer'
                                    }}
                                    onClick={toggleOpenNewCardForm}
                                />
                            </Box>
                        </Box>
                    }
                </Box>
            </Box>
        </div>
    )
}

export default ColumnFC
