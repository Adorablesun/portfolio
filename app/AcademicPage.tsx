import { ArrowUpRight, ArrowLeft, GraduationCap } from 'lucide-react';
import SiteHeader from './SiteHeader';
import { academicJourney, portfolio } from './portfolio';
import './academic.css';

export default function AcademicPage() {
  const base = import.meta.env.BASE_URL;
  return <>
    <a className="skip-link" href="#main">Skip to timeline</a>
    <SiteHeader academic />
    <main id="main" className="academic-page">
      <section className="academic-hero shell" aria-labelledby="academic-title">
        <div className="eyebrow"><span className="small-dot" /> EDUCATION & EXPERIENCE</div>
        <div className="academic-heading-row"><div><h1 id="academic-title">Always<br /><span className="serif-word">becoming.</span></h1><p>My academic journey, from school to university<br className="academic-linebreak" /> and into the working world.</p></div>
          <aside className="academic-current" aria-label="Current academic stage"><GraduationCap size={28} strokeWidth={1.3} aria-hidden="true" /><span className="academic-status">CURRENT CHAPTER</span><strong>Year 3<span>Semester 2</span></strong><p>Asia Pacific University</p><span className="academic-until">Through <time dateTime="2027-01">January 2027</time></span></aside>
        </div>
      </section>
      <section className="academic-timeline shell" aria-labelledby="timeline-title">
        <div className="section-top"><h2 id="timeline-title"><span className="index">01 — 04 /</span> The journey so far</h2><p>Education · University · Industry</p></div>
        <ol className="timeline-list">{academicJourney.map((entry, i) => <li key={entry.name} className={entry.current ? 'timeline-entry is-current' : 'timeline-entry'}>
          <div className="timeline-stage"><span className="timeline-number">0{i + 1}</span><span>{entry.stage}</span></div>
          <div className="timeline-content"><div className="timeline-entry-heading"><h3>{entry.name}</h3>{entry.current && <span className="timeline-current-label">Current</span>}</div><p>{entry.description}</p>{entry.detail && <p className="timeline-detail">{entry.detail}</p>}</div>
        </li>)}</ol>
      </section>
      <section className="academic-next shell"><div><p className="eyebrow">LEARNING INTO MAKING</p><h2>The next chapter<br />is <span className="serif-word">creative.</span></h2></div><a href={`${base}#work`} className="round-link">Explore my work <span><ArrowUpRight size={22} aria-hidden="true" /></span></a></section>
    </main>
    <footer className="academic-footer shell"><span>{portfolio.name} · Multimedia design</span><a href={`${base}#main`}><ArrowLeft size={15} aria-hidden="true" /> Back to portfolio</a></footer>
  </>;
}
