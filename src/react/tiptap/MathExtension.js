import React, {useState} from 'react'
import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { EditableMathField, StaticMathField, addStyles } from 'react-mathquill'

addStyles()

export const MyMathBox = props => {

    return (
        // <NodeViewWrapper className="inline-math-field">
        //     <EditableMathField
        //         latex={props.node.attrs.latex}
        //         onChange={(mathField) => {
        //             props.updateAttributes({
        //                 latex: mathField.latex(),
        //             })
        //         }}
        //     />
        // </NodeViewWrapper>

        <NodeViewWrapper className="inline-math-field" contentEditable={false}>
            <span
                // style={{
                //     height: '0px',
                //     width: '0px',
                //     margin: '0px',
                //     padding: '0px',
                // }}
                contentEditable={true}
                onFocus={(e) => {
                    console.log('onFocus');
                    e.target.blur();
                }}
            >
                Poop
            </span>
            <EditableMathField
                contentEditable={false}
                latex={props.node.attrs.latex}
                onChange={(mathField) => {
                    props.updateAttributes({
                        latex: mathField.latex(),
                    });
                }}
            />
                
        </NodeViewWrapper>
    )
}


const MyMathBoxNode = Node.create({
    name: 'myMathBox',
    group: 'inline',
    inline: true,
    // atom: true,
    content: 'text*', 

    addAttributes() {
        return {
            latex: {
                default: "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}",
            },
            atom: true,
            inline: true,

        }
    },

    parseHTML() {
        return [
            {
                tag: 'my-math-box',
                atom: true,
                inline: true,
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(HTMLAttributes), 0];
    },

    addNodeView() {
        return ReactNodeViewRenderer(MyMathBox)
    },

    addCommands() {
        return {
            insertLatexInline: attributes => ({ commands, editor }) => {
                const parameter = `${attributes?.latex ?? ""}}`;
                return commands.insertContent(`<my-math-box latex=${parameter}></my-math-box>`);
            },
        }
    },

    addKeyboardShortcuts() {
        return {
            'Mod-m': () => this.editor.commands.insertLatexInline(),
        }
    },

})

export default MyMathBoxNode;