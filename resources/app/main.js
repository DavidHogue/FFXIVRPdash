const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let currentWindow;

function createWindow() {
    currentWindow = new BrowserWindow({height: 550, x:0, y:0, frame: false, backgroundColor: '#1e1e1e', resizable: false, icon:'ffxivicon.png'});

    currentWindow.loadURL(url.format({
        pathname: path.join(__dirname,'index.html'),
        protocol: 'file:'
    }));
    
    currentWindow.on('closed', () => {
        currentWindow = null;   
    });
}

// Run the app when it's ready
app.on('ready', createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
    app.quit();  
});