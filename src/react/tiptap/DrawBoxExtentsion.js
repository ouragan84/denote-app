import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'
import React, {useState} from 'react'
import ReactDOM from "react-dom";
import Sketch from 'react-p5';



export const DrawBox = props => {

  const updateData = (data) => {
    props.updateAttributes({
      data: data,
    })
  }

  const onInputFieldUpdate = (event) => {
    updateData(event.target.value);
  }
  
  let x = 250;
  let y = 250;

  const setup = (p5, canvasParentRef) => {
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    
    p5.createCanvas(500, 500).parent(canvasParentRef);
  };

  const draw = (p5) => {
    p5.background(240);
    p5.ellipse(x, y, 70, 70);
    // NOTE: Do not use setState in the draw function or in functions that are executed
    // in the draw function...
    // please use normal variables or class properties for these purposes
  };

  return (
    <NodeViewWrapper className="draw-box">
      <Sketch setup={setup} draw={draw}/>
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