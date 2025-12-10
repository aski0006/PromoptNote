import React, { useState, useEffect } from 'react';
import { Note, Theme, Language } from './types';
import { storageService } from './services/storageService';
import { Dashboard } from './components/Dashboard';
import { Editor } from './components/Editor';
import { Search, Plus, Moon, Sun, Upload, Download, Home } from 'lucide-react';

const translations = {
  [Language.EN]: {
    appTitle: "PromptNote Tool",
    appDesc: "Your personal AI prompt library",
    top10: "Top 10 High-Frequency Prompts",
    recent: "Recently Used",
    noRecent: "No recently used prompts.",
    searchPlaceholder: "Search prompts...",
    noPrompts: "No prompts found.",
    editPrompt: "Edit Prompt",
    newPrompt: "New Prompt",
    titleLabel: "Title",
    contentLabel: "Prompt Content",
    tagsLabel: "Tags",
    created: "Created",
    timesUsed: "Times Used",
    copyUse: "Copy & Use",
    copied: "Copied!",
    save: "Save",
    delete: "Delete",
    importSuccess: "Import successful!",
    invalidJson: "Invalid JSON file",
    titlePlaceholder: "E.g., Python Code Generator",
    contentPlaceholder: "Type your AI prompt here...",
    tagPlaceholder: "Add tag and press Enter",
    export: "Export JSON",
    import: "Import JSON",
    used: "Used",
    language: "Switch Language",
  },
  [Language.ZH]: {
    appTitle: "提示词便签工具箱",
    appDesc: "您的个人AI提示词库",
    top10: "前十高频提示词",
    recent: "最近使用",
    noRecent: "暂无最近使用的提示词。",
    searchPlaceholder: "搜索提示词...",
    noPrompts: "未找到提示词。",
    editPrompt: "编辑提示词",
    newPrompt: "新建提示词",
    titleLabel: "标题",
    contentLabel: "提示词内容",
    tagsLabel: "标签",
    created: "创建于",
    timesUsed: "使用次数",
    copyUse: "复制并使用",
    copied: "已复制!",
    save: "保存",
    delete: "删除",
    importSuccess: "导入成功！",
    invalidJson: "无效的 JSON 文件",
    titlePlaceholder: "例如：Python 代码生成器",
    contentPlaceholder: "在此输入您的 AI 提示词...",
    tagPlaceholder: "输入标签并回车",
    export: "导出 JSON",
    import: "导入 JSON",
    used: "使用次数",
    language: "切换语言",
  }
};

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [view, setView] = useState<'home' | 'editor'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  const [language, setLanguage] = useState<Language>(Language.EN);

  const t = translations[language];

  useEffect(() => {
    // Initial Load
    const loadData = async () => {
      const data = await storageService.getNotes();
      const savedTheme = await storageService.getTheme();
      const savedLang = await storageService.getLanguage();
      setNotes(data);
      setTheme(savedTheme);
      setLanguage(savedLang);
      applyTheme(savedTheme);
    };
    loadData();
  }, []);

  const applyTheme = (t: Theme) => {
    if (t === Theme.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    setTheme(newTheme);
    applyTheme(newTheme);
    storageService.saveTheme(newTheme);
  };

  const toggleLanguage = () => {
    const newLang = language === Language.EN ? Language.ZH : Language.EN;
    setLanguage(newLang);
    storageService.saveLanguage(newLang);
  };

  const handleSaveNote = async (note: Note) => {
    const exists = notes.find(n => n.id === note.id);
    let updatedNotes;
    if (exists) {
      updatedNotes = notes.map(n => n.id === note.id ? note : n);
    } else {
      updatedNotes = [...notes, note];
    }
    setNotes(updatedNotes);
    await storageService.saveNotes(updatedNotes);
    setSelectedNote(note); // Keep editing
  };

  const handleDeleteNote = async (id: string) => {
    const updatedNotes = notes.filter(n => n.id !== id);
    setNotes(updatedNotes);
    await storageService.saveNotes(updatedNotes);
    setSelectedNote(null);
    setView('home');
  };

  const handleUseNote = async (note: Note) => {
    const updatedNote = { ...note, usageCount: note.usageCount + 1 };
    const updatedNotes = notes.map(n => n.id === note.id ? updatedNote : n);
    setNotes(updatedNotes);
    await storageService.saveNotes(updatedNotes);
    // Don't change selection, just update state
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string) as Note[];
          if (Array.isArray(imported)) {
            // Merge logic: Add if ID doesn't exist
            const newNotes = [...notes];
            imported.forEach(imp => {
                if(!newNotes.find(n => n.id === imp.id)) {
                    newNotes.push(imp);
                }
            });
            setNotes(newNotes);
            await storageService.saveNotes(newNotes);
            alert(t.importSuccess);
          }
        } catch (err) {
          alert(t.invalidJson);
        }
      };
      reader.readAsText(file);
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen w-screen bg-mac-bg dark:bg-mac-darkBg text-gray-900 dark:text-gray-100 font-sans overflow-hidden">
      
      {/* Sidebar - 30% Width */}
      <div className="w-80 flex-shrink-0 flex flex-col border-r border-gray-300 dark:border-gray-800 bg-mac-sidebar dark:bg-mac-darkSidebar backdrop-blur-md">
        
        {/* Sidebar Header */}
        <div className="p-4 pt-6 border-b border-gray-200 dark:border-gray-700 drag-region">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => { setView('home'); setSelectedNote(null); }}>
               <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                  <Home className="text-white w-5 h-5" />
               </div>
               <span className="font-bold text-lg tracking-tight">PromptNote</span>
            </div>
            <button 
              onClick={() => { setSelectedNote(null); setView('editor'); }}
              className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              title={t.newPrompt}
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Sidebar List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredNotes.map(note => (
            <div 
              key={note.id}
              onClick={() => { setSelectedNote(note); setView('editor'); }}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                selectedNote?.id === note.id 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <h3 className={`font-semibold text-sm mb-1 truncate ${selectedNote?.id === note.id ? 'text-white' : ''}`}>{note.title}</h3>
              <p className={`text-xs truncate ${selectedNote?.id === note.id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                {note.content}
              </p>
            </div>
          ))}
          {filteredNotes.length === 0 && (
            <div className="text-center text-gray-400 text-sm mt-10">
                {t.noPrompts}
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
           <div className="flex space-x-2">
             <button onClick={toggleTheme} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors" title={theme === Theme.LIGHT ? 'Dark Mode' : 'Light Mode'}>
                {theme === Theme.LIGHT ? <Moon size={18} /> : <Sun size={18} />}
             </button>
             <button onClick={toggleLanguage} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center justify-center font-bold text-xs w-8" title={t.language}>
                {language === Language.EN ? 'EN' : '中'}
             </button>
           </div>
           <div className="flex space-x-2">
             <label className="cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors" title={t.import}>
               <Upload size={18} />
               <input type="file" className="hidden" accept=".json" onChange={handleImport} />
             </label>
             <button 
                onClick={() => storageService.exportData(notes)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors" 
                title={t.export}
             >
               <Download size={18} />
             </button>
           </div>
        </div>
      </div>

      {/* Main Content Area - 70% Width */}
      <div className="flex-1 bg-white dark:bg-gray-900 overflow-hidden relative shadow-2xl">
        {view === 'home' ? (
          <Dashboard 
            notes={notes} 
            onNoteSelect={(n) => { setSelectedNote(n); setView('editor'); }}
            isDarkMode={theme === Theme.DARK}
            t={t}
          />
        ) : (
          <Editor 
            note={selectedNote} 
            onSave={handleSaveNote} 
            onDelete={handleDeleteNote}
            onUse={handleUseNote}
            onBack={() => { setView('home'); setSelectedNote(null); }}
            t={t}
          />
        )}
      </div>
    </div>
  );
};

export default App;