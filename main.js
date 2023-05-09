const { BrowserWindow, app, ipcMain, Menu, dialog} = require('electron');
const fs = require("fs");
const path = require('path');
const homedir = require('os').homedir();
const Store = require('electron-store');
const { autoUpdater, AppUpdater} = require('electron-updater');

const store = new Store();

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

const createWindow = async () => {

    console.log('home directory:', homedir);

    let window = new BrowserWindow({
        width: 1200, 
        height: 800,
        backgroundColor: '#ffffff',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            worldSafeExecuteJavaScript: true,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'src', 'preload.js'),
        }
    });

    window.loadURL(path.join('file://', __dirname, 'index.html'));

    window.setTitle('Denote');

    window.setMinimumSize(400, 300);

    window.webContents.openDevTools({mode: 'detach'});

    // adding menu with File and Edit options to the window
    const menu = Menu.buildFromTemplate([
        {
            label: 'Denote',
            submenu: [
                {role: 'quit', label: 'Quit Denote', accelerator: 'CmdOrCtrl+Q', click: () => {console.log('quit clicked')}},
                {role: 'close', label: 'Close Window', accelerator: 'CmdOrCtrl+W', click: () => {console.log('close clicked')}},
                {role: 'about', label: 'About Denote', accelerator: 'CmdOrCtrl+I', click: () => {console.log('about clicked')}},
            ]
        },
        {
            label: 'File',
            submenu: [
                {role: 'new', label: 'New File', accelerator: 'CmdOrCtrl+N', click: () => {window.webContents.send('new-file-shortcut')}},
                {role: 'open', label: 'Open Folder', accelerator: 'CmdOrCtrl+O', click: () => {window.webContents.send('open-folder')}},
                {role: 'save', label: 'Save File', accelerator: 'CmdOrCtrl+S', click: () => {window.webContents.send('file-saved-shortcut')}},
                {type: 'separator'},
                {role: 'export', label: 'Export File', accelerator: 'CmdOrCtrl+E', click: () => {console.log('export clicked')}},
                {type: 'separator'},
                {role: 'print', label: 'Print File', accelerator: 'CmdOrCtrl+P', click: () => {console.log('print clicked')}},
            ]
        },
        {
            label: 'Edit',
            submenu: [
                {role: 'undo', label: 'Undo', accelerator: 'CmdOrCtrl+Z', click: () => {console.log('undo clicked')}},
                {role: 'redo', label: 'Redo', accelerator: 'CmdOrCtrl+Y', click: () => {console.log('redo clicked')}},
                {type: 'separator'},
                {role: 'cut', label: 'Cut', accelerator: 'CmdOrCtrl+X'},
                {role: 'copy', label: 'Copy', accelerator: 'CmdOrCtrl+C'},
                {role: 'paste', label: 'Paste', accelerator: 'CmdOrCtrl+V'},
                {role: 'delete', label: 'Delete', accelerator: 'CmdOrCtrl+Backspace'},
                {type: 'separator'},
                {role: 'selectAll', label: 'Select All', accelerator: 'CmdOrCtrl+A'},
                {role: 'deselectAll', label: 'Deselect All', accelerator: 'CmdOrCtrl+D'},
                {type: 'separator'},
                {role: 'find', label: 'Find', accelerator: 'CmdOrCtrl+F', click: () => {console.log('find clicked')}},
                {role: 'replace', label: 'Replace', accelerator: 'CmdOrCtrl+H', click: () => {console.log('replace clicked')}},
            ]

        },
        {
            label: 'View',
            submenu: [
                {role: 'toggleDevTools', label: 'Toggle Developer Tools', accelerator: 'CmdOrCtrl+Shift+I', click: () => {console.log('toggle dev tools clicked')}},
                {role: 'reload', label: 'Reload', accelerator: 'CmdOrCtrl+R', click: () => {console.log('reload clicked')}},
            ]
        },
        {
            label: 'Help',
            submenu: [
                {role: 'help', label: 'Help', accelerator: 'CmdOrCtrl+H', click: () => {console.log('help clicked')}},
            ]
        },
        {
            label: 'Window',
            submenu: [
                {role: 'minimize', label: 'Minimize', accelerator: 'CmdOrCtrl+M', click: () => {console.log('minimize clicked')}},
                {role: 'zoom', label: 'Zoom', accelerator: 'CmdOrCtrl+Shift+M', click: () => {console.log('zoom clicked')}},
                {role: 'toggleFullScreen', label: 'Toggle Full Screen', accelerator: 'CmdOrCtrl+Shift+F', click: () => {console.log('toggle full screen clicked')}},
            ]

        }
    ]);

    Menu.setApplicationMenu(menu);   
}

