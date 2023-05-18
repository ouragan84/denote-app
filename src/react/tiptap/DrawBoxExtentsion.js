import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'
import React, {useState} from 'react'
import ReactDOM from "react-dom";
import CanvasDraw from "react-canvas-draw";



export const DrawBox = props => {

  const updateData = (data) => {
    props.updateAttributes({
      data: data,
    })
  }

  const onInputFieldUpdate = (event) => {
    updateData(event.target.value);
  }
  

  return (
    <NodeViewWrapper className="draw-box">
    <div style={{
      textAlign: 'center',
    
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <CanvasDraw
        style={{

        }}
      />
    </div>
    </NodeViewWrapper>
  )

}

const DrawBoxNode = Node.create({
  name: 'draw-box',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      data: {
        default: "default data",
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'draw-box',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['draw-box', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(DrawBox)
  },

  addCommands() {
    return {
      insertDrawBox : attributes => ({ commands, editor }) => {
        const parameters = ""
        if(attributes && attributes.data)
          parameters = `data = "${attributes.data}"`;
          
        return commands.insertContent(`<draw-box ${parameters} ></draw-box>`)
      }
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-d': () => this.editor.commands.insertDrawBox({}),
    }
  }
})

export default DrawBoxNode;