import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_CONTENT_DIR = path.join(
  process.cwd(),
  'src/content/achievements'
);
const DEFAULT_DATA_FILE = path.join(process.cwd(), 'src/data/citations.json');

/**
 * Syncs citation counts from Semantic Scholar to a local JSON file.
 * @param contentDir Directory where markdown files with arxivId are located.
 * @param dataFile Path to the JSON file where results should be stored.
 * @param delayMs Delay between API requests (to avoid rate limits).
 */
export async function syncCitations(
  contentDir = DEFAULT_CONTENT_DIR,
  dataFile = DEFAULT_DATA_FILE,
  delayMs = 1000
) {
  const arxivIds: string[] = [];

  // 1. Get all arxivIds from content
  if (!fs.existsSync(contentDir)) {
    console.log(`Content directory ${contentDir} does not exist.`);
    return;
  }

  const files = fs.readdirSync(contentDir);
  for (const file of files) {
    if (file.endsWith('.md')) {
      const content = fs.readFileSync(path.join(contentDir, file), 'utf-8');
      const match = content.match(/arxivId:\s*['"]?([^'"\n]+)['"]?/);
      if (match && match[1]) {
        arxivIds.push(match[1]);
      }
    }
  }

  if (arxivIds.length === 0) {
    console.log('No arxivIds found.');
    return;
  }

  // 2. Load existing citations
  let citations: Record<string, { count: number; lastUpdated: string }> = {};
  if (fs.existsSync(dataFile)) {
    try {
      citations = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    } catch {
      console.warn(`Failed to parse ${dataFile}, starting fresh.`);
    }
  }

  let hasChanged = false;

  // 3. Fetch latest counts from Semantic Scholar
  for (const arxivId of arxivIds) {
    try {
      const response = await fetch(
        `https://api.semanticscholar.org/graph/v1/paper/arXiv:${arxivId}?fields=citationCount`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await (response.json() as Promise<{
          citationCount?: number;
        }>);
        const newCount = data.citationCount ?? 0;
        const oldCount = citations[arxivId]?.count;

        if (newCount !== oldCount) {
          citations[arxivId] = {
            count: newCount,
            lastUpdated: new Date().toISOString(),
          };
          hasChanged = true;
        }
      }
    } catch (error) {
      console.error(`Error fetching for ${arxivId}:`, error);
    }

    // Add a delay between requests to avoid rate limiting
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  // 4. Save updated citations
  if (hasChanged) {
    const dir = path.dirname(dataFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFile, JSON.stringify(citations, null, 2));
  }

  return hasChanged;
}

// Check if this script is being run directly
const scriptPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
const thisPath = path.resolve(new URL(import.meta.url).pathname);

if (scriptPath === thisPath) {
  syncCitations().catch(console.error);
}
