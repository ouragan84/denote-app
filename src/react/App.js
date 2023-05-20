import React, {useState, useEffect, useRef} from "react";
// import Editor from "./quill/Editor";
import Editor, {resetEditorContent} from "./tiptap/Editor";
import { ipcRenderer , shell} from "electron";
import FileManager from "./file_manager/FileManager";

import path from "path";
import fs from "fs";
import { Tooltip } from "react-tooltip";

export default () => {

    const [data, setData] = useState('');
    const [editor, setEditor] = useState(null);
    const [isEditorLoaded, setIsEditorLoaded] = useState(false);
    const [filePath, setFilePath] = useState(null); // null means unsaved
    const [fileName, setFileName] = useState("Unsaved Notes - (Cmd+S to save)");
    const [fileHeader, setFileHeader] = useState(null); // null means unsaved
    
    const [userID, setUserID] = useState(null);
    const [serverURL, setServerURL] = useState(null);
    const [version, setVersion] = useState(null);
    const [platform, setPlatform] = useState(null);

    // ref to last editor
    const editorRef = useRef(editor);

    const versionRef = useRef(version);
    const serverURLRef = useRef(serverURL);
    const userIDRef = useRef(userID);
    const platformRef = useRef(platform);

    // update ref to last editor
    useEffect(() => {
        editorRef.current = editor;
    }, [editor]);

    useEffect(() => {
        versionRef.current = version;
    }, [version]);

    useEffect(() => {
        serverURLRef.current = serverURL;
    }, [serverURL]);

    useEffect(() => {
        userIDRef.current = userID;
    }, [userID]);

    useEffect(() => {
        platformRef.current = platform;
    }, [platform]);

    const clearCacheAndQuit = () => {
        ipcRenderer.send('clear_cache_and_quit');
    }

    const clearUpdateCache = () => {
        ipcRenderer.send('clear_update_cache_and_quit');
    }

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
                
                // console.log('header created', header);

                setFileHeader(header);
                fileData = header + '\n' + fileData;
                fs.writeFileSync(filepath, fileData);
    
            } else {
    
                let header = JSON.parse(fileData.split('</head>\n')[0].split('<head>')[1])
    
                if ( header && header.version !== versionRef.current ){

                    let fileVersion = header.version;
                    let targetVersion = versionRef.current;

                    console.log('APP is in version ' + targetVersion + ', but file is in version ' + fileVersion + '.');
                    // TODO: handle version mismatch here
                    
                    
                    header.version = targetVersion;
                }
    
                header.lastOpened = new Date().toISOString();
                header = '<head>' + JSON.stringify(header) + '</head>';

                // console.log('header updated', header)
    
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

        // editorRef.current.commands.setContent(newData);
        resetEditorContent(editorRef.current, newData);
    };

    useEffect(() => {
        ipcRenderer.on('app_info', (event, arg) => {
            setVersion(arg.version);
            setPlatform(arg.platform);
            setUserID(arg.userID);
            setServerURL(arg.serverURL);
        });

        ipcRenderer.send('app_info');
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
                    height: 'calc(100vh - 3.5rem)',
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
                    width: '20vw',
                    height: '3.5rem',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    overflow: 'hidden',
                }}
            >
                <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'top', padding:0}}>
                    {/* <a href="https://docs.google.com/forms/d/e/1FAIpQLScrKy8d5o10RFF_nN1-Fi5XsUfO91mPfubCJksNmn4Pg7cQCA/viewform?usp=sharing" target="_blank" style={{color:'#000', textDecoration:'none', fontSize:14}}>Report Bug</a>
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSeBrsSktvQxQ4KvnraRsd5Ob2uBvPriU15wIVQsRP1sBM78ig/viewform?usp=sharing" target="_blank" style={{color:'#000', textDecoration:'none', fontSize:14}}>Request Feature</a> */}
                    <Tooltip place='top' id='feedback'/>

                    <button 
                        style={{
                            backgroundColor:'transparent', border:'none', color:'#000',
                            cursor: 'pointer',
                            borderRadius: 5,
                            border: '1px solid #000',
                            margin: 3,
                        marginBottom: 10,

                            boxShadow: "0px 0px 7px #9E9E9E",
                        }} onClick={() => {shell.openExternal('https://docs.google.com/forms/d/e/1FAIpQLScrKy8d5o10RFF_nN1-Fi5XsUfO91mPfubCJksNmn4Pg7cQCA/viewform?usp=sharing')}}
                        data-tooltip-id="feedback" data-tooltip-content="Report Bugs"
                        
                        >
                            <p style={{color:'#000'}}><strong>Report Bugs</strong></p>
                    </button>
                    <button 
                        style={{backgroundColor:'transparent', border:'none', color:'#000',  
                        borderRadius: 5,
                        margin: 3,

                        border: '1px solid #000',
                        boxShadow: "0px 0px 7px #9E9E9E",
                        marginBottom: 10,
                        
                        // show cursor as pointer when hovering over button
                        cursor: 'pointer',
                        }} onClick={() => {shell.openExternal('https://docs.google.com/forms/d/e/1FAIpQLSeBrsSktvQxQ4KvnraRsd5Ob2uBvPriU15wIVQsRP1sBM78ig/viewform?usp=sharing')}}
                        data-tooltip-id="feedback" data-tooltip-content="Request Features"
                        
                        >
                            <p style={{ color:'#000'}}><strong>Request Feature</strong></p>
                    </button>
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

                {isEditorLoaded && version && userID && serverURL?
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
                        version={version}
                        userID={userID}
                        serverURL={serverURL}
                        platform={platform}
                        clearCacheAndQuit={clearCacheAndQuit}
                        clearUpdateCache={clearUpdateCache}
                    />
                    :
                    isEditorLoaded?
                        <h2>You must be connected to internet the first time you open the app to set up your profile</h2>
                    :
                    <h2>Please select a folder to start writing in</h2>
                }   

            </div>
            
        </div>
    )
};

/*


*/