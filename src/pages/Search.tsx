import React, { useState, useEffect } from 'react';
import { mockDb } from '../mockFirebase';
import { News } from '../types';
import NewsCard from '../components/NewsCard';
import { Search as SearchIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES } from '../constants';
import { cn } from '../utils';

interface SearchProps {
  onNewsClick: (news: News) => void;
}

const Search: React.FC<SearchProps> = ({ onNewsClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [results, setResults] = useState<News[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const allNews = mockDb.getNews();
    
    const filtered = allNews.filter((news: any) => {
      const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           news.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || news.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    setResults(filtered);
    setLoading(false);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-6 pb-8">
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Rechercher un sujet, une aide..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium shadow-sm"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border",
            !selectedCategory 
              ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" 
              : "bg-white border-slate-200 text-slate-500 hover:border-indigo-200"
          )}
        >
          Tout
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border",
              selectedCategory === cat.id 
                ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" 
                : "bg-white border-slate-200 text-slate-500 hover:border-indigo-200"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {results.length > 0 ? (
            results.map((news) => (
              <motion.div
                key={news.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <NewsCard news={news} onClick={onNewsClick} />
              </motion.div>
            ))
          ) : (
            !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-[40px] border border-slate-100 shadow-sm"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                  <SearchIcon size={32} />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-1">Aucun résultat</h4>
                <p className="text-slate-500 font-medium">Essaie d'autres mots-clés ou catégories.</p>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Search;
