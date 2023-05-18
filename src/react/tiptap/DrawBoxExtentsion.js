import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'
import React, {useState} from 'react'
import { Excalidraw } from "@excalidraw/excalidraw";
import DrawBoxCustomComp from './DrawBoxCustomComp';

export const DrawBox = props => {

  React.useEffect(()=>{
    console.log('effect before: ', props.node.attrs)
  }, [])

  const updateElements = (newElements) => {
    props.updateAttributes({
      elements: JSON.stringify(newElements),
    })
  }

  const updateState = (newState) => {
    props.updateAttributes({
      state: JSON.stringify(newState),
    })
  }

  const onDrawBoxChange = (elements, state) => {
    updateElements(elements);
    updateState(state);

    //console.log('state: ', state, ' elements: ', elements, 'string elements: ', JSON.stringify(elements))
  }

  //console.log(JSON.parse(props.node.attrs.state)) // , 'parse: ', JSON.parse(props.node.attrs.elements)s
  //console.log('raw: ', props.node.attrs)


  React.useEffect(()=>{
    console.log('effect after: ', props.node.attrs)
  }, [])

  return (
    <NodeViewWrapper className="draw-box">
      <span className="label">Draw Box</span>

      <div className="content">
        <div>
          <h1 style={{ textAlign: "center" }}>Excalidraw Example</h1>
          <div style={{ width: '1000px' }}>
            <DrawBoxCustomComp
              attr={props.node.attrs}
              state={JSON.parse(props.node.attrs.state)}
              elements={JSON.parse(props.node.attrs.elements)}
              onDrawBoxChange={onDrawBoxChange}
            />
          </div>

        </div>
      </div>
    </NodeViewWrapper>
  )

}

const DrawBoxNode = Node.create({
  name: 'draw-box',
  group: 'block',
  atom: true,

  addAttributes() {
    // return {
    //   elements: {
    //     default: "{}",
    //   },
    //   state: {
    //     default: "{}",
    //   }

    // }
    return {
      elements: {
        default: "{}",
        renderHTML: (attributes) => {
          //console.log('poop ', attributes.elements)
          return {           
            elements: attributes.elements
          };
        }
      },
      state: {
        default: "{}",
        renderHTML: (attributes) => {
          return {
            state: attributes.state
          };
        }
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: 'draw-box',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    //console.log('hello: ', HTMLAttributes)
    return ['draw-box', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(DrawBox)
  },

  // renderHTML({ node, HTMLAttributes }) {
  //   return [
  //     "draw-box",
  //     mergeAttributes(
  //       this.options.HTMLAttributes,
  //       HTMLAttributes
  //     )
  //   ];
  // },

  addCommands() {
    return {
      insertDrawBox : attributes => ({ commands, editor }) => {
        const parameters = ""
        if(attributes)
          if(attributes.elements)
            parameters += ` elements = "${attributes.elements}"`;
          if(attributes.state)
            parameters += ` state = "${attributes.state}"`;
        
            
        return commands.insertContent(`<draw-box${parameters} ></draw-box>`)
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