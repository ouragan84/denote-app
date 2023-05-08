import React, { useState } from "react";
import {RiFileAddLine, RiFolderAddLine} from "react-icons/ri"


const fs = require('fs');
const path = require('path');



function FileManager(props) {
    let explorer = props.explorer
    let handleInsertNode = props.handleInsertNode
    let cwd = props.cwd

    const [expand, setExpand] = useState(false)
    const [showInput, setShowInput] = useState({
        visible: false,
        isFolder: null,
    })

    const handleNewItem = (e, isFolder) => {
        e.stopPropagation()
        setExpand(true)
        setShowInput({
            visible: true,
            isFolder
        })
    }

    const onAddItem = (e) => {
        // 13 - Enter key
        if(e.keyCode === 13 && e.target.value){
            // logic for adding dir item
            handleInsertNode(explorer.id, e.target.value, showInput.isFolder, )
            setShowInput({...showInput, visible:false})

            //update the directory
        }
    }

    const addItemIconStyle = {
        paddingLeft:5,
        paddingRight:5,
    }

    if (explorer.isFolder){
        return (
            <>
                <div style={{marginTop:5}}>
                    <div style={{
                        marginTop: '3px',
                        backgroundColor: 'lightgray',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '2px',
                        width: '200px',
                        cursor: 'pointer',
                    }} onClick={()=>{
                        // explorer = removeDupes(explorer)
                        setExpand(!expand)
                    }}>
                        <span>🗂️ {explorer.name}</span>

                        <div style={{display:"flex", alignItems:'center'}}>
                            <RiFileAddLine style={addItemIconStyle} onClick={(e)=>handleNewItem(e, true)}>Folder +</RiFileAddLine>
                            <RiFolderAddLine style={addItemIconStyle}  onClick={(e)=>handleNewItem(e, false)}>File +</RiFolderAddLine>
                        </div>

                    </div> 
                    <div style={{display: expand ? 'block': 'none', paddingLeft: 10}}>

                        {
                            showInput.visible && (
                                <div style={{display:'flex', alignItems:"center", gap:'5px', paddingLeft:2}}>
                                    <span style={{marginTop:'5px'}}>{showInput.isFolder ? "🗂️" : "📄" }</span>
                                    <input 
                                    type="text"
                                    onKeyDown={onAddItem}
                                    onBlur={()=>setShowInput({...showInput, visible:false})}
                                    autoFocus
                                    style={{
                                        margin: '6px 0 0px 0',
                                        padding: '5px',
                                        display:'flex',
                                        border: '1px solid lightgray',
                                        alignItems:'center',
                                        justifyContent:'space-between',
                                        cursor:'pointer'
                                    }}></input>
                                </div>
                            )
                        }

                        {explorer.items.map((exp) => {
                            return <FileManager explorer={exp} handleInsertNode={handleInsertNode} cwd={cwd} key={exp.id}/>
                        })}
                    </div>
                </div>
            </>
        );
    }else{
        return <span style={{    
            marginTop: '5px',
            paddingLeft: '2px',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
        }}>📄 {explorer.name}</span>
    }
  }
  
  export default FileManager;