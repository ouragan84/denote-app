import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'
import React, {useRef, useState, useLayoutEffect} from 'react'
import { ResizableBox } from 'react-resizable'
import 'react-resizable/css/styles.css';

export const MyImageComponent = props => {
    const img_b64 = props.node.attrs.base64
    const [dim, setDim] = useState({width:0, height:0})

    var i = new Image();

    i.onload = function(){
      setDim({width: i.width, height: i.height})
    };

    i.src = img_b64;

    const r = dim.width/dim.height

    const divWidth = 800

    return (
        <NodeViewWrapper className="my-image"
        >
          
              <ResizableBox style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                boxSizing: 'border-box',
                marginBottom: '10px',
                overflow: 'hidden',
                position: 'relative',
                margin: '20px',
              }} width={Math.min(divWidth, dim.width)} height={(Math.min(divWidth, dim.width))/r} lockAspectRatio={true} minConstraints={[100, 100/r]} maxConstraints={[divWidth, divWidth/r]} >
                <img
                  src={img_b64}  
                  style={{objectFit:'contain', width:'100%'}}
                />
              </ResizableBox>
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