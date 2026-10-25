// Rarity tiers: base roll weight, income range, and how hard the dealer shuffles.
export const RARITIES = [
  { id: 'common',    name: 'Common',    color: '#b8c0cc', weight: 60,   income: [1, 2],         swaps: 6,  swapTime: 0.55 },
  { id: 'uncommon',  name: 'Uncommon',  color: '#5fd068', weight: 25,   income: [4, 6],         swaps: 8,  swapTime: 0.45 },
  { id: 'rare',      name: 'Rare',      color: '#3fa7ff', weight: 10,   income: [15, 22],       swaps: 10, swapTime: 0.36 },
  { id: 'epic',      name: 'Epic',      color: '#b46bff', weight: 4,    income: [60, 90],       swaps: 12, swapTime: 0.28 },
  { id: 'legendary', name: 'Legendary', color: '#ffb833', weight: 0.9,  income: [300, 450],     swaps: 15, swapTime: 0.21 },
  { id: 'mythic',    name: 'Mythic',    color: '#ff4d6d', weight: 0.09, income: [2000, 3000],   swaps: 18, swapTime: 0.16 },
  { id: 'secret',    name: 'Secret',    color: '#ffffff', weight: 0.01, income: [15000, 25000], swaps: 22, swapTime: 0.12 },
];

const Y = 0xf5cd30, BLUE = 0x0d69ac, GREEN = 0x4b974b, TAN = 0xe8b98a, DARK = 0x1b1b22;

export const THEMES = [
  { id: 'basketball', name: 'Basketball', emoji: '🏀', color: '#ff8a1f' },
  { id: 'soccer', name: 'Soccer', emoji: '⚽', color: '#39d353' },
  { id: 'cartoon', name: 'Cartoon', emoji: '🎨', color: '#ff5cc8' },
];

