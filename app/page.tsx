import { ArrowDown, ArrowUpRight, Asterisk, Plus } from 'lucide-react';
import { portfolio, projects } from './portfolio';
import OpeningSequence from './OpeningSequence';
import SiteHeader from './SiteHeader';

export default function Home() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader />
    <main id="main">
      <section className="hero shell" aria-labelledby="intro-heading">
        <div className="eyebrow"><span className="small-dot" /> MULTIMEDIA DESIGN PORTFOLIO</div>
        <h1 id="intro-heading">Ideas in motion.<br />Design with <span className="serif-word">feeling.</span><span className="hero-star" aria-hidden="true">✳</span></h1>
        <div className="hero-bottom"><p>{portfolio.intro}</p><a className="round-link" href="#work">Explore the work <span><ArrowDown size={20} aria-hidden="true" /></span></a></div>
        <OpeningSequence />
      </section>
      <section id="work" className="work shell" aria-labelledby="work-heading">
        <div className="section-top"><h2 id="work-heading"><span className="index">01 /</span> Selected work</h2><p>Different mediums. One creative perspective.</p></div>
        <p className="draft-note">DESIGN PREVIEW <span>Sample projects demonstrate the layout. They are not finished portfolio work.</span></p>
        <div className="project-grid">{projects.map((project, i) => <article key={project.id} className={`project ${i === 0 ? 'featured' : ''}`}>
          <div className={`project-cover ${project.style}`}>
            {project.image ? <img src={`${import.meta.env.BASE_URL}${project.image.replace(/^\//, '')}`} alt="Sample abstract artwork: lime and chrome sculptural ribbons against a cobalt background" width={1536} height={1024} fetchPriority="high" /> : <div className="type-cover" aria-hidden="true"><span>{project.coverTop}</span><strong>{project.coverTitle}</strong><span>{project.coverBottom}</span></div>}
            <span className="cover-label">{project.label}</span><span className="cover-number">0{i + 1}</span>
          </div>
          <div className="project-heading"><div><p className="project-category">{project.category}</p><h3>{project.title}</h3></div><span className="project-year">SAMPLE</span></div>
          <p className="project-description">{project.description}</p>
          <details className="case-study"><summary>Explore the case study structure <Plus size={18} aria-hidden="true" /></summary><div className="case-body"><p className="case-notice">Content guide — replace these prompts with your project story.</p><dl>
            <div><dt>The brief</dt><dd>What did you create, who was it for, and what did it need to communicate?</dd></div>
            <div><dt>My role & tools</dt><dd>Identify your contribution, collaborators, software, and project timeline.</dd></div>
            <div><dt>The process</dt><dd>Show sketches, storyboards, experiments, and the decisions behind the final direction.</dd></div>
            <div><dt>The final work</dt><dd>{project.finalPrompt}</dd></div>
            <div><dt>Outcome & reflection</dt><dd>Share real feedback and what you learned. Include measurable results only when you have evidence.</dd></div>
          </dl></div></details>
        </article>)}</div>
      </section>
      <section id="about" className="about shell" aria-labelledby="about-heading">
        <h2 className="section-label" id="about-heading"><span className="index">02 /</span> Behind the work</h2>
        <div><h3>A curious mind.<br />Many ways to <span className="serif-word">create.</span></h3><p className="about-copy">{portfolio.about}</p><a className="academic-link" href={`${import.meta.env.BASE_URL}academic/`}>Explore my academic journey <ArrowUpRight size={18} aria-hidden="true" /></a><div className="disciplines" aria-label="Example creative disciplines">{portfolio.disciplines.map(d => <span key={d}>{d}</span>)}</div><p className="small-note">Example disciplines — ready to personalise.</p></div>
      </section>
      <section id="contact" className="contact" aria-labelledby="contact-heading"><div className="shell"><div className="contact-top"><p className="section-label"><span className="index">03 /</span> Get in touch</p><Asterisk size={52} strokeWidth={1.25} aria-hidden="true" /></div><h2 id="contact-heading">Have an idea?<br />Let’s make it <span className="serif-word">happen.</span></h2>{portfolio.email ? <a className="email-link" href={`mailto:${portfolio.email}`}>{portfolio.email}<ArrowUpRight aria-hidden="true" /></a> : <p className="contact-placeholder">Your email and creative profiles will live here.</p>}<footer><span>{portfolio.name} · Multimedia design</span><span>Portfolio framework / 2026</span><a href="#main">Back to top ↑</a></footer></div></section>
    </main>
  </>;
}

