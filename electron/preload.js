"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    saveNotes: (notes) => electron_1.ipcRenderer.invoke('save-notes', notes),
    loadNotes: () => electron_1.ipcRenderer.invoke('load-notes'),
    saveTheme: (theme) => electron_1.ipcRenderer.invoke('save-theme', theme),
    loadTheme: () => electron_1.ipcRenderer.invoke('load-theme'),
    saveLanguage: (lang) => electron_1.ipcRenderer.invoke('save-language', lang),
    loadLanguage: () => electron_1.ipcRenderer.invoke('load-language'),
});
