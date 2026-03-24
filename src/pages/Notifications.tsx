import React, { useEffect, useState } from 'react';
import { Bell, Info, Calendar, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn, formatDate } from '../utils';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Alert } from '../types';

const Notifications: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'alerts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const alertsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Alert[];
      setAlerts(alertsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'event': return Calendar;
      case 'featured': return Star;
      default: return Info;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'event': return { text: 'text-emerald-500', bg: 'bg-emerald-50' };
      case 'featured': return { text: 'text-amber-500', bg: 'bg-amber-50' };
      default: return { text: 'text-blue-500', bg: 'bg-blue-50' };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Alertes</h2>
      </div>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm font-medium">Aucune alerte pour le moment !</p>
          </div>
        ) : (
          alerts.map((alert, i) => {
            const Icon = getIcon(alert.type);
            const colors = getColor(alert.type);
            
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-3xl border transition-all flex gap-4 bg-white border-slate-100 shadow-sm"
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", colors.bg, colors.text)}>
                  <Icon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold truncate text-slate-900">
                      {alert.title}
                    </h4>
                  </div>
                  <p className="text-sm text-slate-500 mb-2 leading-relaxed">
                    {alert.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {formatDate(alert.createdAt)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;
