const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  send: (channel, data) => {
    console.log(`Sending ${channel} with data:`, data); // Debug
    ipcRenderer.send(channel, data);
  },
});

// Test communication on load
ipcRenderer.send("overlay-loaded", "Overlay is ready");
