import * as THREE from 'three';

// Builds a blocky, Roblox-R6-style figure. Units: feet at y=0, head top at ~5.2.
// Returns { group, leftArm, rightArm, head, torso, aura, dispose }.

const faceCache = new Map();

const hex = (n) => '#' + n.toString(16).padStart(6, '0');

function faceTexture(type, skinHex, beard, goatee) {
  const key = [type, skinHex, beard, goatee].join('|');
  if (faceCache.has(key)) return faceCache.get(key);
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#' + skinHex.toString(16).padStart(6, '0');
  g.fillRect(0, 0, 128, 128);
  g.lineCap = 'round';
  const ink = '#1a1a1a';
  if (beard !== undefined) {
    g.fillStyle = hex(beard);
    if (goatee) {
      g.beginPath(); g.ellipse(64, 108, 20, 18, 0, 0, Math.PI * 2); g.fill();
      g.fillRect(44, 78, 40, 7);
    } else {
      g.fillRect(0, 90, 128, 38);
      g.fillRect(0, 46, 12, 50); g.fillRect(116, 46, 12, 50);
      g.beginPath(); g.ellipse(64, 80, 30, 8, 0, 0, Math.PI * 2); g.fill();
    }
  }
  const eyes = (color = ink, r = 7) => {
    g.fillStyle = color;
    g.beginPath(); g.ellipse(44, 52, r, r * 1.4, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(84, 52, r, r * 1.4, 0, 0, Math.PI * 2); g.fill();
  };
  const smile = (w = 6, wide = 26) => {
    g.strokeStyle = ink; g.lineWidth = w;
    g.beginPath(); g.arc(64, 70, wide, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke();
  };
  switch (type) {
    case 'smile': eyes(); smile(); break;
    case 'happy':
      eyes(); g.fillStyle = ink; g.beginPath(); g.arc(64, 74, 22, 0, Math.PI); g.fill();
      g.fillStyle = '#fff'; g.fillRect(48, 74, 32, 6); break;
    case 'cool':
      g.fillStyle = '#0d0d0d';
      g.fillRect(24, 40, 34, 22); g.fillRect(70, 40, 34, 22); g.fillRect(56, 44, 16, 6);
      g.fillStyle = 'rgba(255,255,255,0.35)'; g.fillRect(28, 43, 10, 5); g.fillRect(74, 43, 10, 5);
      g.strokeStyle = ink; g.lineWidth = 5;
      g.beginPath(); g.moveTo(50, 88); g.quadraticCurveTo(70, 96, 84, 82); g.stroke(); break;
    case 'angry':
      eyes(); g.strokeStyle = ink; g.lineWidth = 6;
      g.beginPath(); g.moveTo(30, 34); g.lineTo(54, 42); g.moveTo(98, 34); g.lineTo(74, 42); g.stroke();
      g.beginPath(); g.arc(64, 98, 18, 1.15 * Math.PI, 1.85 * Math.PI); g.stroke(); break;
    case 'ninja':
      g.fillStyle = '#d9a066'; g.fillRect(18, 38, 92, 30); eyes(ink, 6); break;
    case 'eyepatch':
      eyes(); g.fillStyle = '#111'; g.beginPath(); g.ellipse(44, 52, 15, 15, 0, 0, Math.PI * 2); g.fill();
      g.strokeStyle = '#111'; g.lineWidth = 4; g.beginPath(); g.moveTo(10, 30); g.lineTo(118, 70); g.stroke();
      smile(); break;
    case 'robot':
      g.fillStyle = '#111'; g.fillRect(22, 36, 84, 34);
      g.fillStyle = '#4dfcff'; g.fillRect(32, 46, 22, 14); g.fillRect(74, 46, 22, 14);
      g.fillStyle = '#333'; for (let i = 0; i < 5; i++) g.fillRect(36 + i * 12, 86, 8, 12); break;
    case 'glow':
      g.shadowColor = '#fff'; g.shadowBlur = 18; eyes('#ffffff', 8);
      g.shadowBlur = 0; g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 5;
      g.beginPath(); g.arc(64, 74, 20, 0.2 * Math.PI, 0.8 * Math.PI); g.stroke(); break;
    case 'glitch':
      eyes('#00ffea', 8); g.fillStyle = '#ff00d4'; g.fillRect(30, 60, 40, 6); g.fillRect(56, 84, 44, 6);
      g.fillStyle = '#fff'; g.fillRect(10, 20, 30, 4); g.fillRect(80, 104, 30, 4); smile(5, 20); break;
    case 'toon': {
      for (const x of [42, 86]) {
        g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x, 48, 17, 21, 0, 0, Math.PI * 2); g.fill();
        g.strokeStyle = ink; g.lineWidth = 3; g.stroke();
        g.fillStyle = ink; g.beginPath(); g.arc(x + 3, 52, 8, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#fff'; g.beginPath(); g.arc(x + 6, 48, 3, 0, Math.PI * 2); g.fill();
      }
      g.fillStyle = '#7a1020'; g.beginPath(); g.arc(64, 82, 24, 0, Math.PI); g.fill();
      g.fillStyle = '#ff6b8a'; g.beginPath(); g.ellipse(64, 98, 12, 6, 0, 0, Math.PI * 2); g.fill();
      break;
    }
    case 'mask':
      g.fillStyle = '#111'; g.beginPath(); g.ellipse(64, 50, 52, 18, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#fff'; g.beginPath(); g.ellipse(44, 50, 11, 7, 0, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.ellipse(84, 50, 11, 7, 0, 0, Math.PI * 2); g.fill();
      smile(); break;
    case 'sleepy':
      for (const x of [44, 84]) {
        g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x, 48, 14, 16, 0, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#c0392b'; g.beginPath(); g.arc(x, 52, 6, 0, Math.PI * 2); g.fill();
        g.fillStyle = hex(skinHex); g.fillRect(x - 15, 30, 30, 17);
        g.strokeStyle = ink; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 15, 47); g.lineTo(x + 15, 47); g.stroke();
      }
      g.fillStyle = 'rgba(0,0,0,0.15)'; g.fillRect(56, 56, 16, 34);
      g.strokeStyle = ink; g.lineWidth = 4; g.beginPath(); g.moveTo(46, 102); g.lineTo(82, 100); g.stroke(); break;
    case 'glasses':
      eyes(ink, 6);
      g.strokeStyle = ink; g.lineWidth = 4;
      g.beginPath(); g.arc(44, 52, 16, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.arc(84, 52, 16, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.moveTo(60, 52); g.lineTo(68, 52); g.stroke();
      smile(5, 22);
      g.fillStyle = 'rgba(0,0,0,0.12)'; g.beginPath(); g.ellipse(64, 112, 18, 8, 0, 0, Math.PI * 2); g.fill(); break;
    case 'sponge': {
      for (const x of [40, 88]) {
        g.fillStyle = '#fff'; g.beginPath(); g.arc(x, 44, 20, 0, Math.PI * 2); g.fill();
        g.strokeStyle = ink; g.lineWidth = 3; g.stroke();
        g.fillStyle = '#4fc3f7'; g.beginPath(); g.arc(x, 46, 10, 0, Math.PI * 2); g.fill();
        g.fillStyle = ink; g.beginPath(); g.arc(x, 46, 5, 0, Math.PI * 2); g.fill();
        g.lineWidth = 3; for (const dx of [-8, 0, 8]) { g.beginPath(); g.moveTo(x + dx, 24); g.lineTo(x + dx * 1.4, 14); g.stroke(); }
      }
      g.strokeStyle = ink; g.lineWidth = 4; g.beginPath(); g.arc(64, 72, 34, 0.1 * Math.PI, 0.9 * Math.PI); g.stroke();
      g.fillStyle = '#fff'; g.fillRect(52, 103, 10, 11); g.fillRect(66, 103, 10, 11);
      g.strokeRect(52, 103, 10, 11); g.strokeRect(66, 103, 10, 11);
      g.fillStyle = '#e57373'; for (const [x, y] of [[22, 84], [30, 92], [98, 84], [106, 92]]) { g.beginPath(); g.arc(x, y, 3, 0, Math.PI * 2); g.fill(); }
      g.fillStyle = 'rgba(160,140,0,0.35)'; for (const [x, y, r] of [[14, 16, 6], [112, 112, 8], [16, 116, 5], [110, 20, 5]]) { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); }
      break;
    }
    case 'mickey':
      g.fillStyle = '#f6c9a0';
      g.beginPath(); g.ellipse(64, 92, 52, 34, 0, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.ellipse(46, 48, 18, 30, 0, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.ellipse(82, 48, 18, 30, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = ink; g.beginPath(); g.ellipse(48, 46, 6, 13, 0, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.ellipse(80, 46, 6, 13, 0, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.ellipse(64, 72, 11, 8, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#7a1020'; g.beginPath(); g.arc(64, 90, 22, 0, Math.PI); g.fill();
      g.fillStyle = '#ff6b8a'; g.beginPath(); g.ellipse(64, 104, 10, 5, 0, 0, Math.PI * 2); g.fill(); break;
    default: eyes(); smile();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  faceCache.set(key, tex);
  return tex;
}

function jerseyTexture(look, back) {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = hex(look.shirt); g.fillRect(0, 0, 128, 128);
  if (look.stripes !== undefined) {
    g.fillStyle = hex(look.stripes);
    for (let x = 12; x < 128; x += 34) g.fillRect(x, 0, 17, 128);
  }
  g.fillStyle = hex(look.trim ?? 0xffffff);
  // V collar and side stripes
  g.beginPath(); g.moveTo(40, 0); g.lineTo(64, 26); g.lineTo(88, 0); g.lineTo(78, 0); g.lineTo(64, 16); g.lineTo(50, 0); g.fill();
  g.fillRect(0, 0, 8, 128); g.fillRect(120, 0, 8, 128);
  g.font = `900 ${back ? 70 : 56}px Nunito, Arial Black, sans-serif`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.lineWidth = 6;
  const r = (look.shirt >> 16) & 255, gg = (look.shirt >> 8) & 255, b = look.shirt & 255;
  const light = (r * 0.299 + gg * 0.587 + b * 0.114) / 255 > 0.6;
  g.fillStyle = light ? hex(look.trim ?? 0x111111) : '#fff';
  g.strokeStyle = light ? '#fff' : hex(look.trim ?? 0xffffff);
  const y = back ? 70 : 76;
  g.strokeText(String(look.number), 64, y);
  g.fillText(String(look.number), 64, y);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const ballCache = {};
function ballTexture(kind) {
  if (ballCache[kind]) return ballCache[kind];
  const c = document.createElement('canvas');
  c.width = 256; c.height = 128;
  const g = c.getContext('2d');
  if (kind === 'basketball') {
    g.fillStyle = '#e8701a'; g.fillRect(0, 0, 256, 128);
    g.strokeStyle = '#1a0d00'; g.lineWidth = 4;
    g.beginPath(); g.moveTo(0, 64); g.lineTo(256, 64);
    g.moveTo(64, 0); g.lineTo(64, 128); g.moveTo(192, 0); g.lineTo(192, 128);
    g.moveTo(128, 0); g.bezierCurveTo(100, 40, 100, 88, 128, 128);
    g.moveTo(0, 0); g.bezierCurveTo(28, 40, 28, 88, 0, 128);
    g.moveTo(256, 0); g.bezierCurveTo(228, 40, 228, 88, 256, 128);
    g.stroke();
  } else {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, 256, 128);
    g.fillStyle = '#111';
    for (let row = 0; row < 3; row++) for (let i = 0; i < 6; i++) {
      const x = i * 43 + (row % 2) * 21 + 10, y = 20 + row * 44;
      g.beginPath();
      for (let k = 0; k < 5; k++) { const a = (k / 5) * Math.PI * 2 - Math.PI / 2; g.lineTo(x + Math.cos(a) * 11, y + Math.sin(a) * 11); }
      g.fill();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  ballCache[kind] = tex;
  return tex;
}

function mat(color, look, extra = {}) {
  const m = new THREE.MeshStandardMaterial({
    color,
    roughness: look.metal ? 0.3 : 0.65,
    metalness: look.metal ? 0.7 : 0.05,
    ...extra,
  });
  if (look.glow) { m.emissive = new THREE.Color(look.glow); m.emissiveIntensity = 0.18; }
  return m;
}

function box(w, h, d, material, x, y, z) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function add(parent, mesh, x = 0, y = 0, z = 0) {
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

const GOLD = () => new THREE.MeshStandardMaterial({ color: 0xffc83d, metalness: 0.9, roughness: 0.25, emissive: 0x3a2500, emissiveIntensity: 0.4 });

export function buildFigure(look) {
  const group = new THREE.Group();
  const skin = mat(look.skin, look);
  const shirt = mat(look.shirt, look);
  const pants = mat(look.pants, look);
  const arms = mat(look.arms ?? look.skin, look);

  group.add(box(0.96, 2, 1, pants, -0.5, 1, 0));
  group.add(box(0.96, 2, 1, pants, 0.5, 1, 0));
  let torsoMat = shirt;
  if (look.number !== undefined) {
    const front = mat(0xffffff, look, { map: jerseyTexture(look, false) });
    const back = mat(0xffffff, look, { map: jerseyTexture(look, true) });
    torsoMat = [shirt, shirt, shirt, shirt, front, back];
  }
  const torso = box(2, 2, 1, torsoMat, 0, 3, 0);
  group.add(torso);

  const mkArm = (side) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 1.5, 3.9, 0);
    pivot.add(box(0.96, 2, 1, arms, 0, -0.9, 0));
    group.add(pivot);
    return pivot;
  };
  const leftArm = mkArm(-1);
  const rightArm = mkArm(1);

  // Head: face on the +z side
  const faceMat = new THREE.MeshStandardMaterial({ map: faceTexture(look.face || 'smile', look.skin, look.beard, look.goatee), roughness: 0.6 });
  if (look.glow) { faceMat.emissive = new THREE.Color(0xffffff); faceMat.emissiveMap = faceMat.map; faceMat.emissiveIntensity = 0.12; }
  const head = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), [skin, skin, skin, skin, faceMat, skin]);
  head.position.set(0, 4.6, 0);
  head.castShadow = true;
  group.add(head);

  addHair(head, look);
  addHat(head, look);
  const aura = addExtras(group, torso, look);

  // Taller players: scale every part about the feet
  if (look.tall) {
    for (const c of group.children) { c.position.multiplyScalar(look.tall); c.scale.multiplyScalar(look.tall); }
  }

  return { group, leftArm, rightArm, head, torso, aura };
}

function addHair(head, look) {
  if (!look.hair) return;
  const m = new THREE.MeshStandardMaterial({ color: look.hairColor ?? 0x1b1b1b, roughness: 0.9 });
  if (look.hairGlow) { m.emissive = new THREE.Color(look.hairColor); m.emissiveIntensity = 0.6; }
  const part = (geo, x, y, z) => add(head, new THREE.Mesh(geo, m), x, y, z);
  // Shell over the back and sides, leaving the face (+z) open
  part(new THREE.BoxGeometry(1.26, 0.5, 1.04), 0, 0.37, -0.12);
  switch (look.hair) {
    case 'buzz':
      part(new THREE.BoxGeometry(1.24, 0.06, 1.24), 0, 0.62, 0);
      break;
    case 'afro':
      part(new THREE.BoxGeometry(1.5, 0.75, 1.45), 0, 0.62, -0.05);
      break;
    case 'spiky':
      part(new THREE.BoxGeometry(1.3, 0.25, 1.3), 0, 0.66, 0);
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2;
        const spike = part(new THREE.ConeGeometry(0.2, 0.75, 6), Math.cos(a) * 0.4, 0.95, Math.sin(a) * 0.4 - 0.05);
        spike.rotation.set(Math.sin(a) * 0.6, 0, -Math.cos(a) * 0.6);
      }
      part(new THREE.ConeGeometry(0.22, 0.9, 6), 0, 1.15, 0);
      break;
    default: // short, bun, long
      part(new THREE.BoxGeometry(1.3, 0.25, 1.3), 0, 0.66, 0);
      part(new THREE.BoxGeometry(1.3, 0.14, 0.1), 0, 0.52, 0.62);
      if (look.hair === 'bun') part(new THREE.SphereGeometry(0.26, 12, 8), 0, 0.85, -0.35);
      if (look.hair === 'long') {
        part(new THREE.BoxGeometry(1.32, 1.3, 0.22), 0, -0.05, -0.6);
        part(new THREE.BoxGeometry(0.14, 0.9, 1.0), -0.66, 0.1, -0.1);
        part(new THREE.BoxGeometry(0.14, 0.9, 1.0), 0.66, 0.1, -0.1);
      }
  }
}

function addHat(head, look) {
  const hc = look.hatColor ?? 0x222222;
  const hm = new THREE.MeshStandardMaterial({ color: hc, roughness: 0.6 });
  switch (look.hat) {
    case 'cap':
    case 'capBack': {
      add(head, new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.66, 0.3, 24), hm), 0, 0.7, 0);
      add(head, new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 0.6), hm), 0, 0.58, look.hat === 'cap' ? 0.75 : -0.75);
      break;
    }
    case 'bacon': {
      const hair = new THREE.MeshStandardMaterial({ color: 0x5a3214, roughness: 0.9 });
      add(head, new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.35, 1.32), hair), 0, 0.62, 0);
      add(head, new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.9, 0.25), hair), 0, 0.2, -0.6);
      for (let i = -1; i <= 1; i++) add(head, new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.25, 0.25), hair), i * 0.42, 0.45, 0.62);
      break;
    }
    case 'hardhat': {
      const y = new THREE.MeshStandardMaterial({ color: 0xffd60a, roughness: 0.4 });
      add(head, new THREE.Mesh(new THREE.SphereGeometry(0.72, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), y), 0, 0.55, 0);
      add(head, new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.06, 24), y), 0, 0.56, 0.05);
      break;
    }
    case 'headphones': {
      const p = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4 });
      // Half torus in the XY plane arches over the top of the head
      add(head, new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.07, 8, 24, Math.PI), p), 0, 0, 0);
      add(head, new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16), new THREE.MeshStandardMaterial({ color: 0x7d3cff })), -0.68, 0, 0).rotation.z = Math.PI / 2;
      add(head, new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16), new THREE.MeshStandardMaterial({ color: 0x7d3cff })), 0.68, 0, 0).rotation.z = Math.PI / 2;
      break;
    }
    case 'headband':
    case 'bandana':
      add(head, new THREE.Mesh(new THREE.BoxGeometry(1.26, look.hat === 'bandana' ? 0.45 : 0.2, 1.26), hm), 0, look.hat === 'bandana' ? 0.42 : 0.3, 0);
      add(head, new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.15), hm), 0.2, 0.05, -0.68).rotation.z = 0.4;
      break;
    case 'helmet': {
      const m = new THREE.MeshStandardMaterial({ color: 0xc0c8d0, metalness: 0.85, roughness: 0.3 });
      add(head, new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.5, 1.34), m), 0, 0.42, 0);
      add(head, new THREE.Mesh(new THREE.BoxGeometry(1.34, 1.2, 0.2), m), 0, 0, -0.62);
      add(head, new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.4, 0.5), new THREE.MeshStandardMaterial({ color: 0xc1121f })), 0, 0.85, 0);
      break;
    }
    case 'antenna': {
      const m = new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.8, roughness: 0.3 });
      add(head, new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8), m), 0, 0.9, 0);
      add(head, new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), new THREE.MeshStandardMaterial({ color: 0xff3355, emissive: 0xff3355, emissiveIntensity: 1 })), 0, 1.22, 0);
      break;
    }
    case 'wizard': {
      add(head, new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.08, 24), hm), 0, 0.62, 0);
      const cone = add(head, new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.7, 24), hm), 0, 1.45, 0);
      cone.rotation.z = 0.15;
      add(head, new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshStandardMaterial({ color: 0xffe066, emissive: 0xffe066 })), 0.25, 1.2, 0.55);
      break;
    }
    case 'bubble': {
      const glass = new THREE.MeshPhysicalMaterial({ color: 0xbfe9ff, transparent: true, opacity: 0.3, roughness: 0, metalness: 0, clearcoat: 1 });
      add(head, new THREE.Mesh(new THREE.SphereGeometry(1.0, 24, 16), glass), 0, 0, 0).castShadow = false;
      break;
    }
    case 'horns': {
      const m = new THREE.MeshStandardMaterial({ color: 0x2a1a10, roughness: 0.4 });
      const l = add(head, new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.7, 12), m), -0.45, 0.85, 0); l.rotation.z = 0.5;
      const r = add(head, new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.7, 12), m), 0.45, 0.85, 0); r.rotation.z = -0.5;
      break;
    }
    case 'kabuto': {
      const m = new THREE.MeshStandardMaterial({ color: 0x1b1b1b, metalness: 0.5, roughness: 0.35 });
      add(head, new THREE.Mesh(new THREE.SphereGeometry(0.75, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), m), 0, 0.5, 0);
      const g = GOLD();
      const l = add(head, new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.8, 0.08), g), -0.3, 1.1, 0.5); l.rotation.z = 0.45;
      const r = add(head, new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.8, 0.08), g), 0.3, 1.1, 0.5); r.rotation.z = -0.45;
      break;
    }
    case 'tophat':
      add(head, new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.08, 24), hm), 0, 0.62, 0);
      add(head, new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.0, 24), hm), 0, 1.15, 0);
      add(head, new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.56, 0.15, 24), new THREE.MeshStandardMaterial({ color: 0xb3001b })), 0, 0.75, 0);
      break;
    case 'crown': {
      const g = GOLD();
      add(head, new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.35, 24, 1, true), g), 0, 0.78, 0).material.side = THREE.DoubleSide;
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        add(head, new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.35, 8), g), Math.cos(a) * 0.55, 1.1, Math.sin(a) * 0.55);
      }
      add(head, new THREE.Mesh(new THREE.OctahedronGeometry(0.13), new THREE.MeshStandardMaterial({ color: 0xff1744, emissive: 0xff1744, emissiveIntensity: 0.6 })), 0, 0.8, 0.64);
      break;
    }
    case 'homer': {
      const m = new THREE.MeshStandardMaterial({ color: 0x222222 });
      for (const x of [-0.12, 0.12]) {
        const t = add(head, new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.025, 6, 16, Math.PI), m), x, 0.6, 0);
        t.rotation.y = Math.PI / 2;
      }
      for (const sx of [-1, 1]) add(head, new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.3, 0.4), m), sx * 0.62, 0.15, -0.2);
      break;
    }
    case 'mouseEars': {
      const m = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
      for (const sx of [-1, 1]) {
        const e = add(head, new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.1, 24), m), sx * 0.62, 0.85, -0.1);
        e.rotation.x = Math.PI / 2;
      }
      break;
    }
    case 'ogreEars': {
      const m = new THREE.MeshStandardMaterial({ color: look.skin, roughness: 0.7 });
      for (const sx of [-1, 1]) {
        const e = add(head, new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.14, 0.45, 10), m), sx * 0.78, 0.3, 0);
        e.rotation.z = -sx * Math.PI / 2.4;
      }
      break;
    }
    case 'dogEars': {
      const m = new THREE.MeshStandardMaterial({ color: 0x5a3214, roughness: 0.8 });
      const l = add(head, new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.8, 0.5), m), -0.72, 0.1, 0); l.rotation.z = -0.25;
      const r = add(head, new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.8, 0.5), m), 0.72, 0.1, 0); r.rotation.z = 0.25;
      add(head, new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 8), new THREE.MeshStandardMaterial({ color: 0x111111 })), 0, -0.05, 0.64);
      break;
    }
    case 'bunnyEars': {
      const m = new THREE.MeshStandardMaterial({ color: look.skin, roughness: 0.7 });
      const pink = new THREE.MeshStandardMaterial({ color: 0xff9ec7 });
      for (const sx of [-1, 1]) {
        const e = add(head, new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, 0.18), m), sx * 0.3, 1.15, 0); e.rotation.z = -sx * 0.15;
        add(e, new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.9, 0.04), pink), 0, 0, 0.1);
      }
      break;
    }
    case 'catEars': {
      const m = new THREE.MeshStandardMaterial({ color: look.skin, roughness: 0.7 });
      for (const sx of [-1, 1]) {
        const e = add(head, new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.5, 4), m), sx * 0.38, 0.8, 0); e.rotation.y = Math.PI / 4;
      }
      // whiskers
      const w = new THREE.MeshStandardMaterial({ color: 0x111111 });
      for (const sx of [-1, 1]) for (const dy of [-0.08, 0.04]) add(head, new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.03, 0.02), w), sx * 0.45, -0.1 + dy, 0.61);
      break;
    }
    case 'halo': {
      const m = new THREE.MeshStandardMaterial({ color: 0xfff3a0, emissive: look.glow ?? 0xffe066, emissiveIntensity: 2 });
      const t = add(head, new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.07, 10, 32), m), 0, 1.05, 0);
      t.rotation.x = Math.PI / 2;
      t.castShadow = false;
      break;
    }
  }
}

