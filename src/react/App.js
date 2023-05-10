import React, {useState, useEffect, useRef} from "react";
import { platform } from "os";
import {SketchField, Tools} from 'react-sketch';
import Editor from "./Editor";
import { ipcRenderer } from "electron";

export default () => {

    const [data, setData] = useState('');
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [version, setVersion] = useState('Loading...');
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [updateDownloaded, setUpdateDownloaded] = useState(false);

    useEffect(() => {
        setEditorLoaded(true);

        ipcRenderer.on('app_version', (event, arg) => {
            ipcRenderer.removeAllListeners('app_version');
            setVersion(`${arg.version}, ${arg.isDev?'dev':'prod'}, ${arg.isUpToDate? 'up to date': 'not up to date'}`);
        });

        ipcRenderer.on('update_available', () => {
            ipcRenderer.removeAllListeners('update_available');
            setUpdateAvailable(true);
        });

        ipcRenderer.on('update_downloaded', () => {
            ipcRenderer.removeAllListeners('update_downloaded');
            setUpdateDownloaded(true);
        });

        ipcRenderer.send('app_version');
    }, []);

    const installUpdate = () => {
        ipcRenderer.send('install_update');
    }

    return (
        <>
            <h1 style={{ textAlign: "center" }}>Hello world! Version 1</h1>

            <div>
                <Editor
                    name="description"
                    onChange={(data) => {
                        setData(data);
                    }}
                    editorLoaded={editorLoaded}
                />
            </div>

            <h2>app version: {version}</h2>
            
            {updateAvailable && <h2>Update available.</h2>}

            {updateDownloaded && 
                <>
                    <h2>Update downloaded.</h2>
                    <button onClick={installUpdate}>Install Update</button>
                </>
            }
        </>
    )
};