import { Category } from './types';

export const CATEGORIES: Category[] = [
  { 
    id: 'orientation', 
    name: 'Orientation & Formation', 
    icon: 'Compass', 
    color: 'bg-violet-500',
    subcategories: ['Parcours scolaires', 'Reconversion', 'Alternance']
  },
  { 
    id: 'emploi', 
    name: 'Emploi', 
    icon: 'Briefcase', 
    color: 'bg-blue-500',
    subcategories: ['Recherche de job', 'CV', 'Stages', "Dispositifs d'insertion"]
  },
  { 
    id: 'quotidien', 
    name: 'Vie quotidienne', 
    icon: 'Coffee', 
    color: 'bg-orange-500',
    subcategories: ['Logement', 'Budget', 'Transport']
  },
  { 
    id: 'sante', 
    name: 'Santé', 
    icon: 'HeartPulse', 
    color: 'bg-rose-500',
    subcategories: ['Accès aux soins', 'Prévention', 'Bien-être']
  },
  { 
    id: 'mobilite', 
    name: 'Mobilité internationale', 
    icon: 'Globe', 
    color: 'bg-sky-500',
    subcategories: ['Erasmus+', 'Volontariat', 'Séjours à l\'étranger']
  },
  { 
    id: 'engagement', 
    name: 'Engagement', 
    icon: 'Users', 
    color: 'bg-emerald-500',
    subcategories: ['Bénévolat', 'Service civique', 'Projets citoyens']
  },
  { 
    id: 'droits', 
    name: 'Accès aux droits', 
    icon: 'Scale', 
    color: 'bg-amber-500',
    subcategories: ['Aides financières', 'Dispositifs publics']
  },
];

export const REACTION_LABELS: Record<string, string> = {
  useful: 'Utile',
  unclear: 'Pas clair',
  interested: 'Ça m’intéresse',
  more_info: 'Je veux plus d’infos',
};

export const FEEDBACK_STATUS_LABELS: Record<string, string> = {
  new: 'Nouveau',
  processed: 'Traité',
  archived: 'Archivé',
};
