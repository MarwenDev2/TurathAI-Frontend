import { User } from "./user";

export interface ForumComment {
  id?: number;
  content: string;
  image?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  liked: number;
  disliked: number;
  userId: number;
  user?: User;
  forumId: number;
  isEdited?: boolean;
}