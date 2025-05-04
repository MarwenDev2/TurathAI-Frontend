import { ForumComment } from "./forumComment";
import { User } from "./user";

export interface Forum {
  id?: number;
  title: string;
  description: string;
  image?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  userId: number;
  user?: User;
  
  // Frontend-only properties
  showComments?: boolean;
  newComment?: string;
  hasErrorWord?: boolean;
  badWordError?: string;
  comments?: ForumComment[];
}