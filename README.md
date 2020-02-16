Initialize yarn directory.

```
yarn init
```

When asked, set entry point ("main") as `main.js`. If not asked, add it to
 the `package.json` file.

 ```
{
  "name": "electronEightNgNineBoilerPlate",
  "version": "1.0.0",
  "description": "Core code required to run Angular 9 within Electron",
  "main": "main.js",
  "license": "MIT"
} 
 ``` 

Install electron.

``` 
yarn add --dev electron
```

Add `main.js` and temporary `index.html` at root level for electron sanity
 check.

#### `index.html`

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>It works!</title>
</head>
<body>
<h1>It works!</h1>
</body>
</html>
```

#### `main.js`

```
const electron = require('electron');
const {app, BrowserWindow, ipcMain} = electron;

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1600,
        height: 900,
        webPreferences: {
            nodeIntegration: true
        },
    });
    mainWindow.loadFile('index.html');
    mainWindow.webContents.openDevTools();
}

app.on('ready', createMainWindow); 
```

Add script to `package.json` to start electron from yarn.

```
  "scripts": {
    "start": "electron ."
  }, 
```