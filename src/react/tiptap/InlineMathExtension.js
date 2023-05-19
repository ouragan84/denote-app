import React, {useState, useRef, useEffect} from 'react'
import { mergeAttributes, Node, nodeInputRule } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { EditableMathField, addStyles } from 'react-mathquill'

addStyles()

export const InlineMathBox = props => {

  const [field, setField] = useState(null);
  const currentField = useRef(field);

  useEffect(() => {
    const prevMathField = currentField.current;
    currentField.current = field;

    if (!prevMathField && field && props.node.attrs.isNew) {
      props.updateAttributes({
        isNew: false,
      })
      field.focus();
    }
  }, [field]);

  const handleChange = (mathField) => {
    setField(mathField);
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

      // if (key === 'ArrowLeft'){
      //   e.preventDefault();
      //   e.stopPropagation();

      //   // get position of cursor in mathfield
      //   // const cursorPos = currentField.current.__controller.cursor.position();
      //   // console.log(currentField.current);
      //   // console.log(currentField.current.__controller);
      //   // console.log(currentField.current.__controller.cursor);

      //   // console.log(currentField.current.__controller.cursor.offset());
      //   // console.log(currentField.current);
      //   // console.log(currentField.current.__controller.cursor.position());


      //   // if cursor is at the beginning of the mathfield
      //   // if (cursorPos === 0){
      //   //   // move cursor to end of mathfield
      //   //   // currentField.current.__controller.cursor.moveToRightEnd();
      //   //   // move cursor to end of mathfield
      //   //   props.editor.chain().focus(pos-1).run();
      //   // }
        
      // }
      
      // if (key === 'ArrowRight'){
      //   e.preventDefault();
      //   e.stopPropagation();
      // }
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
              mathquillDidMount={mathField => {
                setField(mathField);
              }}
              // https://docs.mathquill.com/en/latest/Config/
              config={{
                autoCommands: 'pi theta sqrt sum',
                autoOperatorNames: 'sin cos',
                handlers: {
                  edit: (mathField) => { props.editor.commands.save() },
                  upOutOf: (mathField) => { props.editor.chain().focus(props.getPos()-1).run(); },
                  downOutOf: (mathField) => { props.editor.chain().focus(props.getPos()+1).run(); },
                  moveOutOf: (dir, mathField) => { props.editor.chain().focus(props.getPos()+dir).run();},
                  // this one sometimes gives an error but it works, so.... ig it's fine
                  deleteOutOf: (dir, mathField) => { props.editor.chain().focus(props.getPos() + 1).deleteRange({from: props.getPos(), to: props.getPos() + 1}).run(); },
                }
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
            default: "x",
            renderHTML: (attributes) => {
              return {
                latex: attributes.latex
              };
            }
          },
          isNew: {
            default: true,
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
        // return ReactNodeViewRenderer(InlineMathBox, { isNew: true });
        return ReactNodeViewRenderer((props) => {
          return <InlineMathBox {...props}/>;
        }, {});
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
