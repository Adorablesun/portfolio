import { ArrowLeft, ArrowUpRight, Download, Infinity as InfinityIcon, Play, Plus } from 'lucide-react';
import SiteHeader from './SiteHeader';
import { portfolio } from './portfolio';
import './future-pages.css';

export type FuturePageKind = 'resume' | 'showreel' | 'lab';

const pageCopy = {
  resume: {
    number: '04', eyebrow: 'PROFESSIONAL SNAPSHOT',
    title: <>One clear page.<br />The <span className="serif-word">full picture.</span></>,
    lede: 'A concise record of my education, experience, creative focus, and working toolkit.',
    meta: 'DOWNLOADABLE PDF',
  },
  showreel: {
    number: '05', eyebrow: 'MOTION IN ONE CUT',
    title: <>Sixty seconds.<br />Ideas in <span className="serif-word">motion.</span></>,
    lede: 'A focused edit for moving image, interaction, 3D, and visual storytelling.',
    meta: '60–90 SECOND FILM',
  },
  lab: {
    number: '06', eyebrow: 'PLAYGROUND / LAB',
    title: <>Small experiments.<br />Open <span className="serif-word">possibilities.</span></>,
    lede: 'A home for motion tests, spatial prototypes, visual studies, and creative technology.',
    meta: 'ONGOING COLLECTION',
  },
} as const;

function ResumePlaceholder() {
  return <div className="resume-reserve" aria-label="Reserved résumé layout">
    <div className="resume-sheet">
      <span className="resume-monogram">OY</span><i /><i /><i /><i /><i />
      <div className="resume-columns"><span /><span /></div>
    </div>
    <span className="reserved-action"><Download size={17} aria-hidden="true" /> PDF SLOT RESERVED</span>
  </div>;
}

function ShowreelPlaceholder() {
  return <div className="showreel-reserve" aria-label="Reserved showreel player">
    <span className="showreel-orbit" aria-hidden="true" /><span className="showreel-frame" aria-hidden="true">01:00</span>
    <span className="showreel-play" aria-hidden="true"><Play size={28} fill="currentColor" /></span>
    <div className="showreel-timeline" aria-hidden="true"><i /><b /></div>
    <div className="showreel-chapters"><span>MOTION</span><span>INTERACTION</span><span>3D</span><span>STORY</span></div>
  </div>;
}

function LabPlaceholder() {
  return <div className="lab-reserve" aria-label="Three reserved experiment spaces">
    {['Motion study', 'Spatial prototype', 'Creative AI test'].map((label, index) => <article key={label}>
      <div className="lab-visual" aria-hidden="true"><InfinityIcon /><span>{String(index + 1).padStart(2, '0')}</span></div>
      <div><p>{label}</p><span>RESERVED</span><Plus size={16} aria-hidden="true" /></div>
    </article>)}
  </div>;
}

export default function FuturePage({ kind }: { kind: FuturePageKind }) {
  const base = import.meta.env.BASE_URL;
  const copy = pageCopy[kind];
  return <>
    <a className="skip-link" href="#main">Skip to reserved page</a>
    <SiteHeader current={kind} />
    <main id="main" className={`reserve-page reserve-${kind}`}>
      <section className="reserve-hero shell">
        <div className="reserve-copy">
          <p className="eyebrow"><span className="small-dot" /> {copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className="reserve-lede">{copy.lede}</p>
        </div>
        <aside className="reserve-status"><span>{copy.number}</span><p>SPACE RESERVED</p><strong>{copy.meta}</strong><small>Structure ready · content in preparation</small></aside>
      </section>
      <section className="reserve-stage shell" aria-label={`${copy.eyebrow} placeholder`}>
        {kind === 'resume' && <ResumePlaceholder />}
        {kind === 'showreel' && <ShowreelPlaceholder />}
        {kind === 'lab' && <LabPlaceholder />}
      </section>
    </main>
    <footer className="reserve-footer shell"><span>{portfolio.name} · Multimedia design</span><a href={`${base}#work`}><ArrowLeft size={15} aria-hidden="true" /> Return to selected work</a><a href={`${base}personal/`}>Start a conversation <ArrowUpRight size={15} aria-hidden="true" /></a></footer>
  </>;
}
