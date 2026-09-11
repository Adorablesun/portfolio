import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';

type RibbonPhase = 'idle' | 'engaged' | 'returning';
type RibbonZone = 'idea' | 'bridge' | 'curiosity' | 'none';

export default function ConnectionRibbon() {
  const [bend, setBend] = useState(0);
  const [phase, setPhase] = useState<RibbonPhase>('idle');
  const [zone, setZone] = useState<RibbonZone>('none');
  const bendValue = useRef(0);
  const bendTarget = useRef(0);
  const engaged = useRef(false);
  const animationFrame = useRef<number | null>(null);

  const settleBend = () => {
    if (animationFrame.current !== null) return;
    const step = () => {
      const distance = bendTarget.current - bendValue.current;
      bendValue.current += distance * .18;
      if (Math.abs(distance) < .06) {
        bendValue.current = bendTarget.current;
        setBend(bendValue.current);
        animationFrame.current = null;
        if (!engaged.current && bendTarget.current === 0) setPhase('idle');
        return;
      }
      setBend(bendValue.current);
      animationFrame.current = requestAnimationFrame(step);
    };
    animationFrame.current = requestAnimationFrame(step);
  };

  useEffect(() => () => {
    if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
  }, []);

  function enter(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    engaged.current = true;
    setZone('bridge');
    setPhase('engaged');
  }

  function move(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    bendTarget.current = Math.max(-18, Math.min(18, (event.clientY - bounds.top - bounds.height / 2) * .35));
    event.currentTarget.style.setProperty('--ribbon-offset', `${9 - progress * 100}`);
    event.currentTarget.style.setProperty('--ribbon-x', `${progress * 100}%`);
    event.currentTarget.style.setProperty('--ribbon-y', `${Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100))}%`);
    engaged.current = true;
    setPhase('engaged');
    setZone(progress < .27 ? 'idea' : progress > .73 ? 'curiosity' : 'bridge');
    settleBend();
  }

  function leave(event: PointerEvent<HTMLAnchorElement>) {
    event.currentTarget.style.setProperty('--ribbon-offset', '-41');
    event.currentTarget.style.setProperty('--ribbon-x', '50%');
    event.currentTarget.style.setProperty('--ribbon-y', '52%');
    engaged.current = false;
    bendTarget.current = 0;
    setZone('none');
    setPhase('returning');
    settleBend();
  }

  function focus() {
    engaged.current = true;
    setZone('bridge');
    setPhase('engaged');
  }

  function blur() {
    engaged.current = false;
    bendTarget.current = 0;
    setZone('none');
    setPhase('returning');
    settleBend();
  }

  const path = `M 20 30 C 120 ${30 + bend}, 122 ${74 + bend}, 230 74 S 350 ${30 - bend}, 440 30`;
  return <a className="connection-ribbon" href="#contact-channels" data-phase={phase} data-zone={zone} onPointerEnter={enter} onPointerMove={move} onPointerLeave={leave} onFocus={focus} onBlur={blur} aria-label="Start a conversation — explore my contact options">
    <span className="ribbon-labels" aria-hidden="true"><span className="ribbon-label-idea">YOUR IDEA</span><span className="ribbon-label-curiosity">MY CURIOSITY</span></span>
    <svg viewBox="0 0 460 100" fill="none" aria-hidden="true">
      <path className="ribbon-guide" d={path} />
      <path className="ribbon-thread" pathLength="100" d={path} />
      <path className="ribbon-light ribbon-light-halo" pathLength="100" d={path} />
      <path className="ribbon-light" pathLength="100" d={path} />
      <path className="ribbon-response ribbon-response-halo" pathLength="100" d={path} />
      <path className="ribbon-response" pathLength="100" d={path} />
      <g className="ribbon-node ribbon-node-idea">
        <circle className="ribbon-node-pulse" cx="20" cy="30" r="13" />
        <circle className="ribbon-end" cx="20" cy="30" r="7" />
        <circle className="ribbon-dot" cx="20" cy="30" r="2.5" />
      </g>
      <g className="ribbon-node ribbon-node-curiosity">
        <circle className="ribbon-node-pulse" cx="440" cy="30" r="13" />
        <circle className="ribbon-end" cx="440" cy="30" r="7" />
        <circle className="ribbon-dot" cx="440" cy="30" r="2.5" />
      </g>
    </svg>
    <span className="ribbon-invitation"><span className="ribbon-invitation-copy"><span>A conversation starts here</span><span>Follow the signal to connect</span></span><ArrowUpRight size={16} aria-hidden="true" /></span>
  </a>;
}
