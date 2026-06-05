export type BoardType = 'major' | 'general' | 'free' | 'project';

export interface Post {
  postId: string;
  title: string;
  boardType: BoardType;
  content: string;
  fileName: string | null;
  linkUrl: string | null;
  authorId: string;
  authorNickname: string;
  createdAt: string;
  updatedAt?: string | null;
  views: number;
}

export interface PostResponse {
  message: string;
  post?: Post;
}

export interface DeletePostRequest {
  userId?: string;
}

export interface DeletePostResponse {
  message: string;
}

export interface PostSummary {
  postId: string;
  title: string;
  authorNickname: string;
  views: number;
  createdAt: string;
}

export interface PostListResponse {
  message?: string;
  boardType?: BoardType;
  posts?: PostSummary[];
}

export interface UpdatePostRequest {
  userId?: string;
  title: string;
  content: string;
}

export interface UpdatedPost {
  postId: string;
  title: string;
  content: string;
  authorNickname: string;
  updatedAt: string;
}

export interface UpdatePostResponse {
  message: string;
  post?: UpdatedPost;
}
