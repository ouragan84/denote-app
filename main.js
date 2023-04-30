const { BrowserWindow, app, ipcMain, Menu, dialog} = require('electron');
const fs = require("fs");
const path = require('path');
const homedir = require('os').homedir();
const { autoUpdater, AppUpdater} = require('electron-updater');

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

    window.setTitle('Slant');

    window.setMinimumSize(400, 300);

    window.webContents.openDevTools({mode: 'detach'});

    // adding menu with File and Edit options to the window
    const menu = Menu.buildFromTemplate([
        {
            label: 'Slant',
            submenu: [
                {role: 'quit', label: 'Quit Slant', accelerator: 'CmdOrCtrl+Q', click: () => {console.log('quit clicked')}},
                {role: 'close', label: 'Close Window', accelerator: 'CmdOrCtrl+W', click: () => {console.log('close clicked')}},
                {role: 'about', label: 'About Slant', accelerator: 'CmdOrCtrl+I', click: () => {console.log('about clicked')}},
            ]
        },
        {
            label: 'File',
            submenu: [
                {role: 'new', label: 'New File', accelerator: 'CmdOrCtrl+N', click: () => {console.log('new clicked')}},
                {role: 'open', label: 'Open File', accelerator: 'CmdOrCtrl+O', click: () => {console.log('open clicked')}},
                {role: 'save', label: 'Save File', accelerator: 'CmdOrCtrl+S', click: () => {console.log('save clicked')}},
                {role: 'saveAs', label: 'Save File As', accelerator: 'CmdOrCtrl+Shift+S', click: () => {console.log('save as clicked')}},
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
                {role: 'cut', label: 'Cut', accelerator: 'CmdOrCtrl+X', click: () => {console.log('cut clicked')}},
                {role: 'copy', label: 'Copy', accelerator: 'CmdOrCtrl+C', click: () => {console.log('copy clicked')}},
                {role: 'paste', label: 'Paste', accelerator: 'CmdOrCtrl+V', click: () => {console.log('paste clicked')}},
                {role: 'delete', label: 'Delete', accelerator: 'CmdOrCtrl+Backspace', click: () => {console.log('delete clicked')}},
                {type: 'separator'},
                {role: 'selectAll', label: 'Select All', accelerator: 'CmdOrCtrl+A', click: () => {console.log('select all clicked')}},
                {role: 'deselectAll', label: 'Deselect All', accelerator: 'CmdOrCtrl+D', click: () => {console.log('deselect all clicked')}},
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
    