// This file is the entry point for Electron. 
// It requires compilation or running via ts-node, but provided here as the source logic.

import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

// Declarations to handle missing types
declare const __dirname: string;

// Determine storage directory
// Use app.getPath('userData') to ensure write permissions on Windows (e.g., %APPDATA%/PromptNoteTool)
// We create a 'database' subdirectory as requested.
const USER_DATA_PATH = app.getPath('userData');
const DB_DIR = path.join(USER_DATA_PATH, 'database');
const DATA_FILE = path.join(DB_DIR, 'data.json');
const CONFIG_FILE = path.join(DB_DIR, 'config.json');

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)){
    fs.mkdirSync(DB_DIR, { recursive: true });
}

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    titleBarStyle: 'hiddenInset', // Mac style title bar
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // In production, load the built index.html. In dev, load localhost.
  // The logic below detects if we are in dev mode based on command line args or env
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  if (isDev) {
    // Attempt to connect to Vite dev server
    win.loadURL('http://localhost:5173').catch(() => {
        win.loadFile(path.join(__dirname, '../build/index.html'));
    });
  } else {
    win.loadFile(path.join(__dirname, '../build/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if ((process as any).platform !== 'darwin') {
    app.quit();
  }
});

// Helper to safely read config
function getConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load config', e);
  }
  return {};
}

// Helper to safely save config (merge)
function saveConfig(newSettings: any) {
  try {
    const currentConfig = getConfig();
    const updatedConfig = { ...currentConfig, ...newSettings };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(updatedConfig), 'utf-8');
  } catch (e) {
    console.error('Failed to save config', e);
  }
}

// IPC Handlers
ipcMain.handle('load-notes', async () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (e) {
    console.error('Failed to load notes', e);
    return [];
  }
});

ipcMain.handle('save-notes', async (event, notes) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Failed to save notes', e);
    return false;
  }
});

ipcMain.handle('load-theme', async () => {
  return getConfig().theme || null;
});

ipcMain.handle('save-theme', async (event, theme) => {
  saveConfig({ theme });
});

ipcMain.handle('load-language', async () => {
  return getConfig().language || null;
});

ipcMain.handle('save-language', async (event, language) => {
  saveConfig({ language });
});