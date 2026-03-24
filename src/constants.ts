export const CATEGORIES = [
  { id: 'sante', name: 'Santé', icon: 'HeartPulse', color: 'bg-rose-500' },
  { id: 'activites', name: 'Activités', icon: 'Gamepad2', color: 'bg-orange-500' },
  { id: 'sport', name: 'Sport', icon: 'Trophy', color: 'bg-emerald-500' },
  { id: 'culture', name: 'Culture', icon: 'Palette', color: 'bg-indigo-500' },
  { id: 'emploi', name: 'Emploi', icon: 'Briefcase', color: 'bg-blue-500' },
  { id: 'orientation', name: 'Orientation', icon: 'Compass', color: 'bg-violet-500' },
  { id: 'aides', name: 'Aides', icon: 'HandHelping', color: 'bg-amber-500' },
  { id: 'mobilite', name: 'Mobilité', icon: 'Bus', color: 'bg-sky-500' },
  { id: 'logement', name: 'Logement', icon: 'Home', color: 'bg-teal-500' },
  { id: 'prevention', name: 'Prévention', icon: 'ShieldAlert', color: 'bg-red-500' },
  { id: 'citoyennete', name: 'Citoyenneté', icon: 'Users', color: 'bg-purple-500' },
  { id: 'evenements', name: 'Événements', icon: 'Calendar', color: 'bg-fuchsia-500' },
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
