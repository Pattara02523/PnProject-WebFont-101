import { apiFetch } from './api-fetch';

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export async function getProfileApi(): Promise<UserProfile> {
  return apiFetch<UserProfile>('/users/me', {
    method: 'GET'
  });
}

export async function updateProfileApi(
  payload: UpdateProfilePayload
): Promise<UserProfile> {
  return apiFetch<UserProfile>('/users/profile', {
    method: 'PATCH',
    body: payload as Record<string, unknown>
  });
}