// Characters you can roll: one per theme per rarity tier. `look` drives the blocky model builder.
export const CHARACTERS = [
  // Basketball
  { id: 'rookie', name: 'Rookie Hooper', theme: 'basketball', tier: 0, look: { skin: Y, shirt: 0xf2f2f2, pants: 0xf2f2f2, number: 3, trim: 0x1d4ed8, face: 'smile', extras: ['basketball'] } },
  { id: 'street', name: 'Street Baller', theme: 'basketball', tier: 1, look: { skin: 0x8d5524, shirt: 0x1b1b22, pants: 0x1b1b22, number: 11, trim: 0xff8a1f, face: 'happy', hat: 'capBack', hatColor: 0xff8a1f, extras: ['basketball'] } },
  { id: 'pointguard', name: 'Point Guard', theme: 'basketball', tier: 2, look: { skin: TAN, shirt: 0x1d4ed8, pants: 0x1d4ed8, number: 7, trim: 0xffffff, face: 'cool', hat: 'headband', hatColor: 0xffffff, extras: ['basketball'] } },
  { id: 'dunker', name: 'Slam Dunker', theme: 'basketball', tier: 3, look: { skin: 0x5c3a21, shirt: 0xc8102e, pants: 0xc8102e, number: 32, trim: 0x111111, face: 'angry', hat: 'headband', hatColor: 0xc8102e, extras: ['basketball'] } },
  { id: 'mvp', name: 'MVP', theme: 'basketball', tier: 4, look: { skin: 0x8d5524, shirt: 0x552583, pants: 0x552583, number: 1, trim: 0xfdb927, face: 'cool', extras: ['basketball', 'chain'] } },
  { id: 'halloffame', name: 'Hall of Famer', theme: 'basketball', tier: 5, look: { skin: TAN, shirt: 0x111111, pants: 0x111111, number: 33, trim: 0xffc83d, face: 'glow', hat: 'crown', glow: 0xffb833, extras: ['basketball', 'cape', 'aura'], capeColor: 0x7a0f0f } },
  { id: 'goat', name: 'The GOAT', theme: 'basketball', tier: 6, look: { skin: 0x5c3a21, shirt: 0xffc83d, pants: 0xffc83d, number: 0, trim: 0x111111, metal: true, face: 'glow', hat: 'horns', glow: 0xffe066, extras: ['basketball', 'aura', 'wings', 'chain'], wingColor: 0xfff3b0 } },
  // Soccer
  { id: 'kicker', name: 'Sunday Kicker', theme: 'soccer', tier: 0, look: { skin: TAN, shirt: 0x2e8b57, pants: 0xffffff, number: 9, trim: 0xffffff, face: 'smile', extras: ['soccerball'] } },
  { id: 'keeper', name: 'Goalkeeper', theme: 'soccer', tier: 1, look: { skin: 0xc68642, shirt: 0xd4ff00, pants: 0x111111, arms: 0xd4ff00, number: 1, trim: 0x111111, face: 'happy', hat: 'cap', hatColor: 0x111111, extras: ['soccerball', 'gloves'] } },
  { id: 'winger', name: 'Speedy Winger', theme: 'soccer', tier: 2, look: { skin: TAN, shirt: 0x6cace4, pants: 0xffffff, number: 11, trim: 0xffffff, face: 'happy', hat: 'bacon', extras: ['soccerball'] } },
  { id: 'striker', name: 'Striker', theme: 'soccer', tier: 3, look: { skin: 0x8d5524, shirt: 0xda291c, pants: 0xffffff, number: 10, trim: 0xffffff, face: 'cool', hat: 'headband', hatColor: 0x111111, extras: ['soccerball'] } },
  { id: 'goldenboot', name: 'Golden Boot', theme: 'soccer', tier: 4, look: { skin: TAN, shirt: 0xffffff, pants: 0xffffff, number: 9, trim: 0xffc83d, face: 'cool', extras: ['soccerball', 'chain', 'goldboots'] } },
  { id: 'legend', name: 'Pitch Legend', theme: 'soccer', tier: 5, look: { skin: 0xc68642, shirt: 0x0a1f44, pants: 0x0a1f44, number: 10, trim: 0xffc83d, face: 'glow', hat: 'crown', glow: 0x3fa7ff, extras: ['soccerball', 'cape', 'aura', 'goldboots'], capeColor: 0x0a1f44 } },
  { id: 'phenom', name: 'The Phenom', theme: 'soccer', tier: 6, look: { skin: 0x2b1b6b, shirt: 0x3d1f9e, pants: 0x1a0f4a, arms: 0x3d1f9e, number: 7, trim: 0x6ef3ff, face: 'glow', hat: 'halo', glow: 0x6ef3ff, extras: ['soccerball', 'aura', 'wings', 'goldboots'], wingColor: 0x8a5cff } },
  // Cartoon (original characters)
  { id: 'pup', name: 'Toon Pup', theme: 'cartoon', tier: 0, look: { skin: 0xc68a4a, shirt: 0x3fa7ff, pants: 0x1d3557, face: 'toon', hat: 'dogEars' } },
  { id: 'bunny', name: 'Silly Bunny', theme: 'cartoon', tier: 1, look: { skin: 0xf5f5f5, shirt: 0xff7eb6, pants: 0x5b2a86, face: 'toon', hat: 'bunnyEars' } },
  { id: 'kitty', name: 'Kitty Kat', theme: 'cartoon', tier: 2, look: { skin: 0xff9f43, shirt: 0x2d3436, pants: 0x2d3436, face: 'toon', hat: 'catEars' } },
  { id: 'hero', name: 'Captain Toon', theme: 'cartoon', tier: 3, look: { skin: TAN, shirt: 0x1d4ed8, pants: 0x1d4ed8, arms: 0x1d4ed8, face: 'mask', extras: ['cape', 'emblem'], capeColor: 0xd62828 } },
  { id: 'wizard', name: 'Wizzle the Wizard', theme: 'cartoon', tier: 4, look: { skin: 0x9be15d, shirt: 0x5b2a86, pants: 0x3a1a5c, arms: 0x5b2a86, face: 'toon', hat: 'wizard', hatColor: 0x5b2a86, glow: 0xb46bff } },
  { id: 'toondragon', name: 'Dino Rex Toon', theme: 'cartoon', tier: 5, look: { skin: 0x2ecc71, shirt: 0x27ae60, pants: 0x1e8449, arms: 0x2ecc71, face: 'toon', hat: 'horns', glow: 0xff4d6d, extras: ['wings', 'aura'], wingColor: 0xff4d6d } },
  { id: 'glitch', name: 'Gl!tch Toon', theme: 'cartoon', tier: 6, look: { skin: 0xff00d4, shirt: 0x00e5ff, pants: 0xff00d4, arms: 0x00e5ff, face: 'glitch', hat: 'antenna', glow: 0x00e5ff, extras: ['aura', 'wings'], wingColor: 0xff00d4 } },
];

