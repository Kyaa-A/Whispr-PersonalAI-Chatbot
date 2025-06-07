const { contextBridge, ipcRenderer, clipboard } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  // AI communication methods
  sendMessage: (message) => ipcRenderer.invoke("ai-message", message),

  // Window control methods
  closeWindow: () => ipcRenderer.send("close-window"),
  minimizeWindow: () => ipcRenderer.send("minimize-window"),

  // Clipboard methods
  writeText: (text) => clipboard.writeText(text),
  readText: () => clipboard.readText(),
});
