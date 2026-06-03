import React, { useState } from 'react';
import Splash from './Splash.jsx';

// Show the intro splash once per browser session, and never for visitors who
// prefer reduced motion.
function shouldShowSplash() {
  if (typeof window === 'undefined') return false;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return false;
  return !window.sessionStorage?.getItem('laventra_splash_seen');
}

const navLinks = [
  ['How it works', '#how'],
  ['Features', '#features'],
  ['Dashboard', '#dashboard'],
  ['Pricing', '#pricing'],
  ['FAQ', '#faq'],
];

const problems = [
  {
    num: '01 · Phantom washes',
    stat: '~12%',
    title: 'Cars that go through without a ticket.',
    desc: 'Friends-and-family washes, "I will pay you back later," and the comp-card that quietly never ends.',
  },
  {
    num: '02 · Operator drift',
    stat: '2-4 hrs / wk',
    title: 'Spent reconciling counts by hand.',
    desc: 'Pulling tunnel sensor logs against POS reports, then arguing with the day-shift supervisor.',
  },
  {
    num: '03 · Missed peak',
    stat: '23 min',
    title: 'Average delay before you spot a jam.',
    desc: 'By the time the line is around the block, you have lost three cars to the place down the road.',
  },
];

const steps = [
  ['01', 'Point the camera at the bay', 'Any IP cam above 720p with a clear view of the entry lane. We will send a mount if you need one.', 'camera'],
  ['02', 'AI classifies every vehicle', 'Sedan, SUV, truck, motorbike - with a confidence score and a time-stamped clip in the audit log.', 'car'],
  ['03', 'Reconcile against your POS', 'We pull your ticket data through a one-time API connect and match it car-by-car, ticket-by-ticket.', 'sliders'],
  ['04', 'You get the truth - every shift', 'Auto-generated end-of-shift report with the gap, the timestamps, and the operator on the bay.', 'chart'],
];

const features = [
  ['f-wide', 'clock', 'Live counter, second-by-second', 'Watch every bay in real time. Tap to see the last 24 vehicles, the operator on duty, and the queue depth.'],
  ['f-narrow', 'mail', 'Shift reports', 'Auto-emailed at clock-out. PDF + CSV.'],
  ['f-narrow', 'star', 'Loyalty match', 'Pair counts to member plates and flag suspicious cards.'],
  ['f-wide', 'table', 'Reconciliation that closes itself', 'Tickets-to-cars matched automatically. Mismatches are bucketed by reason: free-wash, voided ticket, manual entry, or no ticket at all. Every flagged event has the clip attached.'],
  ['f-narrow', 'check', 'POS connectors', 'Square, Clover, Toast, ICS, DRB and custom API.'],
  ['f-narrow', 'box', 'Offline-safe', 'Buffers locally if internet drops. Syncs back.'],
  ['f-narrow', 'bell', 'Anomaly alerts', 'SMS the manager the moment a bay drifts above 5%.'],
  ['f-wide', 'user', 'Multi-site, one roof', 'Switch between sites, compare shifts, benchmark operators. Owner-mode rolls up every bay into one P&L view, so you can finally answer which location is actually making money.'],
];

const feedRows = [
  ['14:38', 'SUV · Toyota RAV4', 'matched', false],
  ['14:36', 'Sedan · class A', 'matched', false],
  ['14:34', 'Hatch · unknown', 'no ticket', true],
  ['14:31', 'SUV · class B', 'matched', false],
  ['14:29', 'Sedan · class A', 'matched', false],
  ['14:27', 'Truck · pickup', 'matched', false],
  ['14:25', 'Sedan · class A', 'matched', false],
];

const plans = [
  {
    name: 'Starter',
    price: '$89',
    suffix: ' / bay / month',
    desc: 'For single-bay sites just starting to plug the leaks.',
    cta: 'Start a trial',
    featured: false,
    items: ['1 bay · 1 camera', 'Live counter and shift reports', 'Square / Clover / Toast connectors', 'Email support'],
  },
  {
    name: 'Operator',
    price: '$149',
    suffix: ' / bay / month',
    desc: 'For multi-bay sites with real revenue to defend.',
    cta: 'Book a demo',
    featured: true,
    items: ['Up to 6 bays per site', 'Anomaly SMS alerts', 'Loyalty / plate matching', 'Phone and chat support'],
  },
  {
    name: 'Group',
    price: 'Custom',
    suffix: '',
    desc: 'For chains, franchises and groups above 8 bays.',
    cta: 'Talk to sales',
    featured: false,
    items: ['Unlimited bays · multi-site', 'Owner-mode P&L rollups', 'Custom POS / ERP API', 'Dedicated success manager'],
  },
];