// Dealer upgrades: each level rolls luckier, looks cooler, and gets fancier cups.
export const DEALER_LEVELS = [
  { name: 'Noob', cost: 0, luck: 1, cup: 0xd62828,
    look: { skin: Y, shirt: BLUE, pants: GREEN, face: 'smile' } },
  { name: 'Guest', cost: 150, luck: 1.25, cup: 0xd62828,
    look: { skin: Y, shirt: BLUE, pants: GREEN, face: 'smile', hat: 'cap', hatColor: 0x1d3557 } },
  { name: 'Bacon', cost: 750, luck: 1.6, cup: 0x1d6fd6,
    look: { skin: TAN, shirt: 0x2e8b57, pants: 0x223377, face: 'happy', hat: 'bacon' } },
  { name: 'Cool Dude', cost: 4000, luck: 2.1, cup: 0x1d6fd6,
    look: { skin: TAN, shirt: 0xff6b35, pants: 0x222831, face: 'cool', hat: 'capBack', hatColor: 0x111111, extras: ['chain'] } },
  { name: 'Pro Dealer', cost: 20000, luck: 2.8, cup: 0x222222,
    look: { skin: TAN, shirt: 0x15151b, pants: 0x15151b, arms: 0x15151b, face: 'cool', hat: 'tophat', hatColor: 0x111111, extras: ['tie'] } },
  { name: 'Elite', cost: 100000, luck: 3.8, cup: 0xd4a017,
    look: { skin: TAN, shirt: 0x6a0dad, pants: 0x1b0a2e, arms: 0x6a0dad, face: 'cool', hat: 'crown', extras: ['chain', 'cape'], capeColor: 0xb3001b } },
  { name: 'Godly', cost: 500000, luck: 5.2, cup: 0xf5f5f5,
    look: { skin: 0xfff1e0, shirt: 0xffffff, pants: 0xe8e8e8, arms: 0xffffff, face: 'glow', hat: 'halo', glow: 0xffe066, extras: ['wings', 'aura', 'chain'] } },
  { name: 'Cosmic', cost: 2500000, luck: 7.5, cup: 0x3d1f9e,
    look: { skin: 0x2b1b6b, shirt: 0x3d1f9e, pants: 0x1a0f4a, arms: 0x3d1f9e, face: 'glow', hat: 'crown', glow: 0x6ef3ff, extras: ['wings', 'aura', 'cape'], capeColor: 0x8a5cff, wingColor: 0x8a5cff } },
];

export function tierWeights(luck) {
  return RARITIES.map((r, i) => r.weight * Math.pow(luck, i * 0.5));
}

export function tierOdds(luck) {
  const w = tierWeights(luck);
  const total = w.reduce((a, b) => a + b, 0);
  return w.map((x) => x / total);
}

export function rollCharacter(luck, theme) {
  const w = tierWeights(luck);
  let r = Math.random() * w.reduce((a, b) => a + b, 0);
  let tier = 0;
  for (; tier < w.length - 1; tier++) {
    r -= w[tier];
    if (r <= 0) break;
  }
  const pool = CHARACTERS.filter((c) => c.tier === tier && (!theme || c.theme === theme));
  const ch = pool[Math.floor(Math.random() * pool.length)];
  const [lo, hi] = RARITIES[tier].income;
  // Each roll gets its own income within the tier's range, so rolls feel different.
  const income = Math.round(lo + Math.random() * (hi - lo));
  return { id: ch.id, income };
}

export const themeById = (id) => THEMES.find((t) => t.id === id);

export const charById = (id) => CHARACTERS.find((c) => c.id === id);

export function fmt(n) {
  if (n < 1000) return '$' + Math.floor(n).toLocaleString();
  const units = ['K', 'M', 'B', 'T', 'Qa'];
  let u = -1;
  while (n >= 1000 && u < units.length - 1) { n /= 1000; u++; }
  return '$' + (n < 10 ? n.toFixed(2) : n < 100 ? n.toFixed(1) : Math.floor(n)) + units[u];
}
