import React, {useState, useEffect, useRef} from "react";
import FileManager from "./FileManager"
import './styles.css';
import useTraverseTree from "./hooks/use-traverse-tree";
import InlinesExample from "./RichTextEditor";



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

const fs = require('fs');
const path = require('path');

function getTree(dirPath) {
  const name = path.basename(dirPath);
  const stats = fs.statSync(dirPath);
  const tree = { id: Math.floor(Math.random() * 1000), name, path:dirPath ,isFolder: stats.isDirectory(), items: [] };
  if (stats.isDirectory()) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      tree.items.push(getTree(filePath));
    }
  }
  return tree;
}

export default () => {
  
  // get this folder url from the Open Directory functionality
  const testFolder = '/Users/anigokul/Desktop/Startup/Denote/denote-app/testdir';

  console.log(getTree(testFolder))

  const [content, setContent] = useState('Poop');
  const [explorerData, setExplorerData] = useState(getTree(testFolder))

  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };

  const {insertNode} = useTraverseTree()  

  const handleInsertNode = (_id, item, isFolder) => {
    const finalTree = insertNode(explorerData, _id, item, isFolder)
    setExplorerData(finalTree)
  }

  const [open, setOpen] = useState(false);

  /**
   * Just alerts what the current state of 'open' is.
   */
  const enterHandler = () => {
    if (open) {
      alert("open is TRUE");
    } else {
      alert("open is FALSE");
    }
  };

  /**
   * Mathquill configuration.
   */
  const config = {
    handlers: {
      enter: enterHandler
    }
  };

    return (
        <>
          <InlinesExample/>
            {/* <div style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{width:'20vw', height:'100vh', backgroundColor:'#dfe4f2', position:'absolute',top:0, left:0}}>
                    <FileManager explorer={explorerData} handleInsertNode={handleInsertNode} cwd={testFolder}/>
                </div>
                <div style={{width:'80vw', height:'1', backgroundColor:'white', position:'absolute', left:'20vw', height: '100vh'}}>

                </div>
            </div> */}
        </>
    )
};