import { Note, Theme, Language } from '../types';

const STORAGE_KEY = 'prompt-notes-data';
const THEME_KEY = 'prompt-notes-theme';
const LANG_KEY = 'prompt-notes-lang';

// Mock initial data for demonstration if empty
const INITIAL_DATA: Note[] = [
  {
    id: '1',
    title: 'Code Refactoring',
    content: 'Refactor the following code to be more readable and performant, following clean code principles:',
    tags: ['coding', 'dev'],
    usageCount: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Email Professional',
    content: 'Rewrite this email to sound more professional and polite:',
    tags: ['work', 'writing'],
    usageCount: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'React Component Generator',
    content: 'Create a React functional component using TypeScript and Tailwind CSS for:',
    tags: ['coding', 'react'],
    usageCount: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Summarize Text',
    content: 'Summarize the following text into 3 bullet points:',
    tags: ['productivity', 'writing'],
    usageCount: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Explain Like I am 5',
    content: 'Explain this concept to me as if I were a 5 year old:',
    tags: ['learning'],
    usageCount: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const storageService = {
  async getNotes(): Promise<Note[]> {
    if (window.electronAPI) {
      const notes = await window.electronAPI.loadNotes();
      return notes.length > 0 ? notes : INITIAL_DATA;
    } else {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
        return INITIAL_DATA;
      }
      return JSON.parse(stored);
    }
  },

  async saveNotes(notes: Note[]): Promise<void> {
    if (window.electronAPI) {
      await window.electronAPI.saveNotes(notes);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }
  },

  async getTheme(): Promise<Theme> {
    if (window.electronAPI) {
      const theme = await window.electronAPI.loadTheme();
      return theme === Theme.DARK ? Theme.DARK : Theme.LIGHT;
    } else {
      const stored = localStorage.getItem(THEME_KEY);
      return stored === Theme.DARK ? Theme.DARK : Theme.LIGHT;
    }
  },

  async saveTheme(theme: Theme): Promise<void> {
    if (window.electronAPI) {
      await window.electronAPI.saveTheme(theme);
    } else {
      localStorage.setItem(THEME_KEY, theme);
    }
  },

  async getLanguage(): Promise<Language> {
    if (window.electronAPI) {
      const lang = await window.electronAPI.loadLanguage();
      return lang === Language.ZH ? Language.ZH : Language.EN;
    } else {
      const stored = localStorage.getItem(LANG_KEY);
      return stored === Language.ZH ? Language.ZH : Language.EN;
    }
  },

  async saveLanguage(lang: Language): Promise<void> {
    if (window.electronAPI) {
      await window.electronAPI.saveLanguage(lang);
    } else {
      localStorage.setItem(LANG_KEY, lang);
    }
  },

  exportData(notes: Note[]) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "prompt_notes_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
};