import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ArrowUpRight, RotateCcw } from 'lucide-react';
import './opening.css';

const motionQuery = '(prefers-reduced-motion: reduce)';
const subscribeMotion = (notify: () => void) => {
  const query = window.matchMedia(motionQuery);
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
};
const reducedMotion = () => window.matchMedia(motionQuery).matches;

function Sequence({ onFinish }: { onFinish: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current!;
    const stage = stageRef.current!;
    let cancelled = false;
    let destroyScene: (() => void) | undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    const finish = () => onFinish();
    const timer = window.setTimeout(finish, 5500);
    const onVisibility = () => { if (document.hidden) finish(); };
    document.addEventListener('visibilitychange', onVisibility);

    // A separate chunk keeps WebGL out of the portfolio's initial JavaScript.
    // Typography and the CSS orbit still play if WebGL is unavailable.
    void import('./opening-scene').then(({ createOpeningScene }) => {
      if (cancelled) return;
      try {
        destroyScene = createOpeningScene(stage);
      } catch {
        stage.dataset.fallback = 'true';
      }
    }).catch(() => { if (!cancelled) stage.dataset.fallback = 'true'; });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisibility);
      destroyScene?.();
      dialog.close();
      document.body.style.overflow = originalOverflow;
    };
  }, [onFinish]);

  return (
    <dialog ref={dialogRef} className="opening" aria-label="Portfolio opening animation" onCancel={onFinish}>
      <div className="opening-grid" aria-hidden="true" />
      <div className="opening-halo" aria-hidden="true" />
      <div className="opening-stage" ref={stageRef} aria-hidden="true"><div className="opening-orbit" /></div>
      <div className="opening-topline"><span><i /> A MULTIMEDIA EXPERIENCE</span><span className="opening-edition">SOUND OFF / IMAGINATION ON</span></div>
      <div className="opening-titles" aria-hidden="true">
        <div className="opening-title opening-title-one"><span>BEYOND</span></div>
        <div className="opening-title opening-title-two"><span>THE <em>FRAME.</em></span></div>
        <div className="opening-title opening-title-three"><span>MAKE IT<br /><em>FEEL.</em></span></div>
      </div>
      <div className="opening-side opening-side-left" aria-hidden="true">FORM / COLOUR / MOVEMENT</div>
      <div className="opening-side opening-side-right" aria-hidden="true">NO SINGLE MEDIUM.</div>
      <div className="opening-bottomline">
        <div className="opening-caption"><span>VISUAL WORLDS, IN MOTION.</span><div className="opening-progress" aria-hidden="true"><span /></div></div>
        <button type="button" className="opening-skip" onClick={onFinish}>Skip intro <ArrowUpRight size={18} aria-hidden="true" /></button>
      </div>
      <div className="opening-curtain" aria-hidden="true" />
    </dialog>
  );
}

export default function OpeningSequence() {
  const prefersReduced = useSyncExternalStore(subscribeMotion, reducedMotion, () => true);
  const [playing, setPlaying] = useState(() => !window.location.hash && !reducedMotion());
  const replayRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const query = window.matchMedia(motionQuery);
    const stopForPreference = () => { if (query.matches) setPlaying(false); };
    query.addEventListener('change', stopForPreference);
    return () => query.removeEventListener('change', stopForPreference);
  }, []);
  const finish = useCallback(() => {
    setPlaying(false);
    // Native dialog closing restores focus; this is also a stable target after auto-finish.
    requestAnimationFrame(() => replayRef.current?.focus({ preventScroll: true }));
  }, []);

  return <>
    {playing && !prefersReduced && <Sequence onFinish={finish} />}
    {!prefersReduced && <button ref={replayRef} type="button" className="intro-replay" onClick={() => setPlaying(true)}><RotateCcw size={14} aria-hidden="true" /> Replay intro</button>}
  </>;
}
