"use strict";
// This file is the entry point for Electron. 
// It requires compilation or running via ts-node, but provided here as the source logic.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
// Determine storage directory
// Use app.getPath('userData') to ensure write permissions on Windows (e.g., %APPDATA%/PromptNoteTool)
// We create a 'database' subdirectory as requested.
const USER_DATA_PATH = electron_1.app.getPath('userData');
const DB_DIR = path.join(USER_DATA_PATH, 'database');
const DATA_FILE = path.join(DB_DIR, 'data.json');
const CONFIG_FILE = path.join(DB_DIR, 'config.json');
// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
}
function createWindow() {
    const win = new electron_1.BrowserWindow({
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
    const isDev = process.env.NODE_ENV === 'development' || !electron_1.app.isPackaged;
    if (isDev) {
        // Attempt to connect to Vite dev server
        win.loadURL('http://localhost:5173').catch(() => {
            win.loadFile(path.join(__dirname, '../build/index.html'));
        });
    }
    else {
        win.loadFile(path.join(__dirname, '../build/index.html'));
    }
}
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
// Helper to safely read config
function getConfig() {
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
            return JSON.parse(data);
        }
    }
    catch (e) {
        console.error('Failed to load config', e);
    }
    return {};
}
// Helper to safely save config (merge)
function saveConfig(newSettings) {
    try {
        const currentConfig = getConfig();
        const updatedConfig = Object.assign(Object.assign({}, currentConfig), newSettings);
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(updatedConfig), 'utf-8');
    }
    catch (e) {
        console.error('Failed to save config', e);
    }
}
// IPC Handlers
electron_1.ipcMain.handle('load-notes', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf-8');
            return JSON.parse(data);
        }
        return [];
    }
    catch (e) {
        console.error('Failed to load notes', e);
        return [];
    }
}));
electron_1.ipcMain.handle('save-notes', (event, notes) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2), 'utf-8');
        return true;
    }
    catch (e) {
        console.error('Failed to save notes', e);
        return false;
    }
}));
electron_1.ipcMain.handle('load-theme', () => __awaiter(void 0, void 0, void 0, function* () {
    return getConfig().theme || null;
}));
electron_1.ipcMain.handle('save-theme', (event, theme) => __awaiter(void 0, void 0, void 0, function* () {
    saveConfig({ theme });
}));
electron_1.ipcMain.handle('load-language', () => __awaiter(void 0, void 0, void 0, function* () {
    return getConfig().language || null;
}));
electron_1.ipcMain.handle('save-language', (event, language) => __awaiter(void 0, void 0, void 0, function* () {
    saveConfig({ language });
}));
