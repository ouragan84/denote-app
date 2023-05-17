import './styles.scss'

import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorContent, useEditor, ReactNodeViewRenderer} from '@tiptap/react'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import React, {useEffect, useState} from 'react'

import ComponentNode from './ExampleExtension'
import MyMathBoxNode from './InlineMathExtension'
import {SmilieReplacer} from './EmojiReplacerExtension'
import DrawBoxNode from './DrawBoxExtentsion'
import IndentCommand from './IndentCommandExtension'
import CodeBlockExtension from './CodeBlockExtension'
import { callAIPrompt } from './AIPromptsExtension'


import { FaBold, FaItalic, FaStrikethrough, FaCode, FaRemoveFormat, FaHeading, FaList, FaListOl, FaLaptopCode, FaQuoteLeft, FaUnderline, FaUndo, FaRedo, FaRegEdit } from "react-icons/fa";
import { RiBarChartHorizontalLine } from 'react-icons/ri'
import { BiMath } from 'react-icons/bi'

const MenuBar = ({ editor, fileName }) => {
    if (!editor) {
      return null
    }

    let initCols = []
    for (let i = 0; i < 18; i++)
      initCols.push('black')
    const [cols, setCols] = useState(initCols)
  
    return (
      <div style={{display:'flex',flexDirection:'row', justifyContent:'center', marginLeft:15, marginRight:15}}>
        <div style={{paddingLeft:'1rem', borderBottomLeftRadius:18, borderBottomRightRadius:18 , paddingRight:'1rem', paddingTop:'1rem', paddingBottom:'1rem', boxShadow: "0px 0px 7px #9E9E9E"}}>
          <div style={{marginBottom:'10px'}}>
            <span style={{fontSize: 15, fontWeight: 'default', fontFamily:'sans-serif'}}>{fileName}</span>
            </div>
            <div style={{width:'70vw',display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
              <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', width:500, alignItems:'center'}}>
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
                <FaRemoveFormat onClick={() => editor.chain().focus().clearNodes().run()} 
                onMouseDown={()=>cols[5] = 'gray'}
                onMouseUp={()=>cols[5] = 'black'}
                style={{color:cols[5]}}>
                  clear nodes
                </FaRemoveFormat>
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
                  onClick={() => editor.commands.insertInlineMathBox()}
                  className={editor.isActive('inline-math-field') ? 'is-active' : ''}
                >
                  maf
                </BiMath>
                <FaRegEdit
                  onMouseDown={()=>cols[17] = 'gray'}
                  onMouseUp={()=>cols[17] = 'black'}
                  style={{color:cols[17]}}
                  onClick={() => editor.commands.insertDrawBox()}
                  className={editor.isActive('draw-box') ? 'is-active' : ''}
                >
                    Draw
                </FaRegEdit>
                <button
                  onClick={() => {
                    callAIPrompt(editor, 'Prompt');
                  }}
                >
                  P
                </button>
                <button
                  onClick={() => {
                    callAIPrompt(editor, 'Prompt');
                  }}
                >
                  B
                </button>
                <button
                  onClick={() => {
                    callAIPrompt(editor, 'Prompt');
                  }}
                >
                  FB
                </button>
              </div>
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
          </div>
        </div>
      </div>
    )
}

export default ({content, updateContent, setEditorCallback, fileName}) => {
    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text,
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
            CodeBlockExtension,

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
      // make sure not in a code block
      if (event.key === 'Tab') {
        event.preventDefault()
        editor.chain().focus().insertContent('\t').run()
      }
    }


    return (
        <>
            <MenuBar editor={editor} fileName={fileName}
              style={{
                height: '10%',
              }}
            />
            <EditorContent 
              editor={editor} 
              onKeyDown={handleKeyDown}
              style={{
                fontFamily: 'sans-serif',
                height: '90%',
                overflowY: 'auto',
              }}
            />
        </>
    )
}