const faqs = [
  ['Do I need to buy new cameras?', 'No. Laventra runs on any IP camera at 720p or above with a clear view of the bay entry. If you do not have one, we will ship a $60 PoE camera as part of onboarding - yours to keep.'],
  ['How accurate is the counter, really?', 'Our deployed average across 42 sites is 99.4%. The remaining 0.6% is almost always two cars that enter back-to-back during peak, and we flag those for human review with a clip.'],
  ['Will this work with my POS?', 'Out of the box: Square, Clover, Toast, ICS Sonny, DRB Patheon. Custom POS? We have integrated 7 of them in the last 12 months - the median connector takes us 4 days.'],
  ['What about my customers privacy?', 'We process vehicles, not faces. Plate data is hashed on-device before it leaves your bay. You own the video; we retain inference metadata only. GDPR-aligned, with a signed DPA.'],
  ['What if my internet goes down?', 'The on-site box buffers up to 14 days locally. When connectivity returns, it syncs back in order. You never lose a count.'],
  ['How long does setup take?', 'For a single-bay site, you are live in under a day: 30 minutes for camera angle, 1 hour for POS connect, the rest is calibration. No concrete to break.'],
];

function Wordmark({ size = 24 }) {
  return (
    <a href="#" className="wm" style={{ fontSize: size }}>
      laven<span className="t">t</span><span className="r">r</span><span className="a">a</span>
    </a>
  );
}

function Icon({ name }) {
  const paths = {
    camera: <><rect x="3" y="6" width="18" height="13" rx="2" /><circle cx="12" cy="12.5" r="3.5" /><circle cx="17.5" cy="9" r="1" fill="currentColor" stroke="none" /></>,
    car: <><path d="M5 11l1.5-4.5A2 2 0 018.4 5h7.2a2 2 0 011.9 1.5L19 11" /><path d="M5 11h14v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-1H9v1a1 1 0 01-1 1H6a1 1 0 01-1-1z" /><circle cx="8" cy="14" r="1" fill="currentColor" stroke="none" /><circle cx="16" cy="14" r="1" fill="currentColor" stroke="none" /></>,
    sliders: <><path d="M3 12h18M3 6h18M3 18h18" /><circle cx="7" cy="6" r="2" fill="#060E1C" /><circle cx="17" cy="12" r="2" fill="#060E1C" /><circle cx="11" cy="18" r="2" fill="#060E1C" /></>,
    chart: <><path d="M3 17l5-6 4 4 8-9" /><path d="M14 6h6v6" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    mail: <path d="M4 19V5l8 6 8-6v14" />,
    star: <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />,
    table: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M9 4v16" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></>,
    box: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M9 12l2 2 4-4" /></>,
    bell: <><path d="M6 10a6 6 0 0112 0v4l2 2H4l2-2v-4z" /><path d="M10 19a2 2 0 004 0" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1" /></>,
  };

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {paths[name]}
      </g>
    </svg>
  );
}

