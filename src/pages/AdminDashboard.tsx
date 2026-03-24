import React, { useEffect, useState } from 'react';
import { mockDb } from '../mockFirebase';
import { News, Feedback, NewsStatus } from '../types';
import { CATEGORIES, REACTION_LABELS, FEEDBACK_STATUS_LABELS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit2, Trash2, MessageSquare, FileText, 
  CheckCircle, Archive, 
  LayoutDashboard, ChevronRight, X, Image as ImageIcon, Link as LinkIcon,
  CheckCircle2
} from 'lucide-react';
import { cn, formatDate } from '../utils';

const AdminDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<'home' | 'news' | 'feedback' | 'editor'>('home');
  const [news, setNews] = useState<News[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [editingNews, setEditingNews] = useState<News | null>(null);

  useEffect(() => {
    const refreshData = () => {
      setNews(mockDb.getNews());
      // For demo, we'll just use an empty array for feedback if not in localStorage
      const savedFeedback = localStorage.getItem('demo_feedback');
      setFeedback(savedFeedback ? JSON.parse(savedFeedback) : []);
    };

    refreshData();
    // Refresh every 2 seconds for demo feel
    const interval = setInterval(refreshData, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleEditNews = (item: News) => {
    setEditingNews(item);
    setActiveView('editor');
  };

  const handleCreateNews = () => {
    setEditingNews(null);
    setActiveView('editor');
  };

  const handleDeleteNews = async (id: string) => {
    if (window.confirm('Es-tu sûr de vouloir supprimer cette information ?')) {
      mockDb.deleteNews(id);
      setNews(mockDb.getNews());
    }
  };

  const handleUpdateFeedbackStatus = async (id: string, status: Feedback['status']) => {
    const updatedFeedback = feedback.map(f => f.id === id ? { ...f, status } : f);
    setFeedback(updatedFeedback);
    localStorage.setItem('demo_feedback', JSON.stringify(updatedFeedback));
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Espace Admin</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveView('home')}
            className={cn("p-2 rounded-xl transition-all", activeView === 'home' ? "bg-indigo-600 text-white" : "bg-white text-slate-400 border border-slate-200")}
          >
            <LayoutDashboard size={20} />
          </button>
          <button 
            onClick={() => setActiveView('news')}
            className={cn("p-2 rounded-xl transition-all", activeView === 'news' ? "bg-indigo-600 text-white" : "bg-white text-slate-400 border border-slate-200")}
          >
            <FileText size={20} />
          </button>
          <button 
            onClick={() => setActiveView('feedback')}
            className={cn("p-2 rounded-xl transition-all", activeView === 'feedback' ? "bg-indigo-600 text-white" : "bg-white text-slate-400 border border-slate-200")}
          >
            <MessageSquare size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeView === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Infos</p>
                <p className="text-3xl font-black text-slate-900">{news.length}</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Nouveaux Retours</p>
                <p className="text-3xl font-black text-indigo-600">{feedback.filter(f => f.status === 'new').length}</p>
              </div>
            </div>

            <section>
              <h3 className="text-lg font-black text-slate-900 mb-4">Derniers retours privés</h3>
              <div className="space-y-3">
                {feedback.slice(0, 5).map((f) => (
                  <div key={f.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900 truncate">{f.userName}</span>
                        <span className={cn(
                          "px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider",
                          f.status === 'new' ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"
                        )}>
                          {FEEDBACK_STATUS_LABELS[f.status]}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">{f.comment || REACTION_LABELS[f.reactionType]}</p>
                    </div>
                    <button onClick={() => setActiveView('feedback')} className="text-slate-300 hover:text-indigo-600">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {activeView === 'news' && (
          <motion.div key="news" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <button 
              onClick={handleCreateNews}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-indigo-200"
            >
              <Plus size={20} />
              Créer une information
            </button>

            <div className="space-y-3">
              {news.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider",
                        item.status === 'published' ? "bg-emerald-100 text-emerald-600" : 
                        item.status === 'draft' ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"
                      )}>
                        {item.status}
                      </span>
                      {item.isFeatured && <span className="bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider">Une</span>}
                    </div>
                    <h4 className="font-bold text-slate-900 truncate">{item.title}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">{formatDate(item.createdAt)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditNews(item)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDeleteNews(item.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeView === 'feedback' && (
          <motion.div key="feedback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {feedback.map((f) => (
              <div key={f.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-black text-slate-900 leading-tight">{f.userName}</h4>
                    <p className="text-xs text-slate-400 font-medium">{f.userEmail}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      f.status === 'new' ? "bg-indigo-100 text-indigo-600" : "bg-emerald-100 text-emerald-600"
                    )}>
                      {FEEDBACK_STATUS_LABELS[f.status]}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{formatDate(f.createdAt)}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-white px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-600 border border-slate-200">
                      {REACTION_LABELS[f.reactionType]}
                    </span>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed italic">"{f.comment || 'Sans commentaire'}"</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Sur : <span className="text-slate-600">{f.newsId.substring(0, 8)}...</span>
                  </p>
                  <div className="flex gap-2">
                    {f.status === 'new' && (
                      <button 
                        onClick={() => handleUpdateFeedbackStatus(f.id, 'processed')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all"
                      >
                        <CheckCircle size={14} />
                        Marquer traité
                      </button>
                    )}
                    {f.status === 'processed' && (
                      <button 
                        onClick={() => handleUpdateFeedbackStatus(f.id, 'archived')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
                      >
                        <Archive size={14} />
                        Archiver
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeView === 'editor' && (
          <NewsEditor 
            item={editingNews} 
            onClose={() => setActiveView('news')} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

interface NewsEditorProps {
  item: News | null;
  onClose: () => void;
}

const NewsEditor: React.FC<NewsEditorProps> = ({ item, onClose }) => {
  const [formData, setFormData] = useState<Partial<News>>(
    item || {
      title: '',
      subtitle: '',
      content: '',
      categoryId: CATEGORIES[0].id,
      imageUrl: '',
      links: [],
      isFeatured: false,
      status: 'draft',
    }
  );

  const [newLink, setNewLink] = useState({ label: '', url: '' });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.title || !formData.content) return;
    
    setLoading(true);
    try {
      const data = {
        ...formData,
        updatedAt: new Date().toISOString(),
        publishedAt: formData.status === 'published' && !formData.publishedAt 
          ? new Date().toISOString() 
          : formData.publishedAt || null,
      };

      mockDb.saveNews(data);
      onClose();
    } catch (error) {
      console.error("Error saving news:", error);
    } finally {
      setLoading(false);
    }
  };

  const addLink = () => {
    if (!newLink.label || !newLink.url) return;
    setFormData({
      ...formData,
      links: [...(formData.links || []), newLink]
    });
    setNewLink({ label: '', url: '' });
  };

  const removeLink = (index: number) => {
    setFormData({
      ...formData,
      links: (formData.links || []).filter((_, i) => i !== index)
    });
  };

  return (
    <motion.div key="editor" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-white rounded-[40px] p-8 shadow-xl border border-slate-100 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-900">{item ? 'Modifier' : 'Créer'} une info</h3>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600"><X size={24} /></button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Titre</label>
          <input 
            type="text" 
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-900"
            placeholder="Titre de l'information"
          />
        </div>

        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Sous-titre (Optionnel)</label>
          <input 
            type="text" 
            value={formData.subtitle} 
            onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
            className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-600"
            placeholder="Court résumé"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Catégorie</label>
            <select 
              value={formData.categoryId} 
              onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-900 appearance-none"
            >
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Statut</label>
            <select 
              value={formData.status} 
              onChange={(e) => setFormData({...formData, status: e.target.value as NewsStatus})}
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-900 appearance-none"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
              <option value="archived">Archivé</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Contenu</label>
          <textarea 
            value={formData.content} 
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-700 min-h-[200px]"
            placeholder="Écris le contenu complet ici..."
          />
        </div>

        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Image URL (Optionnel)</label>
          <div className="relative">
            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={formData.imageUrl} 
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              className="w-full pl-11 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-600"
              placeholder="https://images.unsplash.com/..."
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Liens utiles</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Label" 
              value={newLink.label} 
              onChange={(e) => setNewLink({...newLink, label: e.target.value})}
              className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm"
            />
            <input 
              type="text" 
              placeholder="URL" 
              value={newLink.url} 
              onChange={(e) => setNewLink({...newLink, url: e.target.value})}
              className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm"
            />
            <button onClick={addLink} className="p-3 bg-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-200 transition-all">
              <Plus size={20} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.links?.map((link, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                <LinkIcon size={12} />
                <span>{link.label}</span>
                <button onClick={() => removeLink(i)} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <input 
            type="checkbox" 
            id="isFeatured" 
            checked={formData.isFeatured} 
            onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
            className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="isFeatured" className="text-sm font-bold text-slate-700">Mettre à la une</label>
        </div>

        <button 
          onClick={handleSave}
          disabled={loading || !formData.title || !formData.content}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-indigo-200 disabled:bg-slate-200 disabled:shadow-none transition-all"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
          {!loading && <CheckCircle2 size={20} />}
        </button>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
