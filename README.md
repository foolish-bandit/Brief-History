<p align="center">
  <img src="images/BriefHistory-readme.png" alt="Brief History — Infinitely explore legal history" width="600" />
</p>

<p align="center">
  <strong>Ask a question. Get a timeline. Click any node. Go deeper.</strong>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="MIT" /></a>
  <a href="https://github.com/foolish-bandit/Brief-History/stargazers"><img src="https://img.shields.io/github/stars/foolish-bandit/Brief-History?style=flat-square&color=c9a45c" alt="Stars" /></a>
</p>

<p align="center">
  Brief History generates interactive, AI-powered timelines of legal events, doctrines, and precedent.<br/>
<p align="center">  
  Every node is a starting point. Every drill-down reveals more. <strong>There is no bottom.</strong>
</p>

---

## How It Works

```
"history of the Fourth Amendment"
        |
        v
   ┌─ Timeline ────────────────────────────────────────┐
   │                                                    │
   │  1761  Writs of Assistance Case                    │
   │  1776  Virginia Declaration of Rights              │
   │  1791  Fourth Amendment ratified                   │
   │  1914  Weeks v. United States (exclusionary rule)  │  <── click
   │  1961  Mapp v. Ohio (applied to states)            │
   │  1967  Katz v. United States (reasonable expectation)
   │  2018  Carpenter v. United States (cell-site data) │
   │                                                    │
   └────────────────────────────────────────────────────┘
                        |
                        v  click "Weeks v. United States"
   ┌─ Sub-Timeline ────────────────────────────────────┐
   │                                                    │
   │  1886  Boyd v. United States (Fourth + Fifth)      │
   │  1904  Adams v. New York (evidence admitted)       │
   │  1914  Weeks — exclusionary rule established       │
   │  1920  Silverthorne — fruit of the poisonous tree  │
   │  1949  Wolf v. Colorado (not yet applied to states)│
   │  ...                                              │
   └────────────────────────────────────────────────────┘
                        |
                        v  keep clicking...
```

Every timeline is generated on the fly by Gemini. Explored timelines are cached locally in SQLite so you never re-fetch what you've already mapped.

---

## Features

| Feature | Detail |
|---------|--------|
| **Infinite depth** | Every node is a new query. Drill into sub-events, related doctrines, concurrences, dissents, downstream effects. |
| **AI-generated** | Timelines synthesized on the fly by Google Gemini — not a static database. |
| **Local cache** | SQLite (better-sqlite3) persists explored timelines. Your research graph grows over time. |
| **Animated UI** | Smooth transitions and motion-driven interactions via Motion (Framer Motion). |

---

## Try It

```bash
git clone https://github.com/foolish-bandit/Brief-History.git
cd Brief-History
npm install
```

Create `.env.local`:

```env
GEMINI_API_KEY=your_api_key_here
```

Get a free key at [aistudio.google.com](https://aistudio.google.com/app/apikey).

```bash
npm run dev
```

Opens at `http://localhost:3000`.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, TypeScript, Tailwind CSS v4 |
| Build | Vite 6 |
| AI | Google Gemini (`@google/genai`) |
| Cache | better-sqlite3 |
| Server | Express |
| Animation | Motion (Framer Motion) |

---

## Roadmap

- [ ] Shareable timeline permalinks
- [ ] Export to PDF / Markdown
- [ ] Jurisdiction filtering (federal, state, international)
- [ ] Citation graph visualization
- [ ] Multi-model support (Claude, GPT, local models)

---

## Contributing

```bash
npm run dev       # dev server
npm run build     # production build
npm run lint      # TypeScript type-check
```

PRs welcome — especially UI improvements, export formats, and prompt engineering for better timeline generation.

---

## License

MIT

<p align="center">
  <sub>Built by <a href="https://github.com/foolish-bandit">Zack Brenner</a></sub>
</p>
