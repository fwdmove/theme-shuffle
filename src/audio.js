// Tiny WebAudio synth so the game has sound without asset files.
let ctx = null;
let muted = false;

function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, dur, { type = 'sine', vol = 0.15, slide = 0, delay = 0 } = {}) {
  if (muted) return;
  try {
    const a = ac();
    const t = a.currentTime + delay;
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(a.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  } catch { /* audio unavailable */ }
}

export const sfx = {
  click: () => tone(660, 0.06, { type: 'square', vol: 0.06 }),
  swap: (speed = 1) => tone(220 + Math.random() * 80, 0.12 / speed, { type: 'triangle', vol: 0.08, slide: 200 }),
  lift: () => tone(300, 0.2, { type: 'sine', vol: 0.12, slide: 300 }),
  drop: () => tone(180, 0.15, { type: 'sine', vol: 0.14, slide: -100 }),
  roll: () => [0, 1, 2, 3, 4].forEach((i) => tone(400 + i * 120, 0.08, { type: 'square', vol: 0.05, delay: i * 0.05 })),
  win: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.25, { type: 'triangle', vol: 0.14, delay: i * 0.09 })),
  lose: () => [392, 330, 262].forEach((f, i) => tone(f, 0.3, { type: 'sawtooth', vol: 0.07, delay: i * 0.15 })),
  upgrade: () => [392, 523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, 0.2, { type: 'triangle', vol: 0.12, delay: i * 0.06 })),
  cash: () => { tone(1318, 0.08, { type: 'square', vol: 0.05 }); tone(1760, 0.12, { type: 'square', vol: 0.05, delay: 0.07 }); },
};

export function setMuted(m) { muted = m; }
export function isMuted() { return muted; }
