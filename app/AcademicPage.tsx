import { ArrowUpRight, ArrowLeft, ArrowDown, GraduationCap } from 'lucide-react';
import SiteHeader from './SiteHeader';
import { portfolio } from './portfolio';
import JourneyPath from './JourneyPath';
import './academic.css';

export default function AcademicPage() {
  const base = import.meta.env.BASE_URL;
  return <>
    <a className="skip-link" href="#main">Skip to timeline</a>
    <SiteHeader academic />
    <main id="main" className="academic-page">
      <section className="academic-hero shell" aria-labelledby="academic-title">
        <div className="eyebrow"><span className="small-dot" /> A JOURNEY IN THE MAKING</div>
        <div className="academic-heading-row"><div><h1 id="academic-title"><span className="academic-title-line">Every step.</span><span className="academic-title-line"><span className="serif-word">A new horizon.</span></span></h1><p>From my first classroom to the experiences I hope to design.<br className="academic-linebreak" /> Follow the path through my past, present, and possibilities.</p><a className="journey-start" href="#beginnings">Follow my journey <ArrowDown size={18} aria-hidden="true" /></a></div>
          <aside className="academic-current" aria-label="Current academic stage"><GraduationCap size={28} strokeWidth={1.3} aria-hidden="true" /><span className="academic-status">CURRENT CHAPTER</span><strong>Year 3<span>Semester 2</span></strong><p>Asia Pacific University</p><span className="academic-until">Through <time dateTime="2027-01">January 2027</time></span></aside>
        </div>
      </section>
      <section className="academic-timeline shell" aria-labelledby="timeline-title">
        <div className="section-top journey-navigation"><h2 id="timeline-title">The path so far & beyond</h2><nav aria-label="Journey chapters"><a href="#beginnings">Beginnings</a><a href="#now">Now</a><a href="#future">Future <ArrowUpRight size={14} aria-hidden="true" /></a></nav></div>
        <JourneyPath />
      </section>
      <section className="academic-next shell"><div><p className="eyebrow">LEARNING INTO MAKING</p><h2>The next chapter<br />is <span className="serif-word">creative.</span></h2></div><a href={`${base}#work`} className="round-link">Explore my work <span><ArrowUpRight size={22} aria-hidden="true" /></span></a></section>
    </main>
    <footer className="academic-footer shell"><span>{portfolio.name} · Multimedia design</span><a href={`${base}#main`}><ArrowLeft size={15} aria-hidden="true" /> Back to portfolio</a></footer>
  </>;
}
