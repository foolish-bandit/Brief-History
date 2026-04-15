# Brief History

An infinitely explorable legal history engine.

Brief History generates interactive, AI-powered timelines of legal events, doctrines, and precedent. Ask a question, get a timeline. Click any node, go deeper. There is no bottom.

## What It Does

- **Timeline generation** - Enter any legal topic and get a structured, chronological timeline of key events, cases, and legislative milestones.
- **Infinite depth** - Every timeline node is itself a starting point. Click through to drill into sub-events, related doctrines, concurrences, dissents, and downstream effects.
- **AI-powered research** - Uses the Gemini API to synthesize legal history on the fly, not from a static database.
- **Local persistence** - SQLite (via better-sqlite3) caches explored timelines so you don't re-fetch what you've already mapped.
- **Animated UI** - Smooth transitions and motion-driven interactions via Motion (Framer Motion).

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, TypeScript, Tailwind CSS v4 |
| Build | Vite 6 |
| AI | Google Gemini (`@google/genai`) |
| Database | better-sqlite3 |
| Server | Express |
| Animation | Motion (Framer Motion) |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js (v18+)
- A [Gemini API key](https://aistudio.google.com/app/apikey)

### Setup

```bash
git clone https://github.com/foolish-bandit/BriefHistory.git
cd BriefHistory
npm install
```

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_api_key_here
```

### Run

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run clean` | Remove the `dist` directory |
| `npm run lint` | Type-check with TypeScript |

## Roadmap

- [ ] Shareable timeline permalinks
- [ ] Export timelines to PDF/Markdown
- [ ] Jurisdiction filtering (U.S. federal, state, international)
- [ ] Citation graph visualization
- [ ] Multi-model support (Claude, GPT, local models)

## License

MIT

---

Built by [Zack Brewer](https://github.com/foolish-bandit)
