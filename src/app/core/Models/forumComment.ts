import { Forum } from './forum';
import { User } from './user';


export interface ForumComment {
  id?: number;
  content: string;
  image?: string;
  createdAt?: Date;
  liked?: number;
  disliked?: number;
  userId?: number;
  forumId: number;
}

