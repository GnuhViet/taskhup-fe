import React, { useEffect } from 'react'

import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import Checkbox from '@mui/material/Checkbox'
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined'
import TextBoxToolTip from '~/components/Common/TextBoxToolTip'
import { getContrastTextColor } from '~/core/utils/common-used'
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import { SubmitHandler, useForm } from 'react-hook-form'
import { CardTemplateCreateLabelReq } from '~/core/services/board-services.model'
import Typography from '@mui/material/Typography'
import EditOffOutlinedIcon from '@mui/icons-material/EditOffOutlined'
import DeleteIcon from '@mui/icons-material/Delete'
import { useCreateLabelMutation, useDeleteLabelMutation, useGetLabelsQuery, useUpdateLabelMutation } from '~/core/redux/api/board-template.api'
import { ApiResponse } from '~/core/services/api.model'
import { set } from 'lodash'
import { toast } from 'react-toastify'
import ApiLoadingOverlay from '~/components/Common/ApiLoadingOverlay'

export interface MemberPopoverProps {
    id: string
    templateItem: any
    open: boolean
    anchorEl: HTMLElement
    onClose?: () => void
}

export interface MemberItemmProps {
    item: any
}

export interface ColorSelectOptionProps {
    id: number
    data: string
    selectedId: number
}

export interface ColorOptionsListType {
    [key: number]: { color: string };
}

const titleSx = {
    frontSize: '20px',
    fontWeight: '500',
    maxWidth: '150px'
}

const borderBottom = {
    borderBottom: '1px solid #DCDFE4'
}

const checkBoxSx = {
    p: '6px 4px',
    m: '0 2px'
}

