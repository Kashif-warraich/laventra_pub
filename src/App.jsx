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
  ['The app', '#dashboard'],
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
  ['01', 'A camera watches the lane', 'One IP camera over each bay streams the entry lane to the on-site AI box. Any 720p+ feed works - no tunnels, no loops in the concrete.', 'camera'],
  ['02', 'The AI logs every vehicle', 'On-device, it reads each vehicle - class and plate - and writes a time-stamped event, with a clip, the moment a wash starts.', 'chip'],
  ['03', 'Events sync to the server', 'Counts, device health and alerts post to your account in real time, and buffer locally if the internet drops.', 'server'],
  ['04', 'You watch from your phone', "Open the Laventra app to see today's washes, every event, and a push alert the second a bay goes down - across all your lavaggi.", 'phone'],
];

const features = [
  ['f-wide', 'clock', 'Live wash count', 'Watch every bay count up in real time from your phone. Tap any bay to see the last vehicles, the device on it, and the queue forming.'],
  ['f-narrow', 'mail', 'Reports', 'One-tap PDF + CSV for any day, bay or site. Auto-generated and emailed at clock-out.'],
  ['f-narrow', 'star', 'Loyalty match', 'Match washes to members via an on-device plate hash you control. Flags suspicious comp cards.'],
  ['f-wide', 'table', 'Every wash is an event', 'The AI writes one time-stamped event per vehicle - plate, class, bay, and a clip. Browse, filter and search the whole log; nothing is just a number you have to trust.'],
  ['f-narrow', 'check', 'Device health', 'Every camera and AI box, online or offline at a glance. Know a bay went dark before your staff does.'],
  ['f-narrow', 'box', 'Offline-safe', 'Buffers locally if internet drops. Syncs back in order.'],
  ['f-narrow', 'bell', 'Push alerts', 'A device drops or errors spike - your phone buzzes the same second, via push.'],
  ['f-narrow', 'activity', 'Peak & queue alerts', 'Spot a line forming in real time and get pinged before cars drive off to the place down the road.'],
  ['f-wide', 'user', 'All your lavaggi, one app', 'Switch between sites, compare shifts, benchmark operators. Owner-mode rolls every bay into one view, so you can finally answer which location is actually making money.'],
];

// Mirrors the real Laventra mobile app (see laventra_mobile): a 2x2 stat grid,
// the active-devices card, and the recent-events log the owner watches.
const appStats = [
  ["TODAY'S WASHES", '412', '+ live count', 'blue'],
  ['ACTIVE DEVICES', '7/8', '1 offline', 'teal'],
  ['PENDING ALERTS', '3', 'Needs review', 'amber'],
  ['ERRORS', '2', 'Today', 'red'],
];

const appDevices = [
  ['Bay 01 · Camera', 'Brisbane · Camera', 'camera', 'blue', 'On', 'teal'],
  ['AI Box · Brisbane', 'Brisbane · AI', 'chip', 'purple', 'On', 'teal'],
  ['Bay 03 · Camera', 'Naples · Camera', 'camera', 'red', 'Off', 'red'],
];

const appEvents = [
  ['7BQ 4192', '14:38 · Bay 01', true],
  ['RAV 221', '14:36 · Bay 01', true],
  ['9KX 005', '14:34 · Bay 02', false],
];

const appNav = [
  ['home', 'Home', true],
  ['events', 'Events', false],
  ['carwash', 'Lavaggi', false],
  ['reports', 'Reports', false],
  ['profile', 'Profile', false],
];

