import React, { useState, useEffect, useRef } from "react";
import { ipcRenderer } from "electron";
import path from "path";
import fs from "fs";
import File from "./FileButton";
const { v4: uuid } = require('uuid');

const explorer = {
    name: "Select Working Directory",
    isFolder: true,
    onClick: () => {ipcRenderer.send('open-saved-folder');},
    id: uuid(),
    path: "",
    items: [
    ]
};

const ignoreList = [
  '.git',
  '.DS_Store',
];

function FileManager({content, updateContent, setEditorLoaded }) {

    const [explorerData, setExplorerData] = useState(explorer)
    const [workingFolder, setWorkingFolder] = useState(null)
    const [workingFile, setWorkingFile] = useState(null)

    const contentRef = useRef(content);

    const getFolderData = (folderPath) => {

        // console.log(typeof folderPath, folderPath)

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
                folderData.items.push({
                    name: file,
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
            updateContent(null, ""); // new file
        })

        // file was saved
        ipcRenderer.on('file-saved-reply', (event, filePath) => {
          filePath = `${filePath}`;
          console.log('file-saved-reply', filePath);
          console.log('contentRef.current', contentRef.current);


          updateContent(filePath, content);

          if (!filePath)
              return;
          setWorkingFile(filePath);


          // update explorer
          let folderData = getFolderData(workingFolder);
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
            <File explorer={explorerData} isRoot={true} key={explorerData.id}/>
        </>
    );

}
  
export default FileManager;