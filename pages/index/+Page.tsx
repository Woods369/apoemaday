import { useEffect, useRef, useState } from 'react';
import BookButton from '../../components/BookButton';
import { getPoemOfTheDay, prefetchTitlesIdle, Poem } from '../../lib/poetry';

function PoemView({ poem }: { poem: Poem }) {
  return (
    <div className="poem-wrap">
      <div className="poem-card">
        <h1 className="poem-title">{poem.title}</h1>
        <div className="poem-author">by {poem.author}</div>
        <div className="poem-lines">
          {poem.lines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [poem, setPoem] = useState<Poem | null>(null);
  const [opening, setOpening] = useState(false);
  const [loading, setLoading] = useState(false);
  const openTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    prefetchTitlesIdle();
    return () => {
      if (openTimer.current) clearTimeout(openTimer.current);
    };
  }, []);

  async function handleGenerate() {
    if (loading) return;
    setOpening(true);
    setLoading(true);
    try {
      const p = await getPoemOfTheDay();
      setPoem(p);
    } finally {
      setLoading(false);
      openTimer.current = setTimeout(() => setOpening(false), 950);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start pt-6 pb-40 sm:pb-48 px-3 sm:px-6">
      {!poem && (
        <p className="text-gray-500 text-sm mb-3">
          Tap the book to open today's poem
        </p>
      )}
      {poem && <PoemView poem={poem} />}
      <BookButton
        onClick={handleGenerate}
        opening={opening}
        disabled={loading}
        label="Generate today's poem"
      />
    </main>
  );
}
