import { User } from './user';

import { ForumComment } from './forumComment';

export interface Forum {
  id?: number;
  title: string;
  description: string;
  image?: string;
  createdAt?: Date;
  user?: User;
  showComments?: boolean;
  newComment?: string;
  comments?: ForumComment[];
}
export type Comment = ForumComment;


