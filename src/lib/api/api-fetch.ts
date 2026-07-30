import { ApiError } from './api-error';

export type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  body?: Record<string, unknown> | FormData;
  token?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { body, headers, token, ...init } = options;

  const newHeaders = new Headers(headers);
  let activeToken = token;
  if (!activeToken && typeof window !== 'undefined') {
    const Cookies = require('js-cookie');
    activeToken = Cookies.get('auth_token');
  }
  
  if (activeToken) {
    newHeaders.set('Authorization', `Bearer ${activeToken}`);
  }

  if (body !== undefined && !(body instanceof FormData)) {
    newHeaders.set('Content-Type', 'application/json');
  }

  let newBody = undefined;
  if (body !== undefined) {
    if (body instanceof FormData) {
      newBody = body;
    } else {
      newBody = JSON.stringify(body);
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    body: newBody,
    headers: newHeaders
  });

  if (!response.ok) {
    let errorMessage = 'Something went wrong';
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorMessage;
    } catch (_) {
      // ignore
    }
    throw new ApiError(response.status, errorMessage);
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}
