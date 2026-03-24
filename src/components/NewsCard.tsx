import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { News } from '../types';
import { CATEGORIES } from '../constants';
import { cn, formatDate } from '../utils';

interface NewsCardProps {
  news: News;
  onClick: (news: News) => void;
  featured?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, onClick, featured = false }) => {
  const category = CATEGORIES.find(c => c.id === news.categoryId);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(news)}
      className={cn(
        "group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/60 cursor-pointer transition-all hover:shadow-md",
        featured ? "aspect-[4/5]" : "aspect-[16/9]"
      )}
    >
      {news.imageUrl ? (
        <img
          src={news.imageUrl}
          alt={news.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className={cn("absolute inset-0", category?.color || "bg-slate-200")} />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
            category?.color || "bg-slate-500"
          )}>
            {category?.name || 'Info'}
          </span>
          {news.isFeatured && (
            <span className="bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              À la une
            </span>
          )}
        </div>
        
        <h3 className={cn(
          "font-bold leading-tight mb-1",
          featured ? "text-xl" : "text-lg"
        )}>
          {news.title}
        </h3>
        
        {featured && news.subtitle && (
          <p className="text-white/80 text-sm line-clamp-2 mb-3">
            {news.subtitle}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5 text-white/70 text-[11px] font-medium">
            <Calendar size={12} />
            <span>{formatDate(news.publishedAt || news.createdAt)}</span>
          </div>
          <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-full group-hover:bg-white group-hover:text-indigo-600 transition-colors">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;
