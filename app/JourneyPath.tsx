import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react';
import { academicJourney, futureJourney } from './portfolio';
import { buildJourneyPath, distanceAtY, scrollMotion } from './journey-path';

const stopIds = [
  'beginnings',
  'secondary',
  'now',
  'internship',
  'future',
  'immersive',
  'ai',
  'leadership',
];
const marginNotes = [
  'THE BEGINNING',
  'GROWING FORWARD',
  'THE CURRENT CHAPTER',
  'INTO INDUSTRY',
  'DESIGN FOR PEOPLE',
  'BEYOND THE SCREEN',
  'HUMAN + MACHINE',
  'BRING IT ALL TOGETHER',
];

export default function JourneyPath() {
  const rootRef = useRef<HTMLDivElement>(null);
  const sceneHostRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const sceneHost = sceneHostRef.current!;
    const track = trackRef.current!;
    const fill = fillRef.current!;
    const head = headRef.current!;
    const svg = track.ownerSVGElement!;
    const rows = Array.from(root.querySelectorAll<HTMLElement>('.journey-row'));
    const markers = Array.from(
      root.querySelectorAll<HTMLElement>('.journey-marker'),
    );
    const phaseWords = Array.from(
      root.querySelectorAll<HTMLElement>('.journey-phase-word'),
    );
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let length = 0;
    let frame = 0;
    let disposed = false;
    let centres: number[] = [];
    let scene: import('./journey-scene').JourneySceneController | undefined;
    let sceneToken = 0;
    let latestProgress = 0;
    let latestVisibility = false;

    const stopScene = () => {
      sceneToken += 1;
      scene?.dispose();
      scene = undefined;
      sceneHost.replaceChildren();
      delete sceneHost.dataset.fallback;
    };
    const startScene = async () => {
      if (preference.matches || scene) return;
      const token = ++sceneToken;
      try {
        const { createJourneyScene } = await import('./journey-scene');
        if (disposed || token !== sceneToken || preference.matches) return;
        scene = createJourneyScene(sceneHost);
        scene.setProgress(latestProgress, latestVisibility);
      } catch {
        sceneHost.dataset.fallback = 'true';
      }
    };

    const paint = () => {
      frame = 0;
      if (!length) return;
      const bounds = root.getBoundingClientRect();
      const readingY = window.innerHeight * 0.68 - bounds.top;
      const distance = preference.matches
        ? length
        : distanceAtY(length, readingY, (d) => track.getPointAtLength(d));
      fill.style.strokeDashoffset = String(length - distance);
      const point = track.getPointAtLength(distance);
      head.setAttribute('transform', `translate(${point.x} ${point.y})`);
      head.style.opacity = preference.matches ? '0' : '1';
      const routeVisible = bounds.top < window.innerHeight && bounds.bottom > 0;
      latestProgress = length ? distance / length : 0;
      latestVisibility = routeVisible;
      scene?.setProgress(latestProgress, routeVisible);

      const motions = centres.map((center) =>
        scrollMotion(bounds.top + center, window.innerHeight),
      );
      const compact = window.innerWidth < 620;
      rows.forEach((row, i) => {
        row.classList.toggle(
          'is-reached',
          preference.matches || centres[i] <= readingY,
        );
        const card = row.querySelector<HTMLElement>('.journey-card');
        const note = row.querySelector<HTMLElement>('.journey-margin-note');
        if (!card || preference.matches) return;
        const { position, proximity } = motions[i];
        const direction = row.classList.contains('on-right') ? 1 : -1;
        card.style.setProperty(
          '--scroll-x',
          `${direction * position * (compact ? 14 : 42)}px`,
        );
        card.style.setProperty(
          '--scroll-y',
          `${position * (compact ? 25 : 48)}px`,
        );
        card.style.setProperty(
          '--scroll-scale',
          String((compact ? 0.95 : 0.9) + proximity * (compact ? 0.05 : 0.1)),
        );
        card.style.setProperty(
          '--scroll-rotate',
          `${direction * position * (compact ? 1.2 : 3.2)}deg`,
        );
        card.style.setProperty(
          '--scroll-blur',
          `${(1 - proximity) * (compact ? 1.6 : 4.5)}px`,
        );
        row.style.setProperty(
          '--marker-scale',
          String(0.82 + proximity * 0.28),
        );
        if (note) {
          note.style.setProperty('--note-shift', `${position * -32}px`);
          note.style.setProperty(
            '--note-opacity',
            String(0.25 + proximity * 0.75),
          );
          note.style.setProperty(
            '--note-spacing',
            `${0.08 + proximity * 0.08}em`,
          );
        }
      });

      const phaseGroups = [
        [0, 1],
        [2, 3],
        [4, 5, 6, 7],
      ];
      phaseWords.forEach((word, phase) => {
        const group = phaseGroups[phase];
        const strongest = group.reduce(
          (best, index) =>
            motions[index].proximity > best.proximity ? motions[index] : best,
          motions[group[0]],
        );
        word.style.opacity = routeVisible
          ? String(0.018 + strongest.proximity * 0.065)
          : '0';
        word.style.setProperty(
          '--phase-shift',
          `${strongest.position * -70}px`,
        );
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onPreferenceChange = () => {
      if (preference.matches) stopScene();
      else void startScene();
      measure();
    };
    const measure = () => {
      if (disposed) return;
      const bounds = root.getBoundingClientRect();
      const points = markers.map((marker) => {
        const rect = marker.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 - bounds.left,
          y: rect.top + rect.height / 2 - bounds.top,
        };
      });
      centres = points.map((point) => point.y);
      svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
      const path = buildJourneyPath(points);
      track.setAttribute('d', path);
      fill.setAttribute('d', path);
      length = track.getTotalLength();
      fill.style.strokeDasharray = String(length);
      schedule();
    };
    const reveal =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting)
                  entry.target.classList.add('is-visible');
              });
            },
            { rootMargin: '0px 0px -5% 0px', threshold: 0.05 },
          )
        : undefined;
    if (reveal) {
      root.dataset.enhanced = 'true';
      rows.forEach((row) => reveal.observe(row));
    }
    const resize = new ResizeObserver(measure);
    resize.observe(root);
    markers.forEach((marker) => resize.observe(marker));
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    preference.addEventListener('change', onPreferenceChange);
    measure();
    void startScene();
    void document.fonts.ready.then(measure);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      reveal?.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      preference.removeEventListener('change', onPreferenceChange);
      stopScene();
      delete root.dataset.enhanced;
    };
  }, []);

  return (
    <div ref={rootRef} className="journey-route">
      <div ref={sceneHostRef} className="journey-3d-stage" aria-hidden="true" />
      <div className="journey-atmosphere" aria-hidden="true">
        <span className="journey-phase-word phase-foundation">FOUNDATION</span>
        <span className="journey-phase-word phase-present">PRESENT</span>
        <span className="journey-phase-word phase-future">FUTURE</span>
      </div>
      <svg
        className="journey-svg"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="journey-colour" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2448df" />
            <stop offset="45%" stopColor="#2448df" />
            <stop offset="100%" stopColor="#8270ea" />
          </linearGradient>
        </defs>
        <path ref={trackRef} className="journey-track" />
        <path ref={fillRef} className="journey-fill" />
        <g ref={headRef} className="journey-head">
          <circle
            className="journey-head-aura"
            r="16"
            fill="#2448df"
            opacity=".12"
          />
          <circle r="6" fill="#2448df" stroke="white" strokeWidth="2" />
        </g>
      </svg>
      <ol className="journey-stops">
        {academicJourney.map((entry, i) => (
          <li
            id={stopIds[i]}
            key={entry.name}
            className={`journey-row ${i % 2 ? 'on-right' : 'on-left'} ${entry.current ? 'is-current' : ''}`}
          >
            <span className="journey-marker">
              {String(i + 1).padStart(2, '0')}
            </span>
            <article className="journey-card">
              <p className="journey-kicker">{entry.stage}</p>
              <h3>{entry.name}</h3>
              <p>{entry.description}</p>
              {entry.detail && <p className="journey-detail">{entry.detail}</p>}
              {entry.current && (
                <span className="journey-badge">Where I am now</span>
              )}
            </article>
            <span className="journey-margin-note" aria-hidden="true">
              {marginNotes[i]}
            </span>
          </li>
        ))}
        {futureJourney.map((entry, i) => (
          <li
            id={stopIds[i + academicJourney.length]}
            key={entry.name}
            className={`journey-row is-future ${i % 2 ? 'on-right' : 'on-left'}`}
          >
            <span className="journey-marker">
              <Sparkles size={18} aria-hidden="true" />
            </span>
            <article className="journey-card">
              <p className="journey-kicker">ASPIRATION / {entry.stage}</p>
              <h3>{entry.name}</h3>
              <p>{entry.description}</p>
              <p className="journey-focus">{entry.focus}</p>
              <details className="journey-project">
                <summary>
                  A project to work towards{' '}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </summary>
                <p>{entry.project}</p>
              </details>
            </article>
            <span className="journey-margin-note" aria-hidden="true">
              {marginNotes[i + academicJourney.length]}
            </span>
          </li>
        ))}
      </ol>
      <div className="journey-end">
        <span className="journey-marker" aria-hidden="true">
          <ArrowDown size={18} />
        </span>
        <p>Still learning. Still exploring.</p>
        <h3>
          The path keeps <span className="serif-word">going.</span>
        </h3>
        <span>Future chapters are aspirations, with room to evolve.</span>
      </div>
    </div>
  );
}
