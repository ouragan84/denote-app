import React, { useState } from "react";

function FileManager(props) {
    
    const [explorerData, setExplorerData] = useState(props.explorer)
    const [expand, setExpand] = useState(false)
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
                            return <FileManager explorer={exp} key={exp.id}/>
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
        }}>📄 {explorerData.name}</span>
    }
  }
  
  export default FileManager;