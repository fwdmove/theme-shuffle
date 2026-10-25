// Rarity tiers: base roll weight, income range, and how hard the dealer shuffles.
export const RARITIES = [
  { id: 'common',    name: 'Common',    color: '#b8c0cc', weight: 60,   income: [1, 2],         swaps: 5,  swapTime: 1.15 },
  { id: 'uncommon',  name: 'Uncommon',  color: '#5fd068', weight: 25,   income: [4, 6],         swaps: 6,  swapTime: 1.05 },
  { id: 'rare',      name: 'Rare',      color: '#3fa7ff', weight: 10,   income: [15, 22],       swaps: 7, swapTime: 0.95 },
  { id: 'epic',      name: 'Epic',      color: '#b46bff', weight: 4,    income: [60, 90],       swaps: 8, swapTime: 0.85 },
  { id: 'legendary', name: 'Legendary', color: '#ffb833', weight: 0.9,  income: [300, 450],     swaps: 9, swapTime: 0.75 },
  { id: 'mythic',    name: 'Mythic',    color: '#ff4d6d', weight: 0.09, income: [2000, 3000],   swaps: 10, swapTime: 0.65 },
  { id: 'secret',    name: 'Secret',    color: '#ffffff', weight: 0.01, income: [15000, 25000], swaps: 12, swapTime: 0.55 },
];

const Y = 0xf5cd30, BLUE = 0x0d69ac, GREEN = 0x4b974b, TAN = 0xe8b98a, DARK = 0x1b1b22;

export const THEMES = [
  { id: 'basketball', name: 'Basketball', emoji: '🏀', color: '#ff8a1f' },
  { id: 'soccer', name: 'Soccer', emoji: '⚽', color: '#39d353' },
  { id: 'cartoon', name: 'Cartoon', emoji: '🎨', color: '#ff5cc8' },
];

// Characters you can roll, grouped by theme and rarity tier. `look` drives the blocky model builder.
const LAL = { shirt: 0xfdb927, pants: 0xfdb927, trim: 0x552583 };
const ENG = { shirt: 0xffffff, pants: 0x1d2a5c, trim: 0x1d2a5c };
const ESP = { shirt: 0xc60b1e, pants: 0x1d2a5c, trim: 0xffc400 };
const LIGHT = 0xf1c27d, MED = 0xc68642, BROWN = 0x8d5524, DEEP = 0x5c3a21;
const BLK = 0x1b1b1b, BRN = 0x6d4c41;

