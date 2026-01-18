This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Usage Guide

Content OS is designed to operationalize AI writing systems. It uses a **Brand-centric** approach and a **Style Corpus** to ensure consistent tone and voice.

### 1. Requirements

- **Database**: PostgreSQL (via Prisma).
- **Auth**: Google OAuth (NextAuth v5) gated by an email allowlist.
- **AI Engine**: Anthropic Claude Opus 4.5 (default when `ANTHROPIC_API_KEY` is set) or Google Gemini.
- **Environment Variables** (see `.env.example`):
  ```bash
  DATABASE_URL="..."
  NEXTAUTH_SECRET="..."
  GOOGLE_CLIENT_ID="..."
  GOOGLE_CLIENT_SECRET="..."
  ALLOWED_EMAILS="you@example.com"
  ANTHROPIC_API_KEY="..."
  # or
  GOOGLE_GENERATIVE_AI_API_KEY="..."
  # Optional: pricing config used by /usage
  # LLM_PRICING_JSON='{"model-name":{"input":0.000001,"output":0.000002}}'
  ```

### 2. Branding & Tone

The engine uses two layers for tone control:
1.  **Brand System Prompt**: The specific "lens" or personality for a brand (e.g., "Professional Music Critic").
2.  **Writing Style Corpus**: Markdown files located in `src/corpus/`. The AI analyzes these files to extrapolate your specific writing style (sentence structure, formatting, etc.).

### 3. Workflow

1.  **Select a Brand**: Choose from the brands defined in your database.
2.  **Input a Brief**: Paste your markdown skeleton or content brief.
3.  **Generate Blog**: Receive a 500-1000 word blog post formatted in clean Markdown.
4.  **Generate Social Posts**: Derive a Twitter/X thread or social post from the generated blog content.

---

## Deployment on Vercel

When deploying to Vercel, follow these steps:

### 1. Environment Variables
Add `DATABASE_URL` and `GOOGLE_GENERATIVE_AI_API_KEY` in your Vercel Project Settings.

### 2. Database Initialization
Since the UI does not yet support brand creation, you must seed your database with at least one brand to get started.

Run the following command locally (pointing to your production database) or via a CI/CD pipeline:
```bash
npx prisma db seed
```

### 3. Build & Deploy
Vercel will automatically handle the `next build` and deployment. If you see a warning about workspace root inference, it is safe to ignore as long as the build succeeds.
