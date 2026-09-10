import { useState, type PointerEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function ConnectionRibbon() {
  const [bend, setBend] = useState(0);
  function move(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setBend(Math.max(-18, Math.min(18, (event.clientY - bounds.top - bounds.height / 2) * .35)));
  }
  const path = `M 20 30 C 120 ${30 + bend}, 122 ${74 + bend}, 230 74 S 350 ${30 - bend}, 440 30`;
  return <a className="connection-ribbon" href="#contact-channels" onPointerMove={move} onPointerLeave={() => setBend(0)} aria-label="Start a conversation — explore my contact options">
    <span className="ribbon-labels" aria-hidden="true"><span>YOUR IDEA</span><span>MY CURIOSITY</span></span>
    <svg viewBox="0 0 460 100" fill="none" aria-hidden="true">
      <path className="ribbon-guide" d={path} />
      <path className="ribbon-thread" pathLength="100" d={path} />
      <path className="ribbon-light ribbon-light-halo" pathLength="100" d={path} />
      <path className="ribbon-light" pathLength="100" d={path} />
      <circle className="ribbon-end" cx="20" cy="30" r="7" />
      <circle className="ribbon-end" cx="440" cy="30" r="7" />
      <circle className="ribbon-dot" cx="20" cy="30" r="2.5" />
      <circle className="ribbon-dot" cx="440" cy="30" r="2.5" />
    </svg>
    <span className="ribbon-invitation">A conversation starts here <ArrowUpRight size={16} aria-hidden="true" /></span>
  </a>;
}
