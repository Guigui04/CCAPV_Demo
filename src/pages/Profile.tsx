import React from 'react';
import { useAuth } from '../components/FirebaseProvider';
import { motion } from 'framer-motion';
import { LogOut, User, Mail, Calendar, Shield, ChevronRight, Settings, Bell, ShieldCheck } from 'lucide-react';
import { cn, formatDate } from '../utils';

const Profile: React.FC = () => {
  const { profile, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (!profile) return null;

  const menuItems = [
    { icon: Bell, label: 'Notifications', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: Settings, label: 'Paramètres', color: 'text-slate-500', bg: 'bg-slate-50' },
    { icon: ShieldCheck, label: 'Confidentialité', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8 pb-8">
      <div className="text-center pt-4">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4 border-4 border-white shadow-lg">
          <User size={48} strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {profile.firstName} {profile.lastName}
        </h2>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
            isAdmin ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
          )}>
            {isAdmin ? 'Administrateur' : 'Utilisateur Jeune'}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email</p>
              <p className="font-bold text-slate-700">{profile.email}</p>
            </div>
          </div>
          
          {profile.birthDate && (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date de naissance</p>
                <p className="font-bold text-slate-700">{formatDate(profile.birthDate)}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rôle</p>
              <p className="font-bold text-slate-700">{isAdmin ? 'Admin CC' : 'Jeune 11-30 ans'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {menuItems.map((item, i) => (
          <button
            key={i}
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.bg, item.color)}>
                <item.icon size={20} />
              </div>
              <span className="font-bold text-slate-700">{item.label}</span>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
          </button>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="w-full py-4 bg-white text-red-500 rounded-2xl font-black text-lg flex items-center justify-center gap-2 border-2 border-red-50 hover:bg-red-50 transition-all"
      >
        Se déconnecter
        <LogOut size={20} />
      </button>

      <p className="text-center text-slate-400 text-[10px] font-medium uppercase tracking-widest">
        Version 1.0.0 • Communauté de Communes
      </p>
    </div>
  );
};

export default Profile;