const LabelPopoverFC: React.FC<MemberPopoverProps> = ({ id, templateItem, open, anchorEl, onClose }) => {
    const { data: apiResponse, isLoading, refetch } = useGetLabelsQuery(templateItem?.id)
    const [create, { isLoading: createLoading }] = useCreateLabelMutation()
    const [updateLabel, { isLoading: updateLoading }] = useUpdateLabelMutation()
    const [deleteLabel, { isLoading: deleteLoading }] = useDeleteLabelMutation()

    const response = apiResponse as ApiResponse<any>
    const data = response?.data

    // const data = [
    //     { id: 1, title: 'test 1 abc', color: '#FF5733' },
    //     { id: 2, title: 'test 2 abc', color: '#33FF57' },
    //     { id: 3, title: 'test 3 abc', color: '#3357FF' },
    //     { id: 4, title: 'test 4 abc', color: '#8D33FF' },
    //     { id: 5, title: 'test 5 abc', color: '#808080' },
    //     { id: 6, title: 'test 6 abc', color: '#FF0000' },
    //     { id: 7, title: 'test 7 abc', color: '#00FF00' },
    //     { id: 8, title: 'test 8 abc', color: '#0000FF' },
    //     { id: 9, title: 'test 9 abc', color: '#FFFF00' },
    //     { id: 10, title: 'test 10 abc', color: '#00FFFF' },
    //     { id: 11, title: 'test 11 abc', color: '#FF00FF' },
    //     { id: 12, title: 'test 12 abc', color: '#C0C0C0' },
    //     { id: 13, title: 'test 13 abc', color: '#800000' },
    //     { id: 14, title: 'test 14 abc', color: '#008000' },
    //     { id: 15, title: 'test 15 abc', color: '#000080' }
    // ]

    const [selectedItem, setSelectedItem] = React.useState(null)
    const [currentMenu, setCurrentMenu] = React.useState('setting') // setting, create-new, edit
    const [actionsShow, setActionsShow] = React.useState('edit')

    const MainContent: React.FC = () => {
        const [fillterName, setFillterName] = React.useState(null)

        const LabelItem: React.FC<MemberItemmProps> = ({ item }) => {
            return (
                <Box sx={{ p: '2px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        {/* <Checkbox
                            sx={checkBoxSx}
                        /> */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: `${item.colorCode}`,
                            borderRadius: '2px',
                            height: '34px',
                            paddingLeft: '8px',
                            width: '100%',
                            justifyContent: 'center'
                        }}
                        >
                            <TextBoxToolTip sx={{
                                ...titleSx,
                                color: getContrastTextColor(item.colorCode)
                            }} id='1asd' text={item.title} breakOnLine={1} />
                        </Box>
                    </Box>
                    <Box>
                        <Checkbox
                            sx={{
                                ...checkBoxSx,
                                cursor: templateItem.usedIn === 0 ? 'pointer' : 'unset'
                            }}
                            icon={
                                templateItem.usedIn === 0
                                    ?
                                    actionsShow === 'edit'
                                        ? <ModeEditOutlinedIcon />
                                        : <DeleteIcon />
                                    : <EditOffOutlinedIcon />
                            }
                            checkedIcon={
                                templateItem.usedIn === 0
                                    ?
                                    actionsShow === 'edit'
                                        ? <ModeEditOutlinedIcon />
                                        : <DeleteIcon />
                                    : <EditOffOutlinedIcon />
                            }
                            onClick={async () =>
                                templateItem.usedIn === 0
                                    ? (async () => {
                                        switch (actionsShow) {
                                            case 'edit':
                                                setCurrentMenu('edit')
                                                break
                                            case 'delete':
                                                try {
                                                    await deleteLabel(
                                                        { id: item.id, templateId: templateItem?.id }
                                                    ).unwrap()
                                                    await refetch()
                                                } catch (error) {
                                                    toast.error('Delete label failed', {
                                                        position: 'bottom-right'
                                                    })
                                                }
                                                break
                                            default:
                                                break
                                        }

                                        setSelectedItem(item)
                                    })()
                                    : null
                            }
                        />
                    </Box>
                </Box>
            )
        }

        return (
            <Box sx={{
                m: '12px 24px',
                display: currentMenu === 'setting' ? 'block' : 'none'
            }}>
                <Box sx={{ justifyContent: 'center', width: '100%', display: 'flex', fontWeight: '500', color: '#44546f' }}>Label Settings</Box>
                <Box sx={{ ...borderBottom, p: '8px 0 4px 0', mb: '6px' }}>
                    <TextField
                        placeholder='Label name'
                        size='small'
                        sx={{ width: '100%' }}
                        onChange={(e) => setFillterName(e.target.value)}
                    />
                    <FormHelperText>Type name to search</FormHelperText>
                </Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <Box sx={{ fontSize: '12px', fontWeight: '500', color: '#44546f' }}>Labels</Box>
                    {templateItem.usedIn === 0 && (
                        <Box sx={{ display: 'flex' }}>
                            <Box
                                sx={{
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    color: actionsShow === 'edit' ? '#0079BF' : '#44546f',
                                    textDecoration: actionsShow === 'edit' ? 'underline' : 'none'
                                }}
                                onClick={() => setActionsShow('edit')}
                            >Edit</Box>
                            <Box
                                sx={{
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    ml: '12px',
                                    color: actionsShow === 'delete' ? '#0079BF' : '#44546f',
                                    textDecoration: actionsShow === 'delete' ? 'underline' : 'none'
                                }}
                                onClick={() => setActionsShow('delete')}
                            >Delete</Box>
                        </Box>
                    )}
                </Box>
                <Box sx={{
                    ...borderBottom,
                    pb: '8px',
                    mb: '6px',
                    maxHeight: '300px',
                    overflowY: 'scroll',
                    '&::-webkit-scrollbar': {
                        width: '6px',
                        height: '6px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#dcdde1',
                        borderRadius: '8px'
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#A8A8A8'
                    }
                }}>
                    {(fillterName
                        ? data.filter((item: any) =>
                            item.title.toLowerCase().includes(fillterName.toLowerCase())
                        )
                        : data
                    )?.map((item: any) => {
                        return (
                            <Box key={item.id}>
                                <LabelItem item={item} />
                            </Box>
                        )
                    })}
                </Box>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    marginTop: '12px'
                }}>
                    {
                        templateItem?.usedIn === 0
                            ?
                            (
                                <Button
                                    id={`abc-${id}`}
                                    sx={{ width: '100%' }}
                                    className="button right-button"
                                    variant="contained"
                                    onClick={async () => {
                                        await setSelectedItem(null)
                                        setCurrentMenu('create-new')
                                    }}
                                >Create a new label</Button>
                            )
                            : null
                    }
                </Box>
            </Box>
        )
    }

    const CreateNewContent: React.FC = () => {

        const ColorOptionsList: ColorOptionsListType = {
            1: { color: '#BAF3DB' },
            2: { color: '#F8E6A0' },
            3: { color: '#FEDEC8' },
            4: { color: '#FFD5D2' },
            5: { color: '#DFD8FD' },
            6: { color: '#4BCE97' },
            7: { color: '#F5CD47' },
            8: { color: '#FEA362' },
            9: { color: '#F87168' },
            10: { color: '#9F8FEF' },

            11: { color: '#1F845A' },
            12: { color: '#946F00' },
            13: { color: '#C25100' },
            14: { color: '#C9372C' },
            15: { color: '#6E5DC6' },
            16: { color: '#CCE0FF' },
            17: { color: '#C6EDFB' },
            18: { color: '#D3F1A7' },
            19: { color: '#FDD0EC' },
            20: { color: '#DCDFE4' },

            21: { color: '#579DFF' },
            22: { color: '#6CC3E0' },
            23: { color: '#94C748' },
            24: { color: '#E774BB' },
            25: { color: '#8590A2' },
            26: { color: '#0C66E4' },
            27: { color: '#227D9B' },
            28: { color: '#5B7F24' },
            29: { color: '#AE4787' },
            30: { color: '#626F86' }
        }

        const [selectedId, setSelectedId] = React.useState(null)

        useEffect(() => {
            setSelectedId(selectedItem?.colorCode
                ?
                Number(Object.keys(ColorOptionsList).find(key => ColorOptionsList[key].color === selectedItem.colorCode))
                : null
            )
        }, [selectedItem])

        const ColorSelectOption: React.FC<ColorSelectOptionProps> = ({ id, data, selectedId }) => {
            return (
                <Box
                    sx={{
                        width: '48px',
                        height: '32px',
                        borderRadius: '3px',
                        backgroundColor: `${data}`,
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
                    onClick={() => handleSelectBackground(id)}
                >
                    {id === selectedId ? <CheckOutlinedIcon /> : null}
                </Box>
            )
        }

        const { register, handleSubmit, formState: { errors }, setValue, clearErrors } = useForm<CardTemplateCreateLabelReq>({
            defaultValues: {
                id: selectedItem?.id || null,
                title: selectedItem?.title || '',
                colorCode: selectedItem?.colorCode || null,
                templateId: templateItem?.id
            }
        })

        const onSubmit: SubmitHandler<CardTemplateCreateLabelReq> = async (data) => {

            try {
                if (!selectedItem) { // create
                    await create(data).unwrap()
                } else { // edit
                    await updateLabel(data).unwrap()
                }
                await refetch()
                setCurrentMenu('setting')
                if (!selectedItem) { // create
                    toast.success('Create label successfully', {
                        position: 'bottom-right'
                    })
                } else { // edit
                    toast.success('Update label successfully', {
                        position: 'bottom-right'
                    })
                }
            } catch (error) {
                // console.log(error)
            }
        }

        const handleSelectBackground = (id: number) => {
            if (selectedId === id) {
                setSelectedId(null)
                setValue('colorCode', null)
                return
            }

            setSelectedId(id)
            setValue('colorCode', ColorOptionsList[id]?.color)
            clearErrors('colorCode')
        }

        return (
            <Box sx={{
                m: '12px 24px',
                display: currentMenu === 'setting' ? 'none' : 'block'
            }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box>
                        <Checkbox
                            sx={{
                                ...checkBoxSx,
                                position: 'absolute',
                                top: '8px',
                                left: '16px'
                            }}
                            icon={<ArrowBackIosOutlinedIcon sx={{ fontSize: '16px' }} />}
                            checkedIcon={<ArrowBackIosOutlinedIcon sx={{ fontSize: '16px' }} />}
                            onClick={() => {
                                setCurrentMenu('setting')
                            }}
                        />
                        <Box sx={{ justifyContent: 'center', width: '100%', display: 'flex', fontWeight: '500', color: '#44546f' }}>
                            {
                                currentMenu === 'edit' ? 'Edit Label' : 'Create a new label'
                            }
                        </Box>
                    </Box>
                    <Box sx={{ p: '8px 0 4px 0', mb: '6px' }}>
                        <Box sx={{ fontSize: '12px', fontWeight: '500', color: '#44546f' }}>
                            Title
                            <Typography variant="caption" color="error">
                                &nbsp;&nbsp;&nbsp;{errors?.title?.message}
                            </Typography>
                        </Box>
                        <TextField
                            placeholder=''
                            size='small'
                            sx={{ width: '100%' }}
                            {...register('title', {
                                required: 'Field is required'
                            })}
                            error={!!errors.title}
                        />
                        <TextField
                            placeholder=''
                            size='small'
                            sx={{ width: '100%', display: 'none' }}
                            {...register('colorCode', {
                                required: 'Color is required'
                            })}
                            error={!!errors.title}
                        />
                    </Box>

                    <Box sx={{ p: '0 0 4px 0', mb: '6px' }}>
                        <Box sx={{ fontSize: '12px', fontWeight: '500', color: '#44546f' }}>
                            Color
                            <Typography variant="caption" color="error">
                                &nbsp;&nbsp;&nbsp;{errors?.colorCode?.message}
                            </Typography>
                        </Box>
                        {
                            Array.from({ length: 6 }, (_, i) => i * 5).map((num) => (
                                <Box key={`row-${num}`} sx={{ display: 'flex', justifyContent: 'space-between', mb: '6px' }}>
                                    {Array.from({ length: Math.min(5, 31 - num) }, (_, j) => num + j + 1).map((key) => (
                                        <div key={key}>
                                            <ColorSelectOption
                                                id={key}
                                                selectedId={selectedId}
                                                data={ColorOptionsList[key]?.color}
                                            />
                                        </div>
                                    ))}
                                </Box>
                            ))
                        }

                    </Box>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        marginTop: '12px'
                    }}>
                        <Button
                            type='submit'
                            id={`abc-${id}`}
                            sx={{
                                width: '100%',
                                backgroundColor: '#0079BF'
                            }}
                            variant="contained"
                        >
                            {
                                currentMenu === 'edit' ? 'Edit Label' : 'Create a new label'
                            }
                        </Button>
                    </Box>
                </form>
            </Box>
        )
    }

    return (
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left'
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
            }}
            slotProps={{
                paper: {
                    style: {
                        width: '320px',
                        borderRadius: '8px',
                        // border: '1px solid #B2B9C4',
                        boxShadow: '0',
                        marginTop: id === 'header-create-board-popover' ? '8px' : '0'
                    }
                }
            }}
            style={{ zIndex: 999 }}
        >
            {isLoading
                ? <ApiLoadingOverlay />
                : <>
                    <MainContent />
                    <CreateNewContent />
                </>
            }
        </Popover >
    )
}

export default LabelPopoverFC