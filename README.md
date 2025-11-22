# A Poem A Day 📖

A minimalist web app that presents a daily poem from [PoetryDB](https://poetrydb.org) with a beautiful book-opening animation.

## Features

- 📚 **Brown Book Button** - Click to reveal today's poem with a smooth opening animation
- 🎯 **Deterministic Daily Poems** - Everyone sees the same poem on the same day (UTC-based)
- 📱 **Mobile-First Design** - Button positioned at bottom for easy thumb reach
- ⚡ **Performance Optimized** - localStorage caching, idle prefetching
- ♿ **Accessible** - Keyboard navigation, ARIA labels, reduced-motion support
- 🎨 **Beautiful Typography** - Merriweather serif for poems, Inter for UI

## Tech Stack

- **Framework**: [Vike](https://vike.dev) (React SSR)
- **Styling**: TailwindCSS + Custom CSS3 animations
- **API**: [PoetryDB](https://poetrydb.org)
- **Deployment**: Vercel

## Local Development

```bash
npm install
npm run dev
```

## Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

## How It Works

1. Click the brown book button at the bottom
2. Book opens with a 3D CSS animation
3. Today's poem appears (title, author, lines)
4. Same poem for everyone on the same UTC day
5. Cached in localStorage to avoid refetching

## License

MIT
