import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'
import React, {useState} from 'react'


export const MyImageComponent = props => {

    // const updateSize = (newSize) => {
    //     props.updateAttributes({
    //         width: newSize.width,
    //         height: newSize.height,
    //     })
    // }

    const maxWidth = props.node.attrs.maxWidth;

    console.log("MyImageComponent", maxWidth)

    return (
        <NodeViewWrapper className="my-image"
            style={{
            }}
        >
            <div style={{
                // textAlign: 'center',
                maxWidth:  `min(${maxWidth}, 100%)`,
                // backgroundColor: 'red',
            }}>
                <img
                    src={props.node.attrs.base64}

                />
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