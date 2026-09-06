# Multimedia portfolio framework

## Design direction
A typography-led creative portfolio with a cool white canvas, cobalt accent, oversized headings, and a large featured project followed by two smaller projects. Graphics, animation, video, photography, and interactive work can share the same project structure. No software-development positioning is required.

## Visitor journey
1. Introduction: identify the designer and the kind of work.
2. Selected work: show a few relevant projects, with the strongest first.
3. Project story: brief, individual role and tools, process, final media, outcome and reflection.
4. About: personal approach and actual creative disciplines.
5. Contact: a real email and selected creative profiles.

## Research and application
- Nielsen Norman Group, “5 Steps to Creating a UX-Design Portfolio”: https://www.nngroup.com/articles/ux-design-portfolios/ — supports selective, scannable project stories explaining role, decisions, and results. Its audience is UX hiring; adapting the case-study structure to multimedia is a design judgment, not a claim about every multimedia employer.
- Nielsen Norman Group, “UX Hiring: Insights from a Design Recruiter”: https://www.nngroup.com/articles/ux-hiring-insights/ — context on communicating work clearly to varied hiring audiences.
- web.dev, “Accessible responsive design”: https://web.dev/articles/accessible-responsive-design — informs relative sizing, flexible layout, keyboard focus, and zoom-aware design.
- web.dev, “prefers-reduced-motion: Sometimes less movement is more”: https://web.dev/articles/prefers-reduced-motion — informs respecting motion preferences.

Research reviewed 6 September 2026. Visual styling is an original proposal, not a claim that a particular aesthetic is universally best.

## Technical foundation
Semantic HTML rendered by React and TypeScript using the generated Vinext/Vite stack. CSS Grid, Flexbox, custom properties, and media queries implement the layout. Native details/summary supplies project expansion without client-side JavaScript. No database is required.

- app/portfolio.ts: editable name, introduction, about, disciplines, email, and projects.
- app/page.tsx: page sections and reusable project rendering.
- app/globals.css: colour, type, spacing, responsive layout, and motion settings.
- app/layout.tsx: document metadata. Indexing is disabled during the sample-content stage.

Run `npm install`, then `npm run dev`. Use `npm run build` for the production build.

## Content to supply next
Display name, a short biography, strongest 3–5 actual projects, your role and tools for each, finished media, and contact links. Replace the sample projects, disciplines, and bio before presenting this as your professional portfolio. The generated abstract artwork is only a layout sample. No projects, client claims, or outcomes are attributed to the owner.

## Media guidance for the next phase
Use optimised images with descriptive alternatives. Videos should have a poster image, explicit playback controls, and captions/transcripts where applicable. Avoid autoplay audio. Add a lightbox or separate case-study routes only if the supplied work needs them.
