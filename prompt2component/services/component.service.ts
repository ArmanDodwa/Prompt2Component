import {authenticatedFetch} from './auth.service';

export interface GeneratePayload {
  prompt: string;
}

export interface GenerateResponse {
  node?: string | null;
  code?: string;
  fileName?: string;
  isValid?: boolean;
  iterationCount?: number;
  explanation?: string;
  dependencies?: string[];
  errors?: string[];
  status?: string;
  message?: string;
  error?: boolean;
}

export async function generateComponentCode(
  payload: GeneratePayload,
  token?: string,
  onProgress?: (data: GenerateResponse) => void
): Promise<GenerateResponse> {
  const baseUrl =
    process.env.BACKEND_API_BASE_URL || 'http://localhost:5001/api';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }


  const response = await authenticatedFetch(`${baseUrl}/components/generate`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed with status ${response.status}: ${errorText}`);
  }

  if (!response.body) {
    throw new Error('Streaming response body not supported by the environment.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let latestState: GenerateResponse = {};
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n\n');
    
    // Keep trailing incomplete segment in buffer
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;

      const rawData = trimmed.replace(/^data:\s*/, '').trim();
      if (rawData === '[DONE]') break;

      try {
        const parsed: GenerateResponse = JSON.parse(rawData);
        
        if (parsed.error) {
          throw new Error(parsed.message || 'Error occurred during generation.');
        }

        latestState = { ...latestState, ...parsed };

        if (onProgress) {
          onProgress(latestState);
        }
      } catch (err) {
        if (err instanceof SyntaxError) {
          // Chunk was split midway through JSON, will resolve on next read
          continue;
        }
        throw err;
      }
    }
  }

  return latestState;
}