import React, { useState } from 'react';
import { useAuth } from '../components/FirebaseProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Mail, Calendar, Shield, ChevronRight, Settings, Bell, ShieldCheck, Save, CheckCircle2, ArrowLeft, Trash2 } from 'lucide-react';
import { cn, formatDate } from '../utils';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';

const Profile: React.FC = () => {
  const { profile, isAdmin, logout, refreshProfile, deleteAccount } = useAuth();
  const [activeTab, setActiveTab] = useState<'main' | 'edit' | 'notifications' | 'settings' | 'privacy'>('main');
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    postalCode: profile?.postalCode || '',
    city: profile?.city || '',
    birthDate: profile?.birthDate || '',
  });
  const [notifSettings, setNotifSettings] = useState({
    push: profile?.notificationsEnabled ?? true,
    email: profile?.emailNotificationsEnabled ?? false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (!profile) return null;

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      if (profile.uid) {
        await updateDoc(doc(db, 'users', profile.uid), {
          firstName: formData.firstName,
          lastName: formData.lastName,
          postalCode: formData.postalCode,
          city: formData.city,
          birthDate: formData.birthDate,
          updatedAt: new Date().toISOString()
        });
        
        await refreshProfile();
        toast.success('Profil mis à jour avec succès');
        setActiveTab('main');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      if (profile.uid) {
        await updateDoc(doc(db, 'users', profile.uid), {
          notificationsEnabled: notifSettings.push,
          emailNotificationsEnabled: notifSettings.email,
          updatedAt: new Date().toISOString()
        });
        
        await refreshProfile();
        toast.success('Préférences enregistrées');
        setActiveTab('main');
      }
    } catch (error) {
      console.error("Error updating notifications:", error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsSaving(false);
    }
  };

  const menuItems = [
    { id: 'notifications', icon: Bell, label: 'Notifications', color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'settings', icon: Settings, label: 'Paramètres', color: 'text-slate-500', bg: 'bg-slate-50' },
    { id: 'privacy', icon: ShieldCheck, label: 'Confidentialité', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8 pb-8">
      <AnimatePresence mode="wait">
        {activeTab === 'main' && (
          <motion.div key="main" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="text-center pt-4 relative">
              <button 
                onClick={() => setActiveTab('edit')}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white rounded-full shadow-sm"
              >
                <Settings size={20} />
              </button>
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
                      <p className="font-bold text-slate-700">
                        {formatDate(profile.birthDate)} <span className="text-slate-400 font-medium">({calculateAge(profile.birthDate)} ans)</span>
                      </p>
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
                  onClick={() => setActiveTab(item.id as any)}
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
          </motion.div>
        )}

        {activeTab === 'edit' && (
          <motion.div key="edit" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setActiveTab('main')} className="p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-indigo-600">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-black text-slate-900">Modifier le profil</h2>
            </div>

            <div className="space-y-4">
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

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Date de naissance</label>
                <input 
                  type="date" 
                  value={formData.birthDate}
                  onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                  className="w-full p-4 bg-white rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-900 shadow-sm"
                />
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
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 mt-6 disabled:opacity-70"
              >
                {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'notifications' && (
          <motion.div key="notifications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setActiveTab('main')} className="p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-indigo-600">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-black text-slate-900">Notifications</h2>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">Notifications Push</h4>
                  <p className="text-xs text-slate-500 mt-1">Recevoir des alertes sur cet appareil</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={notifSettings.push}
                    onChange={(e) => setNotifSettings({...notifSettings, push: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="h-px bg-slate-100 w-full"></div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">Emails</h4>
                  <p className="text-xs text-slate-500 mt-1">Recevoir un récapitulatif par email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={notifSettings.email}
                    onChange={(e) => setNotifSettings({...notifSettings, email: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>

            <button 
              onClick={handleSaveNotifications}
              disabled={isSaving}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 mt-6 disabled:opacity-70"
            >
              {isSaving ? "Enregistrement..." : "Enregistrer les préférences"}
            </button>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setActiveTab('main')} className="p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-indigo-600">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-black text-slate-900">Paramètres</h2>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-6 space-y-6">
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Thème de l'application</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-3 border-2 border-indigo-600 bg-indigo-50 rounded-xl font-bold text-indigo-600 text-sm">
                    Clair
                  </button>
                  <button className="p-3 border-2 border-slate-100 bg-white rounded-xl font-bold text-slate-400 text-sm hover:border-slate-200">
                    Sombre (Bientôt)
                  </button>
                </div>
              </div>

              <div className="h-px bg-slate-100 w-full"></div>

              <div>
                <h4 className="font-bold text-red-600 mb-2 flex items-center gap-2">
                  <Trash2 size={18} /> Zone de danger
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  La suppression de votre compte est définitive. Toutes vos données seront effacées.
                </p>
                <button 
                  onClick={async () => {
                    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
                      try {
                        await deleteAccount();
                        toast.success('Votre compte a été supprimé');
                      } catch (error: any) {
                        if (error.code === 'auth/requires-recent-login') {
                          toast.error('Veuillez vous déconnecter et vous reconnecter pour supprimer votre compte');
                        } else {
                          toast.error('Erreur lors de la suppression du compte');
                        }
                      }
                    }
                  }}
                  className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
                >
                  Supprimer mon compte
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'privacy' && (
          <motion.div key="privacy" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setActiveTab('main')} className="p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-indigo-600">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-black text-slate-900">Confidentialité</h2>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-6 space-y-6">
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Politique de confidentialité</h4>
                <p className="text-sm text-slate-600 mb-4">
                  Vos données personnelles sont traitées dans le respect du RGPD. Nous ne partageons pas vos informations avec des tiers sans votre consentement.
                </p>
                <button className="text-indigo-600 font-bold text-sm hover:underline">
                  Lire la politique complète
                </button>
              </div>

              <div className="h-px bg-slate-100 w-full"></div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Vos données</h4>
                <p className="text-sm text-slate-600 mb-4">
                  Vous pouvez demander une copie de vos données personnelles stockées sur notre plateforme.
                </p>
                <button 
                  onClick={() => toast.success('Votre demande a été envoyée. Vous recevrez un email prochainement.')}
                  className="py-2 px-4 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  Demander mes données
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
