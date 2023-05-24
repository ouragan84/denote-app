import { mergeAttributes, nodeInputRule } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import Image from "@tiptap/extension-image"

import React from 'react'
import { NodeViewWrapper } from '@tiptap/react'

export const ImageResizeComponent = props => {
  const handler = mouseDownEvent => {
    const parent = mouseDownEvent.target.closest(".image-resizer")
    const image = parent?.querySelector("img.postimage") ?? null
    if (image === null) return
    const startSize = { x: image.clientWidth, y: image.clientHeight }
    const startPosition = { x: mouseDownEvent.pageX, y: mouseDownEvent.pageY }

    function onMouseMove(mouseMoveEvent) {
      props.updateAttributes({
        width: startSize.x - startPosition.x + mouseMoveEvent.pageX,
        height: startSize.y - startPosition.y + mouseMoveEvent.pageY
      })
    }
    function onMouseUp() {
      document.body.removeEventListener("mousemove", onMouseMove)
    }

    document.body.addEventListener("mousemove", onMouseMove)
    document.body.addEventListener("mouseup", onMouseUp, { once: true })
  }
  return (
    <NodeViewWrapper className="image-resizer">
      {props.extension.options.useFigure ? (
        <figure>
          <img {...props.node.attrs} className="postimage" />
        </figure>
      ) : (
        <img {...props.node.attrs} className="postimage" />
      )}
      <div className="resize-trigger" onMouseDown={handler}>
        {props.extension.options.resizeIcon}
      </div>
    </NodeViewWrapper>
  )
}


export const inputRegex = /(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/

export const ImageResize = Image.extend({
  name: "imageResize",
  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
      resizeIcon: <>⊙</>,
      useFigure: false
    }
  },
  addAttributes() {
    return {
      width: {
        default: "100%",
        renderHTML: attributes => {
          return {
            width: attributes.width
          }
        }
      },
      height: {
        default: "auto",
        renderHTML: attributes => {
          return {
            height: attributes.height
          }
        }
      },
      isDraggable: {
        default: true,
        renderHTML: attributes => {
          return {}
        }
      }
    }
  },
  parseHTML() {
    return [
      {
        tag: "image-resizer"
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "image-resizer",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageResizeComponent)
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: match => {
          const [, , alt, src, title, height, width, isDraggable] = match
          return { src, alt, title, height, width, isDraggable }
        }
      })
    ]
  }
})

export default ImageResize