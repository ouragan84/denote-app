import './styles.scss'

import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, {useState} from 'react'

import ComponentNode from './ExampleExtension'
import MyMathBoxNode from './InlineMathExtension'
import {SmilieReplacer} from './EmojiReplacerExtension'
import DrawBoxNode from './DrawBoxExtentsion'

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

export default () => {
    const editor = useEditor({
        extensions: [
            ComponentNode,
            MyMathBoxNode,
            SmilieReplacer,
            DrawBoxNode,
            Color.configure({ types: [TextStyle.name, ListItem.name] }),
            TextStyle.configure({ types: [ListItem.name] }),
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
                },
            }),
        ],
        content: `
            <h2>
                Welcome to the example editor!
            </h2>
            <p>
                This is still the text editor you’re used to, but enriched with node views.
            </p>
            <react-component count="0"></react-component>
            <p>
                Did you see that? That’s a React component. We are really living in the future.
            </p>
            <h2>
                Here is the quadratic formula: <span data-type="inline-math-box" latex="x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}"></span> 
                isn't it beautiful?
            </h2>
            <p>
                You can edit the formula above by clicking on it.
            </p>
            <draw-box data="This text is set in HTML"></draw-box>
            <p>
                Poop 💩
            </p>
        `,
    })

    return (
        <>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} 
              style={{
                border: '1px solid black',
                margin: '1rem',
                border: 'black 2px solid',
                borderRadius: '5px',
                minHeight: '10rem',
                fontFamily: 'sans-serif',
              }}  
            />
            <button onClick={() => {
                console.log("JSON", editor.getJSON());
                console.log("HTML", editor.getHTML());
                console.log("TEXT", editor.getText());
            }}>
                Print Content
            </button>
        </>
    )
}