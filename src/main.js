import * as THREE from 'three';
import {
  RARITIES, THEMES, DEALER_LEVELS, charById, themeById, rollCharacter, tierOdds, fmt,
} from './data.js';
import { buildFigure, disposeObject } from './figure.js';
import { sfx, setMuted, isMuted } from './audio.js';

const params = new URLSearchParams(location.search);
const SHOT = params.get('shot'); // marketing screenshot mode: ?shot=thumb

// ---------- Save state ----------
const SAVE_KEY = 'theme-shuffle-v1';
const fresh = () => ({ money: 0, level: 0, owned: [], uid: 1, theme: 'basketball', muted: false, wins: 0, losses: 0 });
function load() {
  try { return { ...fresh(), ...JSON.parse(localStorage.getItem(SAVE_KEY)) }; } catch { return fresh(); }
}
function save() {
  if (SHOT) return;
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch { /* storage unavailable */ }
}
let state = SHOT ? fresh() : load();
// Drop characters from older saves that no longer exist in the roster
state.owned = state.owned.filter((o) => charById(o.id));
if (SHOT) state.level = Number(params.get('lvl') ?? 5);
setMuted(state.muted);

const incomePerSec = () => state.owned.reduce((a, o) => a + o.income, 0);
const dealerLevel = () => DEALER_LEVELS[state.level];

// ---------- Renderer / scene ----------
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: !!SHOT });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a0f2e);
scene.fog = new THREE.Fog(0x1a0f2e, 18, 40);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
const camTarget = new THREE.Vector3(0, 0.6, -0.6);
const camDir = new THREE.Vector3(0, 2.9, 7.6).normalize();
const camBase = new THREE.Vector3();

function resize() {
  const w = innerWidth, h = innerHeight, aspect = w / h;
  renderer.setSize(w, h, false);
  camera.aspect = aspect;
  camera.fov = aspect < 1 ? 58 : 45;
  const halfW = aspect < 1 ? 3.3 : 4.9;
  const d = SHOT ? 10.2 : Math.max(8.2, halfW / (Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * aspect));
  camBase.copy(camTarget).addScaledVector(camDir, d);
  camera.position.copy(camBase);
  camera.lookAt(camTarget);
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);

// Lights
scene.add(new THREE.HemisphereLight(0xc9b8ff, 0x2a1035, 0.7));
const key = new THREE.DirectionalLight(0xfff2e0, 1.8);
key.position.set(3, 9, 6);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, { left: -7, right: 7, top: 7, bottom: -5, near: 1, far: 30 });
key.shadow.bias = -0.0005;
scene.add(key);
const spot = new THREE.SpotLight(0xffd9a0, 40, 20, 0.55, 0.5, 1.5);
spot.position.set(0, 9, 1);
spot.target.position.set(0, 0, 0);
scene.add(spot, spot.target);
const rim = new THREE.PointLight(0xff4fd8, 18, 14);
rim.position.set(-5, 3, -4);
scene.add(rim);
const rim2 = new THREE.PointLight(0x4fc3ff, 18, 14);
rim2.position.set(5, 3, -4);
scene.add(rim2);

// Room
const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: 0x3a1238, roughness: 0.9 }));
floor.rotation.x = -Math.PI / 2;
floor.position.y = -3;
floor.receiveShadow = true;
scene.add(floor);

const wall = new THREE.Mesh(new THREE.PlaneGeometry(60, 24), new THREE.MeshStandardMaterial({ color: 0x24123d, roughness: 1 }));
wall.position.set(0, 6, -9);
scene.add(wall);

function neonSign() {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 256;
  const g = c.getContext('2d');
  g.font = '150px "Lilita One", Impact, sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.shadowColor = '#ff4fd8'; g.shadowBlur = 40;
  g.fillStyle = '#ffd1f6';
  g.fillText('THEME SHUFFLE', 512, 128);
  g.shadowColor = '#4fc3ff'; g.shadowBlur = 20;
  g.fillText('THEME SHUFFLE', 512, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
const signMat = new THREE.MeshBasicMaterial({ map: neonSign(), transparent: true, toneMapped: false });
const sign = new THREE.Mesh(new THREE.PlaneGeometry(12, 3), signMat);
sign.position.set(0, 5.6, -8.9);
scene.add(sign);
// Redraw the sign once the web font has loaded
document.fonts?.ready.then(() => { signMat.map.dispose(); signMat.map = neonSign(); signMat.needsUpdate = true; });

// String lights across the top
const bulbs = [];
for (let i = 0; i < 26; i++) {
  const x = -13 + i;
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), new THREE.MeshBasicMaterial({ color: [0xffd166, 0xff4fd8, 0x4fc3ff, 0x6bff8f][i % 4], toneMapped: false }));
  b.position.set(x, 8.2 - Math.cos((i / 25) * Math.PI * 4) * 0.4, -8.5);
  bulbs.push(b);
  scene.add(b);
}

