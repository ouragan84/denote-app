import React from 'react'
import { createReactEditorJS } from 'react-editor-js'
import { EDITOR_JS_TOOLS } from './tools'

const ReactEditorJS = createReactEditorJS()

const Editor = ({content, setContent}) => {
    return (
        <ReactEditorJS tools={EDITOR_JS_TOOLS} onChange={setContent}/>
    )
}

export default Editor;