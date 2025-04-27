import { User } from './user';
import { Site } from './site';

export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string; // Use string for Date (JSON serialization converts Date to string)
  flagged: boolean;
  user: User;
  heritageSite: Site;
}