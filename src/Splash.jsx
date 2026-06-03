import React, { useEffect, useRef, useState } from 'react';

// Full-screen intro splash — a faithful port of the "Laventra Splash" design.
// A car drives into the wash bay, the mud washes off (mud → fog → gleam),
// then the wordmark settles. Auto-dismisses after one wash cycle, and is
// skippable by click / key. Shown once per browser session.
const CYCLE_MS = 6500;   // visible duration before auto-fade
const FADE_MS = 600;    // fade-out transition

// 32 rain droplets with randomized position / delay / duration, matching the
// inline <script> in the prototype.
const DROPS = Array.from({ length: 32 }, (_, i) => ({
  key: i,
  left: `${(Math.random() * 100).toFixed(1)}%`,
  delay: `${(Math.random() * 0.55).toFixed(2)}s`,
  duration: `${(0.5 + Math.random() * 0.3).toFixed(2)}s`,
}));

export default function Splash({ onDone }) {
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);

  function dismiss() {
    if (doneRef.current) return;
    doneRef.current = true;
    setLeaving(true);
    window.setTimeout(() => onDone?.(), FADE_MS);
  }

  useEffect(() => {
    const t = window.setTimeout(dismiss, CYCLE_MS);
    const onKey = (e) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') dismiss(); };
    window.addEventListener('keydown', onKey);
    return () => { window.clearTimeout(t); window.removeEventListener('keydown', onKey); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      id="splash"
      className={leaving ? 'leaving' : ''}
      onClick={dismiss}
      role="button"
      aria-label="Skip intro"
      tabIndex={-1}
    >
      <div className="stage">
        <div className="scene">
          <div className="ground" />

          {/* status chip */}
          <div className="chip"><span className="d" /> Bay 01 · Scanning</div>

          {/* arch */}
          <div className="arch" />
          <span className="arch-r" />

          {/* spray bar */}
          <div className="spray" />

          {/* droplets */}
          <div className="drops">
            {DROPS.map((d) => (
              <span
                key={d.key}
                style={{ left: d.left, animationDelay: d.delay, animationDuration: d.duration }}
              />
            ))}
          </div>

          {/* side brushes */}
          <div className="brush l" />
          <div className="brush r" />

          {/* counting ticks */}
          <div className="ticks">
            {Array.from({ length: 9 }, (_, i) => <i key={i} />)}
          </div>

          {/* car + wash overlays */}
          <div className="car">
            <div className="car-shake">
              <img src="/assets/car-clean.png" alt="" draggable="false" />
              <div className="mud" />
              <div className="fog" />
              <div className="gleam" />
              <div className="spk" style={{ top: '18%', left: '24%' }} />
              <div className="spk" style={{ top: '28%', left: '50%', animationDelay: '.1s' }} />
              <div className="spk" style={{ top: '22%', right: '20%', animationDelay: '.18s' }} />
              <div className="spk" style={{ top: '50%', left: '18%', animationDelay: '.06s' }} />
              <div className="spk" style={{ top: '54%', right: '22%', animationDelay: '.22s' }} />
            </div>
          </div>
        </div>

        {/* wordmark */}
        <div className="wm-wrap">
          <div className="sp-wm">
            laven<span className="accent-t">t</span><span className="accent-r">r</span><span className="accent-a">a</span>
          </div>
          <div className="sp-tagline">AI <span className="sep" /> Car-Wash Counter</div>
        </div>
      </div>

      <button type="button" className="sp-skip" onClick={dismiss}>Skip intro →</button>
    </div>
  );
}
