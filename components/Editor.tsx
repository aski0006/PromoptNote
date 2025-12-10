import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { Copy, Save, Trash2, Tag, ArrowLeft, Check, AlertTriangle } from 'lucide-react';

interface EditorProps {
  note: Note | null;
  onSave: (note: Note) => void;
  onDelete: (id: string) => void;
  onUse: (note: Note) => void;
  onBack: () => void;
  t: any;
}

export const Editor: React.FC<EditorProps> = ({ note, onSave, onDelete, onUse, onBack, t }) => {
  const [formData, setFormData] = useState<Partial<Note>>({});
  const [tagInput, setTagInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (note) {
      setFormData({ ...note });
    } else {
      setFormData({
        title: '',
        content: '',
        tags: [],
        usageCount: 0,
      });
    }
    setTagInput('');
    setCopied(false);
    setShowDeleteModal(false);
  }, [note]);

  const handleSave = () => {
    if (!formData.title || !formData.content) return;
    
    const now = new Date().toISOString();
    const newNote: Note = {
      id: formData.id || crypto.randomUUID(),
      title: formData.title || 'Untitled',
      content: formData.content || '',
      tags: formData.tags || [],
      usageCount: formData.usageCount || 0,
      createdAt: formData.createdAt || now,
      updatedAt: now,
    };
    onSave(newNote);
  };

  const handleCopy = () => {
    if (formData.content) {
      navigator.clipboard.writeText(formData.content);
      if (note) {
        onUse(note);
        setFormData(prev => ({ ...prev, usageCount: (prev.usageCount || 0) + 1 }));
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const confirmDelete = () => {
    if (note) {
        onDelete(note.id);
        setShowDeleteModal(false);
    }
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const currentTags = formData.tags || [];
      if (!currentTags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...currentTags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter(t => t !== tagToRemove)
    });
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 relative transition-colors duration-500">
      
      {/* Mac Style Toolbar */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 dark:border-gray-700 transition-colors duration-500">
        <div>
           {/* Left side placeholder or breadcrumb */}
           <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                {note ? 'Editing' : 'New Note'}
           </span>
        </div>

        {/* Action Buttons: Mac Style Circles */}
        <div className="flex items-center gap-4">
            {/* Yellow: Back */}
            <button
                onClick={onBack}
                className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 hover:bg-yellow-400 text-yellow-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                title={t.language === 'en' ? 'Back' : '返回'}
            >
                <ArrowLeft size={18} />
            </button>

             {/* Red: Delete (Only if existing note) */}
            {note && (
                <button
                onClick={() => setShowDeleteModal(true)}
                className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-red-100 hover:bg-red-500 text-red-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                title={t.delete}
                >
                <Trash2 size={18} />
                </button>
            )}

            {/* Green: Copy & Use */}
            <button
                onClick={handleCopy}
                disabled={!formData.content}
                className={`group relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 shadow-sm hover:shadow-md ${
                    copied
                    ? 'bg-green-500 text-white scale-110'
                    : 'bg-green-100 hover:bg-green-500 text-green-600 hover:text-white disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400'
                }`}
                title={t.copyUse}
            >
                {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>

            {/* Blue: Save */}
            <button
                onClick={handleSave}
                disabled={!formData.title || !formData.content}
                className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-500 text-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400"
                title={t.save}
            >
                <Save size={18} />
            </button>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-8 md:p-12 max-w-5xl mx-auto w-full space-y-8 animate-fade-in">
        <div className="space-y-3">
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder={t.titlePlaceholder}
            className="w-full text-4xl font-extrabold bg-transparent border-none focus:ring-0 focus:outline-none p-0 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 transition-colors"
          />
        </div>

        <div className="space-y-2">
           <div className="flex flex-wrap gap-2 mb-2 min-h-[32px]">
             {(formData.tags || []).map(tag => (
               <span key={tag} className="flex items-center px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg text-sm font-medium transition-colors">
                 {tag}
                 <button 
                    onClick={() => removeTag(tag)}
                    className="ml-2 opacity-50 hover:opacity-100"
                 >
                   &times;
                 </button>
               </span>
             ))}
             <div className="relative flex items-center">
                 <Tag size={14} className="text-gray-400 absolute left-2" />
                 <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    placeholder={t.tagPlaceholder}
                    className="bg-transparent border-none focus:ring-0 text-sm py-1 pl-7 text-gray-600 dark:text-gray-400 placeholder-gray-300 w-48"
                />
             </div>
           </div>
        </div>

        <div className="h-px w-full bg-gray-100 dark:bg-gray-700 my-4" />

        <div className="space-y-2 flex-1">
          <textarea
            value={formData.content || ''}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder={t.contentPlaceholder}
            className="w-full h-[calc(100vh-400px)] p-0 bg-transparent border-none focus:ring-0 focus:outline-none text-gray-700 dark:text-gray-200 resize-none leading-relaxed font-mono text-base transition-colors"
          />
        </div>

        {note && (
            <div className="pt-4 text-xs text-gray-300 dark:text-gray-600 font-mono flex gap-4">
                <span>ID: {note.id.split('-')[0]}...</span>
                <span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
                <span>Used: {note.usageCount} times</span>
            </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-80 transform transition-all scale-100 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-2">
                        <AlertTriangle className="text-red-500 w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {t.language === 'zh' ? '确定删除吗？' : 'Are you sure?'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                         {t.language === 'zh' ? '此操作无法撤销。' : 'This action cannot be undone.'}
                    </p>
                    <div className="flex w-full space-x-3 mt-4">
                        <button 
                            onClick={() => setShowDeleteModal(false)}
                            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
                        >
                            {t.language === 'zh' ? '取消' : 'Cancel'}
                        </button>
                        <button 
                            onClick={confirmDelete}
                            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium text-sm shadow-md shadow-red-500/30"
                        >
                            {t.delete}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};