import React, { useState, useEffect } from "react";
import { ipcRenderer } from "electron";
import path from "path";
import fs from "fs";

function FileButton({explorer, clickCallback, path, isRoot=false}) {
    
    const [explorerData, etExplorerData] = useState(explorer)
    const [expand, setExpand] = useState(isRoot)
    
    if (explorerData.isFolder){
        return (
            <>
                <div style={{marginTop:5}}>
                    <div style={{
                        marginTop: '6px',
                        backgroundColor: 'lightgray',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '2px',
                        width: '300px',
                        cursor: 'pointer',
                    }} onClick={()=>setExpand(!expand)}>
                        <span>🗂️ {explorerData.name}</span>
                    </div> 
                    <div style={{display: expand ? 'block': 'none', paddingLeft: 25}}>
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
                paddingLeft: '5px',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
            }}
            onClick={() => {explorerData.onClick()}}
        >📄 {explorerData.name}</span>
    }
  }
  
  export default FileButton;