function addExtras(group, torso, look) {
  const extras = look.extras || [];
  let aura = null;
  if (extras.includes('chain')) {
    const t = add(group, new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.08, 8, 24, Math.PI), GOLD()), 0, 3.95, 0.52);
    t.rotation.z = Math.PI;
    add(group, new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.1), GOLD()), 0, 3.3, 0.56);
  }
  if (extras.includes('tie')) {
    const red = new THREE.MeshStandardMaterial({ color: 0xc1121f });
    add(group, new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.6, 0.04), new THREE.MeshStandardMaterial({ color: 0xffffff })), 0, 3.2, 0.51);
    add(group, new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.3, 0.05), red), 0, 3.25, 0.53);
  }
  if (extras.includes('cape')) {
    const m = new THREE.MeshStandardMaterial({ color: look.capeColor ?? 0xb3001b, side: THREE.DoubleSide, roughness: 0.8 });
    const cape = add(group, new THREE.Mesh(new THREE.BoxGeometry(2.1, 3.6, 0.06), m), 0, 2.2, -0.58);
    cape.rotation.x = 0.08;
  }
  if (extras.includes('wings')) {
    const m = new THREE.MeshStandardMaterial({
      color: look.wingColor ?? 0xffffff, emissive: look.glow ?? 0x000000, emissiveIntensity: look.glow ? 0.35 : 0,
      side: THREE.DoubleSide, roughness: 0.6,
    });
    const shape = new THREE.Shape();
    shape.moveTo(0, 0); shape.quadraticCurveTo(1.2, 1.6, 2.6, 1.3); shape.quadraticCurveTo(2.0, 0.4, 2.3, -0.4);
    shape.quadraticCurveTo(1.4, -0.3, 1.6, -1.2); shape.quadraticCurveTo(0.8, -0.6, 0, 0);
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.06, bevelEnabled: false });
    for (const s of [-1, 1]) {
      const w = new THREE.Mesh(geo, m);
      w.position.set(s * 0.4, 3.4, -0.6);
      w.scale.x = s;
      w.rotation.y = s * -0.5;
      w.castShadow = true;
      w.userData.wing = s;
      group.add(w);
    }
  }
  if (extras.includes('basketball') || extras.includes('soccerball')) {
    const kind = extras.includes('basketball') ? 'basketball' : 'soccer';
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 16), new THREE.MeshStandardMaterial({ map: ballTexture(kind), roughness: kind === 'basketball' ? 0.8 : 0.4 }));
    ball.castShadow = true;
    ball.userData.ball = kind;
    if (kind === 'basketball') ball.position.set(1.9, 2.2, 0.6);
    else ball.position.set(0.9, 0.5, 1.1);
    group.add(ball);
  }
  if (extras.includes('whiteGloves')) {
    const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    for (const sx of [-1, 1]) add(group, new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.55, 1.1), m), sx * 1.5, 2.2, 0);
  }
  if (extras.includes('vest')) {
    const m = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.9 });
    for (const sx of [-1, 1]) add(group, new THREE.Mesh(new THREE.BoxGeometry(0.62, 2.0, 0.06), m), sx * 0.7, 3, 0.52);
    add(group, new THREE.Mesh(new THREE.BoxGeometry(2.02, 2.0, 0.06), m), 0, 3, -0.52);
  }
  if (extras.includes('belt')) {
    add(group, new THREE.Mesh(new THREE.BoxGeometry(2.06, 0.3, 1.06), new THREE.MeshStandardMaterial({ color: 0x1e40af })), 0, 2.15, 0);
  }
  if (extras.includes('gloves')) {
    const m = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
    for (const sx of [-1, 1]) add(group, new THREE.Mesh(new THREE.BoxGeometry(1.06, 0.5, 1.06), m), sx * 1.5, 2.15, 0);
  }
  if (extras.includes('goldboots')) {
    for (const sx of [-1, 1]) add(group, new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.4, 1.25), GOLD()), sx * 0.5, 0.2, 0.1);
  }
  if (extras.includes('emblem')) {
    const star = new THREE.Shape();
    for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2 + Math.PI / 2, r = i % 2 ? 0.25 : 0.55; star.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
    add(group, new THREE.Mesh(new THREE.ExtrudeGeometry(star, { depth: 0.05, bevelEnabled: false }), new THREE.MeshStandardMaterial({ color: 0xffd60a, emissive: 0x553300 })), 0, 3.1, 0.5);
  }
  if (extras.includes('aura')) {
    const n = 60;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, r = 1.4 + Math.random() * 0.9;
      pos[i * 3] = Math.cos(a) * r; pos[i * 3 + 1] = Math.random() * 5.5; pos[i * 3 + 2] = Math.sin(a) * r;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    aura = new THREE.Points(geo, new THREE.PointsMaterial({
      color: look.auraColor ?? look.glow ?? 0xffffff, size: 0.18, transparent: true, opacity: 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    group.add(aura);
  }
  return aura;
}

export function disposeObject(obj) {
  obj.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) {
      for (const m of [].concat(o.material)) {
        // Face textures are cached and shared; leave them alive.
        m.dispose();
      }
    }
  });
}
