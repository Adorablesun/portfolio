# Multimedia portfolio

A standalone React + TypeScript + Vite portfolio. Hosting uses GitHub Pages; no GPT plugin, account, or runtime is needed to run the website.

## Local development

Use Node.js 24 and npm:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Run `npm run build` then `npm run preview` to preview the production build.

## Publish on GitHub

Push this repository to GitHub. In **Settings → Pages**, choose **GitHub Actions** as the source. The included workflow builds and publishes on each push to `main` or `master`. The workflow reports the final website URL. The base path is detected from GitHub Pages, including project repositories and custom domains.

## Edit the portfolio

- `app/portfolio.ts`: biography, contact, and projects.
- `app/page.tsx`: sections and project cards.
- `app/AcademicPage.tsx`: academic timeline and internship background.
- `app/SiteHeader.tsx`: navigation shared by both pages.
- `app/globals.css`: visual design and motion.
- `app/main.tsx`: React entry point and bundled fonts.
- `index.html`: title, metadata, and favicon.
- `public/images/`: portfolio media.
- `DESIGN.md`: design rationale and content guide.
- `PROJECTS-TO-PREPARE.md`: recommended multimedia projects and asset checklist.

The academic page is published at `academic/`. Its separate HTML entry makes direct links and refreshes work on GitHub Pages without server-side routing.

Current content is labelled as sample work. Replace it before treating this as a finished professional portfolio. Search indexing is disabled in `index.html` during this draft stage.

## Opening animation

The homepage plays a 5.5-second 3D title sequence with pointer-responsive chrome geometry, orbital rings, and kinetic typography. Skip or press Escape to enter immediately; use Replay intro to watch again. Direct section links and reduced-motion preferences bypass the entrance. WebGL loads separately and is released when the sequence closes. A CSS fallback preserves the title sequence if 3D is unavailable. No audio plays.

Implementation: `app/OpeningSequence.tsx`, `app/opening-scene.ts`, and `app/opening.css`. Run `npm test` for the lifecycle and accessibility-behavior checks.

## Next design phase

Extend the opening's art direction into the hero and project transitions, add scroll choreography, and replace sample content with original work.
