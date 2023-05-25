import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'
import React, {useState, useRef} from 'react'
import {RxSize} from 'react-icons/rx'



export const MyImageComponent = props => {

  const divRef = useRef(null);
  const [divRight, setDivWidth] = useState(100)
  const [clientX, setclientX] = useState(0)
  const [showResizeIcon, setShowResizeIcon] = useState(false)
  const [isResizing, setIsResizing] = useState(false);

  const [finalWidth, setFinalWidth] = useState(400)

  const handleMouseMove = (event) => {
    const div = divRef.current;
    if (div) {

      const rect = div.getBoundingClientRect();
      const x = event.clientX - rect.left;
      setclientX(event.clientX)
      const y = event.clientY - rect.top;
      const divWidth = rect.width;
      setDivRight(rect.right)
      const divHeight = rect.height;

      console.log(`Mouse position: (${x},${y})`);
    }
  };


  const handleMouseDown = () => {
    console.log('mouse down')
    setIsResizing(true);
  };

  const handleMouseUp = () => {
    console.log('mouse up')

    if (isResizing){
      
      const delta = clientX - divRight
      setFinalWidth(finalWidth + delta)
      setIsResizing(false);
    }
  };

    const calculatedWidth = `min(100%, auto)`

    return (
        <NodeViewWrapper className="my-image"
            style={{
            }}
        >
            <div style={{ position: 'relative' , backgroundColor:'red', display: 'inline-flex' }}
            onMouseMove={(e) => setShowResizeIcon(true)} 
            onMouseLeave={()=>setShowResizeIcon(false)}
            >
            <img
              ref={divRef}
              style={{display: 'block'}}
              
              src={props.node.attrs.base64}
              width={finalWidth}
            />
            {
              showResizeIcon &&
              <RxSize style={{position: 'absolute', top:0, right:0, fontSize:20}}
              onMouseDown={handleMouseDown}
              onDrag={handleMouseUp}
              />
            }
            </div>
        </NodeViewWrapper>
    )

}

const MyImageNode = Node.create({
  name: 'my-image',
  group: 'block',
  atom: true,

    addAttributes() {
        return {
            base64: {
                default: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjmLTnxX8AB1ADNhJq0mgAAAAASUVORK5CYII=",
            },
            maxWidth: {
                default: 100,
            },
            // height: {
            //     default: 100,
            // }
        }
    },

  parseHTML() {
    return [
      {
        tag: 'my-image',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['my-image', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(MyImageComponent)
  },

  addCommands() {
    return {
        insertMyImage : attributes => ({ commands, editor }) => {
        let parameters = ""
        if(attributes && attributes.base64)
          parameters += ` base64 = "${attributes.base64}"`;
        if(attributes && attributes.maxWidth)
          parameters += ` maxWidth = "${attributes.maxWidth}"`;
        // if(attributes && attributes.height)
        //   parameters += ` height = "${attributes.height}"`;
          
        return commands.insertContent(`<my-image${parameters} ></my-image> `)
      }
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-i': () => this.editor.commands.insertMyImage({}),
    }
  }
})

export default MyImageNode;