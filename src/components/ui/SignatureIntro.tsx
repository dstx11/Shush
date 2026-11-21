import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { lockPageScroll } from '../../hooks/useModalDialog';
import '../../styles/signature-intro.css';

const visitKey = 'shush:signature-intro:1';

// Centre lines for the pen, in writing order. Separate flourishes lift the nib.
const strokes = [
  { d: 'M12 82 C-1 75 13 53 51 36 C79 23 98 21 86 43 C78 58 47 67 38 59 C32 50 59 23 78 21 C91 20 83 32 67 45 C45 63 28 75 30 88 C33 105 85 77 77 66 C72 60 48 73 42 88 C37 100 59 101 82 84', ms: 590 },
  { d: 'M82 84 C96 78 104 69 99 68 C90 65 77 82 82 88 C86 94 101 85 112 74 L103 89 C114 78 123 67 125 71 C126 73 116 84 116 89 C126 78 137 67 139 71 C141 74 126 88 133 90 C138 92 149 84 155 79', ms: 370 },
  { d: 'M168 86 C188 65 211 40 205 39 C197 37 174 72 169 89 C182 74 193 68 191 76 C190 83 177 94 174 88 C173 84 184 86 198 76', ms: 275 },
  { d: 'M215 73 C208 65 190 81 192 88 C194 96 211 77 216 72 C209 82 205 92 212 89 C219 86 225 78 231 72 C225 70 223 76 226 77 C230 79 237 73 239 73 C237 78 225 90 232 90 C238 89 245 81 252 74', ms: 300 },
  { d: 'M252 74 C244 85 240 96 251 87 L268 72 C262 81 253 94 262 89 C279 79 304 42 300 40 C293 37 267 78 269 88 C272 97 294 75 307 55 C317 40 317 33 310 40 C300 49 284 79 280 90 C290 79 303 68 304 72 C306 75 291 89 298 90 C304 91 315 80 319 75', ms: 480 },
  { d: 'M330 72 C324 66 310 78 310 86 C310 96 325 84 330 74 C323 70 321 79 329 79 C339 79 350 70 358 66', ms: 215 },
  { d: 'M347 88 l1.6 -1.6', ms: 70 },
];
const penLead = 180;
const penFinish = strokes.reduce((time, stroke) => time + stroke.ms, penLead);

function shouldPlay() {
  if (typeof window === 'undefined' || location.pathname !== '/' || location.hash) return false;
  if (new URLSearchParams(location.search).get('intro') === '1') return true;
  try { return sessionStorage.getItem(visitKey) !== 'seen'; } catch { return false; }
}

export function SignatureIntro() {
  const [playing, setPlaying] = useState(shouldPlay);
  const dialog = useRef<HTMLDialogElement>(null);
  const dismissed = useRef(false);

  useLayoutEffect(() => {
    const node = dialog.current;
    if (!playing || !node) return;
    if (!node.open) node.showModal();
    const unlock = lockPageScroll();
    try { sessionStorage.setItem(visitKey, 'seen'); } catch { /* Optional visit memory. */ }
    const finish = () => { dismissed.current = true; setPlaying(false); };
    // Escape, skip and native animationend are independent of network and fonts.
    const limit = window.setTimeout(finish, penFinish + 2400);
    return () => {
      clearTimeout(limit);
      node.close();
      unlock();
      if (dismissed.current) document.getElementById('main-content')?.focus({ preventScroll: true });
    };
  }, [playing]);

  if (!playing) return null;
  const finish = () => { dismissed.current = true; setPlaying(false); };
  let delay = penLead;
  return <dialog ref={dialog} className="signature-intro" aria-label="Entrada SHUSH"
    style={{ '--pen-finish': `${penFinish}ms` } as CSSProperties}
    onCancel={event => { event.preventDefault(); finish(); }}
    onAnimationEnd={event => { if (event.target === event.currentTarget && event.animationName === 'signature-exit') finish(); }}>
    <div className="signature-silk" aria-hidden="true" />
    <header className="signature-head">
      <img src="/assets/brand/shush-logo-small.webp" alt="SHUSH" width="1167" height="647" />
      <button type="button" onClick={finish} aria-label="Saltar apresentação">Saltar <span aria-hidden="true">↗</span></button>
    </header>
    <div className="signature-title" role="img" aria-label="Sem barulho. Só rounds.">
      <svg viewBox="-5 8 380 106" aria-hidden="true" className="signature-script">
        <defs>
          <linearGradient id="signature-ink" x1="0" x2="1" y1="0" y2=".16">
            <stop stopColor="#b89ac8"/><stop offset=".34" stopColor="#fff5eb"/><stop offset=".69" stopColor="#e9d8e8"/><stop offset="1" stopColor="#b491c5"/>
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#signature-ink)" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round">
          {strokes.map(({d, ms}) => {
            const start = delay;
            delay += ms;
            return <path key={d} d={d} pathLength="1" style={{ '--ink-start': `${start}ms`, '--ink-time': `${ms}ms` } as CSSProperties} />;
          })}
        </g>
      </svg>
      <div className="signature-impact" aria-hidden="true"><span>Só</span> <span>rounds<i>.</i></span></div>
    </div>
    <div aria-hidden="true" className="signature-foot"><span/>SHUSH / PORTUGAL<span/></div>
  </dialog>;
}
