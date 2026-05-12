export type BoardType = 'major' | 'general' | 'free' | 'sideProject';

export interface Post {
  postId: number;
  title: string;
  boardType: BoardType;
  content: string;
  fileName: string;
  linkUrl: string;
  authorId: number;
  authorNickname: string;
  createdAt: string;
}

export interface PostResponse {
  message: string;
  post?: Post;
}

export interface DeletePostRequest {
  userId: number;
}

export interface DeletePostResponse {
  message: string;
}

export interface PostSummary {
  postId: number;
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
  userId: number;
  title: string;
  content: string;
}

export interface UpdatedPost {
  postId: number;
  title: string;
  content: string;
  authorNickname: string;
  updatedAt: string;
}

export interface UpdatePostResponse {
  message: string;
  post?: UpdatedPost;
}
