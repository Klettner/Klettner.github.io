import fs from 'node:fs';
import path from 'node:path';

const CONTENT_DIR = path.join(process.cwd(), 'src/content/achievements');
const DATA_FILE = path.join(process.cwd(), 'src/data/citations.json');

async function syncCitations() {
  const arxivIds: string[] = [];

  // 1. Get all arxivIds from content
  const files = fs.readdirSync(CONTENT_DIR);
  for (const file of files) {
    if (file.endsWith('.md')) {
      const content = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
      const match = content.match(/arxivId:\s*['"]?([^'"\n]+)['"]?/);
      if (match && match[1]) {
        arxivIds.push(match[1]);
      }
    }
  }

  if (arxivIds.length === 0) {
    console.log('No arxivIds found. Exiting.');
    return;
  }

  // 2. Load existing citations
  let citations: Record<string, { count: number; lastUpdated: string }> = {};
  if (fs.existsSync(DATA_FILE)) {
    citations = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  }

  let hasChanged = false;

  // 3. Fetch latest counts from Semantic Scholar
  for (const arxivId of arxivIds) {
    console.log(`Fetching citations for arXiv:${arxivId}...`);
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
        const data = await response.json();
        const newCount = data.citationCount ?? 0;
        const oldCount = citations[arxivId]?.count;

        if (newCount !== oldCount) {
          console.log(`Updated: ${arxivId} (${oldCount ?? 0} -> ${newCount})`);
          citations[arxivId] = {
            count: newCount,
            lastUpdated: new Date().toISOString(),
          };
          hasChanged = true;
        } else {
          console.log(`No change for ${arxivId} (${newCount})`);
        }
      } else {
        console.warn(
          `Failed to fetch for ${arxivId}: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error(`Error fetching for ${arxivId}:`, error);
    }

    // Add a small delay between requests to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // 4. Save updated citations
  if (hasChanged) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(citations, null, 2));
    console.log('Successfully updated citations.json');
  } else {
    console.log('No citation counts have changed.');
  }
}

syncCitations();