// Table
const felt = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.3, 3.8), new THREE.MeshStandardMaterial({ color: 0x0f7a42, roughness: 0.95 }));
felt.position.set(0, -0.15, 0.1);
felt.receiveShadow = true;
scene.add(felt);
const wood = new THREE.MeshStandardMaterial({ color: 0x6b3a1e, roughness: 0.5, metalness: 0.1 });
const tableRim = new THREE.Mesh(new THREE.BoxGeometry(8.9, 0.5, 4.3), wood);
tableRim.position.set(0, -0.32, 0.1);
tableRim.receiveShadow = true;
tableRim.castShadow = true;
scene.add(tableRim);
const tableBase = new THREE.Mesh(new THREE.BoxGeometry(7.6, 2.5, 3.2), new THREE.MeshStandardMaterial({ color: 0x2a1408, roughness: 0.7 }));
tableBase.position.set(0, -1.8, 0.1);
scene.add(tableBase);
// Gold trim on the table front
const trim = new THREE.Mesh(new THREE.BoxGeometry(8.95, 0.08, 0.05), new THREE.MeshStandardMaterial({ color: 0xffc83d, metalness: 0.9, roughness: 0.3 }));
trim.position.set(0, -0.2, 2.26);
scene.add(trim);

// ---------- Cups ----------
const SLOT_X = [-2.1, 0, 2.1];
const cupGeo = (() => {
  const pts = [
    [0, 1.42], [0.4, 1.42], [0.46, 1.38], [0.62, 0.1], [0.66, 0.02], [0.66, 0], [0.6, 0], [0.56, 0.08], [0.41, 1.32], [0, 1.32],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(pts, 40);
})();
const bandGeo = new THREE.TorusGeometry(0.6, 0.035, 8, 40);
const cups = [0, 1, 2].map((i) => {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: 0xd62828, roughness: 0.35, metalness: 0.1, side: THREE.DoubleSide });
  const body = new THREE.Mesh(cupGeo, material);
  body.castShadow = true;
  body.receiveShadow = true;
  const bandMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
  const band = new THREE.Mesh(bandGeo, bandMat);
  band.rotation.x = Math.PI / 2;
  band.position.y = 0.28;
  group.add(body, band);
  group.position.set(SLOT_X[i], 0, 0);
  body.userData.cup = group;
  scene.add(group);
  return Object.assign(group, { body, material, bandMat });
});
let cupAtSlot = [...cups];

function styleCups() {
  const lvl = dealerLevel();
  const fancy = state.level >= 5;
  for (const c of cups) {
    c.material.color.setHex(lvl.cup);
    c.material.metalness = fancy ? 0.75 : 0.1;
    c.material.roughness = fancy ? 0.25 : 0.35;
    c.material.emissive.setHex(state.level >= 7 ? 0x2a0f6b : 0x000000);
    c.bandMat.color.setHex(fancy ? 0xffc83d : 0xffffff);
    c.bandMat.metalness = fancy ? 0.9 : 0;
  }
}

// ---------- Dealer ----------
const DEALER_Y = -2.3;
let dealer = null;
const dealerLight = new THREE.PointLight(0xffffff, 0, 8);
dealerLight.position.set(0, 3.5, -0.8);
scene.add(dealerLight);

function buildDealer() {
  if (dealer) { scene.remove(dealer.group); disposeObject(dealer.group); }
  const lvl = dealerLevel();
  dealer = buildFigure(lvl.look);
  dealer.group.position.set(0, DEALER_Y, -2.3);
  dealer.wings = [];
  dealer.group.traverse((o) => { if (o.userData.wing) dealer.wings.push(o); });
  scene.add(dealer.group);
  dealerLight.color.setHex(lvl.look.glow ?? 0xffffff);
  dealerLight.intensity = lvl.look.glow ? 3 : 0;
  styleCups();
}

