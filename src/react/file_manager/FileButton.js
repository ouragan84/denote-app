import React, { useState, useEffect } from "react";
import { ipcRenderer } from "electron";
import path from "path";
import fs from "fs";
import { FaFolder, FaFile, FaAngleDown } from "react-icons/fa"


function FileButton({explorer, clickCallback, path, isRoot=false, indent=0, vert=83}) {
    
    const [explorerData, etExplorerData] = useState(explorer)
    const [expand, setExpand] = useState(isRoot)
    const [bg, setBg] = useState('#eef2f2')
    const [rot, setRot] = useState(false)

    const transformedStyle = {
        position:'absolute', top:vert, left:'18vw', color:'#444',
        transition: '1s, transform 0.15s',
        transform: 'rotate(0deg)',
    }
    const normalStyle = {
        position:'absolute', top:vert, left:'18vw', color:'#444',
        transition: '1s, transform 0.15s',
        transform: 'rotate(-90deg)',
    }
    
    if (explorerData.isFolder){
        return (
            <>
                <div>
                    <div style={{
                        marginTop: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection:'row',
                        justifyContent: 'space-between',
                        padding: '2px',
                        width: '300px',
                        cursor: 'pointer',
                        backgroundColor:bg,
                        paddingLeft:(20*indent)
                    }} onClick={()=>{setExpand(!expand)}}
                    onMouseEnter={()=>setBg('#dde1e1')}
                    onMouseLeave={()=>setBg('#eef2f2')}
                    >
                        <div style={{display:'flex',alignItems:'center', fontSize:14, }}><FaFolder style={{width:30, color:'#fad482'}}/>{explorerData.name}</div>
                        <div><FaAngleDown style={expand ? transformedStyle : normalStyle} /></div>
                    </div> 
                    <div style={{display: expand ? 'block': 'none',}}
                    >
                        {explorerData.items.map((exp, index) => {
                            return <FileButton explorer={exp} key={exp.id} indent={indent+1} vert={vert+((index+1)*29)}/>
                        })}
                    </div>
                </div>
            </>
        );
    }else{
        return <span style={{    
                marginTop: '5px',
                display: 'flex',
                flexDirection: 'column',
                padding: '2px',
                cursor: 'pointer',backgroundColor:bg, paddingLeft:(20*indent)
            }}
            onClick={() => {explorerData.onClick()}}
        > <div style={{display:'flex',alignItems:'center', fontSize:14}}
            onMouseEnter={()=>setBg('#dde1e1')}
            onMouseLeave={()=>setBg('#eef2f2')}
        ><FaFile style={{width:30, color:'#778978'}}/>{explorerData.name}</div></span>
    }
  }
  
  export default FileButton;
