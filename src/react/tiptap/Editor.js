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
import Underline from '@tiptap/extension-underline'
import React, {useEffect, useState} from 'react'
import Modal from 'react-modal'

import ComponentNode from './ExampleExtension'
import MyMathBoxNode from './InlineMathExtension'
import {SmilieReplacer} from './EmojiReplacerExtension'
import DrawBoxNode from './DrawBoxExtentsion'
import CodeBlockExtension from './CodeBlockExtension'
import {callAIPrompt, callAIPromptWithQuestion} from './AIPromptsExtension'

import {Tooltip} from 'react-tooltip'

import { FaBold, FaItalic, FaStrikethrough, FaCode, FaRemoveFormat, FaHeading, FaList, FaListOl, FaLaptopCode, FaQuoteLeft, FaUnderline, FaUndo, FaRedo, FaRegEdit, FaQuestion } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { RiBarChartHorizontalLine } from 'react-icons/ri'
import { BiMath } from 'react-icons/bi'
import { TbBracketsContain } from 'react-icons/tb'

const MenuBar = ({ editor, fileName, callprompt }) => {
    if (!editor) {
      return null
    }

    let initCols = []
    for (let i = 0; i < 21; i++)
      initCols.push('black')
    const [cols, setCols] = useState(initCols)
  
    return (
      <div style={{display:'flex',flexDirection:'row', justifyContent:'center', marginLeft:15, marginRight:15,}}>
        <div style={{paddingLeft:'1rem',backgroundColor:'#eef2f2', borderBottomLeftRadius:18, borderBottomRightRadius:18 , paddingRight:'1rem', paddingTop:'1rem', paddingBottom:'1rem', boxShadow: "0px 0px 7px #9E9E9E"}}>
          <div style={{marginBottom:'10px'}}>
            <span style={{fontSize: 15, fontWeight: 'default'}}>{fileName}</span>
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
                  data-tooltip-id="tool" data-tooltip-content="Bold (Cmd+b)"
                >
                  bold
                </FaBold>
                <Tooltip place='bottom' id='tool'/>
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
                  data-tooltip-id="tool" data-tooltip-content="Italic (Cmd+i)"
                >
                  italic
                </FaItalic>
                
                <FaUnderline
                  onMouseDown={()=>cols[2] = 'gray'}
                  onMouseUp={()=>cols[2] = 'black'}
                  style={{color:cols[2]}}
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  disabled={
                    !editor.can()
                      .chain()
                      .focus()
                      .toggleItalic()
                      .run()
                  }
                  className={editor.isActive('underline') ? 'is-active' : ''}
                  data-tooltip-id="tool" data-tooltip-content="Underline (Cmd+u)"
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
                  data-tooltip-id="tool" data-tooltip-content="Strike (Cmd+Shft+x)"

                >
                  strike
                </FaStrikethrough>

                <FaHeading
                onMouseDown={()=>cols[6] = 'gray'}
                onMouseUp={()=>cols[6] = 'black'}
                style={{color:cols[6]}}
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
                  data-tooltip-id="tool" data-tooltip-content="Heading 1"
                >
                  h1
                </FaHeading>
                <FaHeading
                onMouseDown={()=>cols[7] = 'gray'}
                onMouseUp={()=>cols[7] = 'black'}
                style={{color:cols[7], fontSize: 14}}
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                  data-tooltip-id="tool" data-tooltip-content="Heading 2"

                >
                  h2
                </FaHeading>
                <FaHeading
                onMouseDown={()=>cols[8] = 'gray'}
                onMouseUp={()=>cols[8] = 'black'}
                style={{color:cols[8], fontSize: 12}}
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
                  data-tooltip-id="tool" data-tooltip-content="Heading 3"

                >
                  h3
                </FaHeading>

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
                  data-tooltip-id="tool" data-tooltip-content="Code Inline"
                >
                  code
                </FaCode>

                <FaRemoveFormat onClick={() => editor.chain().focus().clearNodes().run()} 
                onMouseDown={()=>cols[5] = 'gray'}
                onMouseUp={()=>cols[5] = 'black'}
                style={{color:cols[5]}}
                data-tooltip-id="tool" data-tooltip-content="Clear Format">
                  clear nodes
                </FaRemoveFormat>

                <div style={{backgroundColor:'lightgray', width:1, height:15, marginLeft:2, marginRight:2}}></div>

                <FaList
                onMouseDown={()=>cols[9] = 'gray'}
                onMouseUp={()=>cols[9] = 'black'}
                style={{color:cols[9]}}
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={editor.isActive('bulletList') ? 'is-active' : ''}
                  data-tooltip-id="tool" data-tooltip-content="Unordered List"
                >
                  bullet list
                </FaList>
                <FaListOl
                onMouseDown={()=>cols[10] = 'gray'}
                onMouseUp={()=>cols[10] = 'black'}
                style={{color:cols[10]}}
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={editor.isActive('orderedList') ? 'is-active' : ''}
                  data-tooltip-id="tool" data-tooltip-content="Ordered List"
                >
                  ordered list
                </FaListOl>




                <div style={{backgroundColor:'lightgray', width:1, height:15, marginLeft:2, marginRight:2}}></div>

                <FaQuoteLeft
                onMouseDown={()=>cols[12] = 'gray'}
                onMouseUp={()=>cols[12] = 'black'}
                style={{color:cols[12]}}
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  className={editor.isActive('blockquote') ? 'is-active' : ''}
                  data-tooltip-id="tool" data-tooltip-content="Quote Block"
                >
                  blockquote
                </FaQuoteLeft>
                <RiBarChartHorizontalLine onClick={() => editor.chain().focus().setHorizontalRule().run()}
                onMouseDown={()=>cols[13] = 'gray'}
                onMouseUp={()=>cols[13] = 'black'}
                style={{color:cols[13]}}
                data-tooltip-id="tool" data-tooltip-content="Horizontal Line"
                >
                  horizontal rule
                </RiBarChartHorizontalLine>
                <BiMath
                onMouseDown={()=>cols[14] = 'gray'}
                onMouseUp={()=>cols[14] = 'black'}
                style={{color:cols[14]}}
                  onClick={() => editor.commands.insertInlineMathBox()}
                  className={editor.isActive('inline-math-field') ? 'is-active' : ''}
                  data-tooltip-id="tool" data-tooltip-content="Insert Math"
                >
                  maf
                </BiMath>
                <FaLaptopCode
                onMouseDown={()=>cols[11] = 'gray'}
                onMouseUp={()=>cols[11] = 'black'}
                style={{color:cols[11]}}
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
                  className={editor.isActive('codeBlock') ? 'is-active' : ''}
                  data-tooltip-id="tool" data-tooltip-content="Code Block"
                >
                  code block
                </FaLaptopCode>
                <FaRegEdit
                  onMouseDown={()=>cols[17] = 'gray'}
                  onMouseUp={()=>cols[17] = 'black'}
                  style={{color:cols[17]}}
                  onClick={() => editor.commands.insertDrawBox()}
                  className={editor.isActive('draw-box') ? 'is-active' : ''}
                  data-tooltip-id="tool" data-tooltip-content="Insert Draw Box"
                >
                    Draw
                </FaRegEdit>

                <div style={{backgroundColor:'lightgray', width:1, height:15, marginLeft:2, marginRight:2}}></div>

                <FaQuestion
                  onMouseDown={()=>cols[18] = 'gray'}
                  onMouseUp={()=>cols[18] = 'black'}
                  style={{color:cols[18]}}
                  data-tooltip-id="tool" data-tooltip-content="Prompt AI"
                  onClick={() => {
                    callprompt(editor, 'Prompt');
                  }}
                >
                  Prompt
                </FaQuestion>
                <HiSparkles
                  onMouseDown={()=>cols[19] = 'gray'}
                  onMouseUp={()=>cols[19] = 'black'}
                  style={{color:cols[19]}}
                  data-tooltip-id="tool" data-tooltip-content="Beautify Selection"
                  onClick={() => {
                    callprompt(editor, 'Beautify');
                  }}
                >
                  Beautify
                </HiSparkles>
                <TbBracketsContain
                  onMouseDown={()=>cols[20] = 'gray'}
                  onMouseUp={()=>cols[20] = 'black'}
                  style={{color:cols[20]}}
                  data-tooltip-id="tool" data-tooltip-content="Fills [...] in Selection"
                  onClick={() => {
                    callprompt(editor, 'FillBlanks');
                  }}
                >
                  FillBlanks
                </TbBracketsContain>
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
                  onMouseDown={()=>cols[16] = 'gray'}
                  onMouseUp={()=>cols[16] = 'black'}
                  style={{color:cols[16]}}
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

    const [promptModalOpen, setPromptModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [loadingModalOpen, setLoadingModalOpen] = useState(false);
    const [error, setError] = useState('');
    const [selection, setSelection] = useState(null);

    const setErrorMessage = (message) => {
      setError(message);
      setErrorModalOpen(true);
    }

    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text,
            ComponentNode,
            MyMathBoxNode,
            SmilieReplacer,
            DrawBoxNode,
            Underline,
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

    const callprompt = (editor, prompt, errorCallback) => {
      if(prompt === 'Prompt'){
        if (!editor.state.selection.empty) {
          return errorCallback('Place your cursor in the editor.');
      }
    
        setSelection(editor.getHTML(editor.state.selection.from, editor.state.selection.to))
        setPromptModalOpen(true);
      }
      else
        callAIPrompt(editor, prompt, setErrorMessage, setLoadingModalOpen);
    }

    return (
        <>
            <Modal
              isOpen={promptModalOpen}
              onRequestClose={() => setPromptModalOpen(false)}
              contentLabel="Prompt Modal"
              ariaHideApp={false}
              style={{
                overlay: {
                  backgroundColor: 'rgba(0,0,0,0.5)',
                },
                content: {
                  backgroundColor: 'white',
                  width: '50%',
                  height: '50%',
                  margin: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }
              }}
            >
              <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <span style={{fontSize: 20, fontWeight: 'bold', fontFamily:'Open Sans'}}>Prompt</span>
                <form style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                  <input type="text" id="prompt-input" name="prompt-input" style={{width: '80%', height: '50%'}}/>
                  <button
                    onClick={() => {
                      callAIPromptWithQuestion(editor, 'Prompt', document.getElementById('prompt-input').value, setErrorMessage, setLoadingModalOpen, selection)
                      setPromptModalOpen(false);
                    }}
                  >
                    Submit
                  </button>
                </form>
              </div>
            </Modal>

            <Modal
              isOpen={loadingModalOpen}
              // onRequestClose={() => setLoadingModalOpen(false)}
              contentLabel="Loading Modal"
              ariaHideApp={false}
              style={{
                overlay: {
                  backgroundColor: 'rgba(0,0,0,0.5)',
                },
                content: {
                  backgroundColor: 'white',
                  width: '50%',
                  height: '50%',
                  margin: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }
              }}
            >
              <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <span style={{fontSize: 20, fontWeight: 'bold', }}>Loading</span>
                <span style={{fontSize: 15, fontWeight: 'default',}}>Loading...</span>
              </div>
            </Modal>

            <Modal
              isOpen={errorModalOpen}
              onRequestClose={() => {setErrorModalOpen(false); setError(''); setLoadingModalOpen(false);}}
              contentLabel="Error Modal"
              ariaHideApp={false}
              style={{
                overlay: {
                  backgroundColor: 'rgba(0,0,0,0.5)',
                },
                content: {
                  backgroundColor: 'white',
                  width: '50%',
                  height: '50%',
                  margin: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }
              }}
            >
              <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <span style={{fontSize: 20, fontWeight: 'bold'}}>Error</span>
                <span style={{fontSize: 15, fontWeight: 'default'}}>{error}</span>
              </div>
            </Modal>

            <MenuBar editor={editor} fileName={fileName}
              setErrorMessage={setErrorMessage}
              setPromptModalOpen={setPromptModalOpen}
              style={{
                height: '10%',
              }}
              callprompt={callprompt}
            />
            <EditorContent 
              editor={editor} 
              onKeyDown={handleKeyDown}
              style={{
                height: '87%',
                overflowY: 'auto',
                margin:10,

              }}
            />
        </>
    )
}