// ---------- Tweens ----------
const tweens = [];
const ease = {
  inOut: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  out: (t) => 1 - Math.pow(1 - t, 3),
  back: (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  in: (t) => t * t,
};
function tween(dur, fn, e = ease.inOut) {
  return new Promise((res) => tweens.push({ t: 0, dur, fn, e, res }));
}
const wait = (s) => tween(s, () => {});

// ---------- Particles ----------
const particles = [];
const pGeo = new THREE.BoxGeometry(0.09, 0.09, 0.09);
function burst(pos, color, count = 60, power = 1) {
  const m = new THREE.MeshBasicMaterial({ color, toneMapped: false });
  const m2 = new THREE.MeshBasicMaterial({ color: 0xffd166, toneMapped: false });
  for (let i = 0; i < count; i++) {
    const p = new THREE.Mesh(pGeo, i % 3 ? m : m2);
    p.position.copy(pos);
    const a = Math.random() * Math.PI * 2, s = (2 + Math.random() * 4) * power;
    p.userData.v = new THREE.Vector3(Math.cos(a) * s * 0.6, 3 + Math.random() * 5 * power, Math.sin(a) * s * 0.6);
    p.userData.life = 1.2 + Math.random() * 0.8;
    p.rotation.set(Math.random() * 3, Math.random() * 3, 0);
    scene.add(p);
    particles.push(p);
  }
}

// ---------- Game state ----------
let phase = 'idle'; // idle | placing | shuffling | guessing | reveal
let current = null;
let prize = null;
let prizeCup = null;
let activeSwap = null;
let dealerMood = 'idle';
let moodTime = 0;
let shake = 0;

const PRIZE_SCALE = 0.25;
function makePrize(id) {
  const f = buildFigure(charById(id).look);
  f.group.scale.setScalar(PRIZE_SCALE);
  return f;
}

function setStatus(html) {
  const el = document.getElementById('status');
  el.innerHTML = html;
  el.classList.toggle('show', !!html);
}

let toastTimer = 0;
function toast(html, cls = '') {
  const el = document.getElementById('toast');
  el.innerHTML = html;
  el.className = 'show ' + cls;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.className = ''), 2600);
}

async function startRound(choice) {
  phase = 'placing';
  updateHud();

  // Reset cups to their home slots
  cupAtSlot = [...cups];
  cups.forEach((c, i) => c.position.set(SLOT_X[i], 0, 0));
  prizeCup = cupAtSlot[0];

  let ch, r;
  // Roll under the first cup until the player keeps one
  for (;;) {
    ch = charById(choice.id);
    r = RARITIES[ch.tier];
    current = choice;
    prize = makePrize(choice.id);
    prize.group.position.set(SLOT_X[0], 0, 0);
    prize.group.scale.setScalar(0.001);
    scene.add(prize.group);

    // The roll happens under the first cup: it rattles, then lifts to reveal who you got
    setStatus(`${themeById(ch.theme).emoji} Rolling...`);
    dealerMood = 'present';
    sfx.roll();
    await tween(0.9, (e, p) => {
      prizeCup.rotation.z = Math.sin(p * 40) * 0.08 * (1 - p * 0.5);
      prizeCup.position.y = Math.abs(Math.sin(p * 20)) * 0.08;
    }, (t) => t);
    prizeCup.rotation.z = 0;
    sfx.lift();
    await tween(0.45, (e) => (prizeCup.position.y = e * 2), ease.out);
    prize.group.scale.setScalar(PRIZE_SCALE);
    burst(new THREE.Vector3(SLOT_X[0], 0.6, 0), r.color, 25 + ch.tier * 20, 0.6 + ch.tier * 0.1);
    if (ch.tier >= 4) { shake = 0.3; sfx.win(); }
    showReveal(ch, r, choice.income);
    setStatus('Keep this one, or roll again?');

    const keep = await askKeep();
    sfx.click();
    hideReveal();
    await tween(0.35, (e) => (prizeCup.position.y = 2 * (1 - e)), ease.in);
    sfx.drop();
    if (keep) break;
    scene.remove(prize.group);
    disposeObject(prize.group);
    choice = rollCharacter(dealerLevel().luck, state.theme);
  }
  prize.group.visible = false;
  setStatus('Keep your eye on the cup!');
  await wait(0.5);

  const speedLabel = (RARITIES[0].swapTime / r.swapTime).toFixed(1);
  setStatus(`Shuffling a <b style="color:${r.color}">${r.name}</b> — speed x${speedLabel} 👀`);
  phase = 'shuffling';
  dealerMood = 'shuffle';
  for (let i = 0; i < r.swaps; i++) {
    const a = Math.floor(Math.random() * 3);
    let b = Math.floor(Math.random() * 2);
    if (b >= a) b++;
    // Slight speed-up through the middle of the shuffle
    const ramp = 1 - 0.1 * Math.sin((i / Math.max(1, r.swaps - 1)) * Math.PI);
    await swap(a, b, r.swapTime * ramp * (0.92 + Math.random() * 0.16));
  }
  activeSwap = null;
  dealerMood = 'idle';
  phase = 'guessing';
  setStatus('Which cup is it under? <b>Tap a cup!</b>');
}

