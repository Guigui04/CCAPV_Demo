
import { UserProfile } from './types';

// Mock User type to match Firebase User enough for our needs
export interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// Local storage keys
const AUTH_KEY = 'demo_auth_user';
const USERS_KEY = 'demo_users';
const NEWS_KEY = 'demo_news';
const FEEDBACK_KEY = 'demo_feedback';

// Initial data
const initialNews = [
  {
    id: '1',
    title: 'Nouveau : Le Pass Jeunes est arrivé !',
    content: 'Profitez de réductions exclusives sur les transports et les loisirs avec le nouveau Pass Jeunes. Disponible dès maintenant pour tous les résidents de moins de 25 ans.',
    categoryId: 'news',
    status: 'published',
    createdAt: new Date().toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    summary: 'Réductions exclusives pour les moins de 25 ans.'
  },
  {
    id: '2',
    title: 'Forum des métiers le 15 Avril',
    content: 'Venez rencontrer des professionnels de tous secteurs au gymnase municipal. Des ateliers CV et lettres de motivation seront également proposés.',
    categoryId: 'events',
    status: 'published',
    createdAt: new Date().toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800',
    summary: 'Rencontrez des pros et boostez votre carrière.'
  },
  {
    id: '3',
    title: 'Aide au logement : ce qu\'il faut savoir',
    content: 'Les critères d\'attribution des aides au logement évoluent. Consultez notre guide complet pour savoir si vous êtes éligible et comment faire votre demande.',
    categoryId: 'tips',
    status: 'published',
    createdAt: new Date().toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
    summary: 'Guide complet sur les nouvelles aides au logement.'
  }
];

// Helper to get data from localStorage
const getLocal = (key: string, fallback: any) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
};

// Helper to save data to localStorage
const saveLocal = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Mock Auth State
let authStateListeners: ((user: MockUser | null) => void)[] = [];

export const mockAuth = {
  currentUser: getLocal(AUTH_KEY, null),
  onAuthStateChanged: (callback: (user: MockUser | null) => void) => {
    authStateListeners.push(callback);
    // Initial call
    setTimeout(() => callback(mockAuth.currentUser), 100);
    return () => {
      authStateListeners = authStateListeners.filter(l => l !== callback);
    };
  },
  signIn: (email: string, profile: any) => {
    const user = { uid: email.replace(/[^a-zA-Z0-9]/g, ''), email, displayName: `${profile.firstName} ${profile.lastName}` };
    mockAuth.currentUser = user;
    saveLocal(AUTH_KEY, user);
    
    // Save profile
    const users = getLocal(USERS_KEY, {});
    users[user.uid] = { ...profile, email, uid: user.uid };
    saveLocal(USERS_KEY, users);
    
    authStateListeners.forEach(l => l(user));
    return user;
  },
  signOut: () => {
    mockAuth.currentUser = null;
    localStorage.removeItem(AUTH_KEY);
    authStateListeners.forEach(l => l(null));
  }
};

// Mock Firestore
export const mockDb = {
  getProfile: (uid: string) => {
    const users = getLocal(USERS_KEY, {});
    return users[uid] || null;
  },
  getNews: () => {
    return getLocal(NEWS_KEY, initialNews);
  },
  saveNews: (news: any) => {
    const allNews = getLocal(NEWS_KEY, initialNews);
    const index = allNews.findIndex((n: any) => n.id === news.id);
    if (index >= 0) {
      allNews[index] = news;
    } else {
      allNews.push({ ...news, id: Math.random().toString(36).substr(2, 9) });
    }
    saveLocal(NEWS_KEY, allNews);
  },
  deleteNews: (id: string) => {
    const allNews = getLocal(NEWS_KEY, initialNews);
    const filtered = allNews.filter((n: any) => n.id !== id);
    saveLocal(NEWS_KEY, filtered);
  }
};
