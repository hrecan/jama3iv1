const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // En développement, chargez l'URL du serveur de développement
    if (isDev) {
        win.loadURL('http://localhost:3002');
        win.webContents.openDevTools();
    } else {
        // En production, chargez les fichiers locaux
        win.loadFile(path.join(__dirname, 'public', 'views', 'index.html'));
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
