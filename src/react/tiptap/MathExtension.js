
import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import InlineMathField from './MathField'

// q: how do I make this node inline instead of block?
// a: add "inline: true" to the object returned by addAttributes()
// q: how do I make this node editable?
// a: add "atom: true" to the object returned by addAttributes()

export default Node.create({
  name: 'inlineMathField',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
    //   count: {
    //     default: 0,
    //   },
        latex: {
            default: "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}",
        },
        atom: true,
        inline: true,

    }
  },

  parseHTML() {
    return [
      {
        tag: 'inline-math-field',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['inline-math-field', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(InlineMathField)
  },
})