import React, {useState, useEffect, useRef} from "react";
// import Editor from "./quill/Editor";
import Editor from "./tiptap/Editor";
import { ipcRenderer } from "electron";

export default () => {

    const [data, setData] = useState('');
    const [version, setVersion] = useState('Loading...');

    const handleDataUpdate = (newData) => {
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
        <>
            <div
                style={{
                    width: '100vw',
                    height: '80vh'
                }}
            >
                <Editor
                    style={{
                        height: '100%',
                        width: '100%',
                    }}
                />
            </div>
        </>
    )
};