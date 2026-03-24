import React, { useState } from 'react';
import { useAuth } from '../components/FirebaseProvider';
import { motion } from 'framer-motion';
import { LogOut, User, Mail, Calendar, Shield, ChevronRight, Settings, Bell, ShieldCheck, Save, CheckCircle2 } from 'lucide-react';
import { cn, formatDate } from '../utils';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const Profile: React.FC = () => {
  const { profile, isAdmin, logout, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    postalCode: profile?.postalCode || '',
    city: profile?.city || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleLogout = () => {
    logout();
  };

  if (!profile) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      if (profile.uid) {
        await updateDoc(doc(db, 'users', profile.uid), {
          firstName: formData.firstName,
          lastName: formData.lastName,
          postalCode: formData.postalCode,
          city: formData.city,
          updatedAt: new Date().toISOString()
        });
        
        await refreshProfile();
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          setIsEditing(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const menuItems = [
    { icon: Bell, label: 'Notifications', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: Settings, label: 'Paramètres', color: 'text-slate-500', bg: 'bg-slate-50' },
    { icon: ShieldCheck, label: 'Confidentialité', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8 pb-8">
      <div className="text-center pt-4 relative">
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white rounded-full shadow-sm"
        >
          <Settings size={20} />
        </button>
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4 border-4 border-white shadow-lg">
          <User size={48} strokeWidth={1.5} />
        </div>
        {!isEditing ? (
          <>
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
          </>
        ) : (
          <div className="space-y-4 mt-4 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Prénom</label>
                <input 
                  type="text" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full p-4 bg-white rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-900 shadow-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Nom</label>
                <input 
                  type="text" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full p-4 bg-white rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-900 shadow-sm"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Code postal</label>
                <input 
                  type="text" 
                  value={formData.postalCode}
                  onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                  className="w-full p-4 bg-white rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-900 shadow-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Ville</label>
                <input 
                  type="text" 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full p-4 bg-white rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-900 shadow-sm"
                />
              </div>
            </div>

            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={cn(
                "w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-xl mt-6",
                saveSuccess 
                  ? "bg-emerald-500 text-white shadow-emerald-200" 
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200",
                isSaving && "opacity-70 cursor-not-allowed"
              )}
            >
              {isSaving ? (
                "Enregistrement..."
              ) : saveSuccess ? (
                <>Enregistré <CheckCircle2 size={20} /></>
              ) : (
                <>Enregistrer <Save size={20} /></>
              )}
            </button>
          </div>
        )}
      </div>

      {!isEditing && (
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
      )}

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
