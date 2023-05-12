import React, {useState, useEffect, useRef} from "react";
import Editor from "./Editor";
import { ipcRenderer } from "electron";

export default () => {

    const [data, setData] = useState('');
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [version, setVersion] = useState('Loading...');

    useEffect(() => {
        setEditorLoaded(true);

        ipcRenderer.on('app_version', (event, arg) => {
            ipcRenderer.removeAllListeners('app_version');
            setVersion(`${arg.version}, ${arg.isDev?'dev':'prod'}, ${arg.isUpToDate? 'up to date': 'not up to date'}`);
        });

        ipcRenderer.send('app_version');
    }, []);

    const installUpdate = () => {
        ipcRenderer.send('install_update');
    }

    return (
        <>
            <h1 style={{ textAlign: "center" }}>Hello world Message: This is part of version 0.1.1</h1>

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
        </>
    )
};