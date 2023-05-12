import React, { useEffect, useRef } from "react";

function Editor({ onChange, editorLoaded, name, value }) {
    const editorRef = useRef();
  
  
    return (
      <div>
        {editorLoaded ? (
          <input
            type="text"
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <div>Editor loading</div>
        )}
      </div>
    );
  }
  
  export default Editor;