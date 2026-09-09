import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react';
import { academicJourney, futureJourney } from './portfolio';
import { buildJourneyPath, distanceAtY } from './journey-path';

export default function JourneyPath() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGGElement>(null);

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
      paint();
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
      {academicJourney.map((entry, i) => <li id={entry.current ? 'now' : i === 0 ? 'beginnings' : undefined} key={entry.name} className={`journey-row ${i % 2 ? 'on-right' : 'on-left'} ${entry.current ? 'is-current' : ''}`}>
        <span className="journey-marker" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
        <article className="journey-card"><p className="journey-kicker">{entry.stage}</p><h3>{entry.name}</h3><p>{entry.description}</p>{entry.detail && <p className="journey-detail">{entry.detail}</p>}{entry.current && <span className="journey-badge">Where I am now</span>}</article>
        <span className="journey-margin-note" aria-hidden="true">{['THE BEGINNING', 'GROWING FORWARD', 'THE CURRENT CHAPTER', 'INTO INDUSTRY'][i]}</span>
      </li>)}
      {futureJourney.map((entry, i) => <li id={i === 0 ? 'future' : undefined} key={entry.name} className={`journey-row is-future ${i % 2 ? 'on-right' : 'on-left'}`}>
        <span className="journey-marker" aria-hidden="true"><Sparkles size={18} /></span>
        <article className="journey-card"><p className="journey-kicker">ASPIRATION / {entry.stage}</p><h3>{entry.name}</h3><p>{entry.description}</p><p className="journey-focus">{entry.focus}</p><details className="journey-project"><summary>A project to work towards <ArrowUpRight size={17} aria-hidden="true" /></summary><p>{entry.project}</p></details></article>
        <span className="journey-margin-note" aria-hidden="true">{['DESIGN FOR PEOPLE', 'BEYOND THE SCREEN', 'HUMAN + MACHINE', 'BRING IT ALL TOGETHER'][i]}</span>
      </li>)}
    </ol>
    <div className="journey-end"><span className="journey-marker" aria-hidden="true"><ArrowDown size={18} /></span><p>Still learning. Still exploring.</p><h3>The path keeps <span className="serif-word">going.</span></h3><span>Future chapters are aspirations, with room to evolve.</span></div>
  </div>;
}
