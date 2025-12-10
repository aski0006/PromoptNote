export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ElectronAPI {
  saveNotes: (notes: Note[]) => Promise<boolean>;
  loadNotes: () => Promise<Note[]>;
  saveTheme: (theme: 'light' | 'dark') => Promise<void>;
  loadTheme: () => Promise<'light' | 'dark' | null>;
  saveLanguage: (lang: 'en' | 'zh') => Promise<void>;
  loadLanguage: () => Promise<'en' | 'zh' | null>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum Language {
  EN = 'en',
  ZH = 'zh',
}