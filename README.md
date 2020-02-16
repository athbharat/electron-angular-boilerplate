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

Add script to `package.json` to use yarn to run this directory as an electron
application. (`npm`/`yarn` will search the `node_modules/.bin/` directory
for corresponding binaries by default.)

```
  "scripts": {
    "start": "electron ."
  }, 
```

Install angular cli.

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
the root level, including:

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

The angular `.gitignore` file can replace the current root `.gitignore`.

Merge the angular `package.json` file into the electron `package.json` file
manually by using `yarn add` at the command line for each dependency. 

Add angular scripts to `package.json`. Adjust the `e2e` route. Change the
angular `start` script to `serve`.

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

Use angular built-in server to run default angular app as sanity check.

```
yarn serve --open 
```

Remove the temporary `ng-app` directory with the old angular `package.json` 
and `node_modules`. Serve angular again to ensure it all still works.

Modify `angular.json` to reflect new `$schema` route:

```
"$schema": "./node_modules/@angular/cli/lib/config/schema.json"
```

Build (in dev mode) the angular app explicitly to create the `dist` folder. 
This will be the folder referenced in the electron `main.js` script. 

```
yarn build 
```

Change the electron `main.js` window reference to point to the built angular
 `index.html`. First import `url` and `path`.
 
 ```
 const url = require('url');
 const path = require('path');
 ```

Then change the browser window to load a url not a file, and point to the
 `index.html` built by angular and output to `dist/ng-app`.

```
   mainWindow.loadURL(url.format({
     pathname: path.join(__dirname, 'dist/ng-app', 'index.html'),
     protocol: 'file:',
     slashes: true,
   }));
```

Change the `<base>` tag of the angular `index.html` from `<base href="/">` to
`<base href="./">` (with the dot, not just the slash) and rebuild to ensure
that all generated dist files (`polyfills...js`, `main...js`, `vendor...js` 
etc.) can be found by the app.

Remove the initial temporary `index.html` file from the project root level.

Add script to `package.json` that builds before launching electron. Use double
ampersand `&&` for sequential execution as opposed to single ampersand
`&` for parallel execution.
 
 ```
    "build-start": "ng build && electron .", 
 ```

Running `yarn build-start` now should build the angular project, output it to
the `dist` directory, and launch it within electron.
