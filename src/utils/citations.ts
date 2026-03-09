/**
 * Fetch the citation count for a paper using its arXiv ID.
 * Returns null if the fetch fails or the paper is not found.
 */
export async function getCitationCount(
  arxivId: string
): Promise<number | null> {
  if (!arxivId) return null;

  try {
    const response = await fetch(
      `https://api.semanticscholar.org/graph/v1/paper/arXiv:${arxivId}?fields=citationCount`,
      {
        headers: {
          Accept: 'application/json',
        },
        // Timeout after 5 seconds
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(
        `Failed to fetch citation count for arXiv:${arxivId}. Status: ${response.status} ${response.statusText}. Body: ${errorText}`
      );
      return null;
    }

    const data = await response.json();
    return data.citationCount ?? null;
  } catch (error: any) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      console.error(`Timeout fetching citation count for arXiv:${arxivId}`);
    } else {
      console.error(
        `Error fetching citation count for arXiv:${arxivId}:`,
        error.message || error
      );
    }
    return null;
  }
}