// ipcMain.on('create-file', (event, text) => {  

//     // If the platform is 'win32' or 'Linux'
//     // Resolves to a Promise<Object>
//     dialog.showSaveDialog ({
//         title: 'Select where to save the file',
//         defaultPath: path.join(homedir, 'Desktop'),
//         buttonLabel: 'Save',
//         // Restricting the user to only Text Files.
//         filters: [ 
//         { 
//             name: 'Slant Files', 
//             extensions: ['sla'] 
//         }, ],
//         // Specifying the File Selector Property
//          properties: process.platform === 'darwin' ? ['createDirectory'] : []
//     }).then(file => {
//         // Stating whether dialog operation was
//         // cancelled or not.
//         // console.log(file.canceled);
//         if (!file.canceled) {
//             const filepath = file.filePath.toString();
//             console.log(filepath);
//             fs.writeFile(filepath, text, (err) => {
//                 if (err) {
//                     console.log("An error ocurred creating the file " + err.message)
//                 }
//             });
//             event.reply('file-saved', filepath);
//         }
//     }).catch(err => {
//       console.log(err)
//     });
// });


const openFolder = async (event) => {
    dialog.showOpenDialog({
        title: 'Select the Directory to be opened',
        defaultPath: path.join(homedir, 'Desktop'),
        buttonLabel: 'Open',
        properties: process.platform === 'darwin' ? ['openDirectory'] : []
    }).then(dir => {
        // Stating whether dialog operation was
        // cancelled or not.
        if (!dir.canceled) {
            const dirPath = dir.filePaths[0].toString();
            store.set('lastOpenedFolder', dirPath);
            console.log(dirPath);
            event.reply('open-folder-reply', dirPath);
        }  
    }).catch(err => {
      console.log(err)
    });
}


ipcMain.on('open-folder', (event) => {  
    // If the platform is 'win32' or 'Linux'
    // Resolves to a Promise<Object>
    openFolder(event);
});


ipcMain.on('open-saved-folder', (event) => {
    const dirPath = store.get('lastOpenedFolder');

    if (dirPath)
        return event.reply('open-folder-reply', dirPath);

    openFolder(event);
});


ipcMain.on('file-saved', (event) => {
    // dialog to save file
    // If the platform is 'win32' or 'Linux'
    dialog.showSaveDialog ({
        title: 'Select where to save the file',
        defaultPath: path.join(homedir, 'Desktop'),
        buttonLabel: 'Save',
        // Restricting the user to only Text Files.
        filters: [
        {
            name: 'Denote Files',
            extensions: ['dnt']
        }, ],
        // Specifying the File Selector Property
        properties: process.platform === 'darwin' ? ['createDirectory'] : []

    }).then(file => {

        if (!file.canceled) {
            const filepath = file.filePath.toString();

            fs.writeFile(filepath, "", (err) => {
                if (err) {
                    console.log("An error ocurred creating the file " + err.message)
                }
            });

            return event.reply('file-saved-reply', filepath);
        }

    }).catch(err => {
        console.log(err)
        }
    );
});


require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`)
});

app.whenReady().then(() => {
    createWindow();
    autoUpdater.checkForUpdatesAndNotify();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
    
app.on('activate', () => {
      // On macOS it's common to re-create a window in the 
      // app when the dock icon is clicked and there are no 
      // other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
    