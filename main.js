const path = require("path");
const { app, BrowserWindow, Menu } = require("electron");

const isMac = process.platform === "darwin";
const isDev = !app.isPackaged;

const createMainWindow = () => {
  const mainWindow = new BrowserWindow({
    title: "Migaku JSON to AnkiCards Converter",
    width: isDev ? 1600 : 800,
    height: isDev ? 900 : 500,
  });

  // Open devtools if in dev env
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"));
};

app.whenReady().then(() => {
  createMainWindow();

  //Implement Menu
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

// Menu Template
const menu = [
  {
    role: "fileMenu"
  }
];

app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});