import { describe, it, expect, vi, beforeEach } from 'vitest';
import { aiService } from './ai-service';

// Mock global fetch
const fetchMock = vi.fn();
global.fetch = fetchMock;

// Mock environment variables
vi.stubGlobal('import.meta', {
  env: {
    VITE_AI_API_KEY: 'test-api-key',
    VITE_AI_API_URL: 'https://api.test/chat/completions'
  }
});

describe('AI Service', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('should generate content successfully', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: 'Ini adalah konten blog yang digenerate oleh AI.'
          }
        }
      ]
    };

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await aiService.generateContent({
      type: 'blog',
      prompt: 'Topik test',
      tone: 'formal',
      length: 'short'
    }, { apiKey: 'test-key', apiUrl: 'https://api.test/chat/completions' });

    expect(result).toBe('Ini adalah konten blog yang digenerate oleh AI.');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('https://api.test/chat/completions', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-key'
      }),
      body: expect.stringContaining('"role":"system"')
    }));
  });

  it('should handle API errors', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({ error: { message: 'Server busy' } })
    });

    await expect(aiService.generateContent({
      type: 'blog',
      prompt: 'Fail test'
    }, { apiKey: 'test-key', apiUrl: 'https://api.test/chat/completions' })).rejects.toThrow('AI Service Error: 500 Server busy');
  });

  it('should clean up markdown from output', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: '**Judul**\n\nIsi konten dengan **bold**.'
          }
        }
      ]
    };

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await aiService.generateContent({
      type: 'blog',
      prompt: 'Markdown test'
    }, { apiKey: 'test-key', apiUrl: 'https://api.test/chat/completions' });

    expect(result).toBe('Judul\n\nIsi konten dengan bold.');
  });
});
