import React, {useState, useEffect, useRef} from "react";
import TextEditor from './quill/Editor';
import FileManager from "./FileManager";
import './styles.css';

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
  const [content, setContent] = useState('');

  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };

    return (
        <>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{width:'20vw', height:'100vh', backgroundColor:'#dfe4f2', position:'absolute',top:0, left:0}}>
                    <FileManager explorer={explorer}/>
                    <p>Herllo: {content}</p>
                </div>
                <div style={{
                  position:'absolute',
                  top:0, 
                  left:'20vw',
                  width:'80vw', 
                  height:'100vh',
                  backgroundColor:'#f0f0f0',
                  scrollBehavior: 'none',
                }} >
                   
                    <TextEditor content={content} setContent={handleEditorChange} style={{height: '100%', width: "100%"}}/>
                   
                </div>
            </div>
        </>
    )
};