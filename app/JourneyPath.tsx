import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { ArrowDown, ArrowUpRight, ArrowLeft, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { academicJourney, futureJourney } from './portfolio';
import { buildJourneyPath, distanceAtY } from './journey-path';

const stops = [...academicJourney, ...futureJourney];
const stopIds = ['beginnings', 'secondary', 'now', 'internship', 'future', 'immersive', 'ai', 'leadership'];
const shortNames = ['Primary', 'Secondary', 'University', 'Internship', 'UI/UX', 'AR/VR', 'AI', 'Leadership'];

function tiltCard(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  card.style.setProperty('--tilt-x', `${(0.5 - y) * 5}deg`);
  card.style.setProperty('--tilt-y', `${(x - 0.5) * 5}deg`);
  card.style.setProperty('--shine-x', `${x * 100}%`);
  card.style.setProperty('--shine-y', `${y * 100}%`);
}
function resetCard(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty('--tilt-x', '0deg');
  event.currentTarget.style.setProperty('--tilt-y', '0deg');
}

export default function JourneyPath() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const [navigation, setNavigation] = useState({ active: 0, visible: false });
  const goTo = (index: number) => {
    const row = rootRef.current?.querySelector<HTMLElement>(`#${stopIds[index]}`);
    if (!row) return;
    row.classList.add('is-visible');
    row.querySelector<HTMLElement>('h3')?.focus({ preventScroll: true });
    row.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
    window.history.replaceState(null, '', `#${stopIds[index]}`);
  };

  useEffect(() => {
    const root = rootRef.current!;
    const track = trackRef.current!;
    const fill = fillRef.current!;
    const head = headRef.current!;
    const svg = track.ownerSVGElement!;
    const rows = Array.from(root.querySelectorAll<HTMLElement>('.journey-row'));
    const markers = Array.from(root.querySelectorAll<HTMLElement>('.journey-marker'));
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let length = 0;
    let frame = 0;
    let disposed = false;
    let centres: number[] = [];

    const paint = () => {
      frame = 0;
      if (!length) return;
      const bounds = root.getBoundingClientRect();
      const readingY = window.innerHeight * 0.68 - bounds.top;
      const distance = preference.matches ? length : distanceAtY(length, readingY, d => track.getPointAtLength(d));
      fill.style.strokeDashoffset = String(length - distance);
      const point = track.getPointAtLength(distance);
      head.setAttribute('transform', `translate(${point.x} ${point.y})`);
      head.style.opacity = preference.matches ? '0' : '1';
      rows.forEach((row, i) => { row.classList.toggle('is-reached', preference.matches || centres[i] <= readingY); });
      const focusY = window.innerHeight * 0.5 - bounds.top;
      let active = 0;
      rows.forEach((_, i) => { if (Math.abs(centres[i] - focusY) < Math.abs(centres[active] - focusY)) active = i; });
      rows.forEach((row, i) => row.classList.toggle('is-active', i === active));
      const visible = bounds.top < window.innerHeight * 0.72 && bounds.bottom > 120;
      setNavigation(previous => previous.active === active && previous.visible === visible ? previous : { active, visible });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const measure = () => {
      if (disposed) return;
      const bounds = root.getBoundingClientRect();
      const points = markers.map(marker => {
        const rect = marker.getBoundingClientRect();
        return { x: rect.left + rect.width / 2 - bounds.left, y: rect.top + rect.height / 2 - bounds.top };
      });
      centres = points.map(point => point.y);
      svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
      const path = buildJourneyPath(points);
      track.setAttribute('d', path);
      fill.setAttribute('d', path);
      length = track.getTotalLength();
      fill.style.strokeDasharray = String(length);
      schedule();
    };
    const reveal = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0.05 }) : undefined;
    if (reveal) {
      root.dataset.enhanced = 'true';
      rows.forEach(row => reveal.observe(row));
    }
    const resize = new ResizeObserver(measure);
    resize.observe(root);
    markers.forEach(marker => resize.observe(marker));
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    preference.addEventListener('change', measure);
    measure();
    void document.fonts.ready.then(measure);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      reveal?.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      preference.removeEventListener('change', measure);
      delete root.dataset.enhanced;
    };
  }, []);

  return <div ref={rootRef} className="journey-route">
    <svg className="journey-svg" aria-hidden="true" preserveAspectRatio="none"><defs><linearGradient id="journey-colour" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2448df" /><stop offset="45%" stopColor="#2448df" /><stop offset="100%" stopColor="#8270ea" /></linearGradient></defs><path ref={trackRef} className="journey-track" /><path ref={fillRef} className="journey-fill" /><g ref={headRef} className="journey-head"><circle r="16" fill="#2448df" opacity=".12" /><circle r="6" fill="#2448df" stroke="white" strokeWidth="2" /></g></svg>
    <ol className="journey-stops">
      {academicJourney.map((entry, i) => <li id={stopIds[i]} key={entry.name} className={`journey-row ${i % 2 ? 'on-right' : 'on-left'} ${entry.current ? 'is-current' : ''}`}>
        <button type="button" className="journey-marker" onClick={() => goTo(i)} aria-label={`Explore ${entry.name}`} aria-current={navigation.active === i ? 'step' : undefined}>{String(i + 1).padStart(2, '0')}<span className="marker-tooltip">{shortNames[i]}</span></button>
        <article className="journey-card" onPointerMove={tiltCard} onPointerLeave={resetCard}><p className="journey-kicker">{entry.stage}</p><h3 tabIndex={-1}>{entry.name}</h3><p>{entry.description}</p>{entry.detail && <p className="journey-detail">{entry.detail}</p>}{entry.current && <span className="journey-badge">Where I am now</span>}</article>
        <span className="journey-margin-note" aria-hidden="true">{['THE BEGINNING', 'GROWING FORWARD', 'THE CURRENT CHAPTER', 'INTO INDUSTRY'][i]}</span>
      </li>)}
      {futureJourney.map((entry, i) => <li id={stopIds[i + academicJourney.length]} key={entry.name} className={`journey-row is-future ${i % 2 ? 'on-right' : 'on-left'}`}>
        <button type="button" className="journey-marker" onClick={() => goTo(i + academicJourney.length)} aria-label={`Explore ${entry.name}`} aria-current={navigation.active === i + academicJourney.length ? 'step' : undefined}><Sparkles size={18} aria-hidden="true" /><span className="marker-tooltip">{shortNames[i + academicJourney.length]}</span></button>
        <article className="journey-card" onPointerMove={tiltCard} onPointerLeave={resetCard}><p className="journey-kicker">ASPIRATION / {entry.stage}</p><h3 tabIndex={-1}>{entry.name}</h3><p>{entry.description}</p><p className="journey-focus">{entry.focus}</p><details className="journey-project"><summary>A project to work towards <ArrowUpRight size={17} aria-hidden="true" /></summary><p>{entry.project}</p></details></article>
        <span className="journey-margin-note" aria-hidden="true">{['DESIGN FOR PEOPLE', 'BEYOND THE SCREEN', 'HUMAN + MACHINE', 'BRING IT ALL TOGETHER'][i]}</span>
      </li>)}
    </ol>
    <div className="journey-end"><span className="journey-marker" aria-hidden="true"><ArrowDown size={18} /></span><p>Still learning. Still exploring.</p><h3>The path keeps <span className="serif-word">going.</span></h3><span>Future chapters are aspirations, with room to evolve.</span><button className="journey-restart" type="button" onClick={() => goTo(0)}><RotateCcw size={16} aria-hidden="true" /> Back to the beginning</button></div>
    {navigation.visible && <nav className="journey-dock" aria-label="Explore journey milestones">
      <div className="journey-dock-heading"><span>YOU ARE HERE <b>{String(navigation.active + 1).padStart(2, '0')} / 08</b></span><strong>{stops[navigation.active].name}</strong></div>
      <div className="journey-dock-controls"><button className="journey-step" type="button" aria-label="Previous milestone" disabled={navigation.active === 0} onClick={() => goTo(navigation.active - 1)}><ArrowLeft size={18} aria-hidden="true" /></button><div className="journey-mini-route">{shortNames.map((name, i) => <button key={name} type="button" aria-label={`Jump to ${stops[i].name}`} aria-current={navigation.active === i ? 'step' : undefined} className={i <= navigation.active ? 'is-visited' : ''} onClick={() => goTo(i)}><span /><span className="dock-tooltip">{name}</span></button>)}</div><button className="journey-step" type="button" aria-label="Next milestone" disabled={navigation.active === stops.length - 1} onClick={() => goTo(navigation.active + 1)}><ArrowRight size={18} aria-hidden="true" /></button></div>
    </nav>}
  </div>;
}
