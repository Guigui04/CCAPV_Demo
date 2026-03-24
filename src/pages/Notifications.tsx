import React from 'react';
import { Bell, Info, Calendar, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils';

const Notifications: React.FC = () => {
  const notifications = [
    {
      id: '1',
      type: 'info',
      title: 'Nouveau dispositif Mobilité',
      message: 'La communauté de communes lance une aide au permis de conduire pour les 18-25 ans.',
      time: 'Il y a 2h',
      read: false,
      icon: Info,
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    {
      id: '2',
      type: 'event',
      title: 'Forum Emploi Jeunes',
      message: 'Rendez-vous samedi prochain à la salle des fêtes pour rencontrer les entreprises locales.',
      time: 'Hier',
      read: true,
      icon: Calendar,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50'
    },
    {
      id: '3',
      type: 'featured',
      title: 'À ne pas manquer',
      message: 'Les inscriptions pour les ateliers culturels d’été sont ouvertes !',
      time: 'Il y a 2 jours',
      read: true,
      icon: Star,
      color: 'text-amber-500',
      bg: 'bg-amber-50'
    }
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Alertes</h2>
        <button className="text-indigo-600 text-xs font-bold uppercase tracking-wider">Tout marquer lu</button>
      </div>

      <div className="space-y-3">
        {notifications.map((notif, i) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "p-4 rounded-3xl border transition-all flex gap-4 group cursor-pointer",
              notif.read ? "bg-white border-slate-100" : "bg-indigo-50/30 border-indigo-100 shadow-sm ring-1 ring-indigo-100"
            )}
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", notif.bg, notif.color)}>
              <notif.icon size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className={cn("font-bold truncate", notif.read ? "text-slate-700" : "text-slate-900")}>
                  {notif.title}
                </h4>
                {!notif.read && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
              </div>
              <p className="text-sm text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                {notif.message}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{notif.time}</span>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center py-12">
        <p className="text-slate-400 text-sm font-medium">C'est tout pour le moment !</p>
      </div>
    </div>
  );
};

export default Notifications;
