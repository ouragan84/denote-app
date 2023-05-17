import React, { useState, useEffect } from "react";
import { ipcRenderer } from "electron";
import path from "path";
import fs from "fs";
import { FaFolder, FaFile } from "react-icons/fa"


function FileButton({explorer, clickCallback, path, isRoot=false}) {
    
    const [explorerData, etExplorerData] = useState(explorer)
    const [expand, setExpand] = useState(isRoot)
    
    if (explorerData.isFolder){
        return (
            <>
                <div style={{marginTop:5}}>
                    <div style={{
                        marginTop: '6px',
                        backgroundColor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '2px',
                        width: '300px',
                        cursor: 'pointer',
                        backgroundColor:'black',
                    }} onClick={()=>setExpand(!expand)}>
                        <div style={{alignItems:'center', fontSize:14}}><FaFolder style={{width:30}}/>{explorerData.name}</div>
                    </div> 
                    <div style={{display: expand ? 'block': 'none', marginLeft: 25}}>
                        {explorerData.items.map((exp) => {
                            return <FileButton explorer={exp} key={exp.id}/>
                        })}
                    </div>
                </div>
            </>
        );
    }else{
        return <span style={{    
                marginTop: '5px',
                paddingRight: '10px',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                backgroundColor:'black',
            }}
            onClick={() => {explorerData.onClick()}}
        > <div style={{alignItems:'center', fontSize:14}}><FaFile style={{width:30}}/>{explorerData.name}</div></span>
    }
  }
  
  export default FileButton;
