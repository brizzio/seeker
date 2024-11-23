const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
  });

contextBridge.exposeInMainWorld("electronAPI", {
  getSources: () => ipcRenderer.invoke("get-sources"),
  getDisplays: () => ipcRenderer.invoke("get-displays"),
  showOverlay: (bounds) => ipcRenderer.send("show-overlay", bounds),
  closeOverlay: () => ipcRenderer.send("close-overlay"),
  onAreaSelected: (callback) => ipcRenderer.on("area-selected", (_, area) => callback(area)),
});
