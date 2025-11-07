Supertreks — Next.js migration

This folder contains a minimal Next.js app migrated from the classic static version. It focuses on:
- Performance (Next Image)
- Modern animations (Framer Motion + GSAP demo)
- SSG (getStaticProps) for fast pages

Quick start (PowerShell on Windows):

# from project root
cd next
npm install
npm run dev

Open http://localhost:3000

Notes:
- Data is stored in `next/data/data.json` and consumed by pages via getStaticProps.
- For production build: `npm run build` then `npm run start`.
- I used Framer Motion for page transitions and GSAP for the hero image subtle parallax/kenburns.

Next steps I can help with:
- Convert every UI section into components and add more animations
- Add TypeScript, ESLint rules, unit tests and accessibility checks
- Deploy to Vercel and set up a preview/staging branch
