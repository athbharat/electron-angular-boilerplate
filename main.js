const electron = require('electron');
const { app, BrowserWindow } = electron;
const url = require('url');
const path = require('path');

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
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/ng-app', 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

}

// This method will be called when Electron has finished initialization and
// is ready to create browser windows. Some APIs can only be used after
// this event occurs.
app.on('ready', createMainWindow);
