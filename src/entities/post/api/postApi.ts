import { apiClient } from '../../../shared/api/base';
import {
  BoardType,
  PostResponse,
  PostListResponse,
  UpdatePostRequest,
  UpdatePostResponse,
  DeletePostRequest,
  DeletePostResponse,
  Post,
  PostSummary,
} from '../model/types';

export const getPostList = async (boardType: BoardType): Promise<PostListResponse> => {
  const response = await apiClient.get<PostListResponse>(`/posts/${boardType}`);
  return response.data;
};

export const createPost = async (boardType: BoardType, data: any): Promise<PostResponse> => {
  const response = await apiClient.post<PostResponse>(`/posts/${boardType}`, data);
  return response.data;
};

export const getPostDetail = async (postId: string): Promise<Post> => {
  const response = await apiClient.get<{ post: Post }>(`/posts/detail/${postId}`);
  return response.data.post;
};

export const getMyPosts = async (): Promise<PostSummary[]> => {
  const response = await apiClient.get<{ posts: PostSummary[] }>('/posts/me');
  return response.data.posts;
};

export const updatePost = async (postId: string, data: UpdatePostRequest): Promise<UpdatePostResponse> => {
  const response = await apiClient.patch<UpdatePostResponse>(`/posts/${postId}`, data);
  return response.data;
};

export const deletePost = async (postId: string, data?: DeletePostRequest): Promise<DeletePostResponse> => {
  const response = await apiClient.delete<DeletePostResponse>(`/posts/${postId}`, { data });
  return response.data;
};
