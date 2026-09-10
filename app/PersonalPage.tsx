import { ArrowLeft, ArrowUpRight, AtSign, BriefcaseBusiness, Camera, MessageCircle, MoveHorizontal, Sparkles } from 'lucide-react';
import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { contactProfiles, portfolio } from './portfolio';
import SiteHeader from './SiteHeader';

type Channel = {
  key: 'whatsapp' | 'email' | 'instagram' | 'linkedin';
  label: string;
  detail: string;
  href: string;
  icon: ReactNode;
  note: string;
};

function moveChannel(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const card = event.currentTarget;
  const bounds = card.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;
  card.style.setProperty('--channel-x', `${x * 100}%`);
  card.style.setProperty('--channel-y', `${y * 100}%`);
  card.style.setProperty('--channel-rx', `${(0.5 - y) * 4}deg`);
  card.style.setProperty('--channel-ry', `${(x - 0.5) * 5}deg`);
}

function resetChannel(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty('--channel-rx', '0deg');
  event.currentTarget.style.setProperty('--channel-ry', '0deg');
}

function moveIdentity(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const card = event.currentTarget;
  const bounds = card.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;
  card.style.setProperty('--pointer-x', `${x * 100}%`);
  card.style.setProperty('--pointer-y', `${y * 100}%`);
  card.style.setProperty('--identity-tilt-x', `${(0.5 - y) * 7}deg`);
  card.style.setProperty('--identity-tilt-y', `${(x - 0.5) * 7}deg`);
}

function resetIdentity(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty('--identity-tilt-x', '0deg');
  event.currentTarget.style.setProperty('--identity-tilt-y', '0deg');
}

const channels: Channel[] = [
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    detail: contactProfiles.whatsapp || 'Phone number needed',
    href: contactProfiles.whatsapp ? `https://wa.me/${contactProfiles.whatsapp.replace(/\D/g, '')}` : '',
    icon: <MessageCircle aria-hidden="true" />,
    note: 'For a quick hello or project conversation',
  },
  {
    key: 'email',
    label: 'Email',
    detail: contactProfiles.email || 'Email address needed',
    href: contactProfiles.email ? `mailto:${contactProfiles.email}` : '',
    icon: <AtSign aria-hidden="true" />,
    note: 'For briefs, opportunities, and longer messages',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    detail: contactProfiles.instagram ? '@oyy_0208' : 'Profile link needed',
    href: contactProfiles.instagram,
    icon: <Camera aria-hidden="true" />,
    note: 'For visual experiments and work in progress',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    detail: contactProfiles.linkedin ? 'Ong Yu Yang on LinkedIn' : 'Profile link needed',
    href: contactProfiles.linkedin,
    icon: <BriefcaseBusiness aria-hidden="true" />,
    note: 'For my professional journey and experience',
  },
];

function ChannelVisual({ type }: { type: Channel['key'] }) {
  if (type === 'whatsapp') return <div className="channel-visual visual-whatsapp" aria-hidden="true">
    <span className="radar-ring radar-one" /><span className="radar-ring radar-two" />
    <span className="radar-core"><MessageCircle /></span>
    <span className="signal-status"><i /> SIGNAL OPEN</span>
  </div>;

  if (type === 'email') return <div className="channel-visual visual-email" aria-hidden="true">
    <span className="mail-signal"><i /><i /><i /></span>
    <span className="mail-window"><b>NEW MESSAGE</b><i /><i /><i /></span>
    <span className="mail-cursor" />
  </div>;

  if (type === 'instagram') return <div className="channel-visual visual-instagram" aria-hidden="true">
    <span className="aperture-ring"><i /><i /><i /><i /><i /><i /></span>
    <span className="aperture-core"><Camera /></span>
    <span className="aperture-count">08 / 24</span>
  </div>;

  return <div className="channel-visual visual-linkedin" aria-hidden="true">
    <svg viewBox="0 0 320 150"><path d="M28 116 102 62l58 43 70-72 62 50" /><path d="m102 62 38-32 90 3" /></svg>
    {Array.from({ length: 6 }, (_, index) => <i key={index} />)}
    <span className="network-label">LET’S BUILD / TOGETHER</span>
  </div>;
}

