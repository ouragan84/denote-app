import React, {useState, useRef, useEffect} from 'react'
import { mergeAttributes, Node, nodeInputRule } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { EditableMathField, addStyles } from 'react-mathquill'

addStyles()

export const InlineMathBox = props => {

    const [currentMathField, setCurrentMathField] = useState(null);

    const handleChange = (mathField) => {
      setCurrentMathField(mathField);
      props.updateAttributes({
        latex: mathField.latex(),
      })
    }

    const handleKeyDown = (e) => {
        const { key } = e;
        const pos = props.getPos();

        if (key === 'Tab' || key === 'Enter'){
          e.preventDefault();
          e.stopPropagation();
          props.editor.chain().focus(pos+1).run();
        }

        if (key === 'ArrowLeft'){
          e.preventDefault();
          e.stopPropagation();
          
        }
        
        if (key === 'ArrowRight'){
          e.preventDefault();
          e.stopPropagation();
        }
    }

    return (
        <NodeViewWrapper
            className="inline-math-box"
            contentEditable={false}
        >
            <EditableMathField
                contentEditable={false}
                latex={props.node.attrs.latex}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                style={{
                  border: 'none',
                }}  
            >
            </EditableMathField>
        </NodeViewWrapper>
    )
}




const InlineMathBoxNode = Node.create({
    name: "inline-math-box",
    group: "inline",
    inline: true,
    selectable: true,
    atom: false,

    addAttributes() {
        return {
          latex: {
            default: "x^2+y^2",
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
        return ReactNodeViewRenderer(InlineMathBox, {});
    },

    addCommands() {
        return {
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
            "Mod-m": () => this.editor.commands.insertInlineMathBox(),
        }
    },
})

export default InlineMathBoxNode;
