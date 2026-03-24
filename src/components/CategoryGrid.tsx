import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { CATEGORIES } from '../constants';
import { cn } from '../utils';

interface CategoryGridProps {
  onSelect: (categoryId: string) => void;
  selectedId?: string;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelect, selectedId }) => {
  return (
    <div className="grid grid-cols-4 gap-3 mb-8">
      {CATEGORIES.map((category) => {
        const Icon = (Icons as any)[category.icon];
        const isActive = selectedId === category.id;
        
        return (
          <motion.button
            key={category.id}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(category.id)}
            className="flex flex-col items-center gap-2"
          >
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm",
              isActive ? "ring-2 ring-indigo-600 ring-offset-2" : "",
              category.color,
              "text-white"
            )}>
              <Icon size={24} strokeWidth={2.5} />
            </div>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-tight text-center leading-tight",
              isActive ? "text-indigo-600" : "text-slate-500"
            )}>
              {category.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default CategoryGrid;
