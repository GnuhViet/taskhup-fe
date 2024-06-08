import React from 'react'
import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useSelector } from 'react-redux'
import FormHelperText from '@mui/material/FormHelperText'
import TextBoxToolTip from '~/components/Common/TextBoxToolTip'
import FormControl from '@mui/material/FormControl'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import { useSelectTemplateMutation } from '~/core/redux/api/board-card.api'
import { toast } from 'react-toastify'


export interface TemplateDialogProps {
    id: string
    open: boolean
    anchorEl: HTMLElement | null
    onClose: () => void
    cardId: string
    defaultTemplateId: string
    reFetch: () => void
}

const borderBottom = {
    borderBottom: '1px solid #DCDFE4'
}

const titleSx = {
    frontSize: '20px',
    fontWeight: '500',
    maxWidth: '150px'
}

export interface MemberItemmProps {
    item: any
}

const TemplateDialog: React.FC<TemplateDialogProps> = ({ id, open, anchorEl, onClose, cardId, defaultTemplateId, reFetch }) => {
    const templateList = useSelector((state: any) => state.boardReducer.boardTemplate)
    const [fillterName, setFillterName] = React.useState('')

    const LabelItem: React.FC<MemberItemmProps> = ({ item }) => {
        return (
            <Box sx={{ p: '2px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 'auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <FormControlLabel
                        sx={{ width: '40px' }}
                        value={item.id}
                        control={<Radio sx={{ ml: '12px' }} />}
                        label={null}
                    />
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
                        <TextBoxToolTip
                            sx={{
                                ...titleSx
                            }}
                            id='1asd'
                            text={item.title}
                            breakOnLine={1}
                        />
                    </Box>
                </Box>
            </Box>
        )
    }

    const [selectedTemplate, setSelectedTemplate] = React.useState(defaultTemplateId)

    React.useEffect(() => {
        setSelectedTemplate(defaultTemplateId)
    }, [defaultTemplateId])

    const [selectTemplate, { isLoading }] = useSelectTemplateMutation()

    const handleClose = async () => {
        if (selectedTemplate && selectedTemplate !== defaultTemplateId) {
            try {
                await selectTemplate({
                    templateId: selectedTemplate,
                    boardCardId: cardId
                })
                await reFetch()
            } catch (error) {
                console.log(error)
            }
        }
        onClose()
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
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
                <Box sx={{ justifyContent: 'center', width: '100%', display: 'flex', fontWeight: '500', color: '#44546f' }}>Template Select</Box>
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
                    <Box sx={{ fontSize: '12px', fontWeight: '500', color: '#44546f' }}>Templates</Box>
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
                    <FormControl>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={selectedTemplate}
                            onChange={(e) => {
                                setSelectedTemplate(e.target.value)
                            }}
                        >
                            {templateList.map((item: any) => {
                                return (
                                    <Box
                                        key={item.id}
                                        sx={{
                                            display: item.title.toLowerCase().includes(fillterName.toLowerCase()) ? 'block' : 'none'
                                        }}
                                    >
                                        <LabelItem item={item} />
                                    </Box>
                                )
                            })}
                        </RadioGroup>
                    </FormControl>
                </Box>
            </Box>
        </Popover >
    )
}

export default TemplateDialog