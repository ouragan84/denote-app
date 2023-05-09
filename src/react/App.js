import React, {useState, useEffect, useRef} from "react";
import { platform } from "os";
import {SketchField, Tools} from 'react-sketch';
import Editor from "./Editor/Editor";
import LoadingEditor from "./Editor/LoadingEditor";
import FileManager from "./FileManager/FileManager"
import './styles.css';
import fs from "fs";


export default () => {

    const [editorLoaded, setEditorLoaded] = useState(false);
    const [data, setData] = useState("");
    const [file, setFile] = useState(null);

    const handleTextUpdate = (text) => {
      setData(text);
      if(file)
        fs.writeFile(file, text, (err) => {
          if(err) console.log(err);
        }, );
    }

    const handleFileOpen = (file, content) => {
      setFile(file);
      setData(content);
    }

    return (
        <>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{width:'20vw', height:'100vh', backgroundColor:'#dfe4f2', position:'absolute',top:0, left:0}}>
                    <FileManager 
                      content={data}
                      updateContent={handleFileOpen}
                      setEditorLoaded={setEditorLoaded}
                    />
                </div>
                <div style={{width:'80vw', height:'100vh', backgroundColor:'white', position:'absolute', top:0, left:'20vw'}}>

                    {
                      editorLoaded
                      && 
                      <Editor
                        style={{ width: "100%", height: "100%" }}
                        onChange={handleTextUpdate}
                        name="editor"
                        value={data}
                        isFileSaved={file !== null}
                      /> 
                      || 
                      <LoadingEditor /> 
                    }

                </div>
            </div>
        </>
    )
};