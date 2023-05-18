import React, {useState, useEffect, useRef} from "react";
// import Editor from "./quill/Editor";
import Editor from "./tiptap/Editor";
import { ipcRenderer } from "electron";
import FileManager from "./file_manager/FileManager";

import path from "path";
import fs from "fs";
import { Tooltip } from "react-tooltip";

export default () => {

    const [data, setData] = useState('');
    const [version, setVersion] = useState(null);
    const [editor, setEditor] = useState(null);
    const [isEditorLoaded, setIsEditorLoaded] = useState(false);
    const [filePath, setFilePath] = useState(null); // null means unsaved
    const [fileName, setFileName] = useState("Unsaved Notes - (Cmd+S to save)");
    const [fileHeader, setFileHeader] = useState(null); // null means unsaved

    // ref to last editor
    const editorRef = useRef(editor);
    const versionRef = useRef(version);

    // update ref to last editor
    useEffect(() => {
        editorRef.current = editor;
        console.log('editor updated', editorRef.current);
    }, [editor]);

    useEffect(() => {
        versionRef.current = version;
        console.log('version updated', versionRef.current);
    }, [version]);


    const handleDataUpdate = (newData) => {
        setData(newData);
        // save newData to file if filepath is not null using os
        if (filePath){
            fs.writeFileSync(filePath, (fileHeader? fileHeader + '\n' + newData : newData));
        }
    };

    const getNewHeader = () => {
        let attributes = {
            version: versionRef.current,
            lastOpened: new Date().toISOString(),
        }

        return '<head>' + JSON.stringify(attributes) + '</head>';
    }

    const handleFileChange = (filepath, fileData) => {

        if(filepath){

            if (!fileData.startsWith('<head>')){

                let header = getNewHeader();
                
                console.log('header created', header);

                setFileHeader(header);
                fileData = header + '\n' + fileData;
                fs.writeFileSync(filepath, fileData);
    
            } else {
    
                let header = JSON.parse(fileData.split('</head>\n')[0].split('<head>')[1])
    
                if ( header && header.version !== versionRef.current ){
                    console.log('APP is in version ' + versionRef.current + ', but file is in version ' + header.version + '.');
                    // TODO: handle version mismatch here
                }
    
                header.lastOpened = new Date().toISOString();
                header = '<head>' + JSON.stringify(header) + '</head>';

                console.log('header updated', header)
    
                setFileHeader(header);
                fileData = header + '\n' + fileData.split('</head>\n')[1];
                fs.writeFileSync(filepath, fileData);
            }

        }

        // cut off header
        let newData = fileData.split('</head>\n')[1];

        setData(newData);
        setFilePath(filepath);
        setFileName(filepath ? path.basename(filepath).split('.dnt')[0] : 'Unsaved Notes - (Cmd+S to save)');

        editorRef.current.commands.setContent(newData);
    };

    useEffect(() => {
        ipcRenderer.on('app_version', (event, arg) => {
            ipcRenderer.removeAllListeners('app_version');
            console.log('loaded version', arg.version)
            setVersion(arg.version);
        });

        ipcRenderer.send('app_version');
    }, []);

    
    return (
        <div 
            style={{

                overflow: 'hidden',
                fontFamily: 'Open Sans',
                
            }}
        >
            <div 
                style={{
                    width: '20vw',
                    height: '100%',
                    backgroundColor: 'white',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    overflow: 'hidden',
                    boxShadow: "0px 0px 7px #9E9E9E",
                    borderTopRightRadius:18,
                    borderBottomRightRadius:18,
                    backgroundColor:'#eef2f2'
                    
                }}
            >                   
                
                <div style={{backgroundColor:'#eef2f2', height:720}}>
                <FileManager
                    content={data}
                    updateContent={handleFileChange}
                    setEditorLoaded={setIsEditorLoaded}
                    style={{
                        width: '100%',
                    }}
                    openFilePath={filePath}
                />
                </div>
            </div>
            <div
                style={{
                    width: '80vw',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: '20vw',
                    overflow: 'hidden',
                }}
            >

                {isEditorLoaded?
                    <Editor
                        style={{
                            height: '100%',
                            width: '100%',
                            overflow: 'hidden',
                        }}
                        content={data}
                        setEditorCallback={setEditor}
                        updateContent={handleDataUpdate}
                        fileName={fileName}
                    />
                    :
                    <></>
                }   

            </div>
            
        </div>
    )
};

/*


*/