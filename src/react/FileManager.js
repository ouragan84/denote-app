import React, { useState } from "react";
import './styles.css';


function FileManager(props) {
    
    const [explorerData, setExplorerData] = useState(props.explorer)
    const [expand, setExpand] = useState(false)
    if (explorerData.isFolder){
        return (
            <>
                <div style={{marginTop:5}}>
                    <div className="folder" onClick={()=>setExpand(!expand)}>
                        <span>🗂️ {explorerData.name}</span>
                    </div> 
                    <div style={{display: expand ? 'block': 'none', paddingLeft: 25}}>
                        {explorerData.items.map((exp) => {
                            return <FileManager explorer={exp} key={exp.id}/>
                        })}
                    </div>
                </div>
            </>
        );
    }else{
        return <span className="file">📄 {explorerData.name}</span>
    }
  }
  
  export default FileManager;