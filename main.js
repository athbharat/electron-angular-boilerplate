const electron = require('electron');
const {app, BrowserWindow, ipcMain} = electron;

let mainWindow;

function createMainWindow() {
    // Create the browser mainWindow.
    mainWindow = new BrowserWindow({
        width: 1600,
        height: 900,
        webPreferences: {
            nodeIntegration: true
        },
    });

    // Load the entry html file.
    mainWindow.loadFile('index.html');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

}

// This method will be called when Electron has finished initialization and
// is ready to create browser windows. Some APIs can only be used after
// this event occurs.
app.on('ready', createMainWindow);