const plans = [
  {
    name: 'Starter',
    price: '$89',
    suffix: ' / bay / month',
    desc: 'For single-bay sites just starting to plug the leaks.',
    cta: 'Start a trial',
    featured: false,
    items: ['1 bay · 1 camera', 'Live app + event log', 'PDF / CSV reports', 'Email support'],
  },
  {
    name: 'Operator',
    price: '$149',
    suffix: ' / bay / month',
    desc: 'For multi-bay sites with real revenue to defend.',
    cta: 'Book a demo',
    featured: true,
    items: ['Up to 6 bays per site', 'Push + SMS alerts', 'Loyalty / plate matching', 'Phone and chat support'],
  },
  {
    name: 'Group',
    price: 'Custom',
    suffix: '',
    desc: 'For chains, franchises and groups above 8 bays.',
    cta: 'Talk to sales',
    featured: false,
    items: ['Unlimited bays · multi-site', 'Owner-mode rollups', 'Custom API & webhooks', 'Dedicated success manager'],
  },
];

const faqs = [
  ['Do I need to buy new cameras?', 'No. Laventra runs on any IP camera at 720p or above with a clear view of the bay entry. If you do not have one, we will ship a $60 PoE camera as part of onboarding - yours to keep.'],
  ['How accurate is the counter, really?', 'Our deployed average across 42 sites is 99.4%. The remaining 0.6% is almost always two cars that enter back-to-back during peak, and we flag those for human review with a clip.'],
  ['Which phones does the app run on?', 'Laventra is a native iOS and Android app - free for every user on your account, with Face ID / fingerprint login and push notifications. There is a read-only web view too, for the back office.'],
  ['Can I run more than one car wash from the app?', 'Yes - Laventra is multi-site from day one. Each lavaggio rolls up its own washes, devices and alerts, and owner-mode gives you one combined view to compare them. Switch sites with a tap.'],
  ['What about my customers privacy?', 'We process vehicles, not faces. Plates are turned into a salted, irreversible hash on-device before anything leaves your bay - that hash is what powers loyalty matching, so we never store or transmit a readable plate. You own the video; we keep inference metadata only. GDPR-aligned and CCPA-ready, with a signed DPA and SOC 2 Type II underway.'],
  ['What if my internet goes down?', 'The on-site box buffers up to 14 days locally. When connectivity returns, it syncs back in order. You never lose a count.'],
  ['How long does setup take?', 'For a single-bay site, you are live in under a day: 30 minutes for camera angle, 1 hour for POS connect, the rest is calibration. No concrete to break.'],
  ['How does per-bay pricing work, and am I locked in?', 'A "bay" is one camera watching one wash lane. Billing is monthly with no contract - cancel any month - or save two months on an annual plan. Onboarding and your first PoE camera are included free; there is no setup fee.'],
];

