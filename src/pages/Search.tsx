import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
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
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [allNews, setAllNews] = useState<News[]>([]);
  const [results, setResults] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'news'), where('status', '==', 'published'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as News[];
      setAllNews(newsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching news:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const filtered = allNews.filter((news) => {
      const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           news.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || news.categoryId === selectedCategory;
      const matchesSubcategory = !selectedSubcategory || news.subcategoryId === selectedSubcategory;
      return matchesSearch && matchesCategory && matchesSubcategory;
    });

    setResults(filtered);
  }, [searchTerm, selectedCategory, selectedSubcategory, allNews]);

  const activeCategoryObj = CATEGORIES.find(c => c.id === selectedCategory);

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
            onClick={() => {
              if (selectedCategory === cat.id) {
                setSelectedCategory(null);
                setSelectedSubcategory(null);
              } else {
                setSelectedCategory(cat.id);
                setSelectedSubcategory(null);
              }
            }}
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

      {activeCategoryObj && activeCategoryObj.subcategories && (
        <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar -mt-2">
          <button
            onClick={() => setSelectedSubcategory(null)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all",
              !selectedSubcategory 
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
                : "bg-white text-slate-500 border border-slate-200"
            )}
          >
            Tout voir
          </button>
          {activeCategoryObj.subcategories.map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubcategory(sub)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all",
                selectedSubcategory === sub 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
                  : "bg-white text-slate-500 border border-slate-200"
              )}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
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
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Search;
