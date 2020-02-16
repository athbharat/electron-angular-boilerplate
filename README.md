# Steps I took to get here.

## This was done on macOS 10.14.6.

Initialize project root as yarn directory.

```
yarn init
```

When asked, set entry point as `main.js`. If not asked, add it to the
`package.json` file.

 ```
{
  "name": "electronAngularBoilerplate",
  "author": "Sean Reed",
  "version": "0.0.0",
  "description": "Core code to run an Angular 9 app within Electron 8.",
  "main": "main.js",
  "license": "MIT"
} 
 ``` 

Install Electron into project root.

``` 
yarn add --dev electron
```

Add `main.js` and temporary `index.html` at root level for Electron sanity
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

Add script to `package.json` to use yarn to run this directory as an Electron
application. (`npm`/`yarn` will search the `node_modules/.bin/` directory
for corresponding binaries by default.)

```
  "scripts": {
    "start": "electron ."
  }, 
```

Test that it works.

```
yarn start 
```

Install Angular CLI into the project root directory.

```
yarn add --dev @angular/cli 
```

Add script to `package.json` to execute `ng` binary.

```
  "scripts": {
    "start": "electron .",
    "ng": "ng"
  },
```

Create new Angular app in the root project directory. When prompted, choose
to add Angular routing and select SCSS as a stylesheet format. 

```
yarn ng new ng-app 
```

Move the following contents of the newly created `ng-app` directory up to
the project root directory, including:

- `e2e` directory
- `src` directory
- `.editorconfig`
- `angular.json`
- `browserslist`
- `karma.conf.js`
- `tsconfig.app.json`
- `tsconfig.json`
- `tsconfig.spec.json`
- `tslint.json`

The Angular `.gitignore` file can replace the current root `.gitignore`.

Merge the Angular `package.json` file into the Electron `package.json` file
manually by using `yarn add` at the command line for each dependency. 

Add Angular scripts to `package.json`. Adjust the `e2e` route. Change the
Angular `start` script to `serve`.

```
  "scripts": {
    "start": "electron .",
    "ng": "ng",
    "serve": "ng serve",
    "build": "ng build",
    "test": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e"
  }, 
```

Use Angular built-in server to run default Angular app as sanity check.

```
yarn serve --open 
```

Remove the temporary `ng-app` directory with the old Angular `package.json` 
and `node_modules`. Serve Angular again to ensure it all still works.

Modify `angular.json` to reflect new `$schema` route:

```
"$schema": "./node_modules/@angular/cli/lib/config/schema.json"
```

Build (in dev mode) the Angular app explicitly to create the `dist` folder. 
This will be the folder referenced in the Electron `main.js` script. 

```
yarn build 
```

Change the Electron `main.js` window reference to point to the built Angular
 `index.html`. First import `url` and `path`.
 
 ```
 const url = require('url');
 const path = require('path');
 ```

Then change the browser window to load a URL not a file (but using the `file:` 
protocol, and point to the `index.html` built by Angular and output to 
`dist/ng-app`.

```
   mainWindow.loadURL(url.format({
     pathname: path.join(__dirname, 'dist/ng-app', 'index.html'),
     protocol: 'file:',
     slashes: true,
   }));
```

Change the `<base>` tag of the Angular `index.html` from `<base href="/">` to
`<base href="./">` (with the dot, not just the slash) and rebuild to ensure
that all generated dist files (`polyfills...js`, `main...js`, `vendor...js` 
etc.) can be found by the app.

Remove the initial temporary `index.html` file from the project root level.

Add script to `package.json` that builds before launching Electron. Use double
ampersand `&&` for sequential execution as opposed to single ampersand
`&` for parallel execution.
 
 ```
    "build-start": "ng build && electron .", 
 ```

Running `yarn build-start` now should build the Angular project, output it to
the `dist` directory, and launch it within Electron.

Add `electron-builder` to the project.

```
yarn add --dev electron-builder 
```

Add build configuration for `electron-builder` to `package.json`.

```
 "build": {
     "appId": "com.example.my-app",
     "productName": "my-app",
     "copyright": "Copyright (c) xxxx My Name.",
     "directories": {
       "output": "build",
       "app": "."
     },
     "mac": {
       "target": [
         "dmg"
       ]
     },
     "win": {
       "target": [
         {
           "target": "nsis",
           "arch": [
             "ia32",
             "x64"
           ]
         }
       ]
     }
   },
```

Add `postinstall` script to `package.json` that uses `electron-builder` to
ensure that native dependencies are always matched to the Electron version.

```
"postinstall": "electron-builder install-app-deps" 
```

Add scripts to `package.json` for building the app in Mac and Windows formats. 
This builds the Angular app in production mode first. When building a Windows
app on Mac, `electron-builder` will download Wine.

```
    "ebm": "ng build --prod && electron-builder --mac",
    "ebw": "ng build --prod && electron-builder --win", 
```
