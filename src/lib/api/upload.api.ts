import { apiFetch } from './api-fetch';

export interface UploadResponse {
  url: string;
  publicId: string;
}

export async function uploadAvatarApi(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  return apiFetch<UploadResponse>('/upload/avatar', {
    method: 'POST',
    body: formData
  });
}
