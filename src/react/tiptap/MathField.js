import { EditableMathField, StaticMathField, addStyles } from 'react-mathquill'
import { NodeViewWrapper } from '@tiptap/react'
import React, {useState} from 'react'

addStyles()

export default props => {
//   const increase = () => {
//     props.updateAttributes({
//       count: props.node.attrs.count + 1,
//     })
//   }
    // const [latex, setLatex] = useState('\\frac{1}{\\sqrt{2}}\\cdot 2')
    
    return (

        <NodeViewWrapper className="inline-math-field">
            <div>
                <EditableMathField
                    latex={props.node.attrs.latex}
                    onChange={(mathField) => {
                        // setLatex(mathField.latex());
                        props.updateAttributes({
                            latex: mathField.latex(),
                        })
                    }}
                />
            </div>
        </NodeViewWrapper>
    )
}