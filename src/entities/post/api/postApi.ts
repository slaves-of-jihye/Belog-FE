import { apiClient } from '../../../shared/api/base';
import {
  BoardType,
  PostResponse,
  PostListResponse,
  UpdatePostRequest,
  UpdatePostResponse,
  DeletePostRequest,
  DeletePostResponse,
} from '../model/types';

export const getPostList = async (boardType: BoardType): Promise<PostListResponse> => {
  const response = await apiClient.get<PostListResponse>(`/posts/${boardType}`);
  return response.data;
};

export const createPost = async (boardType: BoardType, data: any): Promise<PostResponse> => {
  const response = await apiClient.post<PostResponse>(`/posts/${boardType}`, data);
  return response.data;
};

export const updatePost = async (postId: number, data: UpdatePostRequest): Promise<UpdatePostResponse> => {
  const response = await apiClient.patch<UpdatePostResponse>(`/posts/${postId}`, data);
  return response.data;
};

export const deletePost = async (postId: number, data: DeletePostRequest): Promise<DeletePostResponse> => {
  const response = await apiClient.delete<DeletePostResponse>(`/posts/${postId}`, { data });
  return response.data;
};
