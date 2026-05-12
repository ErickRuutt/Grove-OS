# grove-os.com

Marketing website and interview portal for [Grove](https://grove-os.com).

## Local development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Create a `.env.local` file:

```
ANTHROPIC_API_KEY=your-api-key-here
```

Required for the interview portal (`/interview`). Without it, API routes will return 500.

## Routes

- `/` — homepage
- `/blog` — blog index
- `/blog/[slug]` — blog post
- `/docs` — documentation
- `/how-it-works` — product overview
- `/benchmark` — benchmark page
- `/integrations` — integrations page
- `/interview` — AI interview portal (requires `ANTHROPIC_API_KEY`)

## Build

```bash
pnpm build
pnpm start
```

## Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript) (interview portal)
