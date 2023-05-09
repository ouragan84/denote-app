import React, {useState, useEffect, useRef} from "react";
import { platform } from "os";
import {SketchField, Tools} from 'react-sketch';
import Editor from "./Editor";

export default () => {

    window.EXCALIDRAW_ASSET_PATH = "/";

    const tools = [
        Tools.Pencil,
        Tools.Rectangle,
        Tools.Circle,
        Tools.Line,
        Tools.Select,
        Tools.Pan,
        Tools.Text
    ];

    const colors = [
        'black',
        'white',
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
        'purple',
        'pink',
    ]
    
    const [tool, setTool] = useState(0);
    const [color, setColor] = useState(0);


    useEffect(() => {
        // on click t, set tool to text
        const handleKeyDown = (e) => {
            if (e.key === "t") {
                setTool((tool+1) % tools.length);
                console.log("t was pressed")
            }
            if (e.key === "c") {
                setColor((color+1) % colors.length);
                console.log("c was pressed")
            }
        };
        window.addEventListener("keydown", handleKeyDown);
    }, [tool, color]);

    const [editorLoaded, setEditorLoaded] = useState(false);
    const [data, setData] = useState("");
    const [value, setValue] = useState({});
  
    useEffect(() => {
      setEditorLoaded(true);
    }, []);

    useEffect(() => {
        console.log("value changed", value)
    }, [value]);

    return (
        <>
            <h1 style={{ textAlign: "center" }}>Hello world, but I changed it</h1>
            <div style={{height:'85vh'}}>
                <h2>Tool: {tools[tool]}, Color: {colors[color]}</h2>
                < SketchField width='1024px' 
                            height='768px' 
                            tool={tools[tool]}
                            lineColor={colors[color]}
                            lineWidth={3}
                            value={value}
                            setValue={setValue}
                            />
            </div>

            <div style={{height:'20vh'}}>
                
            </div>

            <div style={{height:'85vh'}}>
                <Editor
                    name="description"
                    onChange={(data) => {
                        setData(data);
                    }}
                    editorLoaded={editorLoaded}
                />
                {JSON.stringify(data)}
            </div>
        </>
    )
};