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


import { FaBold, FaItalic, FaStrikethrough, FaCode, FaRemoveFormat, FaHeading, FaList, FaListOl, FaLaptopCode, FaQuoteLeft, FaUnderline, FaUndo, FaRedo } from "react-icons/fa";
import { RiBarChartHorizontalLine } from 'react-icons/ri'
import { BiMath } from 'react-icons/bi'

const MenuBar = ({ editor }) => {
    if (!editor) {
      return null
    }

    let initCols = []
    for (let i = 0; i < 17; i++)
      initCols.push('black')
    const [cols, setCols] = useState(initCols)
  
    return (
      <div style={{display:'flex', justifyContent:'center'}}>
        <div style={{width:'70vw',display:'flex', flexDirection:'row', justifyContent:'space-between', paddingLeft:'1rem', borderRadius:18 , paddingRight:'1rem', paddingTop:'1rem', paddingBottom:'1rem', boxShadow: "0px 0px 7px #9E9E9E"}}>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', width:'28rem',}}>
        <FaBold
          onClick={() => {
            editor.chain().focus().toggleBold().run()
          }}
          onMouseDown={()=>cols[0] = 'gray'}
          onMouseUp={()=>cols[0] = 'black'}
          style={{color:cols[0]}}
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
        </FaBold>
        <FaItalic
          onMouseDown={()=>cols[1] = 'gray'}
          onMouseUp={()=>cols[1] = 'black'}
          style={{color:cols[1]}}
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
        </FaItalic>
        
        <FaUnderline
          onMouseDown={()=>cols[2] = 'gray'}
          onMouseUp={()=>cols[2] = 'black'}
          style={{color:cols[2]}}
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
          Underline
        </FaUnderline>
        <FaStrikethrough
          onMouseDown={()=>cols[3] = 'gray'}
          onMouseUp={()=>cols[3] = 'black'}
          style={{color:cols[3]}}
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
        </FaStrikethrough>
        <FaCode
          onMouseDown={()=>cols[4] = 'gray'}
          onMouseUp={()=>cols[4] = 'black'}
          style={{color:cols[4]}}
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
        </FaCode>
        {/* <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          clear marks
        </button> */}
        <FaRemoveFormat onClick={() => editor.chain().focus().clearNodes().run()} 
        onMouseDown={()=>cols[5] = 'gray'}
        onMouseUp={()=>cols[5] = 'black'}
        style={{color:cols[5]}}>
          clear nodes
        </FaRemoveFormat>
        {/* <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive('paragraph') ? 'is-active' : ''}
        >
          paragraph
        </button> */}
        <FaHeading
        onMouseDown={()=>cols[6] = 'gray'}
        onMouseUp={()=>cols[6] = 'black'}
        style={{color:cols[6]}}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          h1
        </FaHeading>
        <FaHeading
        onMouseDown={()=>cols[7] = 'gray'}
        onMouseUp={()=>cols[7] = 'black'}
        style={{color:cols[7], fontSize: 14}}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          h2
        </FaHeading>
        <FaHeading
        onMouseDown={()=>cols[8] = 'gray'}
        onMouseUp={()=>cols[8] = 'black'}
        style={{color:cols[8], fontSize: 12}}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        >
          h3
        </FaHeading>
        {/* <button
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
        </button> */}
        <FaList
        onMouseDown={()=>cols[9] = 'gray'}
        onMouseUp={()=>cols[9] = 'black'}
        style={{color:cols[9]}}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          bullet list
        </FaList>
        <FaListOl
        onMouseDown={()=>cols[10] = 'gray'}
        onMouseUp={()=>cols[10] = 'black'}
        style={{color:cols[10]}}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          ordered list
        </FaListOl>
        <FaLaptopCode
        onMouseDown={()=>cols[11] = 'gray'}
        onMouseUp={()=>cols[11] = 'black'}
        style={{color:cols[11]}}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
        >
          code block
        </FaLaptopCode>
        <FaQuoteLeft
        onMouseDown={()=>cols[12] = 'gray'}
        onMouseUp={()=>cols[12] = 'black'}
        style={{color:cols[12]}}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
        >
          blockquote
        </FaQuoteLeft>
        <RiBarChartHorizontalLine onClick={() => editor.chain().focus().setHorizontalRule().run()}
        onMouseDown={()=>cols[13] = 'gray'}
        onMouseUp={()=>cols[13] = 'black'}
        style={{color:cols[13]}}
        >
          horizontal rule
        </RiBarChartHorizontalLine>
        <BiMath
        onMouseDown={()=>cols[14] = 'gray'}
        onMouseUp={()=>cols[14] = 'black'}
        style={{color:cols[14]}}
            // Some Quirkiness here, probably a better way to do this, maybe with setNode() function instead of insertContent()
           onClick={() => editor.commands.insertInlineMathBox()}
           className={editor.isActive('inline-math-field') ? 'is-active' : ''}
        >
          maf
        </BiMath>
        </div>
        {/* <button onClick={() => editor.chain().focus().setHardBreak().run()}>
          hard break
        </button> */}
        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', width:'2.8rem'}}>
        <FaUndo
        onMouseDown={()=>cols[15] = 'gray'}
        onMouseUp={()=>cols[15] = 'black'}
        style={{color:cols[15]}}
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
        </FaUndo>
        <FaRedo
        onMouseDown={()=>cols[15] = 'gray'}
        onMouseUp={()=>cols[15] = 'black'}
        style={{color:cols[15]}}
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
        </FaRedo>
        </div>
        {/* <button
          onClick={() => editor.chain().focus().setColor('#958DF1').run()}
          className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
        >
          purple
        </button> */}
        {/* <button
            // Some Quirkiness here, probably a better way to do this, maybe with setNode() function instead of insertContent()
           onClick={() => editor.commands.setReactComponent()}
           className={editor.isActive('react-component') ? 'is-active' : ''}
        >
          react component
        </button> */}

      </div>
      </div>
    )
}

export default () => {
    const editor = useEditor({
        extensions: [
            ComponentNode,
            MyMathBoxNode,
            SmilieReplacer,
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
        `,
    })

    return (
        <>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} 
              style={{
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