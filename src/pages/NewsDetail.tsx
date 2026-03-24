import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, Send, CheckCircle2 } from 'lucide-react';
import { News, ReactionType } from '../types';
import { CATEGORIES, REACTION_LABELS } from '../constants';
import { cn, formatDate } from '../utils';
import { useAuth } from '../components/FirebaseProvider';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

interface NewsDetailProps {
  news: News;
  onBack: () => void;
}

const NewsDetail: React.FC<NewsDetailProps> = ({ news, onBack }) => {
  const { profile } = useAuth();
  const [reaction, setReaction] = useState<ReactionType | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const category = CATEGORIES.find(c => c.id === news.categoryId);

  const handleSubmitFeedback = async () => {
    if (!profile || !reaction) return;
    
    setIsSubmitting(true);
    try {
      const newFeedback = {
        newsId: news.id,
        newsTitle: news.title,
        userId: profile.uid,
        userName: `${profile.firstName} ${profile.lastName}`,
        userEmail: profile.email,
        reactionType: reaction,
        comment: comment,
        status: 'new',
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'feedback'), newFeedback);
      
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error sending feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen -mx-4 -mt-6 pb-24 relative z-50">
      <div className="relative h-72">
        {news.imageUrl ? (
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className={cn("w-full h-full", category?.color || "bg-slate-200")} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button
          onClick={onBack}
          className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="px-6 -mt-12 relative z-10 bg-white rounded-t-[40px] pt-8 pb-12">
        <div className="flex items-center gap-2 mb-4">
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white",
            category?.color || "bg-slate-500"
          )}>
            {category?.name || 'Info'}
          </span>
          <span className="text-slate-400 text-xs font-medium flex items-center gap-1">
            Publié le {formatDate(news.publishedAt || news.createdAt)}
          </span>
        </div>

        <h1 className="text-3xl font-black text-slate-900 leading-tight mb-2">
          {news.title}
        </h1>
        
        {news.subtitle && (
          <p className="text-lg font-medium text-slate-500 mb-6 leading-relaxed">
            {news.subtitle}
          </p>
        )}

        <div className="prose prose-slate max-w-none mb-8">
          {news.content.split('\n').map((para, i) => (
            <p key={i} className="text-slate-600 leading-relaxed mb-4">
              {para}
            </p>
          ))}
        </div>

        {news.links && news.links.length > 0 && (
          <div className="space-y-3 mb-12">
            {news.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-indigo-50 hover:border-indigo-100 transition-all"
              >
                <span className="font-bold text-slate-700 group-hover:text-indigo-700">{link.label}</span>
                <ExternalLink size={18} className="text-slate-400 group-hover:text-indigo-500" />
              </a>
            ))}
          </div>
        )}

        <div className="border-t border-slate-100 pt-10">
          <h3 className="text-xl font-black text-slate-900 mb-2">Cette info t'a été utile ?</h3>
          <p className="text-slate-500 text-sm mb-6">
            Ton avis est privé. Seule l'équipe de la communauté de communes peut le consulter.
          </p>

          {!isSubmitted ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(REACTION_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setReaction(key as ReactionType)}
                    className={cn(
                      "p-3 rounded-2xl border-2 text-sm font-bold transition-all",
                      reaction === key 
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200" 
                        : "bg-white border-slate-100 text-slate-600 hover:border-indigo-200"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Une question ? Un commentaire ? (Optionnel)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all min-h-[120px]"
              />

              <button
                onClick={handleSubmitFeedback}
                disabled={!reaction || isSubmitting}
                className={cn(
                  "w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-xl",
                  !reaction || isSubmitting
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"
                )}
              >
                {isSubmitting ? "Envoi en cours..." : "Envoyer mon retour"}
                {!isSubmitting && <Send size={20} />}
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl text-center"
            >
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-xl font-black text-emerald-900 mb-2">Merci !</h4>
              <p className="text-emerald-700 font-medium">
                Ton retour a bien été envoyé à l'équipe.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
