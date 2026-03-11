import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs';
import { syncCitations } from './sync-citations';

vi.mock('node:fs');

describe('syncCitations', () => {
  const mockContentDir = '/test/content';
  const mockDataFile = '/test/data/citations.json';

  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  it('should find arxivIds in markdown files and fetch their counts', async () => {
    // Mock files in content directory
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readdirSync).mockReturnValue([
      'test.md',
    ] as unknown as string[]);
    vi.mocked(fs.readFileSync).mockImplementation(
      (p: fs.PathOrFileDescriptor) => {
        if (p.toString().endsWith('test.md'))
          return '---\narxivId: "123.456"\n---';
        if (p.toString().endsWith('citations.json')) return '{}';
        return '';
      }
    );

    // Mock successful fetch
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ citationCount: 42 }),
    } as Response);

    const result = await syncCitations(mockContentDir, mockDataFile, 0);

    expect(result).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('123.456'),
      expect.any(Object)
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      mockDataFile,
      expect.stringContaining('"count": 42')
    );
  });

  it('should not update if citation count has not changed', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readdirSync).mockReturnValue([
      'test.md',
    ] as unknown as string[]);
    vi.mocked(fs.readFileSync).mockImplementation(
      (p: fs.PathOrFileDescriptor) => {
        if (p.toString().endsWith('test.md')) return 'arxivId: 123';
        if (p.toString().endsWith('citations.json'))
          return JSON.stringify({
            '123': { count: 10, lastUpdated: '2024-01-01' },
          });
        return '';
      }
    );

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ citationCount: 10 }),
    } as Response);

    const result = await syncCitations(mockContentDir, mockDataFile, 0);

    expect(result).toBe(false);
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  it('should update existing citations if count increases', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readdirSync).mockReturnValue([
      'test.md',
    ] as unknown as string[]);
    vi.mocked(fs.readFileSync).mockImplementation(
      (p: fs.PathOrFileDescriptor) => {
        if (p.toString().endsWith('test.md')) return 'arxivId: 123';
        if (p.toString().endsWith('citations.json'))
          return JSON.stringify({
            '123': { count: 10, lastUpdated: '2024-01-01' },
          });
        return '';
      }
    );

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ citationCount: 15 }),
    } as Response);

    const result = await syncCitations(mockContentDir, mockDataFile, 0);

    expect(result).toBe(true);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      mockDataFile,
      expect.stringContaining('"count": 15')
    );
  });
});