const testimonials = [
  {
    quote: 'The first week we plugged it in, Laventra found 31 washes that never made it to a ticket. That is not a software bill anymore - that is a raise. I check it before I check the bank.',
    initials: 'MD', name: "Marco D'Auria", role: 'Owner · Lavaggio Bahar (3 bays, Naples)',
  },
  {
    quote: 'Reconciliation used to eat my whole Monday. Now the shift report lands in my inbox at clock-out and it already matches the POS. I got my mornings back.',
    initials: 'SK', name: 'Sarah Keller', role: 'Operations Lead · NorthLane Wash (Denver)',
  },
  {
    quote: 'The peak alert is the sleeper feature. We open the second bay the moment a line starts to form - we stopped handing the 5pm rush to the place down the road.',
    initials: 'RA', name: 'Ravi Anand', role: 'Owner · 4-site group (Brisbane)',
  },
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
    activity: <path d="M3 12h4l3 8 4-16 3 8h4" />,
    chip: <><rect x="7" y="7" width="10" height="10" rx="2" /><rect x="10" y="10" width="4" height="4" rx="1" /><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" /></>,
    server: <><rect x="4" y="4" width="16" height="7" rx="2" /><rect x="4" y="13" width="16" height="7" rx="2" /><path d="M7.5 7.5h.01M7.5 16.5h.01" /></>,
    phone: <><rect x="7" y="3" width="10" height="18" rx="2.5" /><path d="M10.5 18h3" /></>,
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

// Small line icons for the app's bottom navigation bar.
function PhoneNavIcon({ name }) {
  const p = {
    home: <path d="M4 11l8-7 8 7M6 10v9h12v-9" />,
    events: <><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M4 9h16M8 3v4M16 3v4" /></>,
    carwash: <><path d="M6 16v-4l1.5-4h9L18 12v4M5 16h14v3H5z" /><path d="M9 9V6M12 9V5M15 9V6" /></>,
    reports: <path d="M5 19V11M10 19V5M15 19v-6M20 19v-3" />,
    profile: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0114 0" /></>,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{p[name]}</svg>
  );
}

// A faithful mockup of the Laventra owner app's Home tab, rebuilt from the real
// Flutter screens so the marketing site shows the actual product.
function AppPhone() {
  const c = { blue: 'var(--p-blue)', teal: 'var(--p-teal)', amber: 'var(--p-amber)', red: 'var(--p-red)', purple: 'var(--p-purple)' };
  return (
    <div className="phone" role="img" aria-label="The Laventra owner app, Home tab: 412 washes today, 7 of 8 devices online, 3 pending alerts, the active-devices list, and a live feed of recent wash events by number plate.">
      <div className="phone-screen">
        <span className="phone-notch" />
        <div className="app-scroll">
          <div className="app-h">
            <span className="app-logo">L</span>
            <span className="greet"><small>Good morning, Marco</small><b>Dashboard</b></span>
            <span className="app-bell"><Icon name="bell" /></span>
          </div>
          <div className="app-grid">
            {appStats.map(([k, v, s, col]) => (
              <div className="app-stat" key={k}>
                <span className="k">{k}</span>
                <span className="v" style={{ color: c[col] }}>{v}</span>
                <span className="s">{s}</span>
              </div>
            ))}
          </div>
          <div className="app-card2">
            <div className="ct"><b>Active Devices</b><span className="lnk">7 online · 1 offline</span></div>
            {appDevices.map(([name, sub, icon, accent, pill, pc]) => (
              <div className="app-row" key={name}>
                <span className="ic" style={{ color: c[accent] }}><Icon name={icon} /></span>
                <span className="tx"><b>{name}</b><small>{sub}</small></span>
                <span className={`pill ${pc}`}>{pill}</span>
              </div>
            ))}
          </div>
          <div className="app-card2">
            <div className="ct"><b>Recent Events</b><a className="see">See all</a></div>
            {appEvents.map(([plate, sub, ok]) => (
              <div className="app-row" key={plate}>
                <span className="ic" style={{ color: ok ? c.teal : c.red }}><Icon name="car" /></span>
                <span className="tx"><b className="plate">{plate}</b><small>{sub}</small></span>
                <span className={`pill ${ok ? 'teal' : 'red'}`}>{ok ? 'Done' : 'Err'}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="app-nav2">
          {appNav.map(([icon, label, on]) => (
            <span key={label} className={on ? 'on' : ''}><PhoneNavIcon name={icon} />{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// The site has no backend, so the demo request is composed into a prefilled
// email the visitor sends from their own client — a real, working hand-off
// rather than a dead button.
function DemoForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = (f.get('name') || '').toString().trim();
    const site = (f.get('site') || '').toString().trim();
    const bays = (f.get('bays') || '').toString().trim();
    const email = (f.get('email') || '').toString().trim();
    const subject = encodeURIComponent(`Demo request - ${site || name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nSite / company: ${site}\nNumber of bays: ${bays}\nReply-to: ${email}\n\nI'd like a 15-minute Laventra demo.`,
    );
    window.location.href = `mailto:sales@laventra.io?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <form className="demo-form" onSubmit={handleSubmit}>
      <div className="df-row">
        <input name="name" type="text" placeholder="Your name" required aria-label="Your name" />
        <input name="site" type="text" placeholder="Site or company" aria-label="Site or company" />
      </div>
      <div className="df-row">
        <input name="email" type="email" placeholder="Work email" required aria-label="Work email" />
        <input name="bays" type="number" min="1" placeholder="Bays" aria-label="Number of bays" />
      </div>
      <button type="submit" className="btn btn-primary df-submit">Book my 15-min demo &rarr;</button>
      {sent && <p className="df-sent">Opening your email app — if nothing happens, write us at <a href="mailto:sales@laventra.io">sales@laventra.io</a>.</p>}
    </form>
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
            <a href="https://app.laventra.io" className="btn btn-ghost nav-btn">Sign in</a>
            <a href="#cta" className="btn btn-primary nav-btn">Book a demo</a>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">AI · Car-Wash Counter</span>
            <h1 className="h1 hero-title">Stop counting cars.<br /><em>Start counting revenue.</em></h1>
            <p className="lede hero-copy">A camera over each bay feeds an on-site AI that logs every vehicle the moment it's washed. The count, the clip and the alerts land in your phone in real time - so you always know, to the car, how many washes you actually sold today.</p>
            <div className="hero-actions">
              <a href="#cta" className="btn btn-primary">Book a 15-min demo &rarr;</a>
              <a href="#dashboard" className="btn btn-ghost">See the app</a>
            </div>
            <div className="hero-tags">
              <span><i /> 99.4% counting accuracy</span>
              <span><i /> Live on iOS &amp; Android</span>
              <span><i /> Push alerts when a bay drops</span>
            </div>
          </div>

          <div className="bay" aria-hidden="true">
            <div className="bay-chip"><i /> Bay 01 · Live</div>
            <div className="bay-counter"><span className="lbl">Today · Bay 01</span><span className="val">412</span><span className="delta flag">⚑ 18 unticketed · flagged</span></div>
            <div className="bay-arch" /><span className="bay-arch-r" /><div className="bay-spray" /><div className="bay-floor" />
            <div className="bay-car"><img src="/assets/car-clean.png" alt="" draggable="false" /></div>
            <div className="bay-bullets">
              <div>SCAN · <b>VEHICLE_CLASS = sedan</b></div>
              <div>EVENT · <b>WASH_START 14:32:08</b></div>
              <div>SYNCED · <b>EVENT #4192 → APP</b></div>
            </div>
          </div>
          <p className="sr-only">Product preview: a live wash-bay view for Bay 01 showing 412 cars counted today, with each vehicle logged as an event and synced to the owner's phone.</p>
        </div>
      </header>

      <section className="trust section-tight">
        <div className="container">
          <div className="trust-metrics">
            {[['42', 'sites live'], ['6', 'countries'], ['3.2M', 'cars counted'], ['99.4%', 'counting accuracy'], ['$1.8M', 'recovered for owners']].map(([n, l]) => (
              <div className="metric" key={l}><span className="m-num">{n}</span><span className="m-lbl">{l}</span></div>
            ))}
          </div>
          <div className="trust-pos">
            <span className="trust-pos-label">Camera in, phone out</span>
            <div className="pos-logos">{['Any IP camera', 'Hikvision', 'Dahua', 'iOS app', 'Android app'].map((p) => <span className="pos" key={p}>{p}</span>)}</div>
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
            <h2 className="h2">From the camera in the bay to the app in your pocket.</h2>
            <p className="lede">Laventra runs on the camera you already have at the bay entrance, turns every wash into an event on the server, and puts it all in your phone. No tunnels, no loops in the concrete, no new wiring.</p>
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
            <span className="eyebrow">In your pocket</span>
            <h2 className="h2">The whole car wash, on your phone.</h2>
            <p className="lede">The owner opens the Laventra app the way they used to check the bank app. Here is exactly what they see.</p>
          </div>
          <div className="app-show">
            <ul className="app-points">
              {[
                ["Today's washes, live", 'Every bay counting up as the cars roll through - no waiting for an end-of-day report.'],
                ['Every event, with the plate and a clip', 'Tap any wash to see the vehicle, the time, the device, and the footage behind it.'],
                ['Device health at a glance', 'Cameras and AI boxes, online or offline - you hear about a dead bay before your staff does.'],
                ['Push the second it matters', 'A bay drops, errors spike, or a line forms - your phone buzzes in real time.'],
                ['All your lavaggi in one place', 'Switch sites, compare shifts, and roll every bay into one owner view.'],
              ].map(([title, desc]) => (
                <li className="app-point" key={title}>
                  <CheckMark size={20} />
                  <div><h3>{title}</h3><p>{desc}</p></div>
                </li>
              ))}
            </ul>
            <div className="phone-wrap"><AppPhone /></div>
          </div>
        </div>
      </section>

      <section id="roi">
        <div className="container">
          <div className="roi">
            <div>
              <span className="eyebrow">Typical ROI</span>
              <div className="roi-num">$1,650</div>
              <p className="lede">Recovered every month on a typical single-bay site - against $89 for the Starter plan. Laventra pays for itself before the 2nd of the month, then keeps going.</p>
              <p className="roi-assume mono">Modeled on 80 cars/day · $14 avg ticket · recovering a conservative 5% leak (industry average runs up to 12%).</p>
            </div>
            <ul className="roi-list">
              {['~$1,650/mo recovered|from washes that never reached a ticket - modeled at less than half the industry-average leak.', '14 hours/month saved|on shift reconciliation. That is a whole admin day back, every month.', '+9% throughput|once peak alerts let you open the next bay before the line forms.', 'Zero capex.|Runs on your existing IP cam, with your first camera and onboarding included.'].map((item) => {
                const [strong, text] = item.split('|');
                return <li key={strong}><CheckMark size={20} /><span><b>{strong}</b> {text}</span></li>;
              })}
            </ul>
          </div>
        </div>
      </section>

      <section id="customers">
        <div className="container">
          <div className="section-head center-head">
            <span className="eyebrow">From the bay</span>
            <h2 className="h2">Operators who stopped guessing.</h2>
          </div>
          <div className="quotes-grid">
            {testimonials.map((t) => (
              <figure className="quote" key={t.name}>
                <blockquote>{t.quote}</blockquote>
                <figcaption className="quote-by"><div className="avatar">{t.initials}</div><div><div className="name">{t.name}</div><div className="role">{t.role}</div></div></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Pricing</span>
            <h2 className="h2">Pay per bay. Cancel any month.</h2>
            <p className="lede">Every plan includes the AI counter, the iOS &amp; Android app, the per-vehicle event log with clips, push alerts, and 24-month video retention. No long contracts.</p>
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
          <p className="pricing-note">A <strong>bay</strong> is one camera on one wash lane. Billed monthly - cancel anytime - or save two months on annual. Onboarding and your first PoE camera are included free; no setup fee.</p>
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
            <DemoForm />
            <p className="small cta-or">Prefer email? Write us at <a href="mailto:sales@laventra.io">sales@laventra.io</a>.</p>
            <p className="small mono cta-note">No card · No commitment · Cancel anytime</p>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="foot">
            <div><Wordmark size={32} /><p className="small foot-copy">The AI car-wash counter. Count every car. Reconcile every ticket. Keep every dollar.</p></div>
            {[
              ['Product', [['Features', '#features'], ['The app', '#dashboard'], ['Pricing', '#pricing'], ['FAQ', '#faq']]],
              ['Company', [['How it works', '#how'], ['Customers', '#customers'], ['Careers', 'mailto:careers@laventra.io'], ['Contact', '#cta']]],
              ['Legal', [['Privacy', '/legal/privacy.html'], ['Terms', '/legal/terms.html'], ['DPA', '/legal/dpa.html'], ['Security', '/legal/security.html']]],
            ].map(([title, links]) => <div key={title}><h4>{title}</h4>{links.map(([label, href]) => <a href={href} key={label}>{label}</a>)}</div>)}
          </div>
          <div className="foot-bottom"><span>© 2026 Laventra · Built for the lavaggio</span><span>v 1.4 · Status · All systems operational</span></div>
        </div>
      </footer>
    </>
  );
}
