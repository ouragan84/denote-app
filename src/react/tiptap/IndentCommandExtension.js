import { Fragment } from 'prosemirror-model'
import { Slice } from 'prosemirror-model'
import { Plugin } from 'prosemirror-state'


const IndentCommand = () => {
  return ({tr, state, dispatch}) => {
    // add two spaces at the start of the current line
    const indentation = '<p>Poop</p>'

  }
}

export default IndentCommand