async function swap(a, b, dur) {
  const A = cupAtSlot[a], B = cupAtSlot[b];
  const xa = SLOT_X[a], xb = SLOT_X[b];
  const depth = Math.abs(xa - xb) * 0.32;
  activeSwap = [A, B];
  sfx.swap(0.4 / dur);
  await tween(dur, (e) => {
    const s = Math.sin(Math.PI * e) * depth;
    A.position.set(THREE.MathUtils.lerp(xa, xb, e), 0, s);
    B.position.set(THREE.MathUtils.lerp(xb, xa, e), 0, -s);
  });
  cupAtSlot[a] = B;
  cupAtSlot[b] = A;
}

async function guess(cup) {
  if (phase !== 'guessing') return;
  phase = 'reveal';
  hoverCup(null);
  setStatus('');
  const win = cup === prizeCup;
  const ch = charById(current.id);
  const r = RARITIES[ch.tier];

  prize.group.position.set(prizeCup.position.x, 0, prizeCup.position.z);
  prize.group.visible = true;
  sfx.lift();
  await tween(0.4, (e) => (cup.position.y = e * 2), ease.out);

  if (win) {
    state.owned.push({ uid: state.uid++, id: current.id, income: current.income });
    state.wins++;
    save();
    sfx.win();
    burst(new THREE.Vector3(prizeCup.position.x, 0.8, prizeCup.position.z), r.color, 40 + ch.tier * 25, 1 + ch.tier * 0.15);
    if (ch.tier >= 4) shake = 0.35;
    dealerMood = 'sad';
    toast(`🎉 You got <b style="color:${r.color}">${ch.name}</b>! <span class="inc">+${fmt(current.income)}/s</span>`, 'win');
  } else {
    await wait(0.25);
    sfx.lift();
    await tween(0.35, (e) => (prizeCup.position.y = e * 2), ease.out);
    state.losses++;
    save();
    sfx.lose();
    dealerMood = 'gloat';
    toast(`😵 Wrong cup! <b style="color:${r.color}">${ch.name}</b> got away...`, 'lose');
  }
  moodTime = 0;
  updateHud();
  await wait(1.8);
  await tween(0.35, (e) => cups.forEach((c) => { if (c.position.y > 0) c.position.y = Math.min(c.position.y, 2 * (1 - e)); }), ease.in);
  cups.forEach((c) => (c.position.y = 0));
  sfx.drop();
  scene.remove(prize.group);
  disposeObject(prize.group);
  prize = null;
  current = null;
  dealerMood = 'idle';
  phase = 'idle';
  updateHud();
}

