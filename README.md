# AI Spend Audit

Free AI tool spend auditor for startups — find where you're overpaying on AI subscriptions and how much you could save.

**Live URL:** https://ai-spend-audit-bice.vercel.app  
**Built for:** Credex Web Dev Intern Assignment

## Screenshots
> Add screenshots here after submission

## Quick Start

### Install
```bash
git clone https://github.com/dhana301126/ai-spend-audit.git
cd ai-spend-audit
npm install
```

### Run locally
```bash
cp .env.local.example .env.local
# Fill in your Supabase and Anthropic keys
npm run dev
```

### Deploy
Deploy to Vercel with one click. Add environment variables in Vercel dashboard.

## Decisions

1. **Next.js over plain React** — Built-in API routes meant I didn't need a separate backend server, reducing complexity for a 7-day build.

2. **Supabase over Firebase** — Postgres gives structured querying for audit data. Firebase's NoSQL would make savings calculations harder to query.

3. **Hardcoded audit rules over AI** — The assignment specifically said audit math should use hardcoded rules. AI is unpredictable for financial calculations — a rule engine is auditable and defensible.

4. **Fallback summary over blocking on API** — If Anthropic API fails, users still get a useful templated summary. Never block the user experience on a third-party API.

5. **In-memory + Supabase hybrid** — Started with in-memory store for speed, migrated to Supabase for persistence. This let me ship fast and upgrade later.

## Tech Stack
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Database:** Supabase (Postgres)
- **AI:** Anthropic Claude API (with fallback)
- **Deploy:** Vercel