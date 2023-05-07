import React, {useState, useEffect, useRef} from "react";
import { platform } from "os";
import {SketchField, Tools} from 'react-sketch';
import Editor from "./Editor";
import FileManager from "./FileManager"
import './styles.css';
import MathTextBox from "./Math/mathTextBox";

const explorer = {
    id:"1",
    name: "root",
    isFolder: true,
    items: [
      {
        id:"2",
        name: "public",
        isFolder: true,
        items: [
          {
            id:"3",
            name: "public nested 1",
            isFolder: true,
            items: [
              {
                id:"4",
                name: "index.html",
                isFolder: false,
                items: []
              },
              {
                id:"5",
                name: "hello.html",
                isFolder: false,
                items: []
              }
            ]
          },
          {
            id:"6",
            name: "public_nested_file",
            isFolder: false,
            items: []
          }
        ]
      },
      {
        id:"7",
        name: "src",
        isFolder: true,
        items: [
          {
            id:"8",
            name: "App.js",
            isFolder: false,
            items: []
          },
          {
            id:"9",
            name: "Index.js",
            isFolder: false,
            items: []
          },
          {
            id:"10",
            name: "styles.css",
            isFolder: false,
            items: []
          }
        ]
      },
      {
        id:"11",
        name: "package.json",
        isFolder: false,
        items: []
      }
    ]
  };

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
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{width:'20vw', height:'100vh', backgroundColor:'#dfe4f2', position:'absolute',top:0, left:0}}>
                    <FileManager explorer={explorer}/>
                </div>
                <div style={{width:'80vw', height:'100vh', backgroundColor:'white', position:'absolute', top:0, left:'20vw'}}>
                <h1 style={{ textAlign: "center" }}>Text Edit area</h1>
                <div style={{width: '80vw'}}>
                    <MathTextBox/>
                </div>
                {/* 
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
                </div> */}
                </div>
            </div>
        </>
    )
};