function ChannelCard({ channel, index }: { channel: Channel; index: number }) {
  const content = <>
    <span className="channel-glow" aria-hidden="true" />
    <span className="channel-top"><span className="channel-number">{String(index + 1).padStart(2, '0')}</span><span className="channel-availability"><i /> {channel.href ? 'AVAILABLE' : 'OFFLINE'}</span></span>
    <ChannelVisual type={channel.key} />
    <span className="channel-bottom">
      <span className="channel-icon">{channel.icon}</span>
      <span className="channel-copy"><strong>{channel.label}</strong><span>{channel.note}</span><small>{channel.detail}</small></span>
      {channel.href ? <span className="channel-open">OPEN <ArrowUpRight className="channel-arrow" aria-hidden="true" /></span> : <span className="channel-needed">DETAIL NEEDED</span>}
    </span>
  </>;

  return channel.href
    ? <a className={`channel-card channel-${channel.key} is-ready`} href={channel.href} target={channel.href.startsWith('mailto:') ? undefined : '_blank'} rel={channel.href.startsWith('mailto:') ? undefined : 'noreferrer'} onPointerMove={moveChannel} onPointerLeave={resetChannel}>{content}</a>
    : <div className={`channel-card channel-${channel.key} is-missing`} aria-disabled="true">{content}</div>;
}

