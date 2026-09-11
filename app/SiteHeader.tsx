import { type PointerEvent, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Asterisk } from 'lucide-react';
import { portfolio } from './portfolio';

export default function SiteHeader({ academic = false, personal = false }: { academic?: boolean; personal?: boolean }) {
  const base = import.meta.env.BASE_URL;
  const home = academic || personal ? base : '';
  const header = useRef<HTMLElement | null>(null);
  const frame = useRef<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => {
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const progress = Math.max(0, Math.min(1, window.scrollY / scrollable));
        header.current?.style.setProperty('--nav-progress', `${progress}`);
        header.current?.style.setProperty('--nav-progress-position', `${progress * 100}%`);
        setScrolled(window.scrollY > 24);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  const moveGlassLight = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    event.currentTarget.style.setProperty('--glass-x', `${x.toFixed(2)}%`);
    event.currentTarget.style.setProperty('--glass-y', `${y.toFixed(2)}%`);
  };

  return <header ref={header} className={`site-header shell${scrolled ? ' is-scrolled' : ''}`} onPointerMove={moveGlassLight}>
    <a className="wordmark" href={`${home}#main`} aria-label={`${portfolio.name} — portfolio home`}><Asterisk aria-hidden="true" /><span className="wordmark-name">{portfolio.name}</span><span className="wordmark-period">.</span></a>
    <nav aria-label="Main navigation">
      <a href={`${home}#work`}><span className="nav-label">Work</span><span className="nav-index">01</span></a>
      <a href={`${home}#about`}><span className="nav-label">About</span><span className="nav-index">02</span></a>
      <a href={`${base}academic/`} aria-current={academic ? 'page' : undefined}><span className="nav-label">Academic</span><span className="nav-index">03</span></a>
      <a className="nav-cta" href={`${base}personal/`} aria-current={personal ? 'page' : undefined}><span className="nav-talk-long">Let’s talk</span><span className="nav-talk-short">Talk</span><ArrowUpRight size={17} aria-hidden="true" /></a>
    </nav>
    <span className="nav-glass-caustics" aria-hidden="true"><i /><i /></span>
    <span className="nav-progress" aria-hidden="true"><i /><b /></span>
  </header>;
}
