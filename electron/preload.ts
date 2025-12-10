import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  saveNotes: (notes: any) => ipcRenderer.invoke('save-notes', notes),
  loadNotes: () => ipcRenderer.invoke('load-notes'),
  saveTheme: (theme: string) => ipcRenderer.invoke('save-theme', theme),
  loadTheme: () => ipcRenderer.invoke('load-theme'),
  saveLanguage: (lang: string) => ipcRenderer.invoke('save-language', lang),
  loadLanguage: () => ipcRenderer.invoke('load-language'),
});