export default function PersonalPage() {
  const base = import.meta.env.BASE_URL;
  const missing = channels.filter(channel => !channel.href).length;
  const [cardAngle, setCardAngle] = useState(0);
  const cardDrag = useRef<{ pointerId: number; startX: number; startAngle: number; delta: number } | null>(null);
  const cardBackVisible = Math.abs(Math.round(cardAngle / 180)) % 2 === 1;
  const cardStyle = { '--card-rest-angle': `${cardAngle}deg` } as CSSProperties;

  const startCardDrag = (event: PointerEvent<HTMLElement>) => {
    if (!event.isPrimary) return;
    cardDrag.current = { pointerId: event.pointerId, startX: event.clientX, startAngle: cardAngle, delta: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add('is-dragging');
    event.currentTarget.style.setProperty('--identity-tilt-x', '0deg');
    event.currentTarget.style.setProperty('--identity-tilt-y', '0deg');
  };

  const moveCard = (event: PointerEvent<HTMLElement>) => {
    const drag = cardDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      moveIdentity(event);
      return;
    }
    const width = Math.max(event.currentTarget.getBoundingClientRect().width, 1);
    drag.delta = Math.max(-210, Math.min(210, ((event.clientX - drag.startX) / width) * 230));
    event.currentTarget.style.setProperty('--card-drag-angle', `${drag.delta}deg`);
  };

  const finishCardDrag = (event: PointerEvent<HTMLElement>) => {
    const drag = cardDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const stage = event.currentTarget;
    const nextAngle = Math.abs(drag.delta) < 24 ? drag.startAngle : Math.round((drag.startAngle + drag.delta) / 180) * 180;
    stage.classList.remove('is-dragging');
    setCardAngle(nextAngle);
    stage.style.setProperty('--card-drag-angle', '0deg');
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    cardDrag.current = null;
  };

  const turnCardWithKeyboard = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    setCardAngle(value => value + (event.key === 'ArrowRight' ? 180 : -180));
  };

  return <>
    <a className="skip-link" href="#main">Skip to introduction</a>
    <SiteHeader personal />
    <main id="main" className="personal-page">
      <section className="personal-hero shell" aria-labelledby="personal-title">
        <div className="personal-intro">
          <p className="eyebrow"><span className="small-dot" /> A LITTLE MORE PERSONAL</p>
          <h1 id="personal-title">
            <span className="intro-typewriter"><span>Hi, I’m</span><i aria-hidden="true" /></span>{' '}
            <span className="serif-word name-typewriter" aria-label="Yu Yang.">
              {Array.from('Yu Yang.').map((character, index) => <span className={`name-letter${character === ' ' ? ' name-letter-space' : ''}`} style={{ '--letter-index': index } as CSSProperties} aria-hidden="true" key={`${character}-${index}`}>{character === ' ' ? '\u00a0' : character}</span>)}
              <i aria-hidden="true" />
            </span>
            <br />
            <span className="connect-title-reveal">
              <span className="connect-word connect-word-left">Let’s</span>
              <span className="title-connection" aria-hidden="true"><i /><b /><i /></span>
              <span className="connect-word connect-word-right">connect.</span>
            </span>
          </h1>
          <p className="personal-lede">I’m a multimedia design student who enjoys turning ideas into visual identities, moving images, and digital experiences. I’m currently exploring where UI/UX, immersive technology, and AI can meet thoughtful human-centred design.</p>
          <a className="personal-work-link" href={`${base}#work`}>See what I’m creating <ArrowUpRight size={18} aria-hidden="true" /></a>
        </div>
        <aside className="personal-card-stage" aria-label="3D identity card. Drag horizontally to turn it." onPointerDown={startCardDrag} onPointerMove={moveCard} onPointerUp={finishCardDrag} onPointerCancel={finishCardDrag} onPointerLeave={resetIdentity}>
          <div className="personal-card" style={cardStyle}>
            <div className="personal-card-face personal-card-front">
              <div className="identity-scene" aria-hidden="true">
                <div className="identity-orbit orbit-one" />
                <div className="identity-orbit orbit-two" />
                <div className="identity-core"><span>OY</span><small>CREATIVE SIGNAL</small></div>
                <div className="identity-card-back">
                  <span className="card-corner">OY<small>✦</small></span>
                  <span className="card-emblem"><b>OY</b><small>CREATIVE WILD</small></span>
                  <span className="card-corner card-corner-bottom">OY<small>✦</small></span>
                </div>
                <div className="identity-shards">{Array.from({ length: 6 }, (_, index) => <i key={index} />)}</div>
                <div className="identity-scan" />
                <span className="identity-hint">HOVER TO REVEAL / DRAG TO TURN</span>
              </div>
              <div className="personal-card-copy"><span className="personal-status"><i /> CURRENTLY LEARNING & CREATING</span><strong>{portfolio.name}</strong></div>
            </div>
            <div className="personal-card-face personal-card-rear">
              <span className="rear-corner">OY / 01</span>
              <div className="rear-orbit" aria-hidden="true"><i /><i /><i /></div>
              <div className="rear-monogram"><span>OY</span><small>DIGITAL IDENTITY</small></div>
              <div className="rear-copy"><p>CURIOUS BY DESIGN</p><strong>Ideas become real<br />when people connect.</strong><span>UI/UX · MOTION · AR/VR · AI</span></div>
              <span className="rear-code">KUALA LUMPUR / 2026</span>
            </div>
            <i className="card-edge card-edge-left" aria-hidden="true" />
            <i className="card-edge card-edge-right" aria-hidden="true" />
            <i className="card-edge card-edge-top" aria-hidden="true" />
            <i className="card-edge card-edge-bottom" aria-hidden="true" />
          </div>
          <input className="card-rotation-input" type="range" min="0" max="1" step="1" value={cardBackVisible ? 1 : 0} aria-label={`Card side: ${cardBackVisible ? 'back' : 'front'}. Use left and right arrow keys to turn.`} onChange={event => setCardAngle(Number(event.currentTarget.value) * 180)} onKeyDown={turnCardWithKeyboard} />
          <span className="card-drag-hint"><MoveHorizontal size={15} aria-hidden="true" /> DRAG TO TURN · {cardBackVisible ? 'BACK' : 'FRONT'}</span>
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
