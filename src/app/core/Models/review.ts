import { Site } from './site';
import { User } from './user';

export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string; // Use string for Date (JSON serialization converts Date to string)
  flagged: boolean;
  user: User;
  heritageSite: Site;

  selected?: boolean; // For bulk actions
  expanded?: boolean; //for showing / hiding details of a review fel timeline 
}