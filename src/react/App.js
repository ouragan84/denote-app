import React, {useState, useEffect, useRef} from "react";
import { platform } from "os";
import {SketchField, Tools} from 'react-sketch';
import Editor from "./Editor";

export default () => {

    const [data, setData] = useState('');
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [version, setVersion] = useState('Loading...');

    useEffect(() => {
        setEditorLoaded(true);
    }, []);

    return (
        <>
            <h1 style={{ textAlign: "center" }}>Hello world! Version 2</h1>

            <h2>Version: {version}</h2>

            <div style={{height:'85vh'}}>
                <Editor
                    name="description"
                    onChange={(data) => {
                        setData(data);
                    }}
                    editorLoaded={editorLoaded}
                />
            </div>
        </>
    )
};