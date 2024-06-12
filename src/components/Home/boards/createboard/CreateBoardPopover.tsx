import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import { ReactComponent as CloseIcon } from '~/assets/close.svg'
import { ReactComponent as BoardIcon } from '~/assets/board-trans.svg'
import { ReactComponent as SelectedIcon } from '~/assets/selected-icon.svg'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import FormHelperText from '@mui/joy/FormHelperText'
import TextField from '@mui/material/TextField'
import Select, { selectClasses } from '@mui/joy/Select'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import Option from '@mui/joy/Option'
import Button from '@mui/material/Button'
import { BoardCreateReq, BoardCreateResp } from '~/core/services/board-services.model'
import { useDispatch, useSelector } from 'react-redux'
import { WorkSpace } from '~/core/model/workspace.model'
import { useCreateBoardMutation } from '~/core/redux/api/board.api'
import { addCreatedBoard } from '~/core/redux/slices/homeSlice'
import { ApiResponse } from '~/core/services/api.model'
import { toast } from 'react-toastify'
import SingleLineTextBoxToolTip from '~/components/Common/SingleLineTextBoxToolTip'
import { Tooltip } from '@mui/material'

export interface CreateBoardPopoverProps {
    id: string
    workspaceId?: string
    open: boolean
    anchorEl: HTMLElement
    onClose?: () => void
}

export interface BackgourndSelectProps {
    id: string
    data: string
    selectedId: string
}

const contentSx = {
    width: '100%',
    overflow: 'hidden',
    p: '0 12px 12px 12px'
}

const closeButtonSx = {
    position: 'absolute',
    right: '4px',
    top: '7px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#B2B9C4'
    }
}

const paddingSx = {
    p: '4px 8px 4px 8px'
}

const titleSx = {
    m: '12px 0 4px 0',
    fontSize: '12px',
    fontWeight: 'bold'
}

const backGroundUrlList = {
    img1: '#1976d2',
    img2: 'linear-gradient(to bottom right, #FF5733, #FFC300)',
    img3: 'linear-gradient(to bottom right, #3385FF, #D433FF)',
    img4: 'linear-gradient(to bottom right, #FF33A1, #FF3333)',
    color1: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    color2: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    color3: 'linear-gradient(45deg, #FF3D00 30%, #FF9100 90%)',
    color4: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
    color5: 'linear-gradient(45deg, #9C27B0 30%, #E040FB 90%)',
    color6: 'linear-gradient(45deg, #607D8B 30%, #9E9E9E 90%)'
}


