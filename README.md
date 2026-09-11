# Multimedia portfolio

A standalone React + TypeScript + Vite portfolio. Hosting uses GitHub Pages; no GPT plugin, account, or runtime is needed to run the website.

The shared navigation stays at the top of every page as a highly translucent liquid-glass surface with refracted color, moving caustics, bright inner edges, and a pointer-responsive highlight. Its wordmark, links, numbered droplets, and CTA share a consistent control rail, while a live page-progress signal runs along the lower edge. The light and dark themes use separate glass tints so the page remains visible through the surface without sacrificing readable controls. Active-page, hover, mobile, dark-theme, and reduced-motion states are included.

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
- `app/PersonalPage.tsx`: personal introduction and contact channels.
- `app/SiteHeader.tsx`: navigation shared by both pages.
- `app/globals.css`: visual design and motion.
- `app/main.tsx`: React entry point and bundled fonts.
- `index.html`: title, metadata, and favicon.
- `public/images/`: portfolio media.
- `DESIGN.md`: design rationale and content guide.
- `PROJECTS-TO-PREPARE.md`: recommended multimedia projects and asset checklist.

The academic page is published at `academic/`. Its separate HTML entry makes direct links and refreshes work on GitHub Pages without server-side routing.

The personal contact page is published at `personal/`. Its entrance types “Hi, I’m”, then reveals every character in “Yu Yang” separately while that character rapidly transforms through multiple fonts before settling into the final blue serif. A curved connection below the heading links Your idea to My curiosity. It has distinct idle, pointer-engaged, endpoint, keyboard-focus, and elastic-return states: the line bends toward the pointer, a local signal follows it along the curve, each endpoint answers independently, and the invitation changes before smoothly settling when the pointer leaves. It links to the contact section without crossing the typography. The OY identity card turns upright from a near-horizontal position and is built as a thin, two-sided CSS 3D object. Visitors drag in any direction to rotate both axes continuously, and the card stays at the released angle; cursor movement adds live depth. All four arrow keys provide equivalent keyboard rotation. The front keeps its fractured reveal, while the reverse carries a second identity composition. The Creative Spectrum presents UI/UX, motion, AR/VR, AI + creativity, Unity/C#, graphic design, video editing, and 3D modelling as an asymmetric set of cursor-responsive tiles rather than a plain tag row. Reduced-motion behavior is included. The full page begins in its light theme and transitions together to the dark communication-console theme when the contact area reaches the central reading line; scrolling back restores the light theme. WhatsApp, email, Instagram, and LinkedIn each have their own cursor-responsive signal animation while the full card remains an accessible link. The Instagram channel presents a stack of abstract visual frames that fans into a scanned mini gallery on hover or keyboard focus. Public contact details live in `app/portfolio.ts`; unavailable channels stay visibly disabled rather than linking to placeholder destinations.

The Academic Journey has a scroll-drawn route from education and internship milestones into a proposed future: UI/UX, AR/VR, AI-assisted experiences, then creative technology and leadership. These future chapters are labelled as aspirations. Cards drift, sharpen, and settle as they cross the reading line while markers, margin notes, and large chapter words move at different depths. A transparent Three.js scene follows the same progress: a small travelling light pulls three live-sampled strands that bend around the journey curve and pass through subtle spatial waypoints as the camera moves from cobalt foundations into the violet future. The ending becomes a full-viewport finale: the page transitions into a deep spatial palette, the route recedes, an animated 3D knot with a luminous core and orbital rings emerges behind the centred message, and ambient auroras, grid motion, and a large CSS orbit animate the background. `app/JourneyPath.tsx` measures the actual card positions, including expanded project prompts, so both the SVG and 3D paths stay aligned on mobile and desktop. Reduced-motion preferences show the complete static route, retain a stable finale composition, and skip WebGL. The academic page has its own brief, non-blocking entrance reveal.

Current content is labelled as sample work. Replace it before treating this as a finished professional portfolio. Search indexing is disabled in `index.html` during this draft stage.

## Opening animation

The homepage plays a 5.5-second 3D title sequence with pointer-responsive chrome geometry, orbital rings, and kinetic typography. Skip or press Escape to enter immediately; use Replay intro to watch again. Direct section links and reduced-motion preferences bypass the entrance. WebGL loads separately and is released when the sequence closes. A CSS fallback preserves the title sequence if 3D is unavailable. No audio plays.

Implementation: `app/OpeningSequence.tsx`, `app/opening-scene.ts`, and `app/opening.css`. Run `npm test` for the lifecycle and accessibility-behavior checks.

## Next design phase

Extend the opening's art direction into the hero and project transitions, add scroll choreography, and replace sample content with original work.
