import { apiClient } from './base';
import { CreateDeadlineRequest, Deadline } from '../../entities/deadline/model/types';

export const deadlineService = {
  async getAll(): Promise<Deadline[]> {
    const response = await apiClient.get<Deadline[]>('/deadlines');
    return response.data;
  },

  async getUpcoming(days = 3): Promise<Deadline[]> {
    const response = await apiClient.get<Deadline[]>(`/deadlines/upcoming?days=${days}`);
    return response.data;
  },

  async create(data: CreateDeadlineRequest): Promise<Deadline> {
    const response = await apiClient.post<Deadline>('/deadlines', data);
    return response.data;
  },

  async toggleComplete(id: string): Promise<Deadline> {
    const response = await apiClient.patch<Deadline>(`/deadlines/${id}/complete`);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/deadlines/${id}`);
  },
};
