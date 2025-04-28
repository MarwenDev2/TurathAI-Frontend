import { User } from './user';
import { Site } from './site';

export interface Wishlist {
  id: number;
  createdAt: string;
  user: User;
  heritageSite: Site;
}