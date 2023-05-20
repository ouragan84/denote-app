  
  import React, { useState, useEffect, useRef } from "react";
  import { ipcRenderer, shell } from "electron";
  import path from "path";
  import fs from "fs";
  import File from "./FileButton";

  import {FaFolderOpen, FaFileMedical} from 'react-icons/fa'
  import {MdFeedback} from 'react-icons/md'

  const { v4: uuid } = require('uuid');

  const ignoreList = [
    '.git',
    '.DS_Store',
  ];

  const extension = '.dnt';

  function FileManager({content, updateContent, setEditorLoaded, openFilePath }) {

      const [explorerData, setExplorerData] = useState(null)
      const [workingFolder, setWorkingFolder] = useState(null)
      const [workingFile, setWorkingFile] = useState(null)

      const contentRef = useRef(content);
      const workingFolderRef = useRef(workingFolder);

      const openNewFile = () => {
        updateContent(null, "");
      }

      const getFolderData = (folderPath) => {

          // console.log(typeof folderPath, folderPath)

          if(!folderPath || folderPath === '')
                return;

          if(!fs.existsSync(folderPath))
              return;

          let folderData = {
              name: path.basename(folderPath),
              path: folderPath,
              isFolder: true,
              onClick: () => {},
              id: uuid(),
              items: []
          };

          let folderChildren = fs.readdirSync(folderPath);

          folderChildren.forEach(file => {
              if (ignoreList.includes(file))
                  return;
              
              if (fs.lstatSync(path.join(folderPath, file)).isDirectory()){
                  const newFolderData = getFolderData(path.join(folderPath, file))
                  if(newFolderData)
                    folderData.items.push(newFolderData);
              }else{
                    if (path.extname(file) !== extension)
                        return;

                  folderData.items.push({
                      name: file.split(extension)[0],
                      path: path.join(folderPath, file),
                      onClick: () => { updateContent(path.join(folderPath, file), fs.readFileSync(path.join(folderPath, file), 'utf8')); },
                      isFolder: false,
                      id: uuid(),
                      items: []
                  });
              }
          });

          return folderData;
      }

      useEffect(() => {
        contentRef.current = content;
      }, [content]);

      useEffect(() => {
        workingFolderRef.current = workingFolder;
      }, [workingFolder]);

      useEffect(() => {
          // directory was selected
          ipcRenderer.on('open-folder-reply', (event, folderPath) => {
              if (!folderPath)
                  return;

              setWorkingFolder(folderPath);

              let folderData = getFolderData(folderPath);

              console.log(folderData)

              setExplorerData(folderData);

              setEditorLoaded(true);
          });

          // file shortcut was pressed
          ipcRenderer.on('file-saved-shortcut', (event) => {
              if (workingFile){
                  console.log('file is already saved');
                  return;
              }

              ipcRenderer.send('file-saved');
          })

          // new file shortcut was pressed
          ipcRenderer.on('new-file-shortcut', (event) => {
            openNewFile();
          })

          // file was saved
          ipcRenderer.on('file-saved-reply', (event, filePath) => {
            filePath = `${filePath}`;
            console.log('file-saved-reply', filePath);
            console.log('contentRef.current', contentRef.current);

            updateContent(filePath, contentRef.current);

            if (!filePath)
                return;
            setWorkingFile(filePath);

            console.log('workingFolder', workingFolderRef.current);
            
            // update explorer
            let folderData = getFolderData(workingFolderRef.current);
            setExplorerData(folderData);
          });

          // call open folder
          ipcRenderer.send('open-saved-folder');

          return () => {
              ipcRenderer.removeAllListeners();
          };
      }, []);
              
      return (
          <>
            <div style={{backgroundColor:'#eef2f2', boxShadow: "0px 1px 1px lightgray", paddingTop:1,display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                <button 
                  style={{backgroundColor:'transparent', border:'none', color:'#000',  
                  display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center',
                  // show cursor as pointer when hovering over button
                  cursor: 'pointer',
                  }} onClick={() => {shell.openExternal('https://www.denote.app')}}>
                    <h3 style={{paddingLeft:10, color:'#000'}}>Denote</h3></button>
                <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                <FaFolderOpen style={{marginRight:20, fontSize:18}} onClick={() => {ipcRenderer.send('open-folder')}}/>
                <FaFileMedical style={{marginRight:20}} onClick={() => {openNewFile();}}/>
                </div>
            </div>
            <div style={{height:720, overflowY:'scroll'}}>
            {explorerData ?
              <File explorer={explorerData} isRoot={true} key={explorerData.id} openFilePath={openFilePath}/>
              : <></>
            }
            </div>
          </>
      );

  }
  
  export default FileManager;