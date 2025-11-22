export type Poem = {
  title: string;
  author: string;
  lines: string[];
  linecount?: number | string;
};

const TITLES_URL = 'https://poetrydb.org/title';
const TITLE_DETAILS_PREFIX = 'https://poetrydb.org/title/';

let cachedTitles: string[] | null = null;
let titlesFetchInFlight: Promise<string[]> | null = null;

function dateKeyUTC(d?: Date) {
  const now = d || new Date();
  return now.toISOString().slice(0, 10);
}

function hashString32(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export async function fetchAllTitles(): Promise<string[]> {
  if (cachedTitles) return cachedTitles;
  if (titlesFetchInFlight) return titlesFetchInFlight;

  titlesFetchInFlight = fetch(TITLES_URL)
    .then(async (r) => {
      if (!r.ok) throw new Error('Failed to fetch titles');
      const data = await r.json();
      const list = Array.isArray(data?.titles) ? data.titles : [];
      if (!Array.isArray(list) || list.length === 0) throw new Error('No titles found');
      cachedTitles = list;
      return list;
    })
    .finally(() => {
      titlesFetchInFlight = null;
    });

  return titlesFetchInFlight;
}

export function pickTitleForDate(titles: string[], d?: Date) {
  const key = dateKeyUTC(d) + ':apoemaday';
  const idx = hashString32(key) % titles.length;
  return titles[idx];
}

export async function fetchPoemByTitle(title: string): Promise<Poem> {
  const url = TITLE_DETAILS_PREFIX + encodeURIComponent(title);
  const r = await fetch(url);
  if (!r.ok) throw new Error('Failed to fetch poem');
  const arr = await r.json();
  const first = Array.isArray(arr) && arr.length > 0 ? arr[0] : null;
  if (!first) throw new Error('Poem not found');
  return {
    title: first.title,
    author: first.author,
    lines: first.lines || [],
    linecount: first.linecount
  };
}

export async function getPoemOfTheDay(): Promise<Poem> {
  const key = 'apoemaday:' + dateKeyUTC();
  try {
    if (typeof window !== 'undefined') {
      const cached = window.localStorage.getItem(key);
      if (cached) return JSON.parse(cached);
    }
  } catch {}

  try {
    const titles = await fetchAllTitles();
    const title = pickTitleForDate(titles);
    const poem = await fetchPoemByTitle(title);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(poem));
      }
    } catch {}
    return poem;
  } catch (e) {
    const r = await fetch('https://poetrydb.org/random/1');
    if (!r.ok) throw e;
    const arr = await r.json();
    const first = Array.isArray(arr) && arr.length > 0 ? arr[0] : null;
    if (!first) throw e;
    return {
      title: first.title,
      author: first.author,
      lines: first.lines || [],
      linecount: first.linecount
    };
  }
}

export function prefetchTitlesIdle() {
  const schedule = typeof window !== 'undefined' && 'requestIdleCallback' in window
    ? (cb: () => void) => (window as any).requestIdleCallback(cb, { timeout: 1500 })
    : (cb: () => void) => setTimeout(cb, 300);

  schedule(() => { fetchAllTitles().catch(() => {}); });
}
