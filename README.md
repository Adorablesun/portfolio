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
- `app/globals.css`: visual design and motion.
- `app/main.tsx`: React entry point and bundled fonts.
- `index.html`: title, metadata, and favicon.
- `public/images/`: portfolio media.
- `DESIGN.md`: design rationale and content guide.

Current content is labelled as sample work. Replace it before treating this as a finished professional portfolio. Search indexing is disabled in `index.html` during this draft stage.

## Planned next design phase

Interactive 3D, richer motion graphics, scroll choreography, and a stronger multimedia art direction. These enhancements should respect reduced-motion preferences and include usable mobile fallbacks.
