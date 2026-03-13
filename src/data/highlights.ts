export async function fetchHighlights() {
  try {
    const response = await fetch('https://api.chsmc.workers.dev/highlights-feed');
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    return [];
  }
}
