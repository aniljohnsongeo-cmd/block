// ─── LEGO Digital Studio — Constants ─────────────────────────────────────────

export const COLORS = {
  background: '#F7F5F0',
  legoRed: '#E3000B',
  legoBlue: '#0055BF',
  legoYellow: '#FFD700',
  legoGreen: '#00852B',
  legoWhite: '#F0F0F0',
  legoBlack: '#1A1A1D',
  legoDarkGray: '#6B6B6B',
  legoLightGray: '#D3D3D3',
  deloitteGreen: '#86BC25',
  roadColor: '#C8C5BE',
  gridLine: 'rgba(0,0,0,0.06)',
};

// Disciplines that each block represents
export const DISCIPLINES = [
  { label: 'Strategy',       color: COLORS.legoRed,    id: 'strategy'    },
  { label: 'Design',         color: COLORS.legoBlue,   id: 'design'      },
  { label: 'Technology',     color: COLORS.legoYellow, id: 'technology'  },
  { label: 'Content',        color: COLORS.legoGreen,  id: 'content'     },
  { label: 'Intelligence',   color: COLORS.legoWhite,  id: 'intelligence'},
];

// Scroll progress thresholds (0–1)
export const SCROLL_PHASES = {
  SINGLE_BLOCK:    { start: 0,    end: 0.12 },
  BLOCKS_ARRIVE:   { start: 0.12, end: 0.30 },
  ASSEMBLY:        { start: 0.30, end: 0.58 },
  BUILDING:        { start: 0.58, end: 0.75 },
  ZOOM_OUT:        { start: 0.75, end: 0.88 },
  CITY_REVEAL:     { start: 0.88, end: 1.00 },
};

// Camera keyframes [x, y, z] at each phase
export const CAMERA_KEYFRAMES = [
  // 0: single block — close low angle
  { position: [0, 4, 9],   target: [0, 0.8, 0], phase: 'SINGLE_BLOCK'  },
  // 1: blocks arrive — slightly wider
  { position: [0, 5, 12],  target: [0, 1.0, 0], phase: 'BLOCKS_ARRIVE' },
  // 2: assembly — close-up
  { position: [3, 6, 10],  target: [0, 2.0, 0], phase: 'ASSEMBLY'      },
  // 3: building — eye-level architectural
  { position: [6, 7, 11],  target: [0, 4.0, 0], phase: 'BUILDING'      },
  // 4: zoom out — mid aerial
  { position: [12, 18, 22],target: [0, 2.0, 0], phase: 'ZOOM_OUT'      },
  // 5: full city — high isometric
  { position: [24, 32, 40],target: [0, 0.0, 0], phase: 'CITY_REVEAL'   },
];

// Narrative text at each phase
export const NARRATIVE = [
  {
    phase: 'SINGLE_BLOCK',
    eyebrow: 'DELOITTE DIGITAL STUDIO',
    headline: 'Different blocks.\nOne experience.',
    sub: 'One block is a beginning. Scroll to build something bigger.',
  },
  {
    phase: 'BLOCKS_ARRIVE',
    eyebrow: 'FIVE DISCIPLINES',
    headline: 'Strategy. Design.\nTechnology.\nContent. Intelligence.',
    sub: 'Each block a specialised force — arriving with purpose.',
  },
  {
    phase: 'ASSEMBLY',
    eyebrow: 'CONVERGENCE',
    headline: 'Blocks converge.\nSystems align.',
    sub: 'Interlocking by design. Every discipline has its place.',
  },
  {
    phase: 'BUILDING',
    eyebrow: 'DELOITTE DIGITAL',
    headline: 'Built to stand.\nBuilt to last.',
    sub: 'Architecture of infinite possibilities.',
  },
  {
    phase: 'ZOOM_OUT',
    eyebrow: 'THE BIGGER PICTURE',
    headline: 'Part of something\nmuch larger.',
    sub: 'Zoom out. The city awaits.',
  },
  {
    phase: 'CITY_REVEAL',
    eyebrow: 'EXPLORE THE CITY',
    headline: 'Your world of\nideas, built.',
    sub: 'Click any building to step inside.',
  },
];

// City buildings (interactive)
export const CITY_BUILDINGS = [
  {
    id: 'hq',
    label: 'Deloitte Studio',
    tag: 'Home',
    color: COLORS.legoRed,
    position: [0, 0, 0],
    size: { w: 4, h: 8, d: 4 },
    section: 'home',
    description: 'The intersection where strategy, design and technology converge into transformative experiences.',
    icon: '◼',
  },
  {
    id: 'work',
    label: 'Work',
    tag: 'Portfolio',
    color: COLORS.legoBlue,
    position: [-9, 0, -5],
    size: { w: 3, h: 6, d: 3 },
    section: 'work',
    description: 'Award-winning case studies from Fortune 500 companies and emerging innovators.',
    icon: '▣',
  },
  {
    id: 'services',
    label: 'Services',
    tag: 'Capabilities',
    color: COLORS.legoYellow,
    position: [9, 0, -5],
    size: { w: 3, h: 5, d: 3 },
    section: 'services',
    description: 'End-to-end from research and strategy through design and engineering to launch.',
    icon: '◧',
  },
  {
    id: 'about',
    label: 'About',
    tag: 'Culture',
    color: COLORS.legoGreen,
    position: [-8, 0, 7],
    size: { w: 2.5, h: 4, d: 2.5 },
    section: 'about',
    description: 'A global team of makers, thinkers and relentless problem-solvers.',
    icon: '◉',
  },
  {
    id: 'ai',
    label: 'AI & Tech',
    tag: 'Intelligence',
    color: COLORS.legoWhite,
    position: [8, 0, 7],
    size: { w: 2.5, h: 5, d: 2.5 },
    section: 'ai',
    description: 'Applied AI, data platforms and emerging technology for the businesses of tomorrow.',
    icon: '◈',
  },
];

export const TOTAL_SCROLL_HEIGHT = 2800; // px of scroll space
