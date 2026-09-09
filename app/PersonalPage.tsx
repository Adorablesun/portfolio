import { ArrowLeft, ArrowUpRight, AtSign, BriefcaseBusiness, Camera, MessageCircle, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { contactProfiles, portfolio } from './portfolio';
import SiteHeader from './SiteHeader';

type Channel = {
  label: string;
  detail: string;
  href: string;
  icon: ReactNode;
  note: string;
};

const channels: Channel[] = [
  {
    label: 'WhatsApp',
    detail: contactProfiles.whatsapp || 'Phone number needed',
    href: contactProfiles.whatsapp ? `https://wa.me/${contactProfiles.whatsapp.replace(/\D/g, '')}` : '',
    icon: <MessageCircle aria-hidden="true" />,
    note: 'For a quick hello or project conversation',
  },
  {
    label: 'Email',
    detail: contactProfiles.email || 'Email address needed',
    href: contactProfiles.email ? `mailto:${contactProfiles.email}` : '',
    icon: <AtSign aria-hidden="true" />,
    note: 'For briefs, opportunities, and longer messages',
  },
  {
    label: 'Instagram',
    detail: contactProfiles.instagram ? '@oyy_0208' : 'Profile link needed',
    href: contactProfiles.instagram,
    icon: <Camera aria-hidden="true" />,
    note: 'For visual experiments and work in progress',
  },
  {
    label: 'LinkedIn',
    detail: contactProfiles.linkedin ? 'Ong Yu Yang on LinkedIn' : 'Profile link needed',
    href: contactProfiles.linkedin,
    icon: <BriefcaseBusiness aria-hidden="true" />,
    note: 'For my professional journey and experience',
  },
];

function ChannelCard({ channel, index }: { channel: Channel; index: number }) {
  const content = <>
    <span className="channel-number">{String(index + 1).padStart(2, '0')}</span>
    <span className="channel-icon">{channel.icon}</span>
    <span className="channel-copy"><strong>{channel.label}</strong><span>{channel.note}</span><small>{channel.detail}</small></span>
    {channel.href ? <ArrowUpRight className="channel-arrow" aria-hidden="true" /> : <span className="channel-needed">DETAIL NEEDED</span>}
  </>;

  return channel.href
    ? <a className="channel-card is-ready" href={channel.href} target={channel.href.startsWith('mailto:') ? undefined : '_blank'} rel={channel.href.startsWith('mailto:') ? undefined : 'noreferrer'}>{content}</a>
    : <div className="channel-card is-missing" aria-disabled="true">{content}</div>;
}

export default function PersonalPage() {
  const base = import.meta.env.BASE_URL;
  const missing = channels.filter(channel => !channel.href).length;

  return <>
    <a className="skip-link" href="#main">Skip to introduction</a>
    <SiteHeader personal />
    <main id="main" className="personal-page">
      <section className="personal-hero shell" aria-labelledby="personal-title">
        <div className="personal-intro">
          <p className="eyebrow"><span className="small-dot" /> A LITTLE MORE PERSONAL</p>
          <h1 id="personal-title">Hi, I’m <span className="serif-word">Yu Yang.</span><br />Let’s connect.</h1>
          <p className="personal-lede">I’m a multimedia design student who enjoys turning ideas into visual identities, moving images, and digital experiences. I’m currently exploring where UI/UX, immersive technology, and AI can meet thoughtful human-centred design.</p>
          <a className="personal-work-link" href={`${base}#work`}>See what I’m creating <ArrowUpRight size={18} aria-hidden="true" /></a>
        </div>
        <aside className="personal-card" aria-label="About Ong Yu Yang">
          <div className="personal-monogram" aria-hidden="true"><span>OY</span><span>YANG</span></div>
          <div className="personal-card-copy"><span className="personal-status"><i /> CURRENTLY LEARNING & CREATING</span><strong>{portfolio.name}</strong><p>Year 3 · Semester 2<br />Asia Pacific University</p></div>
        </aside>
      </section>

      <section className="personal-values shell" aria-label="Creative interests">
        <p>WHAT I’M DRAWN TO</p>
        <div><span>UI / UX</span><span>Motion</span><span>AR / VR</span><span>AI + creativity</span></div>
      </section>

      <section className="connect-section" aria-labelledby="connect-title">
        <div className="shell">
          <div className="connect-heading">
            <div><p className="eyebrow"><Sparkles size={14} aria-hidden="true" /> OPEN THE CONVERSATION</p><h2 id="connect-title">Choose your<br /><span className="serif-word">way in.</span></h2></div>
            <p>Whether it’s a collaboration, an opportunity, or simply a shared interest in design and technology, I’d be happy to hear from you.</p>
          </div>
          <div className="channel-list">{channels.map((channel, index) => <ChannelCard channel={channel} index={index} key={channel.label} />)}</div>
          {missing > 0 && <p className="contact-setup-note">{missing} contact {missing === 1 ? 'detail is' : 'details are'} still needed before every channel can open.</p>}
          <footer className="personal-footer"><span>{portfolio.name} · Multimedia design</span><a href={`${base}#main`}><ArrowLeft size={15} aria-hidden="true" /> Back to portfolio</a></footer>
        </div>
      </section>
    </main>
  </>;
}
