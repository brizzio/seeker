const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");

let mainWindow;
let overlayWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Set preload script
      nodeIntegration: false,
      contextIsolation: true, // Keep context isolation for security
    },
  });

  mainWindow.loadFile("index.html");

  // Handle screen capture and start overlay
  ipcMain.on("start-screen-capture", (event) => {
    const display = screen.getPrimaryDisplay();
    const bounds = display.bounds;
    createOverlay(bounds);
  });

  // Handle selected area
  ipcMain.on("area-selected", (event, area) => {
    console.log("Area selected:", area);
    // Handle the selected area here, such as capturing a screenshot
  });

  // Handle overlay closing
  ipcMain.on("close-overlay", () => {
    if (overlayWindow) {
      overlayWindow.close();
    }
  });
}

function createOverlay(bounds) {
  overlayWindow = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    focusable: true,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Use preload.js to expose ipcRenderer
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  overlayWindow.loadFile("overlay.html");
  overlayWindow.once("ready-to-show", () => {
    overlayWindow.webContents.send("start-selection"); // Start the selection overlay
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
