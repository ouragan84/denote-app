import React, { useState, useEffect } from "react";
import { ipcRenderer } from "electron";
import path from "path";
import fs from "fs";
import { FaFolder, FaFile, FaAngleDown } from "react-icons/fa"


function FileButton({explorer, clickCallback, path, isRoot=false, indent=0, vert=86, openFilePath}) {
    
    const [explorerData, etExplorerData] = useState(explorer)
    const [expand, setExpand] = useState(isRoot)
    const [bg, setBg] = useState('#eef2f2')
    const [rot, setRot] = useState(false)

    const [screenSize, setScreenSize] = useState(getCurrentDimension());

  	function getCurrentDimension(){
    	return {
      		width: window.innerWidth,
      		height: window.innerHeight
    	}
  	}

    function map (number, inMin, inMax, outMin, outMax) {
        return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }

    const swconvert = (w) => {
        return Math.floor(map(w, 1440, 1038, 20, 100))
    }
    // console.log(swconvert(screenSize.width))
  
    const transformedStyle = {
        position:'inherit', color:'#444', marginRight:swconvert(screenSize.width),
        transition: '1s, transform 0.15s',
        transform: 'rotate(0deg)',
    }
    const normalStyle = {
        position:'inherit', color:'#444',marginRight:swconvert(screenSize.width),
        transition: '1s, transform 0.15s',
        transform: 'rotate(-90deg)',
    }

    const [selected, setSelected] = useState(openFilePath == explorerData.path)
    

    const indspace = <div style={{width:indent*15}}/>
    
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
                    }} onClick={()=>{setExpand(!expand)}}
                    onMouseEnter={()=>setBg('#dde1e1')}
                    onMouseLeave={()=>setBg('#eef2f2')}
                    >
                        <div style={{display:'flex',alignItems:'center', fontSize:14, }}>{indspace}<FaFolder style={{width:30, color:'#fad482'}}/>{explorerData.name}</div>
                        <div><FaAngleDown style={expand ? transformedStyle : normalStyle} /></div>
                    </div> 
                    <div style={{display: expand ? 'block': 'none',}}
                    >
                        {explorerData.items.map((exp, index) => {
                            return <FileButton explorer={exp} key={exp.id} indent={indent+1} vert={vert+((index+1)*29)} openFilePath={openFilePath}/>
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
                cursor: 'pointer',backgroundColor:(openFilePath == explorerData.path ? '#96d1f2' : '#eef2f2'),
            }}
            onClick={() => {explorerData.onClick()
                // console.log(openFilePath == explorerData.path)
            }}
        > <div style={{display:'flex',alignItems:'center', fontSize:14}}
            onMouseEnter={()=>{if(!openFilePath == explorerData.path) setBg('#dde1e1')}}
            onMouseLeave={()=>{if(!openFilePath == explorerData.path) setBg('#eef2f2')}}
        >{indspace}<FaFile style={{width:30, color:'#778978'}}/>{explorerData.name}</div></span>
    }
  }
  
  export default FileButton;
