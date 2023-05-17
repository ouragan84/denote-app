import './styles.scss'

import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorContent, useEditor } from '@tiptap/react'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import React, {useEffect, useState} from 'react'

import ComponentNode from './ExampleExtension'
import MyMathBoxNode from './InlineMathExtension'
import {SmilieReplacer} from './EmojiReplacerExtension'
import DrawBoxNode from './DrawBoxExtentsion'
import IndentCommand from './IndentCommandExtension'

const MenuBar = ({ editor }) => {
    if (!editor) {
      return null
    }
  
    return (
      <>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleStrike()
              .run()
          }
          className={editor.isActive('strike') ? 'is-active' : ''}
        >
          strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleCode()
              .run()
          }
          className={editor.isActive('code') ? 'is-active' : ''}
        >
          code
        </button>
        <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          clear marks
        </button>
        <button onClick={() => editor.chain().focus().clearNodes().run()}>
          clear nodes
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive('paragraph') ? 'is-active' : ''}
        >
          paragraph
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          h1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          h2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        >
          h3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
        >
          h4
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
        >
          h5
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
        >
          h6
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          ordered list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
        >
          code block
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
        >
          blockquote
        </button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          horizontal rule
        </button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()}>
          hard break
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .undo()
              .run()
          }
        >
          undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .redo()
              .run()
          }
        >
          redo
        </button>
        <button
          onClick={() => editor.chain().focus().setColor('#958DF1').run()}
          className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
        >
          purple
        </button>
        <button
            // Some Quirkiness here, probably a better way to do this, maybe with setNode() function instead of insertContent()
           onClick={() => editor.commands.setReactComponent()}
           className={editor.isActive('react-component') ? 'is-active' : ''}
        >
          react component
        </button>
        <button
            // Some Quirkiness here, probably a better way to do this, maybe with setNode() function instead of insertContent()
           onClick={() => editor.commands.insertInlineMathBox()}
           className={editor.isActive('inline-math-field') ? 'is-active' : ''}
        >
          math
        </button>
        <button
          onClick={() => editor.commands.insertDrawBox()}
          className={editor.isActive('draw-box') ? 'is-active' : ''}
        >
          Draw
        </button>
      </>
    )
}

export default ({content, updateContent, setEditorCallback}) => {
    const editor = useEditor({
        extensions: [
            ComponentNode,
            MyMathBoxNode,
            SmilieReplacer,
            DrawBoxNode,
            IndentCommand,
            Color.configure({ types: [TextStyle.name, ListItem.name] }),
            TextStyle.configure({ types: [ListItem.name] }),
            // add placeholder
            Placeholder.configure({
                placeholder: 'Your journey starts here...',
                showOnlyCurrent: true,
            }),
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
                }
            }),

        ],
        onUpdate({ editor }) {
            updateContent(editor.getHTML());
        },
        content: content,
    })

    useEffect(() => {
      setEditorCallback(editor);
    }, [editor])

    const handleKeyDown = (event) => {
      if (event.key === 'Tab') {
        console.log("TAB");
        event.preventDefault() // Prevent focus from shifting to other UI elements
  
        // Indent the selected text
        
        editor.chain().focus().command(IndentCommand()).run();

      }
    }


    return (
        <>
            <MenuBar editor={editor} 
              style={{
                height: '10%',
              }}
            />
            <EditorContent 
              editor={editor} 
              onKeyDown={handleKeyDown}
              style={{
                border: 'black 2px solid',
                borderRadius: '5px',
                fontFamily: 'sans-serif',
                height: '90%',
                overflowY: 'auto',
              }}
            />
        </>
    )
}