const CreateBoardPopover: React.FC<CreateBoardPopoverProps> = ({ id, workspaceId, open, anchorEl, onClose }) => {
    const dispatch = useDispatch()
    const workspaces = (useSelector((state: any) => state.homeReducer.workspace) as WorkSpace[]).filter((item: WorkSpace) => item.canCreateBoard)

    enum BackgroundType {
        URL = 'URL',
        COLOR = 'COLOR'
    }

    const [selectedId, setSelectedId] = React.useState('1')
    const [backGroundData, setBackGroundData] = React.useState(backGroundUrlList.img1)
    const [backgroundType, setBackgroundType] = React.useState<BackgroundType>(BackgroundType.URL)

    const handleSelectBackground = (id: string, data: string, type: BackgroundType) => {
        setSelectedId(id)
        setBackGroundData(data)
        setBackgroundType(type)
    }

    React.useEffect(() => {
        setBackGroundData(backGroundUrlList.img1)
        reset()
    }, [open])

    const BackgourndUrlSelect: React.FC<BackgourndSelectProps> = ({ id, data, selectedId }) => {
        return (
            <Box
                sx={{
                    width: '64px',
                    height: '40px',
                    borderRadius: '3px',
                    background: `${data}`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                        boxShadow: 'inset 0 0 0 1000px rgba(0, 0, 0, 0.4)'
                    }
                }}
                onClick={() => handleSelectBackground(id, data, BackgroundType.URL)}
            >
                {id === selectedId ? <SelectedIcon /> : null}
            </Box>
        )
    }

    const BackgourndColorSelect: React.FC<BackgourndSelectProps> = ({ id, data, selectedId }) => {
        return (
            <Box
                sx={{
                    width: '40px',
                    height: '32px',
                    borderRadius: '3px',
                    backgroundImage: `${data}`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                        boxShadow: 'inset 0 0 0 1000px rgba(0, 0, 0, 0.4)'
                    }
                }}
                onClick={() => handleSelectBackground(id, data, BackgroundType.COLOR)}
            >
                {id === selectedId ? <SelectedIcon /> : null}
            </Box>
        )
    }

    const form = useForm<BoardCreateReq>({
        defaultValues: {
            title: '',
            background: backGroundUrlList.img1,
            workspaceId: workspaceId === undefined ? '' : workspaceId
        }
    })

    const { register, handleSubmit, formState, getValues, reset } = form
    const { errors } = formState

    const [create, { isLoading }] = useCreateBoardMutation()

    const onSubmit: SubmitHandler<BoardCreateReq> = async (data) => {
        try {
            data.background = backGroundData
            console.log(data)

            const resp = await create(data).unwrap() as ApiResponse<BoardCreateResp>
            dispatch(addCreatedBoard(resp.data))
            onClose()
            toast.success('Board created!')
            // dispatch later
        } catch (error) {
            //TODO
        }
    }

    React.useEffect(() => {
        if (!open) {
            form.reset()
        }
    }, [open, form])

    return (
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={
                id === 'header-create-board-popover'
                    ? {
                        vertical: 'bottom',
                        horizontal: 'left'
                    } : {
                        vertical: 'top',
                        horizontal: 'right'
                    }
            }
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
            }}
            slotProps={{
                paper: {
                    style: {
                        minWidth: '300px',
                        borderRadius: '8px',
                        // border: '1px solid #B2B9C4',
                        boxShadow: '0',
                        marginTop: id === 'header-create-board-popover' ? '8px' : '0'
                    }
                }
            }}
            style={{ zIndex: 99 }}
        >
            <>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', ...paddingSx }}>
                        <Box sx={{ height: '40px', display: 'flex', alignItems: 'center' }}>Create board</Box>
                        <Box sx={closeButtonSx} onClick={onClose}>
                            <CloseIcon />
                        </Box>
                    </Box>
                    <Box sx={contentSx}>
                        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Box sx={{
                                width: '200px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRadius: '3px',
                                background: backGroundData,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}>
                                <BoardIcon />
                            </Box>
                        </Box>


                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Box className="formSection" sx={{ pb: '4px' }}>
                                <Box sx={titleSx}>Background</Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: '8px' }}>
                                    <BackgourndUrlSelect id='1' selectedId={selectedId} data={backGroundUrlList.img1} />
                                    <BackgourndUrlSelect id='2' selectedId={selectedId} data={backGroundUrlList.img2} />
                                    <BackgourndUrlSelect id='3' selectedId={selectedId} data={backGroundUrlList.img3} />
                                    <BackgourndUrlSelect id='4' selectedId={selectedId} data={backGroundUrlList.img4} />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <BackgourndColorSelect id='5' selectedId={selectedId} data={backGroundUrlList.color1} />
                                    <BackgourndColorSelect id='6' selectedId={selectedId} data={backGroundUrlList.color2} />
                                    <BackgourndColorSelect id='7' selectedId={selectedId} data={backGroundUrlList.color3} />
                                    <BackgourndColorSelect id='8' selectedId={selectedId} data={backGroundUrlList.color4} />
                                    <BackgourndColorSelect id='9' selectedId={selectedId} data={backGroundUrlList.color5} />
                                    <BackgourndColorSelect id='10' selectedId={selectedId} data={backGroundUrlList.color6} />
                                </Box>
                            </Box>
                            <Box className="formSection" sx={{ pb: '4px' }}>
                                <Box sx={titleSx}>Board title <span style={{ color: 'red' }}>*</span></Box>
                                <FormControl>
                                    <TextField
                                        autoFocus
                                        placeholder=''
                                        size='small'
                                        {...register('title', { required: 'Field is required' })}
                                        error={!!errors.title}
                                    />
                                    <FormHelperText sx={{ fontSize: '14px' }}>👋 Board title is required</FormHelperText>
                                </FormControl>
                            </Box>
                            <Box className="formSection" sx={{ pb: '4px' }}>
                                <Box sx={titleSx}>Workspace</Box>
                                <Select
                                    placeholder="Choose workspace…"
                                    indicator={<KeyboardArrowDown />}
                                    sx={{
                                        [`& .${selectClasses.indicator}`]: {
                                            transition: '0.2s',
                                            [`&.${selectClasses.expanded}`]: {
                                                transform: 'rotate(-180deg)'
                                            }
                                        },
                                        zIndex: 9999, // Add this line
                                        maxWidth: '276px'
                                    }}
                                    defaultValue={workspaceId} // Add this line
                                    {...register('workspaceId', { required: 'Field is required' })}
                                >
                                    {workspaces.map((item: WorkSpace) => (
                                        <Option value={item.id} key={item.id}>
                                            <SingleLineTextBoxToolTip
                                                id={`create-board-workspace-select-${item.id}`}
                                                text={item.title}
                                                sx={{
                                                    maxWidth: '250px'
                                                }}
                                            />
                                            {/* {item.title} */}
                                        </Option>
                                    ))}
                                </Select>
                            </Box>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ height: '32px', m: '16px 0 8px 0' }}
                                disabled={!formState.isValid}>Create</Button>
                            <Box sx={{ maxWidth: '276px', fontSize: '12px', mt: '8px' }}>
                                You can update board data later on the board settings in board detail menu.
                            </Box>
                        </form>
                    </Box>
                </Box>
            </>
        </Popover >
    )
}

export default CreateBoardPopover