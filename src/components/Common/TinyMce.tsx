import React from 'react'
import { Editor } from '@tinymce/tinymce-react'

export interface TinyMceProps {
    value: string
    setValue: (value: string) => void
}

const TinyMce: React.FC<TinyMceProps> = ({ value, setValue }) => {

    return (
        <Editor
            apiKey='dbg7svsu8ovrt7sgcc1su1vw1rdya8ygm0ll3im2av4185gi'
            init={{
                auto_focus: true,
                height: '260px',
                menubar: false,
                plugins: 'lists advlist table link',
                paste_data_images: false,
                toolbar: [
                    // { name: 'history', items: ['undo', 'redo'] },
                    { name: 'styles', items: ['styles'] },
                    { name: 'formatting', items: ['fontsizeinput', 'bold', 'underline', 'italic'] },
                    { name: 'alignment and list', items: ['align', 'bullist', 'table', 'link'] }
                ],
                setup: function (editor) {
                    editor.on('keydown', function (e) {
                        if (e.keyCode === 9) {
                            e.preventDefault()
                            editor.execCommand('mceInsertContent', false, '&emsp;')
                        }
                    })
                }
            }}
            value={value}
            onEditorChange={(content) => setValue(content)}
        />
    )
}

export default TinyMce