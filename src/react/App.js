import React, {useState, useEffect, useRef} from "react";
// import Editor from "./quill/Editor";
import Editor from "./tiptap/Editor";
import { ipcRenderer } from "electron";
import FileManager from "./file_manager/FileManager";

import path from "path";
import fs from "fs";

export default () => {

    const [data, setData] = useState('');
    const [version, setVersion] = useState('Loading...');
    const [editor, setEditor] = useState(null);
    const [isEditorLoaded, setIsEditorLoaded] = useState(false);
    const [filePath, setFilePath] = useState(null);
    const [fileName, setFileName] = useState("Unsaved Notes ᐧ");


    // ref to last editor
    const editorRef = useRef(editor);

    // update ref to last editor
    useEffect(() => {
        editorRef.current = editor;
        console.log('editor updated', editorRef.current);
    }, [editor]);

    const handleDataUpdate = (newData) => {
        setData(newData);
        // save newData to file if filepath is not null using os
        if (filePath){
            fs.writeFileSync(filePath, newData);
        }
    };

    const handleFileChange = (filepath, newData) => {
        setData(newData);
        setFilePath(filepath);
        setFileName(path ? path.basename(filepath).split('.')[0] : 'Unsaved Notes ᐧ');

        // console.log(editorRef.current);

        console.log(newData)

        editorRef.current.commands.setContent(newData);
    };

    useEffect(() => {
        ipcRenderer.on('app_version', (event, arg) => {
            ipcRenderer.removeAllListeners('app_version');
            setVersion(`${arg.version}, ${arg.isDev?'dev':'prod'}, ${arg.isUpToDate? 'up to date': 'not up to date'}`);
        });

        ipcRenderer.send('app_version');
    }, []);

    
    return (
        <div 
            style={{
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
            }}
        >
            <div 
                style={{
                    width: '20vw',
                    height: '100vh',
                    backgroundColor: 'lightgray',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    overflow: 'hidden',
                }}
            >
                <FileManager
                    content={data}
                    updateContent={handleFileChange}
                    setEditorLoaded={setIsEditorLoaded}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                />
            </div>
            <div
                style={{
                    width: '80vw',
                    height: '100vh',
                    position: 'absolute',
                    top: 0,
                    left: '20vw',
                    overflow: 'hidden',
                }}
            >
                {/* <h2 style={{
                    width: '100%',
                    height: '5%',
                    fontFamily: 'sans-serif',
                    fontSize: '20px',
                    marginLeft: '10px',
                    marginTop: '10px',
                    marginBottom: '5px',
                }}>{fileName}</h2> */}
                {isEditorLoaded?
                    <Editor
                        style={{
                            height: '100%',
                            width: '100%',
                            overflow: 'hidden',
                        }}
                        content={data}
                        setEditorCallback={setEditor}
                        updateContent={handleDataUpdate}
                        fileName={fileName}
                    />
                    :
                    <></>
                }   

            </div>
        </div>
    )
};