import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'
import React, {useRef, useState, useLayoutEffect, useEffect} from 'react'
import { ResizableBox } from 'react-resizable'
import 'react-resizable/css/styles.css';

export const MyImageComponent = props => {
  const img_b64 = props.node.attrs.base64
  const [dim, setDim] = useState({width:0, height:0})

  // initialize dimensions to attribute width if not null negative
  var i = new Image();

  i.src = img_b64;

  const r = dim.width/dim.height

  i.onload = function(){
    if(dim.width == 0 && dim.height == 0)
      setDim({width: i.width, height: i.height})
  };

  const margin = 64;
  const divWidth = props.editor.view.dom.parentNode.clientWidth - margin * 2;

  return (
        <NodeViewWrapper className="my-image">
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
            }} width={ Math.min(divWidth, dim.width) } height={ Math.min(divWidth/r, dim.height) }
            lockAspectRatio={true} minConstraints={[100, 100/r]} maxConstraints={[divWidth, divWidth/r]} 
              onResizeStop={(e, data) => {
                // props.updateAttributes({
                //   width: data.size.width,
                // })

                // console.log(props.node.attrs.width)

                // setDim({width: data.size.width, height: data.size.width/r})
                
                // props.editor.commands.save();
              }}
             >
              <img
                src={img_b64}  
                style={{objectFit:'contain', width:'100%'}}
              />
              {/* {props.selected && <div style={{
                position: 'absolute',
                bottom: '0px',
                right: '0px',
                width: '10px',
                height: '10px',
                opacity: '1',
                borderRadius: '50%',
                backgroundColor: '#1de0e0',
              }}></div>} */}

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
            width: {
                default: null,
            },
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
        if(attributes && attributes.width)
          parameters += ` width = "${attributes.width}"`;
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