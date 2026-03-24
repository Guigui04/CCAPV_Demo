export type Role = 'user' | 'admin';
export type NewsStatus = 'draft' | 'published' | 'archived';
export type FeedbackStatus = 'new' | 'processed' | 'archived';
export type ReactionType = 'useful' | 'unclear' | 'interested' | 'more_info';

export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  birthDate?: string;
  postalCode?: string;
  city?: string;
  notificationsEnabled?: boolean;
  emailNotificationsEnabled?: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  subcategories?: string[];
}

export interface NewsLink {
  label: string;
  url: string;
}

export interface News {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  categoryId: string;
  subcategoryId?: string;
  imageUrl?: string;
  links?: NewsLink[];
  isFeatured: boolean;
  status: NewsStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'event' | 'featured';
  createdAt: string;
}

export interface Feedback {
  id: string;
  newsId: string;
  userId: string;
  userName: string;
  userEmail: string;
  reactionType: ReactionType;
  comment: string;
  status: FeedbackStatus;
  createdAt: string;
}
