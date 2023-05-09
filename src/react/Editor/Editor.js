import React, { useEffect, useRef } from "react";

function Editor({ onChange, name, value, isFileSaved }) {
  
    return (
      <div  style={{ width: "100%", height: "100%" }}>
        <textarea
          id="editor"
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: "100%", height: "100%", border: "none", outline: "none", resize: "none", padding: "10px" }}
        />
        {
          !isFileSaved 
            && 
          <span style={{position: 'absolute', bottom: 0, right: 0, padding: '5px', backgroundColor: 'lightgreen'}}>
            File Not Saved! Press Crtl+S
          </span>
        }
      </div>
    );
  }
  
  export default Editor;