function CheckMark({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12l4 4 10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeroCar() {
  return (
    <svg viewBox="0 0 740 260" aria-hidden="true">
      <defs>
        <linearGradient id="hBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffffff" /><stop offset="100%" stopColor="#c8d4e6" /></linearGradient>
        <linearGradient id="hGlass" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#cdd8e8" /><stop offset="100%" stopColor="#8a9bb8" /></linearGradient>
        <linearGradient id="hRim" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e6ecf5" /><stop offset="100%" stopColor="#7a869d" /></linearGradient>
      </defs>
      <ellipse cx="370" cy="244" rx="290" ry="8" fill="#000" opacity=".45" />
      <path d="M 36 198 L 14 178 L 28 154 Q 60 130 120 122 L 200 102 Q 230 84 280 78 L 470 78 Q 530 86 580 110 L 660 132 Q 712 138 724 162 L 720 198 L 700 210 L 640 210 L 600 210 L 220 210 L 180 210 L 96 210 Z" fill="url(#hBody)" stroke="#0a1424" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 168 102 Q 200 70 248 64 L 458 64 Q 510 70 540 102 L 558 132 L 158 132 Z" fill="url(#hGlass)" stroke="#0a1424" strokeWidth="2" />
      <path d="M 360 70 L 358 130 L 372 130 L 374 70 Z" fill="#0a1424" />
      <path d="M 490 144 L 580 144 Q 600 156 580 178 L 480 178 Q 470 168 478 156 Z" fill="#f0f4fa" stroke="#0a1424" strokeWidth="2" />
      <path d="M 500 158 L 580 158" stroke="#0a1424" strokeWidth="1.4" opacity=".7" />
      <path d="M 110 210 L 620 210 L 600 234 L 130 234 Z" fill="#e2e8f2" stroke="#0a1424" strokeWidth="1.6" />
      <path d="M 38 162 L 80 152 L 86 170 L 44 178 Z" fill="#ffffff" stroke="#0a1424" strokeWidth="1.4" />
      <path d="M 644 154 L 700 158 L 696 174 L 644 170 Z" fill="#0a1424" opacity=".88" />
      {[['170', 42, 38, 28], ['570', 46, 42, 30]].map(([cx, r1, r2, r3]) => (
        <g key={cx}>
          <circle cx={cx} cy="214" r={r1} fill="#0a1424" />
          <circle cx={cx} cy="214" r={r2} fill="#15203a" />
          <circle cx={cx} cy="214" r={r3} fill="#1f2b46" />
          <g stroke="url(#hRim)" strokeWidth="4" strokeLinecap="round">
            <line x1={cx} y1={cx === '170' ? '190' : '186'} x2={cx} y2={cx === '170' ? '238' : '242'} />
            <line x1={Number(cx) - (cx === '170' ? 24 : 28)} y1="214" x2={Number(cx) + (cx === '170' ? 24 : 28)} y2="214" />
            <line x1={Number(cx) - (cx === '170' ? 17 : 20)} y1={cx === '170' ? '197' : '194'} x2={Number(cx) + (cx === '170' ? 17 : 20)} y2={cx === '170' ? '231' : '234'} />
            <line x1={Number(cx) + (cx === '170' ? 17 : 20)} y1={cx === '170' ? '197' : '194'} x2={Number(cx) - (cx === '170' ? 17 : 20)} y2={cx === '170' ? '231' : '234'} />
          </g>
          <circle cx={cx} cy="214" r="5" fill="url(#hRim)" />
        </g>
      ))}
    </svg>
  );
}

function DashboardChart() {
  return (
    <svg viewBox="0 0 600 200" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="cFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2B7FFF" stopOpacity=".35" /><stop offset="100%" stopColor="#00C896" stopOpacity="0" /></linearGradient>
        <linearGradient id="cLine" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#2B7FFF" /><stop offset="100%" stopColor="#00C896" /></linearGradient>
      </defs>
      <g stroke="rgba(91,186,255,.08)" strokeWidth="1">
        <line x1="0" y1="50" x2="600" y2="50" /><line x1="0" y1="100" x2="600" y2="100" /><line x1="0" y1="150" x2="600" y2="150" />
      </g>
      <path d="M 0 150 L 40 140 L 80 110 L 120 90 L 160 60 L 200 38 L 240 50 L 280 78 L 320 50 L 360 30 L 400 58 L 440 86 L 480 110 L 520 130 L 560 148 L 600 158 L 600 200 L 0 200 Z" fill="url(#cFill)" />
      <path d="M 0 150 L 40 140 L 80 110 L 120 90 L 160 60 L 200 38 L 240 50 L 280 78 L 320 50 L 360 30 L 400 58 L 440 86 L 480 110 L 520 130 L 560 148 L 600 158" stroke="url(#cLine)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 0 158 L 40 152 L 80 128 L 120 108 L 160 78 L 200 60 L 240 70 L 280 96 L 320 70 L 360 52 L 400 78 L 440 100 L 480 124 L 520 142 L 560 160 L 600 168" stroke="#ffaa50" strokeWidth="1.8" strokeDasharray="4 4" fill="none" strokeLinecap="round" opacity=".8" />
      <circle cx="360" cy="30" r="5" fill="#fff" stroke="url(#cLine)" strokeWidth="2" />
    </svg>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(shouldShowSplash);

  function dismissSplash() {
    window.sessionStorage?.setItem('laventra_splash_seen', '1');
    setShowSplash(false);
  }

  return (
    <>
      {showSplash && <Splash onDone={dismissSplash} />}

      <nav className="nav">
        <div className="container nav-inner">
          <Wordmark />
          <div className="nav-links">{navLinks.map(([label, href]) => <a href={href} key={href}>{label}</a>)}</div>
          <div className="nav-cta">
            <a href="#login" className="btn btn-ghost nav-btn">Sign in</a>
            <a href="#cta" className="btn btn-primary nav-btn">Book a demo</a>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">AI · Car-Wash Counter</span>
            <h1 className="h1 hero-title">Stop counting cars.<br /><em>Start counting revenue.</em></h1>
            <p className="lede hero-copy">Laventra reads every vehicle that rolls through your bay with computer vision, reconciles it against tickets, cash, and operator counts, and tells you, to the car, how many washes you actually sold today.</p>
            <div className="hero-actions">
              <a href="#cta" className="btn btn-primary">Book a 15-min demo &rarr;</a>
              <a href="#how" className="btn btn-ghost">See how it works</a>
            </div>
            <div className="hero-tags">
              <span><i /> 99.4% counting accuracy</span>
              <span><i /> Installs in under a day</span>
              <span><i /> No new hardware in the bay</span>
            </div>
          </div>

          <div className="bay" aria-hidden="true">
            <div className="bay-chip"><i /> Bay 01 · Live</div>
            <div className="bay-counter"><span className="lbl">Today · Bay 01</span><span className="val">412</span><span className="delta">▲ 18 vs ticket count</span></div>
            <div className="bay-arch" /><div className="bay-spray" /><div className="bay-floor" />
            <div className="bay-car"><HeroCar /></div>
            <div className="bay-bullets">
              <div>SCAN · <b>VEHICLE_CLASS = sedan</b></div>
              <div>EVENT · <b>WASH_START 14:32:08</b></div>
              <div>RECONCILED · <b>TICKET #4192</b></div>
            </div>
          </div>
        </div>
      </header>

      <section className="trust section-tight">
        <div className="container trust-row">
          <div className="label">Operating in <strong>42 sites</strong> across 6 countries</div>
          <div className="trust-logos">
            {['Splash&Co', 'AquaBay', 'NorthLane', 'BaharAuto', 'Suds 9•', 'VettaLavaggio'].map((logo) => <div className="logo" key={logo}>{logo}</div>)}
          </div>
        </div>
      </section>

      <section id="problem">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">The leak</span>
            <h2 className="h2">Every car wash loses money to the same three holes.</h2>
            <p className="lede">If you cannot tell the difference between cars washed and tickets rung, you cannot tell which one is wrong. Most owners do not find out until the quarterly P&L.</p>
          </div>
          <div className="problem-grid">
            {problems.map((item) => (
              <article className="problem-card" key={item.num}>
                <span className="num">{item.num}</span><span className="stat">{item.stat}</span>
                <h3 className="h3">{item.title}</h3><p className="desc">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="how">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">How it works</span>
            <h2 className="h2">From a single camera to a clean balance sheet.</h2>
            <p className="lede">Laventra runs on the camera you already have at the bay entrance. No tunnels, no loops in the concrete, no new wiring.</p>
          </div>
          <div className="how-steps">
            {steps.map(([ix, title, desc, icon]) => (
              <article className="step" key={ix}>
                <div className="icon"><Icon name={icon} /></div><span className="ix">{ix}</span><h3>{title}</h3><p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="features">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What's in the box</span>
            <h2 className="h2">Built for the way you actually run the bay.</h2>
          </div>
          <div className="features-grid">
            {features.map(([span, icon, title, desc]) => (
              <article className={`feature ${span}`} key={title}>
                <div className="icon"><Icon name={icon} /></div><h3>{title}</h3><p>{desc}</p>{span === 'f-wide' && <div className="deco" />}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="dashboard">
        <div className="container">
          <div className="section-head compact-head">
            <span className="eyebrow">The control room</span>
            <h2 className="h2">One screen. Every bay. Every car.</h2>
            <p className="lede">Owners check Laventra the way they used to check the bank app. Here is what they see.</p>
          </div>
          <div className="dash">
            <div>
              <div className="dash-head"><span><span className="dot" />Today · 26 May 2026</span><span>Site · Brisbane Lavaggio</span></div>
              <div className="dash-stats">
                <div className="dash-tile"><span className="k">Cars washed</span><span className="v grad">412</span><span className="d">▲ 6.2% vs Tue</span></div>
                <div className="dash-tile"><span className="k">Reconciled</span><span className="v">394</span><span className="d">▲ 95.6% match</span></div>
                <div className="dash-tile"><span className="k">Phantom</span><span className="v warn-text">18</span><span className="d warn-text">▼ flag for review</span></div>
                <div className="dash-tile"><span className="k">Revenue</span><span className="v grad">$6,872</span><span className="d">▲ $412 recovered</span></div>
              </div>
              <div className="dash-tile feed-tile">
                <div className="dash-head"><span>Live feed · Bay 01</span><span>14:38:22</span></div>
                <div className="dash-feed">
                  {feedRows.map(([time, label, badge, warn]) => <div className="feed-row" key={time + label}><span className="t">{time}</span><span className="p">{label}</span><span className={`b ${warn ? 'warn' : ''}`}>{badge}</span></div>)}
                </div>
              </div>
            </div>
            <div>
              <div className="dash-head"><span>Cars per hour · 7-day rolling</span><span className="mono chart-times"><span>06:00</span><span>14:00</span><span>22:00</span></span></div>
              <div className="dash-tile chart-tile">
                <div className="chart-wrap"><DashboardChart /></div>
                <div className="chart-legend"><span><i className="legend-count" />Cars counted</span><span><i className="legend-ticket" />Tickets sold</span><span className="peak">Peak 14:00 · 47 cars/hr</span></div>
              </div>
              <div className="dash-tile recovered">
                <div className="dash-head"><span>Recovered this month</span><span className="green">+ $4,820</span></div>
                {['From phantom washes|$3,140', 'From operator drift|$980', 'From voided tickets|$700'].map((row) => {
                  const [label, value] = row.split('|');
                  return <div className="recovered-row" key={label}><span>{label}</span><span>{value}</span></div>;
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="roi">
        <div className="container">
          <div className="roi">
            <div><span className="eyebrow">Typical ROI</span><div className="roi-num">8.4x</div><p className="lede">Return on Laventra in the first 90 days, for a single-bay site doing about 80 cars / day.</p></div>
            <ul className="roi-list">
              {['~$1,600/mo recovered|from phantom washes alone (industry avg 12%).', '14 hours/month saved|on shift reconciliation. That is a whole admin day back.', '+9% throughput|after operators learn the system is watching the count.', 'Zero capex.|Runs on your existing IP cam. No tunnel sensors to install.'].map((item) => {
                const [strong, text] = item.split('|');
                return <li key={strong}><CheckMark size={20} /><span><b>{strong}</b> {text}</span></li>;
              })}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="quote">
            <p>The first week we plugged it in, Laventra found 31 washes that never made it to a ticket. That is not a software bill anymore - that is a raise. I check it before I check the bank.</p>
            <div className="quote-by"><div className="avatar">MD</div><div><div className="name">Marco D'Auria</div><div className="role">Owner · Lavaggio Bahar (3 bays, Naples)</div></div></div>
          </div>
        </div>
      </section>

      <section id="pricing">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Pricing</span>
            <h2 className="h2">Pay per bay. Cancel any month.</h2>
            <p className="lede">Every plan includes the AI counter, POS reconciliation, audit clips, and 24-month video retention. No long contracts. No hardware to buy.</p>
          </div>
          <div className="pricing-grid">
            {plans.map((plan) => (
              <article className={`plan ${plan.featured ? 'feat' : ''}`} key={plan.name}>
                {plan.featured && <span className="tag">Most popular</span>}
                <span className="name">{plan.name}</span><div className="price">{plan.price}<small>{plan.suffix}</small></div><p className="desc">{plan.desc}</p>
                <ul>{plan.items.map((item) => <li key={item}><CheckMark />{item}</li>)}</ul>
                <a href="#cta" className={`btn ${plan.featured ? 'btn-primary' : 'btn-ghost'}`}>{plan.cta}</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="container">
          <div className="section-head center-head">
            <span className="eyebrow">Frequently asked</span>
            <h2 className="h2">The honest answers.</h2>
          </div>
          <div className="faq">
            {faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><div>{answer}</div></details>)}
          </div>
        </div>
      </section>

      <section id="cta">
        <div className="container">
          <div className="final-cta">
            <span className="eyebrow">Ready when you are</span>
            <h2>See your real car count by Friday.</h2>
            <p>Book a 15-minute demo. We will pull your last week of POS data, run it through Laventra against a sample of your camera feed, and show you the gap on the call.</p>
            <div className="row"><a href="#" className="btn btn-primary">Book a demo &rarr;</a><a href="mailto:sales@laventra.io" className="btn btn-ghost">Email sales@laventra.io</a></div>
            <p className="small mono cta-note">No card · No commitment · Cancel anytime</p>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="foot">
            <div><Wordmark size={32} /><p className="small foot-copy">The AI car-wash counter. Count every car. Reconcile every ticket. Keep every dollar.</p></div>
            {[
              ['Product', ['Features', 'Dashboard', 'Pricing', 'Changelog']],
              ['Company', ['About', 'Customers', 'Careers', 'Contact']],
              ['Legal', ['Privacy', 'Terms', 'DPA', 'Security']],
            ].map(([title, links]) => <div key={title}><h4>{title}</h4>{links.map((link) => <a href="#" key={link}>{link}</a>)}</div>)}
          </div>
          <div className="foot-bottom"><span>© 2026 Laventra · Built for the lavaggio</span><span>v 1.4 · Status · All systems operational</span></div>
        </div>
      </footer>
    </>
  );
}
