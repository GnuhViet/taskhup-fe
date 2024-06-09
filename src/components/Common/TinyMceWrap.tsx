import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TinyMce from '~/components/Common/TinyMce'
import { set } from 'lodash'
import { isBlank } from '~/core/utils/data-utils'

interface TinyMceProps {
    focus: boolean
    setIsFocus: (value: boolean) => void
    placeholder: string
    placeHolderSx?: any
    value: string
    handleSave: (value: string) => void
    preventClick?: boolean
}

const labelTextSx = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#44546f'
}

const TinyMceWrap: React.FC<TinyMceProps> = (
    { focus, setIsFocus, placeholder, placeHolderSx, value, handleSave, preventClick }
) => {

    const [editorValue, setEditorValue] = React.useState(value ? value : '')

    const onSave = () => {
        handleSave(editorValue)
        setIsFocus(false)
    }

    return (
        <>
            {focus ? (
                <Box sx={{ position: 'relative' }}>
                    <TinyMce
                        value={editorValue}
                        setValue={setEditorValue}
                    />
                    <Box sx={{ mt: '8px', ml: '2px' }}>
                        <Button
                            variant="contained"
                            sx={{
                                height: '32px',
                                width: '54px',
                                borderRadius: '3px',
                                mr: '6px'
                            }}
                            onClick={onSave}
                        >Save</Button>
                        <Button
                            variant="text"
                            onClick={() => setIsFocus(false)}
                        >Cancel</Button>
                    </Box>
                </Box>
            ) : (
                <Box
                    onClick={() => {
                        if (preventClick) return
                        setIsFocus(true)
                    }}
                    sx={{
                        ...placeHolderSx,
                        cursor: preventClick ? 'unset' : 'pointer',
                        backgroundColor: '#E2E4EA',
                        borderRadius: '3px',
                        // height: '90px',
                        border: '1px solid #dfe1e6',
                        '&:hover': {
                            backgroundColor: preventClick ? '#E2E4EA' :'#CFD3DB'
                        }
                    }}
                >
                    <Box sx={{
                        p: '8px 12px',
                        ...labelTextSx,
                        fontSize: '16px',
                        fontWeight: '400'
                    }}>
                        {isBlank(value)
                            ? placeholder
                            : <div dangerouslySetInnerHTML={{ __html: value }} />
                        }
                    </Box>
                </Box>
            )}
        </>
    )
}

export default TinyMceWrap