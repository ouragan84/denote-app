import React, {useState} from 'react'
import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { EditableMathField, StaticMathField, addStyles } from 'react-mathquill'
import katex from 'katex'

addStyles()

export const InlineMathBox = props => {

    return (
        <NodeViewWrapper className="inline-math-box" contentEditable={false}>
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

    // const latex = props.node.attrs.latex;
    // const handleChange = (e) => {
    //     props.updateAttributes({
    //     latex: e.target.value
    //     });
    // };
    // const options = {
    //     throwOnError: false,
    //     strict: false,
    //     displayMode: true
    // };
    // const preview = katex.renderToString(latex, options);

    // return (
    //     <NodeViewWrapper className="inline-math-box">
    //       <textarea value={latex} onChange={handleChange} />
    //       <div dangerouslySetInnerHTML={{ __html: preview }} />
    //       {/* <EditableMathField
    //         latex={content}
    //         onChange={(mathField) => {
    //           props.updateAttributes({
    //             content: mathField.latex()
    //           });
    //         }}
    //       /> */}
    //     </NodeViewWrapper>
    // );
}


const InlineMathBoxNode = Node.create({
    name: "inline-math-box",
    group: "inline",
    inline: true,
    selectable: false,
    atom: true,

    // addAttributes() {
    //     return {
    //         latex: {
    //             default: "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}",
    //         },
    //     }
    // },

    // parseHTML() {
    //     return [
    //         {
    //             tag: 'inline-math-box',
    //             atom: true,
    //             inline: true,
    //         },
    //     ]
    // },

    addAttributes() {
        return {
          latex: {
            default: "",
            renderHTML: (attributes) => {
              return {
                latex: attributes.latex
              };
            }
          }
        };
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(HTMLAttributes), 0];
    },

    parseHTML() {
        return [
          {
            tag: `span[data-type="${this.name}"]`
          }
        ];
      },
    
      renderHTML({ node, HTMLAttributes }) {
        return [
          "span",
          mergeAttributes(
            { "data-type": this.name },
            this.options.HTMLAttributes,
            HTMLAttributes
          )
        ];
      },

    addNodeView() {
        return ReactNodeViewRenderer(InlineMathBox)
    },

    addCommands() {
        return {
            // insertInlineMathBox: attributes => ({ commands, editor }) => {
            //     const parameter = `${attributes?.latex ?? ""}}`;
            //     // return commands.insertContent(`<my-math-box latex=${parameter}></my-math-box>`);
            // },
            insertInlineMathBox: (attrs) => ({ tr, commands }) => {
                return commands.insertContent({
                    type: this.name,
                    attrs
                });
            }
        }
    },

    addKeyboardShortcuts() {
        return {
            // cmd + m on mac and ctrl + m on windows
            "Mod-m": () => this.editor.commands.insertInlineMathBox(),
        }
    },

})

export default InlineMathBoxNode;
