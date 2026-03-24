import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { News } from '../types';
import NewsCard from '../components/NewsCard';
import CategoryGrid from '../components/CategoryGrid';

interface HomeProps {
  onNewsClick: (news: News) => void;
}

const Home: React.FC<HomeProps> = ({ onNewsClick }) => {
  const [featuredNews, setFeaturedNews] = useState<News[]>([]);
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'news'),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as News[];
      
      setLatestNews(newsData);
      setFeaturedNews(newsData.filter(n => n.isFeatured).slice(0, 3));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching news:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredNews = selectedCategory 
    ? latestNews.filter(n => n.categoryId === selectedCategory)
    : latestNews;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">À la une</h2>
          <button className="text-indigo-600 text-sm font-bold uppercase tracking-wider">Voir tout</button>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x no-scrollbar">
          {featuredNews.length > 0 ? (
            featuredNews.map((news) => (
              <div key={news.id} className="min-w-[280px] snap-center">
                <NewsCard news={news} onClick={onNewsClick} featured />
              </div>
            ))
          ) : (
            <div className="w-full h-48 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 font-medium">
              Aucune actualité à la une
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-4">Catégories</h2>
        <CategoryGrid 
          onSelect={(id) => setSelectedCategory(id === selectedCategory ? null : id)} 
          selectedId={selectedCategory || undefined}
        />
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {selectedCategory ? 'Résultats' : 'Dernières infos'}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {filteredNews.length > 0 ? (
            filteredNews.map((news) => (
              <NewsCard key={news.id} news={news} onClick={onNewsClick} />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
              <p className="text-slate-400 font-medium">Aucune information trouvée</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
