import { ArrowUpRight, Asterisk } from 'lucide-react';
import { portfolio } from './portfolio';

export default function SiteHeader({ academic = false }: { academic?: boolean }) {
  const base = import.meta.env.BASE_URL;
  const home = academic ? base : '';
  return <header className="site-header shell">
    <a className="wordmark" href={`${home}#main`} aria-label={`${portfolio.name} — portfolio home`}><Asterisk aria-hidden="true" />{portfolio.name}<span>.</span></a>
    <nav aria-label="Main navigation">
      <a href={`${home}#work`}>Work <span>01</span></a>
      <a href={`${home}#about`}>About <span>02</span></a>
      <a href={`${base}academic/`} aria-current={academic ? 'page' : undefined}>Academic <span>03</span></a>
      <a href={`${home}#contact`}>Let’s talk <ArrowUpRight size={17} aria-hidden="true" /></a>
    </nav>
  </header>;
}