export const CHARACTERS = [
  // Basketball
  { id: 'caruso', name: 'Alex Caruso', theme: 'basketball', tier: 0, look: { skin: LIGHT, shirt: 0x007ac1, pants: 0x007ac1, trim: 0xef3b24, number: 9, hair: 'buzz', hairColor: BRN, beard: BRN, face: 'smile', extras: ['basketball'] } },
  { id: 'reaves', name: 'Austin Reaves', theme: 'basketball', tier: 0, look: { skin: LIGHT, ...LAL, number: 15, hair: 'short', hairColor: 0x8d6e63, face: 'smile', extras: ['basketball'] } },
  { id: 'haliburton', name: 'Tyrese Haliburton', theme: 'basketball', tier: 1, look: { skin: BROWN, shirt: 0x002d62, pants: 0x002d62, trim: 0xfdbb30, number: 0, hair: 'short', hairColor: BLK, face: 'happy', extras: ['basketball'] } },
  { id: 'brunson', name: 'Jalen Brunson', theme: 'basketball', tier: 1, look: { skin: BROWN, shirt: 0x006bb6, pants: 0x006bb6, trim: 0xf58426, number: 11, hair: 'buzz', hairColor: BLK, beard: BLK, face: 'smile', extras: ['basketball'] } },
  { id: 'morant', name: 'Ja Morant', theme: 'basketball', tier: 2, look: { skin: DEEP, shirt: 0x12173f, pants: 0x12173f, trim: 0x5d76a9, number: 12, hair: 'afro', hairColor: BLK, face: 'happy', extras: ['basketball'] } },
  { id: 'edwards', name: 'Anthony Edwards', theme: 'basketball', tier: 2, look: { skin: DEEP, shirt: 0x0c2340, pants: 0x0c2340, trim: 0x78be20, number: 5, hair: 'buzz', hairColor: BLK, face: 'happy', extras: ['basketball'] } },
  { id: 'luka', name: 'Luka Dončić', theme: 'basketball', tier: 3, look: { skin: LIGHT, ...LAL, number: 77, hair: 'short', hairColor: BRN, beard: BRN, face: 'smile', extras: ['basketball'] } },
  { id: 'wemby', name: 'Victor Wembanyama', theme: 'basketball', tier: 3, look: { skin: DEEP, shirt: 0x111111, pants: 0x111111, trim: 0xc4ced4, number: 1, hair: 'short', hairColor: BLK, face: 'smile', tall: 1.18, extras: ['basketball'] } },
  { id: 'curry', name: 'Stephen Curry', theme: 'basketball', tier: 4, look: { skin: MED, shirt: 0x1d428a, pants: 0x1d428a, trim: 0xffc72c, number: 30, hair: 'short', hairColor: BLK, beard: 0x3e2a1e, face: 'happy', extras: ['basketball'] } },
  { id: 'lebron', name: 'LeBron James', theme: 'basketball', tier: 5, look: { skin: DEEP, ...LAL, number: 23, hair: 'buzz', hairColor: BLK, beard: BLK, face: 'cool', hat: 'headband', hatColor: 0xffffff, glow: 0xfdb927, extras: ['basketball', 'aura'] } },
  { id: 'jordan', name: 'Michael Jordan', theme: 'basketball', tier: 6, look: { skin: 0x4a2c17, shirt: 0xce1141, pants: 0xce1141, trim: 0x111111, number: 23, beard: BLK, goatee: true, face: 'smile', glow: 0xff3b3b, extras: ['basketball', 'aura'] } },
  // Soccer (national team kits)
  { id: 'rice', name: 'Declan Rice', theme: 'soccer', tier: 0, look: { skin: LIGHT, ...ENG, number: 4, hair: 'short', hairColor: BRN, face: 'smile', extras: ['soccerball'] } },
  { id: 'pedri', name: 'Pedri', theme: 'soccer', tier: 0, look: { skin: LIGHT, ...ESP, number: 8, hair: 'short', hairColor: 0x3e2a1e, face: 'smile', extras: ['soccerball'] } },
  { id: 'saka', name: 'Bukayo Saka', theme: 'soccer', tier: 1, look: { skin: DEEP, ...ENG, number: 7, hair: 'short', hairColor: BLK, face: 'happy', extras: ['soccerball'] } },
  { id: 'kane', name: 'Harry Kane', theme: 'soccer', tier: 1, look: { skin: LIGHT, ...ENG, number: 9, hair: 'short', hairColor: 0x8d6e63, face: 'smile', extras: ['soccerball'] } },
  { id: 'bellingham', name: 'Jude Bellingham', theme: 'soccer', tier: 2, look: { skin: BROWN, ...ENG, number: 10, hair: 'buzz', hairColor: BLK, face: 'happy', extras: ['soccerball'] } },
  { id: 'vini', name: 'Vinícius Jr.', theme: 'soccer', tier: 2, look: { skin: DEEP, shirt: 0xffdc02, pants: 0x002776, trim: 0x009c3b, number: 7, hair: 'afro', hairColor: BLK, face: 'happy', extras: ['soccerball'] } },
  { id: 'haaland', name: 'Erling Haaland', theme: 'soccer', tier: 3, look: { skin: 0xffe0bd, shirt: 0xba0c2f, pants: 0xffffff, trim: 0xffffff, number: 9, hair: 'bun', hairColor: 0xe6c36a, face: 'angry', extras: ['soccerball'] } },
  { id: 'yamal', name: 'Lamine Yamal', theme: 'soccer', tier: 3, look: { skin: BROWN, ...ESP, number: 19, hair: 'short', hairColor: BLK, face: 'happy', extras: ['soccerball'] } },
  { id: 'mbappe', name: 'Kylian Mbappé', theme: 'soccer', tier: 4, look: { skin: BROWN, shirt: 0x1d2a5c, pants: 0xffffff, trim: 0xe1000f, number: 10, hair: 'buzz', hairColor: BLK, face: 'happy', extras: ['soccerball'] } },
  { id: 'ronaldo', name: 'Cristiano Ronaldo', theme: 'soccer', tier: 5, look: { skin: 0xe0ac69, shirt: 0xda291c, pants: 0x046a38, trim: 0x046a38, number: 7, hair: 'short', hairColor: BLK, face: 'cool', glow: 0xff4d4d, extras: ['soccerball', 'aura'] } },
  { id: 'messi', name: 'Lionel Messi', theme: 'soccer', tier: 6, look: { skin: LIGHT, shirt: 0x75aadb, stripes: 0xffffff, pants: 0x111111, trim: 0x111111, number: 10, hair: 'short', hairColor: BRN, beard: BRN, face: 'happy', glow: 0x9fd4ff, extras: ['soccerball', 'aura'] } },
  // Cartoon
  { id: 'patrick', name: 'Patrick Star', theme: 'cartoon', tier: 0, look: { skin: 0xff9ec7, shirt: 0xff9ec7, pants: 0x8bc34a, face: 'toon' } },
  { id: 'squidward', name: 'Squidward', theme: 'cartoon', tier: 0, look: { skin: 0x9fd8cb, shirt: 0x8d6e63, pants: 0x9fd8cb, face: 'sleepy' } },
  { id: 'shaggy', name: 'Shaggy', theme: 'cartoon', tier: 1, look: { skin: LIGHT, shirt: 0x7cb342, pants: 0x8d6e63, arms: 0x7cb342, hair: 'long', hairColor: 0x8d6e43, beard: 0x8d6e43, goatee: true, face: 'smile' } },
  { id: 'bart', name: 'Bart Simpson', theme: 'cartoon', tier: 1, look: { skin: 0xffd90f, shirt: 0xff6f00, pants: 0x1e88e5, hair: 'spiky', hairColor: 0xffd90f, face: 'toon' } },
  { id: 'homer', name: 'Homer Simpson', theme: 'cartoon', tier: 2, look: { skin: 0xffd90f, shirt: 0xffffff, pants: 0x42a5f5, hat: 'homer', beard: 0xb08a5a, face: 'toon' } },
  { id: 'peter', name: 'Peter Griffin', theme: 'cartoon', tier: 2, look: { skin: 0xffe0bd, shirt: 0xffffff, pants: 0x2e7d32, hair: 'short', hairColor: 0x5d4037, face: 'glasses' } },
  { id: 'spongebob', name: 'SpongeBob', theme: 'cartoon', tier: 3, look: { skin: 0xfff176, shirt: 0xffffff, pants: 0x8d6e43, face: 'sponge', extras: ['tie'] } },
  { id: 'bugs', name: 'Bugs Bunny', theme: 'cartoon', tier: 3, look: { skin: 0x9e9e9e, shirt: 0x9e9e9e, pants: 0x9e9e9e, face: 'toon', hat: 'bunnyEars', extras: ['whiteGloves'] } },
  { id: 'mickey', name: 'Mickey Mouse', theme: 'cartoon', tier: 4, look: { skin: 0x111111, shirt: 0x111111, pants: 0xe53935, face: 'mickey', hat: 'mouseEars', extras: ['whiteGloves'] } },
  { id: 'shrek', name: 'Shrek', theme: 'cartoon', tier: 4, look: { skin: 0x9ccc65, shirt: 0xe8dcb5, pants: 0x5d4037, arms: 0x9ccc65, face: 'smile', hat: 'ogreEars', extras: ['vest'] } },
  { id: 'goku', name: 'Goku', theme: 'cartoon', tier: 5, look: { skin: 0xffe0bd, shirt: 0xff7a00, pants: 0xff7a00, hair: 'spiky', hairColor: BLK, face: 'happy', auraColor: 0x6ec6ff, extras: ['aura', 'belt'] } },
  { id: 'ssgoku', name: 'Super Saiyan Goku', theme: 'cartoon', tier: 6, look: { skin: 0xffe0bd, shirt: 0xff7a00, pants: 0xff7a00, hair: 'spiky', hairColor: 0xffe14d, hairGlow: true, face: 'angry', auraColor: 0xffd54f, extras: ['aura', 'belt'] } },
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
