const { contextBridge, ipcRenderer } = require("electron");

console.log("Preload script loaded!");

contextBridge.exposeInMainWorld("electron", {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
});


/* contextBridge.exposeInMainWorld("electron", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
});
 */