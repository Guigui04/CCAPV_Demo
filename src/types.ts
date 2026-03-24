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
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
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
  imageUrl?: string;
  links?: NewsLink[];
  isFeatured: boolean;
  status: NewsStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
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
