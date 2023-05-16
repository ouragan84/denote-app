import React, {useState, useEffect, useRef} from "react";
// import Editor from "./quill/Editor";
import Editor from "./tiptap/Editor";
import { ipcRenderer } from "electron";
import FileManager from "./file_manager/FileManager";

export default () => {

    const [data, setData] = useState('');
    const [version, setVersion] = useState('Loading...');

    const handleDataUpdate = (newData) => {
        setData(newData);
    };

    const handleFileChange = (newData) => {
        setData(newData);
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
                }}
            >
                <FileManager
                    content={data}
                    updateContent={handleFileChange}
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
                }}
            >
                <Editor
                    style={{
                        height: '100%',
                        width: '100%',
                    }}
                    content={data}
                    updateContent={handleDataUpdate}
                />
            </div>
        </div>
    )
};