// ---------- Picking cups ----------
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let hovered = null;
function cupFromEvent(ev) {
  const rect = canvas.getBoundingClientRect();
  pointer.set(((ev.clientX - rect.left) / rect.width) * 2 - 1, -((ev.clientY - rect.top) / rect.height) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(cups.map((c) => c.body))[0];
  return hit ? hit.object.userData.cup : null;
}
function hoverCup(c) {
  if (hovered === c) return;
  if (hovered) hovered.material.emissive.setHex(state.level >= 7 ? 0x2a0f6b : 0x000000);
  hovered = c;
  if (c) c.material.emissive.setHex(0x553300);
  canvas.style.cursor = c ? 'pointer' : 'default';
}
let mouseX = 0;
canvas.addEventListener('pointermove', (ev) => {
  mouseX = (ev.clientX / innerWidth) * 2 - 1;
  if (phase === 'guessing') hoverCup(cupFromEvent(ev));
});
canvas.addEventListener('pointerdown', (ev) => {
  if (phase !== 'guessing') return;
  const c = cupFromEvent(ev);
  if (c) guess(c);
});

// ---------- Portraits for UI cards ----------
const portraitRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
portraitRenderer.setSize(200, 240);
portraitRenderer.toneMapping = THREE.ACESFilmicToneMapping;
const pScene = new THREE.Scene();
pScene.add(new THREE.HemisphereLight(0xffffff, 0x554466, 1.6));
const pKey = new THREE.DirectionalLight(0xffffff, 2);
pKey.position.set(3, 6, 8);
pScene.add(pKey);
const pCam = new THREE.PerspectiveCamera(32, 200 / 240, 0.1, 100);
pCam.position.set(2.6, 4.2, 11);
pCam.lookAt(0, 2.9, 0);
const portraitCache = new Map();
function portrait(key, look) {
  if (portraitCache.has(key)) return portraitCache.get(key);
  const f = buildFigure(look);
  f.group.rotation.y = -0.25;
  f.rightArm.rotation.x = -0.3;
  pScene.add(f.group);
  portraitRenderer.render(pScene, pCam);
  const url = portraitRenderer.domElement.toDataURL();
  pScene.remove(f.group);
  disposeObject(f.group);
  portraitCache.set(key, url);
  return url;
}
const charPortrait = (id) => portrait(id, charById(id).look);

// ---------- UI ----------
const $ = (id) => document.getElementById(id);
const modal = $('modal');
const panel = $('panel');

function openModal(html, cls = '') {
  panel.className = 'panel ' + cls;
  panel.innerHTML = html;
  modal.classList.remove('hidden');
}
function closeModal() {
  modal.classList.add('hidden');
  updateHud();
}
modal.addEventListener('pointerdown', (e) => { if (e.target === modal) closeModal(); });

function card(c, extra = '') {
  const ch = charById(c.id);
  const r = RARITIES[ch.tier];
  const t = themeById(ch.theme);
  return `<div class="card tier-${r.id}" style="--rc:${r.color}">
    <div class="rarity">${r.name}</div>
    <img src="${charPortrait(c.id)}" alt="" />
    <div class="cname">${ch.name}</div>
    <div class="theme-tag">${t.emoji} ${t.name}</div>
    <div class="cinc">+${fmt(c.income)}/s</div>
    ${extra}
  </div>`;
}

function renderThemePicker() {
  $('themes').innerHTML = THEMES.map((t) =>
    `<button class="theme-btn ${state.theme === t.id ? 'on' : ''}" data-theme="${t.id}" style="--tc:${t.color}">${t.emoji}<span>${t.name}</span></button>`).join('');
}
$('themes').addEventListener('click', (e) => {
  const b = e.target.closest('[data-theme]');
  if (!b || phase !== 'idle') return;
  sfx.click();
  state.theme = b.dataset.theme;
  save();
  renderThemePicker();
});

function doRoll() {
  if (phase !== 'idle') return;
  startRound(rollCharacter(dealerLevel().luck, state.theme));
}

function showReveal(ch, r, income) {
  const el = $('reveal');
  el.style.setProperty('--rc', r.color);
  el.className = 'show tier-' + r.id;
  el.innerHTML = `<div class="rv-rarity">${r.name}</div><div class="rv-name">${ch.name}</div><div class="rv-inc">+${fmt(income)}/s</div>`;
}
function hideReveal() { $('reveal').className = ''; }

let decide = null;
function askKeep() {
  $('decide').classList.add('show');
  return new Promise((res) => (decide = (keep) => {
    decide = null;
    $('decide').classList.remove('show');
    res(keep);
  }));
}
$('btnKeep').onclick = () => decide?.(true);
$('btnReroll').onclick = () => decide?.(false);

function openCollection() {
  if (phase !== 'idle') return;
  sfx.click();
  const sorted = [...state.owned].sort((a, b) => b.income - a.income);
  const body = sorted.length
    ? `<div class="cards grid">${sorted.map((o) => card(o, `<button class="sell" data-uid="${o.uid}">Sell ${fmt(o.income * 20)}</button>`)).join('')}</div>`
    : `<p class="empty">No characters yet. Roll one and find it under the cups!</p>`;
  openModal(`
    <button class="close" aria-label="Close">✕</button>
    <h2>🎒 Collection</h2>
    <p class="sub">${state.owned.length} characters · earning <b>${fmt(incomePerSec())}/s</b> · ${state.wins}W / ${state.losses}L</p>
    ${body}`, 'collection');
  panel.querySelector('.close').onclick = closeModal;
  panel.querySelectorAll('.sell').forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation();
    const uid = Number(b.dataset.uid);
    const o = state.owned.find((x) => x.uid === uid);
    if (!o) return;
    state.money += o.income * 20;
    state.owned = state.owned.filter((x) => x.uid !== uid);
    sfx.cash();
    save();
    openCollection();
  }));
}

