const { app, BrowserWindow, ipcMain, screen, desktopCapturer, nativeImage } = require("electron");
const path = require("path");

const sharp = require('sharp');

let selectedMonitor = null;

let mainWindow;
let overlayWindow;

let captureInterval;
let imagesArray = [];


ipcMain.on("start-capturing", (event, area) => {
  console.log("Start capturing with area:", area); // Log when capturing starts

  if (!selectedMonitor) {
    console.error("No monitor selected!");
    event.sender.send("capture-error", "No monitor selected");
    return;
  }

  if (!area) {
    console.error("No area selected!");
    event.sender.send("capture-error", "No area selected");
    return;
  }

  // Clear previous captures if any
  clearInterval(captureInterval);
  imagesArray = [];

  captureInterval = setInterval(async () => {
    try {
      const sources = await desktopCapturer.getSources({ types: ["screen"], thumbnailSize: { width: 1366, height: 720}});
      const screen = sources.find(s => s.display_id == selectedMonitor.id); // Find correct screen

      if (screen && screen.thumbnail) {
        // Convert the thumbnail to a buffer (PNG format)
        const imageBuffer = screen.thumbnail.toPNG();
        console.error("screen", screen, imageBuffer);

        // Get the dimensions of the image to validate the crop area
        sharp(imageBuffer)
          .metadata()
          .then(metadata => {
            console.log("Image metadata:", metadata); // Log image dimensions

            // Validate that the crop area is within bounds
            if (area.x < 0 || area.y < 0 || area.width <= 0 || area.height <= 0 || area.x + area.width > metadata.width || area.y + area.height > metadata.height) {
              console.error("Invalid crop area:", area);
              event.sender.send("capture-error", "Invalid crop area");
              return;
            }

            // Use sharp to crop the image
            sharp(imageBuffer)
              .extract({ width: area.width, height: area.height, left: area.x, top: area.y }) // Crop the image
              .toBuffer() // Convert the cropped image to a buffer
              .then(croppedBuffer => {
                const base64Image = croppedBuffer.toString('base64');
                imagesArray.push(`data:image/png;base64,${base64Image}`);

                // Limit to the last 10 images
                if (imagesArray.length > 10) {
                  imagesArray.shift();
                }
                console.log("images:", imagesArray);
                event.sender.send("images-updated", imagesArray);
              })
              .catch(error => {
                console.error("Error cropping image:", error);
              });
          })
          .catch(error => {
            console.error("Error getting image metadata:", error);
          });
      } else {
        console.error("No valid thumbnail or screen found.");
      }
    } catch (error) {
      console.error("Error capturing screen:", error);
    }
  }, 500); // Capture every 0.5 seconds

  // Stop the capture process after 5 seconds
  setTimeout(() => clearInterval(captureInterval), 5000);
});

ipcMain.on("stop-capturing", () => {
  clearInterval(captureInterval);
  imagesArray = [];
});

//===================================================

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Preload script
      nodeIntegration: false,
      contextIsolation: true, // For security
    },
  });

  mainWindow.loadFile("index.html");
}

function createOverlay(bounds) {
  overlayWindow = new BrowserWindow({
    transparent: true,
    frame: false,
    fullscreen: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    movable: false,
    resizable: false,
    focusable: true,
    webPreferences: {
      preload: path.join(__dirname, 'overlay-preload.js'), // Preload script for overlay
      contextIsolation: true,
      nodeIntegration: true,
    },
  });

  overlayWindow.loadFile("overlay.html");

  overlayWindow.once("ready-to-show", () => {
    overlayWindow.setBounds(bounds); // Set overlay bounds to the selected monitor
    overlayWindow.webContents.send("start-selection", bounds);
  });

  // Handle `area-selected` from the overlay
  ipcMain.on("area-selected", (event, area) => {
    console.log("Area selected:", area);
    if (overlayWindow) {
      overlayWindow.close();
    }
  });

  // Handle overlay cancellation
  ipcMain.on("close-overlay", () => {
    if (overlayWindow) {
      overlayWindow.close();
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  // Handle monitor selection
  ipcMain.on("select-monitor", (event) => {
    const displays = screen.getAllDisplays();
    const monitorData = displays.map((display, index) => ({
      id: index,
      name: `Monitor ${index + 1}`,
      bounds: display.bounds,
    }));

    event.sender.send("monitors-available", monitorData);
  });

  // Handle monitor selection and launch overlay
  ipcMain.on("monitor-selected", (event, monitorId) => {
    selectedMonitor = screen.getAllDisplays()[monitorId];
    if (selectedMonitor) {
      console.log('Selected Monitor:', selectedMonitor);
      createOverlay(selectedMonitor.bounds);
    }
  });
});

ipcMain.on("overlay-loaded", (event, message) => {
  console.log(message); // Should log: "Overlay is ready"
});


// Close the app when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

//mainWindow.webContents.openDevTools();
