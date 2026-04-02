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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.






# Reasy Waitlist

Waitlist en 2 pages pour Reasy, construite avec Next.js 15 + TypeScript.

## Structure des fichiers

```
app/
  layout.tsx          → Layout racine + metadata
  globals.css         → Variables CSS, fonts (Syne + DM Sans)
  page.tsx            → Page 1 : Landing (headline + CTA + preview)
  page.module.css
  waitlist/
    page.tsx          → Page 2 : Formulaire (split 50/50)
    page.module.css
  merci/
    page.tsx          → Page de confirmation après inscription
    page.module.css
  api/
    waitlist/
      route.ts        → API POST /api/waitlist (sauvegarde JSON)

components/
  DashboardMockup.tsx        → Screenshot animé du dashboard
  DashboardMockup.module.css
  WaitlistForm.tsx           → Formulaire client avec validation
  WaitlistForm.module.css

data/
  waitlist.json       → Créé automatiquement au 1er signup
```

## Installation

Copier ces fichiers dans votre projet `reasywebapp` en respectant l'arborescence, puis :

```bash
npm run dev
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page avec CTA |
| `/waitlist` | Formulaire d'inscription |
| `/merci` | Page de confirmation |
| `GET /api/waitlist` | Nombre d'inscrits |
| `POST /api/waitlist` | Inscription |

## Déploiement Vercel

> ⚠️ **Important** : L'API utilise le système de fichiers local (`data/waitlist.json`).
> Vercel est **serverless** donc le fichier ne persiste pas entre les déploiements.
>
> **Options recommandées :**
> - **Vercel KV** (Redis) — gratuit jusqu'à 30k req/mois
> - **Vercel Postgres** — gratuit sur hobby plan  
> - **Supabase** — base de données Postgres gratuite
> - **Resend** — envoyer les emails + les stocker
>
> Pour la démo/test : ça fonctionne parfaitement en local.

### Migration vers Vercel KV (recommandé)

```bash
npm install @vercel/kv
```

Remplacer dans `route.ts` :
```ts
import { kv } from '@vercel/kv'

// Lire
const entries = await kv.get<WaitlistEntry[]>('waitlist') ?? []

// Écrire
await kv.set('waitlist', entries)
```