function oddsTable(luck, nextLuck) {
  const now = tierOdds(luck), next = nextLuck ? tierOdds(nextLuck) : null;
  const pct = (x) => (x >= 0.1 ? (x * 100).toFixed(1) : x >= 0.001 ? (x * 100).toFixed(2) : (x * 100).toFixed(3)) + '%';
  return `<table class="odds"><tr><th>Rarity</th><th>Now</th>${next ? '<th>Next</th>' : ''}</tr>
    ${RARITIES.map((r, i) => `<tr><td style="color:${r.color}">${r.name}</td><td>${pct(now[i])}</td>${next ? `<td class="up">${pct(next[i])}</td>` : ''}</tr>`).join('')}
  </table>`;
}

function openDealer() {
  if (phase !== 'idle') return;
  sfx.click();
  const lvl = dealerLevel();
  const next = DEALER_LEVELS[state.level + 1];
  const canBuy = next && state.money >= next.cost;
  openModal(`
    <button class="close" aria-label="Close">✕</button>
    <h2>⭐ Dealer Upgrades</h2>
    <div class="dealer-row">
      <div class="dcard"><img src="${portrait('dealer' + state.level, lvl.look)}" alt=""/><b>${lvl.name}</b><span>🍀 Luck x${lvl.luck}</span></div>
      ${next ? `<div class="arrow">➜</div>
      <div class="dcard next"><img src="${portrait('dealer' + (state.level + 1), next.look)}" alt=""/><b>${next.name}</b><span>🍀 Luck x${next.luck}</span></div>` : ''}
    </div>
    ${next
      ? `<button class="buy" ${canBuy ? '' : 'disabled'}>Upgrade for ${fmt(next.cost)}</button>
         ${canBuy ? '' : `<p class="sub">Need ${fmt(next.cost - state.money)} more</p>`}`
      : '<p class="sub maxed">🌌 Your dealer is MAXED OUT!</p>'}
    ${oddsTable(lvl.luck, next?.luck)}
    <div class="levels">${DEALER_LEVELS.map((l, i) => `<span class="${i <= state.level ? 'got' : ''}">${i <= state.level ? '✔' : '🔒'} ${l.name}</span>`).join('')}</div>`, 'dealer');
  panel.querySelector('.close').onclick = closeModal;
  const buy = panel.querySelector('.buy');
  if (buy) buy.onclick = () => {
    if (state.money < next.cost) return;
    state.money -= next.cost;
    state.level++;
    save();
    closeModal();
    upgradeDealer();
  };
}

async function upgradeDealer() {
  phase = 'reveal';
  sfx.upgrade();
  const lvl = dealerLevel();
  burst(new THREE.Vector3(0, 1.5, -2.3), lvl.look.glow ?? 0xffd166, 120, 1.4);
  shake = 0.3;
  await tween(0.25, (e) => dealer.group.scale.setScalar(1 - e * 0.9), ease.in);
  buildDealer();
  dealer.group.scale.setScalar(0.1);
  await tween(0.5, (e) => dealer.group.scale.setScalar(0.1 + e * 0.9), ease.back);
  dealerMood = 'gloat';
  moodTime = 0;
  toast(`⭐ Dealer upgraded to <b>${lvl.name}</b>! Luck x${lvl.luck}`, 'win');
  await wait(1.5);
  dealerMood = 'idle';
  phase = 'idle';
  updateHud();
}

let lastHud = '';
function updateHud() {
  const lvl = dealerLevel();
  const next = DEALER_LEVELS[state.level + 1];
  $('money').textContent = fmt(state.money);
  $('income').textContent = `+${fmt(incomePerSec())}/s`;
  $('dealerName').textContent = lvl.name;
  $('dealerLuck').textContent = `🍀 x${lvl.luck}`;
  $('colCount').textContent = state.owned.length;
  const costEl = $('upCost');
  costEl.textContent = next ? fmt(next.cost) : 'MAX';
  costEl.classList.toggle('afford', !!next && state.money >= next.cost);
  const idle = phase === 'idle';
  const sig = idle + '|' + phase;
  if (sig !== lastHud) {
    lastHud = sig;
    $('btnRoll').disabled = !idle;
    $('btnCollection').disabled = !idle;
    $('btnDealer').disabled = !idle;
    document.body.classList.toggle('busy', !idle);
  }
}

$('btnRoll').onclick = doRoll;
$('btnCollection').onclick = openCollection;
$('btnDealer').onclick = openDealer;
$('mute').onclick = () => {
  setMuted(!isMuted());
  state.muted = isMuted();
  $('mute').textContent = isMuted() ? '🔇' : '🔊';
  save();
};
$('mute').textContent = isMuted() ? '🔇' : '🔊';
addEventListener('keydown', (e) => {
  if (e.code === 'Space' && phase === 'idle' && modal.classList.contains('hidden')) { e.preventDefault(); doRoll(); }
  if (decide && (e.code === 'Space' || e.code === 'Enter')) { e.preventDefault(); decide(true); }
  if (decide && e.code === 'KeyR') decide(false);
  if (e.code === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  if (phase === 'guessing' && ['Digit1', 'Digit2', 'Digit3'].includes(e.code)) guess(cupAtSlot[Number(e.code.slice(-1)) - 1]);
});

// ---------- Dealer animation ----------
const DOWN = new THREE.Vector3(0, -1, 0);
const tmpV = new THREE.Vector3();
const tmpS = new THREE.Vector3();
const tmpQ = new THREE.Quaternion();
function aimArm(arm, target, k) {
  arm.getWorldPosition(tmpS);
  tmpV.copy(target).sub(tmpS).normalize();
  tmpQ.setFromUnitVectors(DOWN, tmpV);
  arm.quaternion.slerp(tmpQ, k);
}
function relaxArm(arm, x, z, k) {
  tmpQ.setFromEuler(new THREE.Euler(x, 0, z));
  arm.quaternion.slerp(tmpQ, k);
}

function animateDealer(t, dt) {
  if (!dealer) return;
  const k = 1 - Math.exp(-dt * 14);
  const g = dealer.group;
  let bob = Math.sin(t * 2) * 0.04, rotY = 0, headY = mouseX * 0.35;
  moodTime += dt;

  switch (dealerMood) {
    case 'shuffle':
      if (activeSwap) {
        aimArm(dealer.leftArm, tmpV.set(activeSwap[0].position.x, 1.5, activeSwap[0].position.z).clone(), 1 - Math.exp(-dt * 25));
        aimArm(dealer.rightArm, tmpV.set(activeSwap[1].position.x, 1.5, activeSwap[1].position.z).clone(), 1 - Math.exp(-dt * 25));
        headY = (activeSwap[0].position.x + activeSwap[1].position.x) * 0.08;
      }
      bob = Math.abs(Math.sin(t * 14)) * 0.06;
      break;
    case 'present':
      aimArm(dealer.leftArm, new THREE.Vector3(SLOT_X[0], 1.8, 0.3), k);
      relaxArm(dealer.rightArm, 0, 0.6, k);
      headY = -0.4;
      break;
    case 'gloat': // dealer wins: arms up, hop and spin
      relaxArm(dealer.leftArm, 0, -2.6 + Math.sin(t * 12) * 0.3, k);
      relaxArm(dealer.rightArm, 0, 2.6 - Math.sin(t * 12) * 0.3, k);
      bob = Math.abs(Math.sin(t * 9)) * 0.45;
      rotY = Math.sin(moodTime * 3) * 0.5;
      headY = 0;
      break;
    case 'sad': // player wins: facepalm
      aimArm(dealer.rightArm, new THREE.Vector3(0, 2.6, -1.4), k);
      relaxArm(dealer.leftArm, 0.1, -0.15, k);
      bob = -0.1;
      headY = Math.sin(t * 6) * 0.25;
      break;
    default:
      relaxArm(dealer.leftArm, Math.sin(t * 1.6) * 0.12, -0.08, k);
      relaxArm(dealer.rightArm, -Math.sin(t * 1.6) * 0.12, 0.08, k);
  }
  g.position.y = DEALER_Y + bob;
  g.rotation.y += (rotY - g.rotation.y) * k;
  dealer.head.rotation.y += (headY - dealer.head.rotation.y) * k;
  dealer.head.rotation.x = dealerMood === 'sad' ? 0.25 : 0;
  for (const w of dealer.wings) w.rotation.y = w.userData.wing * (-0.5 - Math.sin(t * 4) * 0.25);
  if (dealer.aura) dealer.aura.rotation.y += dt * 0.8;
}

// ---------- Main loop ----------
const clock = new THREE.Clock();
let saveTimer = 0;
let hudTimer = 0;
function frame() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  for (let i = tweens.length - 1; i >= 0; i--) {
    const tw = tweens[i];
    tw.t += dt;
    const p = Math.min(1, tw.t / tw.dur);
    tw.fn(tw.e(p), p);
    if (p >= 1) { tweens.splice(i, 1); tw.res(); }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.userData.v.y -= 12 * dt;
    p.position.addScaledVector(p.userData.v, dt);
    p.rotation.x += dt * 6;
    p.userData.life -= dt;
    if (p.position.y < 0.05 && p.position.z < 2 && Math.abs(p.position.x) < 4.2) { p.position.y = 0.05; p.userData.v.multiplyScalar(0.4); p.userData.v.y *= -0.5; }
    if (p.userData.life <= 0) { scene.remove(p); particles.splice(i, 1); }
  }

  if (prize?.group.visible) {
    // Face the camera while being revealed, spin while celebrating
    if (phase === 'placing') prize.group.rotation.y = Math.sin(t * 2) * 0.35;
    else prize.group.rotation.y += dt * 1.5;
    if (prize.aura) prize.aura.rotation.y += dt;
  }

  animateDealer(t, dt);
  bulbs.forEach((b, i) => b.scale.setScalar(0.8 + 0.4 * Math.max(0, Math.sin(t * 3 + i))));

  if (!SHOT && state.owned.length) state.money += incomePerSec() * dt;
  hudTimer += dt;
  if (hudTimer > 0.1) { hudTimer = 0; updateHud(); }
  saveTimer += dt;
  if (saveTimer > 5) { saveTimer = 0; save(); }

  if (shake > 0) {
    shake = Math.max(0, shake - dt);
    camera.position.copy(camBase).add(new THREE.Vector3((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake, 0));
  } else {
    camera.position.copy(camBase);
    camera.position.x += Math.sin(t * 0.3) * 0.08;
  }
  camera.lookAt(camTarget);

  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

// ---------- Boot ----------
resize();
buildDealer();
renderThemePicker();
updateHud();

if (SHOT) {
  // Static marketing pose: middle cup lifted over a legendary, dealer gloating.
  document.body.classList.add('shot');
  $('shotTitle').classList.remove('hidden');
  // Frame the scene to the right so the title has room on the left
  sign.visible = false;
  camTarget.set(-2.0, 1.2, -0.3);
  resize();
  cups[1].position.set(0.75, 1.35, 0.2);
  cups[1].rotation.z = -0.5;
  cups[0].position.z = 0.3;
  cups[2].position.set(2.4, 0, -0.4);
  prize = makePrize(params.get('char') ?? 'lebron');
  prize.group.position.set(0, 0, 0.2);
  prize.group.scale.setScalar(0.3);
  scene.add(prize.group);
  // One character from each of the other themes standing at the front of the table
  for (const [id, x, ry] of [['messi', -3.1, 0.5], ['spongebob', 3.1, -0.5]]) {
    const f = makePrize(id);
    f.group.scale.setScalar(0.3);
    f.group.position.set(x, 0, 1.2);
    f.group.rotation.y = ry;
    scene.add(f.group);
  }
  dealerMood = 'gloat';
} else if (!state.wins && !state.losses) {
  setTimeout(() => toast('👋 Pick a theme and roll! Your player hides under the cup — find it to keep it.'), 600);
}
frame();
