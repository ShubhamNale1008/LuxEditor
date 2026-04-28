/* ════════════════════════════════════════════════════════
   LuxEditor — app.js
   Core photo editor logic: canvas engine, tools, history,
   adjustments, filters, export, keyboard shortcuts, mobile.
   Zero dependencies. Pure ES6 + Canvas API.
   ════════════════════════════════════════════════════════ */
'use strict';

// ─────────────────────── CONSTANTS ───────────────────────

const FILTERS = [
  // ── Main Filters ──
  { name: 'Original',    label: 'Original',        css: '' },
  { name: 'TealOrange',  label: 'Teal & Orange 🎬', css: 'contrast(1.18) saturate(1.15) brightness(0.92) hue-rotate(8deg)' },
  { name: 'MoodyDark',   label: 'Moody Dark',       css: 'brightness(0.78) contrast(1.4) saturate(0.72)' },
  { name: 'VintageFilm', label: 'Vintage Film',     css: 'sepia(0.42) contrast(0.88) brightness(1.08) saturate(0.82)' },
  { name: 'BrightAiry',  label: 'Bright & Airy',   css: 'brightness(1.22) contrast(0.85) saturate(0.88)' },
  { name: 'HDRPop',      label: 'HDR Pop',          css: 'saturate(1.9) contrast(1.38) brightness(1.04)' },
  { name: 'MatteFade',   label: 'Matte Fade',       css: 'contrast(0.76) saturate(0.78) brightness(1.14)' },
  { name: 'GoldenHour',  label: 'Golden Hour',      css: 'sepia(0.5) saturate(1.8) brightness(1.12) hue-rotate(-18deg)' },
  { name: 'BWClassic',   label: 'B&W Classic',      css: 'grayscale(1) contrast(1.18) brightness(1.02)' },
  { name: 'PastelSoft',  label: 'Pastel Soft',      css: 'brightness(1.14) contrast(0.82) saturate(0.68) hue-rotate(5deg)' },
  { name: 'UrbanGrit',   label: 'Urban Grit',       css: 'contrast(1.45) saturate(0.65) brightness(0.85)' },
  { name: 'Invert',      label: 'Invert',            css: 'invert(1)' },

  // ── VSCO-Style (Premium) ──
  { name: 'A4',          label: 'A4',          css: 'sepia(0.2) contrast(0.9) brightness(1.05) saturate(0.85)',                          group: 'vsco', premium: true },
  { name: 'A6',          label: 'A6',          css: 'sepia(0.15) brightness(1.08) contrast(0.95) saturate(0.92)',                        group: 'vsco', premium: true },
  { name: 'BestMatch',   label: 'Best Match',   css: '__VSCO_BEST__',                                                                       group: 'vsco', premium: true },
  { name: 'C1',          label: 'C1',          css: 'hue-rotate(195deg) saturate(1.1) brightness(1.1) contrast(0.9)',                    group: 'vsco', premium: true },
  { name: 'F2',          label: 'F2',          css: 'sepia(0.35) saturate(1.5) brightness(1.1) hue-rotate(-8deg)',                       group: 'vsco', premium: true },
  { name: 'HB2',         label: 'HB2',         css: 'grayscale(1) contrast(1.42) brightness(0.94)',                                      group: 'vsco', premium: true },
  { name: 'M5',          label: 'M5',          css: 'sepia(0.4) contrast(0.95) brightness(1.05) saturate(1.2) hue-rotate(-5deg)',        group: 'vsco', premium: true },
  { name: 'P5',          label: 'P5',          css: 'saturate(1.6) contrast(1.18) brightness(1.04) hue-rotate(5deg)',                    group: 'vsco', premium: true },

  // ── Instagram-Style (Premium) ──
  { name: 'Clarendon',   label: 'Clarendon',   css: 'contrast(1.2) saturate(1.35) brightness(1.1) hue-rotate(5deg)',                     group: 'instagram', premium: true },
  { name: 'Gingham',     label: 'Gingham',     css: 'contrast(0.85) saturate(0.75) brightness(1.05) sepia(0.15)',                        group: 'instagram', premium: true },
  { name: 'Juno',        label: 'Juno',        css: 'sepia(0.2) saturate(1.6) contrast(1.15) brightness(1.05) hue-rotate(-10deg)',       group: 'instagram', premium: true },
  { name: 'Lark',        label: 'Lark',        css: 'brightness(1.15) contrast(0.9) saturate(0.85) hue-rotate(5deg)',                    group: 'instagram', premium: true },
  { name: 'Ludwig',      label: 'Ludwig',      css: 'brightness(1.12) contrast(0.95) saturate(0.9)',                                     group: 'instagram', premium: true },
  { name: 'Moon_IG',     label: 'Moon',        css: 'grayscale(1) brightness(1.1) contrast(1.1)',                                        group: 'instagram', premium: true },
  { name: 'Reyes',       label: 'Reyes',       css: 'sepia(0.3) contrast(0.85) brightness(1.15) saturate(0.75)',                         group: 'instagram', premium: true },
  { name: 'Sierra',      label: 'Sierra',      css: 'sepia(0.25) contrast(0.9) brightness(1.1) saturate(0.9) hue-rotate(-5deg)',         group: 'instagram', premium: true },
  { name: 'Aden',        label: 'Aden',        css: 'sepia(0.18) brightness(1.12) contrast(0.9) saturate(0.86) hue-rotate(8deg)',        group: 'instagram', premium: true },
  { name: 'Rise',        label: 'Rise',        css: 'sepia(0.2) brightness(1.08) contrast(0.92) saturate(0.9) hue-rotate(-6deg)',        group: 'instagram', premium: true },
  { name: 'Valencia',    label: 'Valencia',    css: 'sepia(0.24) brightness(1.1) contrast(0.9) saturate(1.02)',                          group: 'instagram', premium: true },
  { name: 'Perpetua',    label: 'Perpetua',    css: 'brightness(1.12) contrast(0.94) saturate(0.9) hue-rotate(3deg)',                    group: 'instagram', premium: true },
  { name: 'LoFi',        label: 'Lo-Fi',       css: 'contrast(1.36) saturate(1.28) brightness(1.0)',                                     group: 'instagram', premium: true },
  { name: 'Kelvin',      label: 'Kelvin',      css: 'sepia(0.24) contrast(1.1) brightness(1.04) saturate(1.12) hue-rotate(-16deg)',      group: 'instagram', premium: true },
  { name: 'Mayfair',     label: 'Mayfair',     css: 'brightness(1.08) contrast(1.03) saturate(0.94) sepia(0.12)',                        group: 'instagram', premium: true },
  { name: 'XPro2',       label: 'X-Pro II',    css: 'contrast(1.4) saturate(1.22) brightness(0.96) hue-rotate(-4deg)',                   group: 'instagram', premium: true },

  // ── Premium Editorial / Cinema ──
  { name: 'NoirVelvet',    label: 'Noir Velvet',      css: 'grayscale(0.85) contrast(1.32) brightness(0.9) saturate(0.72)',                   group: 'premium', premium: true },
  { name: 'AmberCine',     label: 'Amber Cine',       css: 'sepia(0.26) contrast(1.08) brightness(1.03) saturate(1.08) hue-rotate(-12deg)',   group: 'premium', premium: true },
  { name: 'ArcticFade',    label: 'Arctic Fade',      css: 'contrast(0.9) brightness(1.1) saturate(0.8) hue-rotate(14deg)',                   group: 'premium', premium: true },
  { name: 'SlateMatte',    label: 'Slate Matte',      css: 'contrast(0.78) brightness(1.13) saturate(0.84)',                                  group: 'premium', premium: true },
  { name: 'PearlPortrait', label: 'Pearl Portrait',   css: 'brightness(1.1) contrast(0.92) saturate(0.9) sepia(0.1)',                         group: 'premium', premium: true },
  { name: 'ChromePop',     label: 'Chrome Pop',       css: 'contrast(1.42) saturate(1.28) brightness(1.02) hue-rotate(2deg)',                 group: 'premium', premium: true },
  { name: 'DustyRose',     label: 'Dusty Rose',       css: 'sepia(0.2) saturate(0.9) brightness(1.08) contrast(0.92) hue-rotate(-18deg)',     group: 'premium', premium: true },
  { name: 'LuxeTeal',      label: 'Luxe Teal',        css: 'contrast(1.14) saturate(1.1) brightness(0.95) hue-rotate(10deg)',                 group: 'premium', premium: true },
  { name: 'FilmIvory',     label: 'Film Ivory',       css: 'sepia(0.34) contrast(0.86) brightness(1.12) saturate(0.8)',                       group: 'premium', premium: true },
  { name: 'UrbanSteel',    label: 'Urban Steel',      css: 'grayscale(0.2) contrast(1.3) saturate(0.72) brightness(0.94)',                    group: 'premium', premium: true },
  { name: 'VelvetMono',    label: 'Velvet Mono',      css: 'grayscale(0.95) contrast(1.26) brightness(0.93)',                                  group: 'premium', premium: true },
  { name: 'SunsetGold',    label: 'Sunset Gold',      css: 'sepia(0.3) contrast(1.06) brightness(1.08) saturate(1.12) hue-rotate(-14deg)',     group: 'premium', premium: true },
  { name: 'OceanGlass',    label: 'Ocean Glass',      css: 'contrast(1.08) brightness(1.02) saturate(0.94) hue-rotate(12deg)',                 group: 'premium', premium: true },
  { name: 'StudioIvory',   label: 'Studio Ivory',     css: 'sepia(0.22) contrast(0.88) brightness(1.14) saturate(0.82)',                       group: 'premium', premium: true },
  { name: 'NeonCity',      label: 'Neon City',        css: 'contrast(1.38) saturate(1.36) brightness(1.0) hue-rotate(18deg)',                  group: 'premium', premium: true },
];

const FILTER_GROUP_META = {
  vsco: {
    heading: 'VSCO Style',
    badge: 'PRO',
    title: 'VSCO Premium',
  },
  instagram: {
    heading: 'Instagram Premium',
    badge: 'PRO',
    title: 'Instagram Premium',
  },
  premium: {
    heading: 'Editorial Premium',
    badge: 'LUXE',
    title: 'Editorial Premium',
  },
};

const _adaptiveVscoCache = {
  key: '',
  name: 'A6',
};

let _filterThumbRenderToken = 0;
// ─────────────────────── EFFECTS (One-Click Presets) ───────────────────────

const EFFECTS = [
  // ── Cinematic ──
  { name: 'CinColorGrade',  label: 'Cinematic Color Grade', group: 'cinematic',    icon: '🎬', adj: { contrast:28, saturation:12, shadows:15, highlights:-20, vignette:32, temperature:-8 }, filter: 'TealOrange' },
  { name: 'CinBlur',        label: 'Cinematic Blur',        group: 'cinematic',    icon: '🌀', adj: { bkBlur:38, contrast:14, highlights:-12, vignette:25 } },
  { name: 'FilmGrain',      label: 'Film Grain',            group: 'cinematic',    icon: '🎞️', adj: { grain:65, contrast:12, saturation:-10, shadows:10, highlights:-15 } },
  { name: 'MovieTone',      label: 'Movie Tone',            group: 'cinematic',    icon: '🎥', adj: { brightness:-12, contrast:32, saturation:8, shadows:18, highlights:-25, vignette:40 } },
  { name: 'TealOrangeFX',   label: 'Teal & Orange',         group: 'cinematic',    icon: '🟠', adj: { contrast:15, saturation:10, temperature:-5 }, filter: 'TealOrange' },
  { name: 'CineBloom',      label: 'Cine Bloom',            group: 'cinematic',    icon: '🎇', adj: { glow:42, highlights:-22, contrast:8, grain:14, vignette:18 } },
  { name: 'NightDrive',     label: 'Night Drive',           group: 'cinematic',    icon: '🌃', adj: { brightness:-16, contrast:26, saturation:6, temperature:-10, vignette:34, grain:22 }, filter: 'LuxeTeal' },
  { name: 'RetroTrailer',   label: 'Retro Trailer',         group: 'cinematic',    icon: '📽️', adj: { contrast:20, saturation:-8, dust:34, lightLeaks:24, grain:30 }, filter: 'FilmIvory' },
  { name: 'MidnightNoir',   label: 'Midnight Noir',         group: 'cinematic',    icon: '🌙', adj: { brightness:-20, contrast:30, saturation:-22, grain:34, vignette:42 }, filter: 'NoirVelvet' },
  { name: 'CineSteel',      label: 'Cine Steel',            group: 'cinematic',    icon: '🔩', adj: { contrast:18, saturation:-12, temperature:-14, dehaze:12, grain:20 }, filter: 'UrbanSteel' },

  // ── Portrait ──
  // bkBlur = background blur (edges blurred, centre/face stays sharp)
  { name: 'PortraitBlur',   label: 'Portrait Blur',         group: 'portrait',     icon: '👤', adj: { bkBlur:72, brightness:5, contrast:8, clarity:-5 } },
  { name: 'SkinSmooth',     label: 'Skin Smooth',           group: 'portrait',     icon: '✨', adj: { clarity:-12, noiseReduction:28, brightness:8, contrast:-8, saturation:-5, bkBlur:22 } },
  { name: 'FaceGlow',       label: 'Face Glow',             group: 'portrait',     icon: '💫', adj: { glow:50, brightness:18, contrast:-10, highlights:-15, saturation:8, bkBlur:18 } },
  { name: 'StudioPortrait', label: 'Studio Portrait',       group: 'portrait',     icon: '📸', adj: { brightness:10, contrast:20, clarity:12, vignette:18, saturation:5, highlights:-12, bkBlur:28 } },
  { name: 'BeautySoft',     label: 'Beauty Soft',           group: 'portrait',     icon: '🌸', adj: { bkBlur:30, glow:32, brightness:14, contrast:-12, saturation:8, temperature:8 } },
  { name: 'EditorialSkin',  label: 'Editorial Skin',        group: 'portrait',     icon: '🪞', adj: { clarity:-10, noiseReduction:24, brightness:10, highlights:-18, glow:18 } },
  { name: 'CreamyPortrait', label: 'Creamy Portrait',       group: 'portrait',     icon: '🥛', adj: { bkBlur:26, brightness:16, contrast:-10, saturation:-6, temperature:10, glow:24 }, filter: 'PearlPortrait' },
  { name: 'HeadshotPro',    label: 'Headshot Pro',          group: 'portrait',     icon: '🎯', adj: { clarity:18, sharpness:22, contrast:12, highlights:-10, bkBlur:24 } },
  { name: 'NaturalGlow',    label: 'Natural Glow',          group: 'portrait',     icon: '🌼', adj: { brightness:12, contrast:-6, highlights:-16, saturation:4, glow:22, noiseReduction:14 } },
  { name: 'SoftPearl',      label: 'Soft Pearl',            group: 'portrait',     icon: '🫧', adj: { bkBlur:20, clarity:-8, brightness:14, contrast:-12, glow:20 }, filter: 'StudioIvory' },

  // ── Wedding / Romantic ──
  { name: 'WeddingGlow',    label: 'Wedding Glow',          group: 'wedding',      icon: '💍', adj: { brightness:22, contrast:-12, highlights:-28, saturation:-12, glow:45, temperature:15, bkBlur:20 } },
  { name: 'RomanticSoft',   label: 'Romantic Soft Light',   group: 'wedding',      icon: '🌹', adj: { brightness:15, contrast:-8, bkBlur:28, glow:38, temperature:18, saturation:-8 } },
  { name: 'DreamyLight',    label: 'Dreamy Light',          group: 'wedding',      icon: '🌟', adj: { brightness:20, contrast:-18, bkBlur:42, glow:55, highlights:-22, saturation:-18 } },
  { name: 'BridalTone',     label: 'Bridal Tone',           group: 'wedding',      icon: '🤍', adj: { brightness:25, contrast:-14, highlights:-35, saturation:-20, temperature:12, whites:18, bkBlur:15 } },
  { name: 'IvoryBloom',     label: 'Ivory Bloom',           group: 'wedding',      icon: '🕊️', adj: { brightness:18, highlights:-30, whites:20, glow:34, temperature:14, saturation:-14 }, filter: 'FilmIvory' },
  { name: 'RoseMist',       label: 'Rose Mist',             group: 'wedding',      icon: '🌷', adj: { brightness:12, contrast:-12, saturation:-10, tint:12, glow:30, bkBlur:26 }, filter: 'DustyRose' },
  { name: 'GoldenVows',     label: 'Golden Vows',           group: 'wedding',      icon: '💫', adj: { temperature:22, highlights:-24, contrast:-6, brightness:16, grain:12, lightLeaks:18 }, filter: 'AmberCine' },
  { name: 'PastelPromise',  label: 'Pastel Promise',        group: 'wedding',      icon: '🎀', adj: { brightness:14, contrast:-14, saturation:-12, tint:8, glow:26, vignette:14 }, filter: 'DustyRose' },
  { name: 'SunsetCeremony', label: 'Sunset Ceremony',       group: 'wedding',      icon: '🌅', adj: { temperature:26, highlights:-20, shadows:12, glow:24, lightLeaks:26 }, filter: 'SunsetGold' },

  // ── Professional Photography ──
  { name: 'BokehBlur',      label: 'Bokeh Blur',            group: 'professional', icon: '⭕', adj: { bkBlur:85, clarity:5 } },
  { name: 'DepthOfField',   label: 'Depth of Field',        group: 'professional', icon: '🔭', adj: { bkBlur:62, clarity:12, contrast:14, vignette:26 } },
  { name: 'LensBlur',       label: 'Lens Blur',             group: 'professional', icon: '🔵', adj: { bkBlur:80, brightness:4, contrast:-4 } },
  { name: 'SoftFocus',      label: 'Soft Focus',            group: 'professional', icon: '🌫️', adj: { bkBlur:32, brightness:8, clarity:-12 } },
  { name: 'HDRPopFX',       label: 'HDR Pop',               group: 'professional', icon: '⚡', adj: { contrast:35, saturation:35, clarity:28, dehaze:18 } },
  { name: 'MatteFadeFX',    label: 'Matte Fade',            group: 'professional', icon: '🎞', adj: { contrast:-22, saturation:-18, brightness:14, blacks:15 } },
  { name: 'MagazineCover',  label: 'Magazine Cover',        group: 'professional', icon: '📰', adj: { clarity:22, sharpness:20, contrast:16, saturation:6, dehaze:10 } },
  { name: 'CommercialClean',label: 'Commercial Clean',      group: 'professional', icon: '💼', adj: { brightness:8, contrast:10, highlights:-14, shadows:10, noiseReduction:20, clarity:10 } },
  { name: 'StudioChrome',   label: 'Studio Chrome',         group: 'professional', icon: '🧊', adj: { contrast:24, saturation:12, clarity:16, glow:10, vignette:12 }, filter: 'ChromePop' },
  { name: 'FineArtMatte',   label: 'Fine Art Matte',        group: 'professional', icon: '🖼️', adj: { contrast:-18, blacks:18, saturation:-12, grain:20, vignette:22 }, filter: 'SlateMatte' },
  { name: 'ProductPolish',  label: 'Product Polish',        group: 'professional', icon: '🛍️', adj: { sharpness:20, clarity:20, highlights:-10, shadows:8, dehaze:12, noiseReduction:12 } },
  { name: 'Architectural',  label: 'Architectural',         group: 'professional', icon: '🏙️', adj: { contrast:22, clarity:24, dehaze:20, saturation:-6, temperature:-4 }, filter: 'UrbanSteel' },
];

const IS_MOBILE = window.innerWidth <= 767 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
const MAX_HISTORY = IS_MOBILE ? 5 : 20;
const MAX_CANVAS_DIM = IS_MOBILE ? 1280 : 4096;

// ─────────────────────── STATE ───────────────────────

const state = {
  // Loaded image
  image: null,
  imageWidth:  0,
  imageHeight: 0,
  fileName:    '',
  fileSize:    0,

  // Canvas pan / zoom
  zoom:  1,
  panX:  0,
  panY:  0,

  // Current tool
  tool: 'select',

  // History stack
  history:      [],
  historyIndex: -1,

  // Adjustments (all default 0)
  adj: {
    exposure: 0, brightness: 0, contrast: 0,
    highlights: 0, shadows: 0, whites: 0, blacks: 0,
    saturation: 0, vibrance: 0, temperature: 0, tint: 0, hue: 0,
    sharpness: 0, clarity: 0, dehaze: 0, noiseReduction: 0,
    vignette: 0, grain: 0, dust: 0, lightLeaks: 0, blur: 0, glow: 0, bkBlur: 0,
  },

  // Active preset filter
  activeFilter: 'Original',

  // Rotation / flip
  rotation:    0,   // accumulated 90-degree steps (visual only, baked)
  flipH:       false,
  flipV:       false,
  freeRotate:  0,   // live CSS preview -45..45

  // Crop
  cropActive:  false,
  cropBox:     { x: 0, y: 0, w: 0, h: 0 },
  cropAspect:  null,

  // Brush
  isDrawing:     false,
  currentStroke: null,

  // Theme
  theme: 'dark',

  // Increments whenever base pixels on mainCanvas change.
  // Used to skip redundant expensive overlay recomputation.
  canvasRevision: 0,

  // Export
  exportFormat:  'jpeg',
  exportQuality: 0.9,
};

// ─────────────────────── DOM HELPERS ───────────────────────

const $  = id  => document.getElementById(id);
const QA = sel => document.querySelectorAll(sel);

// ─────────────────────── CANVAS REFS ───────────────────────

let mainCanvas, mainCtx;
let vigCanvas,  vigCtx;
let grainCanvas, grainCtx;
let dustCanvas,  dustCtx;
let leakCanvas,  leakCtx;
let bkBlurCanvas, bkBlurCtx;

// Tracks which adj keys the most recently applied Effect set,
// so we can reset them when the user switches to a different effect.
let _lastEffectAdj    = null;
let _lastEffectFilter = null;

// Overlay render signatures to avoid recomputing identical frames.
const _overlaySig = {
  vignette: '',
  grain: '',
  dust: '',
  leak: '',
  bkBlur: '',
};

let _grainTileCanvas = null;
let _grainTileCtx = null;
let _bkMaskCanvas = null;
let _bkMaskCtx = null;
let _bkWorkCanvas = null;
let _bkWorkCtx = null;

function bumpCanvasRevision() {
  state.canvasRevision = (state.canvasRevision + 1) % 1000000000;
}
// ─────────────────────── INIT ───────────────────────

document.addEventListener('DOMContentLoaded', () => {
  mainCanvas  = $('mainCanvas');
  mainCtx     = mainCanvas.getContext('2d');
  vigCanvas   = $('vigCanvas');
  vigCtx      = vigCanvas.getContext('2d');
  grainCanvas    = $('grainCanvas');
  grainCtx       = grainCanvas.getContext('2d');
  dustCanvas     = $('dustCanvas');
  dustCtx        = dustCanvas.getContext('2d');
  leakCanvas     = $('leakCanvas');
  leakCtx        = leakCanvas.getContext('2d');
  bkBlurCanvas   = $('bkBlurCanvas');
  bkBlurCtx      = bkBlurCanvas.getContext('2d');

  initFileLoader();
  initTools();
  initAdjustments();
  initRotateTool();
  initCropTool();
  initBrushTool();
  initTextTool();
  initCanvasHover();
  initZoomPan();
  initExport();
  initKeyboard();
  initClipboard();
  initBeforeAfter();
  initAutoEnhance();
  initEffects();
  initUI();
  initFooterActions();
  initTheme();
  initMobile();
  initMobilePreview();

  // Global slider fill update (covers AI sliders loaded later)
  document.addEventListener('input', e => {
    if (e.target.classList.contains('slider')) updateSliderFill(e.target);
  });

  // Disable export button until image loaded
  $('exportBtn').disabled = true;

  hideAppLoader();
});

// ═══════════════════════════════════════════════════════════
//  FILE LOADER
// ═══════════════════════════════════════════════════════════

function initFileLoader() {
  const fileInput = $('fileInput');
  const uploadZone = $('uploadZone');

  fileInput.addEventListener('change', e => {
    const f = e.target.files[0];
    if (f) loadImageFile(f);
    fileInput.value = '';
  });

  // Drag-and-drop on the whole page
  let dragDepth = 0;
  document.addEventListener('dragenter', e => {
    e.preventDefault();
    dragDepth++;
    uploadZone && uploadZone.classList.add('drag-over');
  });
  document.addEventListener('dragleave', () => {
    dragDepth--;
    if (dragDepth <= 0) { dragDepth = 0; uploadZone && uploadZone.classList.remove('drag-over'); }
  });
  document.addEventListener('dragover', e => e.preventDefault());
  document.addEventListener('drop', e => {
    e.preventDefault();
    dragDepth = 0;
    uploadZone && uploadZone.classList.remove('drag-over');
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) loadImageFile(f);
    else showToast('Please drop an image file');
  });
}

function loadImageFile(file) {
  if (!file.type.startsWith('image/')) { showToast('❌ Unsupported file type'); return; }

  showLoading(true);
  state.fileName = file.name.replace(/\.[^.]+$/, '');
  state.fileSize = file.size;

  const url = URL.createObjectURL(file);
  const img  = new Image();

  img.onload = () => {
    // Downscale large images on mobile to prevent OOM crash
    let W = img.naturalWidth, H = img.naturalHeight;
    if (W > MAX_CANVAS_DIM || H > MAX_CANVAS_DIM) {
      const scale = MAX_CANVAS_DIM / Math.max(W, H);
      W = Math.round(W * scale);
      H = Math.round(H * scale);
    }

    state.image       = img;
    state.imageWidth  = W;
    state.imageHeight = H;

    // Set canvas dimensions
    mainCanvas.width  = vigCanvas.width  = grainCanvas.width  = dustCanvas.width = leakCanvas.width = bkBlurCanvas.width  = W;
    mainCanvas.height = vigCanvas.height = grainCanvas.height = dustCanvas.height = leakCanvas.height = bkBlurCanvas.height = H;

    // Reset all state
    resetAdjState();
    state.activeFilter = 'Original';
    state.history      = [];
    state.historyIndex = -1;
    state.zoom = 1; state.panX = 0; state.panY = 0;
    state.rotation = 0; state.flipH = false; state.flipV = false; state.freeRotate = 0;

    // Draw initial image
    renderFromImage();
    renderVignette();
    renderGrain();
    renderBkBlur();
    saveHistory();
    generateFilterThumbnails();
    updateFileInfo();
    updateAllSliders();
    updateFilterUI();
    showEditor();
    // Fit image to viewport on load — wait one frame so the canvas area has laid out
    requestAnimationFrame(fitToScreen);
    showLoading(false);
    URL.revokeObjectURL(url);
    // Reset effect tracking on new image load
    _lastEffectAdj = null; _lastEffectFilter = null;
    // Refresh effects-tab preview if it exists
    requestAnimationFrame(() => { window._effPreviewRefresh && window._effPreviewRefresh(); });
    showToast('✓ Image loaded — ' + state.imageWidth + '×' + state.imageHeight);
  };

  img.onerror = () => {
    showLoading(false);
    showToast('❌ Failed to load image');
    URL.revokeObjectURL(url);
  };

  img.src = url;
}

function showEditor() {
  $('uploadZone').classList.add('hidden');
  $('canvasWrap').classList.remove('hidden');
  $('exportBtn').disabled = false;
}

// ═══════════════════════════════════════════════════════════
//  CANVAS RENDER ENGINE
// ═══════════════════════════════════════════════════════════

/**
 * Re-draw canvas from state.image with current rotation/flip.
 * Only called on initial load and when applying transformations.
 * Brush strokes drawn directly on canvas are NOT preserved here –
 * use saveHistory() + restoreHistory() for those.
 */
function renderFromImage() {
  if (!state.image) return;
  const W = mainCanvas.width, H = mainCanvas.height;
  mainCtx.save();
  mainCtx.clearRect(0, 0, W, H);
  mainCtx.translate(W / 2, H / 2);
  mainCtx.scale(state.flipH ? -1 : 1, state.flipV ? -1 : 1);
  mainCtx.rotate(state.freeRotate * Math.PI / 180);
  // Draw image scaled to canvas size (handles downscaled mobile canvas)
  mainCtx.drawImage(state.image, -W / 2, -H / 2, W, H);
  mainCtx.restore();
  bumpCanvasRevision();
  updateCanvasStyle();
}

// Cached CSS filter string — rebuilt only when adjustments/presets change, not on every pan/zoom frame.
let _cachedFilterStr = 'none';

function updateCanvasStyle() {
  _cachedFilterStr = buildFilterString();
  updateCanvasTransformOnly();
}

// Fast path: update only the CSS transform (pan/zoom). Skips the expensive filter rebuild.
function updateCanvasTransformOnly() {
  const transform = `translate3d(${state.panX}px,${state.panY}px,0) scale(${state.zoom})`;
  mainCanvas.style.filter    = _cachedFilterStr;
  mainCanvas.style.transform = transform;
  // Overlay canvases track main canvas position
  for (const cv of [vigCanvas, grainCanvas, dustCanvas, leakCanvas, bkBlurCanvas]) {
    cv.style.transform = transform;
    cv.style.width     = mainCanvas.style.width;
    cv.style.height    = mainCanvas.style.height;
  }
}

function buildFilterString(adjOverride, filterOverride) {
  const a = adjOverride || state.adj;
  const activeFilterName = (filterOverride !== undefined) ? filterOverride : state.activeFilter;
  const parts = [];

  // Exposure × Brightness → CSS brightness
  const brt = (1 + a.exposure / 100) * (1 + a.brightness / 100);
  if (Math.abs(brt - 1) > 0.001) parts.push(`brightness(${brt.toFixed(4)})`);

  // Contrast
  if (a.contrast !== 0) parts.push(`contrast(${(1 + a.contrast / 100).toFixed(4)})`);

  // Saturation + vibrance (both increase perceived saturation)
  const sat = 1 + (a.saturation + a.vibrance * 0.5) / 100;
  if (Math.abs(sat - 1) > 0.001) parts.push(`saturate(${sat.toFixed(4)})`);

  // Hue rotation
  if (a.hue !== 0) parts.push(`hue-rotate(${a.hue}deg)`);

  // Temperature: warm = sepia tint / cool = blueish hue-rotate
  if (a.temperature > 0) {
    parts.push(`sepia(${(a.temperature / 400).toFixed(4)})`);
    parts.push(`saturate(${(1 + a.temperature / 250).toFixed(4)})`);
  } else if (a.temperature < 0) {
    parts.push(`hue-rotate(${(a.temperature / 3).toFixed(2)}deg)`);
  }

  // Tint (small hue shift)
  if (a.tint !== 0) parts.push(`hue-rotate(${(a.tint * 0.35).toFixed(2)}deg)`);

  // Highlights + whites → extra brightness
  const hiW = (a.highlights + a.whites) / 500;
  if (Math.abs(hiW) > 0.001) parts.push(`brightness(${(1 + hiW).toFixed(4)})`);

  // Shadows + blacks → contrast tweak
  const shB = (a.shadows - a.blacks) / 350;
  if (Math.abs(shB) > 0.001) parts.push(`contrast(${(1 + shB * 0.25).toFixed(4)})`);

  // Dehaze → contrast + saturation
  if (a.dehaze > 0) {
    parts.push(`contrast(${(1 + a.dehaze / 160).toFixed(4)})`);
    parts.push(`saturate(${(1 + a.dehaze / 220).toFixed(4)})`);
  }

  // Noise reduction → tiny blur
  if (a.noiseReduction > 0) parts.push(`blur(${(a.noiseReduction * 0.009).toFixed(3)}px)`);

  // Clarity → slight contrast
  if (a.clarity > 0) parts.push(`contrast(${(1 + a.clarity / 350).toFixed(4)})`);

  // Glow — softens and brightens (highlight bloom simulation)
  if (a.glow > 0) {
    parts.push(`brightness(${(1 + a.glow / 340).toFixed(4)})`);
    parts.push(`contrast(${(1 - a.glow / 580).toFixed(4)})`);
  }

  // Blur (full-image blur — manual slider only, NOT used in effects)
  if (a.blur > 0) parts.push(`blur(${(a.blur * 0.22).toFixed(3)}px)`);

  // Sharpness (via SVG Convolution Filter)
  if (a.sharpness > 0) {
    const s = a.sharpness / 100; // 0 to 1
    // Stronger center, negative neighbors. 
    // Normalized to preserve brightness: 1 + 4*s - 4*s = 1
    const center = 1 + (4 * s);
    const edge = -s;
    const matrix = `0 ${edge} 0 ${edge} ${center} ${edge} 0 ${edge} 0`;
    
    // Update SVG in DOM before returning filter string
    const feConvolve = document.getElementById('sharpenMatrix');
    if (feConvolve) {
      feConvolve.setAttribute('kernelMatrix', matrix);
    }
    parts.push(`url(#svg-sharpen)`);
  }

  // Preset filter
  const preset = FILTERS.find(f => f.name === activeFilterName);
  const presetCss = resolvePresetCss(preset);
  if (presetCss) parts.push(presetCss);

  return parts.length ? parts.join(' ') : 'none';
}

function resolvePresetCss(preset) {
  if (!preset) return '';
  if (preset.css === '__VSCO_BEST__') return getAdaptiveVscoFilterCss();
  return preset.css || '';
}

function getAdaptiveVscoFilterName() {
  const key = `${state.canvasRevision}|${state.imageWidth}|${state.imageHeight}`;
  if (_adaptiveVscoCache.key === key) return _adaptiveVscoCache.name;

  let chosen = 'A6';
  if (!state.image || !state.imageWidth || !state.imageHeight) {
    _adaptiveVscoCache.key = key;
    _adaptiveVscoCache.name = chosen;
    return chosen;
  }

  const sampleSize = 24;
  const sample = document.createElement('canvas');
  sample.width = sample.height = sampleSize;
  const ctx = sample.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    _adaptiveVscoCache.key = key;
    _adaptiveVscoCache.name = chosen;
    return chosen;
  }

  try {
    ctx.drawImage(state.image, 0, 0, sampleSize, sampleSize);
    const { data } = ctx.getImageData(0, 0, sampleSize, sampleSize);
    let lumSum = 0;
    let satSum = 0;
    let warmSum = 0;
    let coolSum = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      lumSum += 0.2126 * r + 0.7152 * g + 0.0722 * b;
      satSum += max > 0 ? (max - min) / max : 0;
      warmSum += r - b;
      coolSum += b - r;
    }

    const pixels = data.length / 4;
    const luminance = lumSum / pixels;
    const saturation = satSum / pixels;
    const warmth = warmSum / pixels;
    const coolness = coolSum / pixels;

    if (luminance < 0.34) chosen = 'HB2';
    else if (saturation < 0.16) chosen = 'P5';
    else if (warmth > 0.08) chosen = 'F2';
    else if (coolness > 0.08) chosen = 'C1';
    else if (luminance > 0.72) chosen = 'A6';
    else chosen = 'A6';
  } catch (_) {
    chosen = 'A6';
  }

  _adaptiveVscoCache.key = key;
  _adaptiveVscoCache.name = chosen;
  return chosen;
}

function getAdaptiveVscoFilterCss() {
  const bestName = getAdaptiveVscoFilterName();
  const bestPreset = FILTERS.find(f => f.name === bestName);
  return bestPreset ? (bestPreset.css || '') : '';
}

// ─── Overlays ───

function renderVignette() {
  if (!mainCanvas.width) return;
  const W = vigCanvas.width, H = vigCanvas.height;
  const amount = state.adj.vignette;

  const sig = `${W}x${H}|${amount}`;
  if (sig === _overlaySig.vignette) {
    vigCanvas.style.opacity = amount === 0 ? '0' : '1';
    return;
  }
  _overlaySig.vignette = sig;

  vigCtx.clearRect(0, 0, W, H);

  if (amount === 0) { vigCanvas.style.opacity = '0'; return; }

  vigCanvas.style.opacity = '1';
  const cx = W / 2, cy = H / 2;
  const r  = Math.hypot(cx, cy) * 1.25;
  const g  = vigCtx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r);
  const alpha = (amount / 100) * 0.9;
  g.addColorStop(0,   'rgba(0,0,0,0)');
  g.addColorStop(0.45, `rgba(0,0,0,${(alpha * 0.25).toFixed(4)})`);
  g.addColorStop(1,   `rgba(0,0,0,${alpha.toFixed(4)})`);
  vigCtx.fillStyle = g;
  vigCtx.fillRect(0, 0, W, H);
}

function renderGrain() {
  if (!mainCanvas.width) return;
  const amount = state.adj.grain;

  const W = grainCanvas.width, H = grainCanvas.height;
  const sig = `${W}x${H}|${amount}`;
  if (sig === _overlaySig.grain) {
    grainCanvas.style.opacity = amount === 0 ? '0' : '1';
    grainCanvas.style.mixBlendMode = 'overlay';
    return;
  }
  _overlaySig.grain = sig;

  if (amount === 0) { grainCanvas.style.opacity = '0'; return; }

  grainCanvas.style.opacity = '1';
  grainCanvas.style.mixBlendMode = 'overlay';

  if (!_grainTileCanvas) {
    _grainTileCanvas = document.createElement('canvas');
    _grainTileCtx = _grainTileCanvas.getContext('2d');
  }

  // Repeating tile keeps CPU stable even for very large images.
  const tileSize = IS_MOBILE ? 128 : 192;
  const tW = Math.min(W, tileSize);
  const tH = Math.min(H, tileSize);
  if (_grainTileCanvas.width !== tW || _grainTileCanvas.height !== tH) {
    _grainTileCanvas.width = tW;
    _grainTileCanvas.height = tH;
  }

  const imageData = _grainTileCtx.createImageData(tW, tH);
  const data = imageData.data;
  const intensity = (amount / 100) * 55;

  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * intensity;
    data[i] = data[i + 1] = data[i + 2] = 128 + n;
    data[i + 3] = Math.min(255, Math.abs(n) * 3);
  }
  _grainTileCtx.putImageData(imageData, 0, 0);
  grainCtx.clearRect(0, 0, W, H);
  const pattern = grainCtx.createPattern(_grainTileCanvas, 'repeat');
  if (pattern) {
    grainCtx.fillStyle = pattern;
    grainCtx.fillRect(0, 0, W, H);
  }
}

// Background (portrait/bokeh) blur — keeps the CENTRE (subject) sharp and blurs
// only the periphery by using an elliptical destination-out mask on the blurred layer.
function renderDust() {
  if (!mainCanvas.width) return;
  const W = dustCanvas.width, H = dustCanvas.height;
  const amount = state.adj.dust;

  const sig = `${W}x${H}|${amount}`;
  if (sig === _overlaySig.dust) {
    dustCanvas.style.opacity = amount === 0 ? '0' : '1';
    dustCanvas.style.mixBlendMode = 'screen';
    return;
  }
  _overlaySig.dust = sig;
  
  dustCtx.clearRect(0, 0, W, H);
  if (amount === 0) { dustCanvas.style.opacity = '0'; return; }
  
  dustCanvas.style.opacity = '1';
  dustCanvas.style.mixBlendMode = 'screen';
  
  dustCtx.strokeStyle = `rgba(255,255,255,${amount / 200})`;
  dustCtx.lineWidth = Math.max(1, W / 1000);
  
  // Deterministic random so dust doesn't jump
  let seed = 1234;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  
  const count = Math.floor(amount * (W / 500));
  dustCtx.beginPath();
  for (let i = 0; i < count; i++) {
    const x = rand() * W;
    const y = rand() * H;
    const len = rand() * 40 + 10;
    const angle = rand() * Math.PI * 2;
    // Scratches
    dustCtx.moveTo(x, y);
    dustCtx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
    // Dust specs
    dustCtx.moveTo(x+10, y+10);
    dustCtx.arc(x+10, y+10, rand() * 3, 0, Math.PI * 2);
  }
  dustCtx.stroke();
}

function renderLightLeaks() {
  if (!mainCanvas.width) return;
  const W = leakCanvas.width, H = leakCanvas.height;
  const amount = state.adj.lightLeaks;

  const sig = `${W}x${H}|${amount}`;
  if (sig === _overlaySig.leak) {
    leakCanvas.style.opacity = amount === 0 ? '0' : '1';
    leakCanvas.style.mixBlendMode = 'screen';
    return;
  }
  _overlaySig.leak = sig;
  
  leakCtx.clearRect(0, 0, W, H);
  if (amount === 0) { leakCanvas.style.opacity = '0'; return; }
  
  leakCanvas.style.opacity = '1';
  leakCanvas.style.mixBlendMode = 'screen';
  
  // Draw a warm analog-style edge burn
  const grad = leakCtx.createLinearGradient(0, 0, W * 0.4, H * 0.4);
  grad.addColorStop(0, `rgba(255, 60, 0, ${amount / 100})`);
  grad.addColorStop(0.5, `rgba(255, 120, 0, ${amount / 150})`);
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  leakCtx.fillStyle = grad;
  leakCtx.fillRect(0, 0, W, H);
}

function renderBkBlur() {
  if (!mainCanvas.width) return;
  const W = bkBlurCanvas.width, H = bkBlurCanvas.height;
  const amount = state.adj.bkBlur || 0;

  const sig = `${W}x${H}|${amount}|${state.canvasRevision}`;
  if (sig === _overlaySig.bkBlur) {
    bkBlurCanvas.style.opacity = amount === 0 ? '0' : '1';
    return;
  }
  _overlaySig.bkBlur = sig;

  bkBlurCtx.clearRect(0, 0, W, H);

  if (amount === 0) { bkBlurCanvas.style.opacity = '0'; return; }

  const blurPx = (amount / 100) * 30;

  if (!_bkMaskCanvas) {
    _bkMaskCanvas = document.createElement('canvas');
    _bkMaskCtx = _bkMaskCanvas.getContext('2d');
  }
  if (!_bkWorkCanvas) {
    _bkWorkCanvas = document.createElement('canvas');
    _bkWorkCtx = _bkWorkCanvas.getContext('2d');
  }

  if (_bkMaskCanvas.width !== W || _bkMaskCanvas.height !== H) {
    _bkMaskCanvas.width = W;
    _bkMaskCanvas.height = H;

    const cx = W / 2;
    const cy = H / 2;
    const rx = W * 0.38;
    const ry = H * 0.46;

    _bkMaskCtx.clearRect(0, 0, W, H);
    _bkMaskCtx.save();
    _bkMaskCtx.translate(cx, cy);
    _bkMaskCtx.scale(rx, ry);
    const mg = _bkMaskCtx.createRadialGradient(0, 0, 0, 0, 0, 1);
    mg.addColorStop(0, 'rgba(0,0,0,1)');
    mg.addColorStop(0.40, 'rgba(0,0,0,0.98)');
    mg.addColorStop(0.70, 'rgba(0,0,0,0.45)');
    mg.addColorStop(1, 'rgba(0,0,0,0)');
    _bkMaskCtx.fillStyle = mg;
    _bkMaskCtx.fillRect(-4, -4, 8, 8);
    _bkMaskCtx.restore();
  }

  if (_bkWorkCanvas.width !== W || _bkWorkCanvas.height !== H) {
    _bkWorkCanvas.width = W;
    _bkWorkCanvas.height = H;
  }

  // ─ Step 1: draw blurred image into reusable offscreen canvas.
  //   Draw padded (image overflows canvas bounds) so gaussian blur doesn't
  //   clamp at edges and bleed inward to the subject area.
  const pad  = Math.ceil(blurPx * 3);
  _bkWorkCtx.clearRect(0, 0, W, H);
  _bkWorkCtx.filter = `blur(${blurPx.toFixed(1)}px)`;
  _bkWorkCtx.drawImage(mainCanvas, -pad, -pad, W + pad * 2, H + pad * 2);
  _bkWorkCtx.filter = 'none';

  // Erase the center of the blurred layer using cached elliptical mask.
  _bkWorkCtx.globalCompositeOperation = 'destination-out';
  _bkWorkCtx.drawImage(_bkMaskCanvas, 0, 0);
  _bkWorkCtx.globalCompositeOperation = 'source-over';

  // ─ Step 3: composite the blurred-periphery layer onto the overlay canvas
  bkBlurCtx.drawImage(_bkWorkCanvas, 0, 0);
  bkBlurCanvas.style.opacity = '1';
}

// ═══════════════════════════════════════════════════════════
//  ZOOM & PAN
// ═══════════════════════════════════════════════════════════

function initZoomPan() {
  const workspace = $('canvasArea');

  // Wheel zoom with premium trackpad support and zoom-to-cursor
  workspace.addEventListener('wheel', e => {
    if (!state.image) return;
    e.preventDefault();
    
    // CtrlKey implies a pinch-gesture on trackpads. Scale smoothly.
    let factor = 1;
    if (e.ctrlKey) {
      factor = Math.exp(-e.deltaY / 150);
    } else {
      factor = e.deltaY < 0 ? 1.08 : 0.92;
    }
    
    // Calculate cursor position relative to center of canvasArea
    const r = $('canvasArea').getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    
    zoomBy(factor, mx, my);
  }, { passive: false });

  // Mouse pan (select tool or space+drag)
  let panning = false;
  let panStart = {};
  let spaceDown = false;
  let _panRaf = 0; // shared RAF handle for mouse and touch pan

  document.addEventListener('keydown', e => { if (e.code === 'Space') spaceDown = true; });
  document.addEventListener('keyup',   e => { if (e.code === 'Space') spaceDown = false; });

  workspace.addEventListener('mousedown', e => {
    if (!state.image) return;
    if (e.button !== 0) return;
    if (state.tool !== 'select' && !spaceDown) return;
    if (state.cropActive) return; // allow crop handle drag
    panning  = true;
    panStart = { x: e.clientX - state.panX, y: e.clientY - state.panY };
    document.body.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', e => {
    if (!panning) return;
    state.panX = e.clientX - panStart.x;
    state.panY = e.clientY - panStart.y;
    // RAF-throttle: clamp to display refresh rate, avoids redundant style recalcs
    cancelAnimationFrame(_panRaf);
    _panRaf = requestAnimationFrame(updateCanvasTransformOnly);
  });

  window.addEventListener('mouseup', () => {
    if (!panning) return;
    panning = false;
    document.body.style.cursor = '';
  });

  // Double tap to Reset Zoom (Fit to Screen) 
  workspace.addEventListener('dblclick', (e) => {
    if (!state.image) return;
    if (e.target.closest('.panel') || e.target.closest('.top-bar') || e.target.closest('.side-handle')) return;
    fitToScreen();
    showToast('Reset zoom to fit');
  });

  // Button controls
  $('zoomIn') .addEventListener('click', () => zoomBy(1.25));
  $('zoomOut').addEventListener('click', () => zoomBy(0.8));
  $('zoomFit').addEventListener('click', fitToScreen);

  // Touch: single-finger pan + two-finger pinch zoom
  let lastDist = 0;
  let touchPanning = false, touchPanStart = {};

  $('canvasArea').addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      if (!state.image) return;
      touchPanning = true;
      touchPanStart = { x: e.touches[0].clientX - state.panX, y: e.touches[0].clientY - state.panY };
    } else if (e.touches.length === 2) {
      touchPanning = false;
      lastDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  }, { passive: true });

  $('canvasArea').addEventListener('touchmove', e => {
    if (e.touches.length === 1 && touchPanning && (state.tool === 'select' || state.tool === 'eyedropper')) {
      e.preventDefault();
      state.panX = e.touches[0].clientX - touchPanStart.x;
      state.panY = e.touches[0].clientY - touchPanStart.y;
      cancelAnimationFrame(_panRaf);
      _panRaf = requestAnimationFrame(updateCanvasTransformOnly);
    } else if (e.touches.length === 2) {
      e.preventDefault();
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (lastDist > 0) zoomBy(d / lastDist);
      lastDist = d;
    }
  }, { passive: false });

  $('canvasArea').addEventListener('touchend', () => { touchPanning = false; lastDist = 0; });
}

function zoomBy(factor, cx, cy) {
  const maxZoom = 12;
  const minZoom = 0.08;
  const oldZoom = state.zoom;
  
  let newZoom = oldZoom * factor;
  newZoom = Math.max(minZoom, Math.min(newZoom, maxZoom));
  
  if (newZoom === oldZoom) return;
  
  // If coordinates are provided (relative to canvasArea center), pin to cursor
  if (cx !== undefined && cy !== undefined) {
    state.panX = cx - (cx - state.panX) * (newZoom / oldZoom);
    state.panY = cy - (cy - state.panY) * (newZoom / oldZoom);
  }
  
  state.zoom = newZoom;
  // Zoom never changes adjustments — skip the filter rebuild
  updateCanvasTransformOnly();
  updateZoomDisplay();
}

function fitToScreen() {
  if (!state.image) return;
  const ws = $('canvasArea');
  const r  = ws.getBoundingClientRect();
  const sx = (r.width  - 64) / mainCanvas.width;
  const sy = (r.height - 64) / mainCanvas.height;
  state.zoom = Math.min(sx, sy, 1);
  state.panX = 0;
  state.panY = 0;
  // Only pan/zoom changed — skip the filter rebuild
  updateCanvasTransformOnly();
  updateZoomDisplay();
}

function updateZoomDisplay() {
  const pct = Math.round(state.zoom * 100) + '%';
  $('zoomLevel').textContent   = pct;
  $('statusZoom').textContent  = pct;
}

// ═══════════════════════════════════════════════════════════
//  HISTORY  (undo / redo)
// ═══════════════════════════════════════════════════════════

function saveHistory(meta) {
  if (!state.image) return;

  const snap = {
    imageData:   mainCtx.getImageData(0, 0, mainCanvas.width, mainCanvas.height),
    adj:         JSON.parse(JSON.stringify(state.adj)),
    activeFilter: state.activeFilter,
    canvasW:     mainCanvas.width,
    canvasH:     mainCanvas.height,
    flipH:       state.flipH,
    flipV:       state.flipV,
    meta:        meta || 'Adjustment',
    time:        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    thumb:       null
  };

  // Add miniature canvas for rendering the history thumbnail efficiently
  const cv = document.createElement('canvas');
  cv.width = 64; 
  cv.height = Math.max(1, Math.round(64 * (mainCanvas.height / mainCanvas.width)));
  const ctx = cv.getContext('2d');
  ctx.drawImage(mainCanvas, 0, 0, cv.width, cv.height);
  snap.thumb = cv.toDataURL('image/jpeg', 0.5);

  // Trim forward history
  state.history = state.history.slice(0, state.historyIndex + 1);
  state.history.push(snap);

  if (state.history.length > MAX_HISTORY) state.history.shift();
  state.historyIndex = state.history.length - 1;

  updateHistoryUI();
}

function undo() {
  if (state.historyIndex <= 0) { showToast('Nothing to undo'); return; }
  state.historyIndex--;
  applyHistorySnap(state.historyIndex);
  updateHistoryUI();
  showToast('↩ Undo');
}

function redo() {
  if (state.historyIndex >= state.history.length - 1) { showToast('Nothing to redo'); return; }
  state.historyIndex++;
  applyHistorySnap(state.historyIndex);
  updateHistoryUI();
  showToast('↪ Redo');
}

function applyHistorySnap(index) {
  const snap = state.history[index];
  if (!snap) return;

  mainCanvas.width  = vigCanvas.width  = grainCanvas.width  = dustCanvas.width = leakCanvas.width = bkBlurCanvas.width  = snap.canvasW;
  mainCanvas.height = vigCanvas.height = grainCanvas.height = dustCanvas.height = leakCanvas.height = bkBlurCanvas.height = snap.canvasH;

  mainCtx.putImageData(snap.imageData, 0, 0);
  bumpCanvasRevision();
  Object.assign(state.adj, snap.adj);
  state.activeFilter = snap.activeFilter;
  state.flipH        = snap.flipH;
  state.flipV        = snap.flipV;

  updateAllSliders();
  updateCanvasStyle();
  renderVignette();
  renderGrain();
  renderDust();
  renderLightLeaks();
  renderBkBlur();
  updateFilterUI();
  updateFileInfo();
}

function updateHistoryUI() {
  $('undoBtn').disabled = state.historyIndex <= 0;
  $('redoBtn').disabled = state.historyIndex >= state.history.length - 1;
  $('histCt').textContent = `${state.historyIndex + 1}/${state.history.length}`;

  const list = $('visualHistoryList');
  if (!list) return;
  list.innerHTML = '';
  
  if (state.history.length === 0) {
    list.innerHTML = '<p class="param-lbl" style="text-align:center; margin-top:20px;">No edits yet.</p>';
    return;
  }

  // Render from newest to oldest for easy clicking
  [...state.history].reverse().forEach((snap, reverseIndex) => {
    const originalIndex = state.history.length - 1 - reverseIndex;
    const isCurrent = originalIndex === state.historyIndex;
    
    // First snap is always labeled "Original"
    let title = typeof snap.meta === 'string' ? snap.meta : 'Adjustment';
    if (originalIndex === 0) title = 'Original Image';

    const div = document.createElement('div');
    div.className = `hist-item ${isCurrent ? 'active' : ''}`;
    div.innerHTML = `
      <img src="${snap.thumb || ''}" class="hist-thumb" alt="History thumbnail" />
      <div class="hist-info">
        <span class="hist-name">${title}</span>
        <span class="hist-time">${snap.time || ''}</span>
      </div>
    `;
    div.onclick = () => {
      // Allow jumping strictly if we aren't already on this snapshot
      if (originalIndex !== state.historyIndex) {
        state.historyIndex = originalIndex;
        applyHistorySnap(originalIndex);
        updateHistoryUI();
        showToast('Jumped to ' + title);
      }
    };
    list.appendChild(div);
  });
}

// ═══════════════════════════════════════════════════════════
//  ADJUSTMENTS
// ═══════════════════════════════════════════════════════════

function initAdjustments() {
  // Shared RAF handle — ensures at most one canvas update per animation frame
  // even when the input event fires faster than the display refresh rate.
  let _adjRaf = 0;

  QA('.adj-row input[type="range"]').forEach(slider => {
    const key = slider.dataset.adj;
    if (!key) return;

    const row  = slider.closest('.adj-row');
    const disp = row && row.querySelector('.av');

    // Initialise fill on load
    updateSliderFill(slider);

    slider.addEventListener('input', () => {
      state.adj[key] = parseFloat(slider.value);
      // Update display text and fill immediately for snappy visual feedback
      if (disp) disp.textContent = slider.value;
      updateSliderFill(slider);
      // Defer the heavier canvas/filter operations to the next paint frame
      cancelAnimationFrame(_adjRaf);
      _adjRaf = requestAnimationFrame(() => {
        updateCanvasStyle();
        if (key === 'vignette') renderVignette();
        if (key === 'grain')    renderGrain();
        if (key === 'dust')     renderDust();
        if (key === 'lightLeaks') renderLightLeaks();
        if (key === 'bkBlur')  renderBkBlur();
      });
    });

    slider.addEventListener('change', () => saveHistory());

    // Double-click label or row to reset to 0
    row && row.addEventListener('dblclick', () => {
      slider.value = slider.dataset.default || '0';
      state.adj[key] = parseFloat(slider.value);
      if (disp) disp.textContent = slider.value;
      updateCanvasStyle();
      if (key === 'vignette') renderVignette();
      if (key === 'grain')    renderGrain();
      if (key === 'dust')     renderDust();
      if (key === 'lightLeaks') renderLightLeaks();
      if (key === 'bkBlur')  renderBkBlur();
      updateSliderFill(slider);
      saveHistory();
    });
  });

  // Collapsible sections
  QA('.adj-hd').forEach(hd => {
    hd.addEventListener('click', () => {
      hd.closest('.adj-sec').classList.toggle('collapsed');
    });
  });

  // Panel tabs
  QA('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      QA('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      QA('.tab-pane').forEach(p => p.classList.add('hidden'));
      $(tab.dataset.tab).classList.remove('hidden');
    });
  });

  // Reset all (adjust panel button)
  $('resetAllAdj').addEventListener('click', () => {
    doFullReset();
  });

  // Tools panel reset button
  $('toolsResetBtn') && $('toolsResetBtn').addEventListener('click', () => {
    doFullReset();
  });

  // Mouse-wheel fine-tuning: scroll over any adjustment slider to nudge by 1 step.
  // Works on both desktop and laptop trackpads. Passive:false lets us call preventDefault
  // so the panel doesn't scroll while the user is adjusting a value.
  QA('.adj-row input[type="range"]').forEach(slider => {
    slider.addEventListener('wheel', e => {
      if (!state.image) return;
      e.preventDefault();
      e.stopPropagation();
      const step  = parseFloat(slider.step) || 1;
      const delta = e.deltaY < 0 ? step : -step;
      slider.value = clamp(parseFloat(slider.value) + delta,
        parseFloat(slider.min), parseFloat(slider.max));
      // Reuse the existing input pathway so RAF-throttle, fills, and history all work
      slider.dispatchEvent(new Event('input', { bubbles: true }));
    }, { passive: false });
  });
}

function resetAdjState() {
  Object.keys(state.adj).forEach(k => { state.adj[k] = 0; });
}

function doFullReset() {
  if (!state.image) { showToast('Load an image first'); return; }
  resetAdjState();
  state.activeFilter = 'Original';
  _lastEffectAdj    = null;
  _lastEffectFilter = null;
  hideEffectNameBadge();
  updateAllSliders();
  updateCanvasStyle();
  renderVignette();
  renderGrain();
  renderDust();
  renderLightLeaks();
  renderBkBlur();
  updateFilterUI();
  saveHistory();
  showToast('✓ All effects reset to original');
}

// ───────────────────────── AUTO ENHANCE ─────────────────────────

async function autoEnhance() {
  if (!state.image) { showToast('Load an image first'); return; }
  saveHistory();
  resetAdjState();

  const loadingStartedAt = performance.now();
  showLoading(true);
  await new Promise(requestAnimationFrame);

  // Fixed AI Enhance look so every photo gets the same result.
  state.adj.exposure    = 8;
  state.adj.brightness  = 8;
  state.adj.contrast    = 14;
  state.adj.highlights  = -48;
  state.adj.shadows     = 4;
  state.adj.whites      = -25;
  state.adj.blacks      = -80;
  state.adj.saturation  = -10;
  state.adj.vibrance    = 30;
  state.adj.temperature = -20;
  state.adj.tint        = 2;
  state.adj.sharpness   = 6;
  state.adj.clarity     = 2;
  state.adj.noiseReduction = 80;
  state.activeFilter    = 'Original';
  updateCanvasStyle();
  renderVignette();
  renderGrain();
  renderDust();
  renderLightLeaks();
  renderBkBlur();
  updateFilterUI();
  showToast('✨ AI Enhanced');

  const elapsed = performance.now() - loadingStartedAt;
  const remaining = Math.max(0, 2000 - elapsed);
  await new Promise(resolve => setTimeout(resolve, remaining));
  showLoading(false);
}

function analyzeImageMood(image) {
  const sampleSize = 28;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = sampleSize;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  const defaults = {
    luminance: 0.5,
    contrast: 0.5,
    saturation: 0.35,
    warmthBias: 0,
    flatness: 0.35,
    brightnessSpike: 0.5,
    texture: 0.5,
    fog: 0.35,
  };

  if (!ctx || !image) return defaults;

  try {
    ctx.drawImage(image, 0, 0, sampleSize, sampleSize);
    const { data } = ctx.getImageData(0, 0, sampleSize, sampleSize);
    let lumSum = 0;
    let satSum = 0;
    let warmSum = 0;
    let maxSum = 0;
    let minSum = 0;
    let edgeDeltaSum = 0;
    let edgeCount = 0;

    const edgeLuma = [];
    const rowStride = sampleSize * 4;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      lumSum += lum;
      satSum += max > 0 ? (max - min) / max : 0;
      warmSum += r - b;
      maxSum += max;
      minSum += min;
      edgeLuma.push(lum);
    }

    for (let y = 0; y < sampleSize - 1; y += 1) {
      for (let x = 0; x < sampleSize - 1; x += 1) {
        const idx = y * sampleSize + x;
        const right = idx + 1;
        const down = idx + sampleSize;
        edgeDeltaSum += Math.abs(edgeLuma[idx] - edgeLuma[right]);
        edgeDeltaSum += Math.abs(edgeLuma[idx] - edgeLuma[down]);
        edgeCount += 2;
      }
    }

    const pixels = data.length / 4;
    const luminance = lumSum / pixels;
    const saturation = satSum / pixels;
    const warmthBias = warmSum / pixels;
    const averagePeak = maxSum / pixels;
    const averageFloor = minSum / pixels;
    const contrast = clamp((averagePeak - averageFloor) * 1.2, 0, 1);
    const flatness = clamp(1 - contrast, 0, 1);
    const brightnessSpike = clamp((averagePeak + luminance) / 2, 0, 1);
    const texture = clamp(1 - (edgeCount ? edgeDeltaSum / edgeCount * 1.8 : 0), 0, 1);
    const fog = clamp((1 - contrast) * (1 - saturation * 0.55), 0, 1);

    return {
      luminance,
      contrast,
      saturation,
      warmthBias,
      flatness,
      brightnessSpike,
      texture,
      fog,
    };
  } catch (_) {
    return defaults;
  }
}

function initAutoEnhance() {
  const btn = $('autoEnhanceBtn');
  if (btn) btn.addEventListener('click', autoEnhance);
}

// ─── Effects (one-click presets) ───

let _currentEffectObj = null;
let _effectBadgeFadeTimer = null;
let _effectBadgeHideTimer = null;

function showEffectNameBadge(name, duration = 1500) {
  const badge = $('effectNameBadge');
  if (!badge || !name) return;

  if (_effectBadgeFadeTimer) clearTimeout(_effectBadgeFadeTimer);
  if (_effectBadgeHideTimer) clearTimeout(_effectBadgeHideTimer);

  badge.textContent = name;
  badge.classList.remove('hidden');
  badge.classList.remove('visible');

  requestAnimationFrame(() => {
    badge.classList.add('visible');
  });

  _effectBadgeFadeTimer = setTimeout(() => {
    badge.classList.remove('visible');
  }, duration);

  _effectBadgeHideTimer = setTimeout(() => {
    badge.classList.add('hidden');
  }, duration + 220);
}

function hideEffectNameBadge() {
  const badge = $('effectNameBadge');
  if (!badge) return;

  if (_effectBadgeFadeTimer) clearTimeout(_effectBadgeFadeTimer);
  if (_effectBadgeHideTimer) clearTimeout(_effectBadgeHideTimer);

  badge.classList.remove('visible');
  badge.classList.add('hidden');
}

function applyEffect(effect, amount = 1.0, options = {}) {
  const opts = {
    commitHistory: true,
    syncAdjSliders: true,
    showToast: true,
    ...options,
  };

  if (!state.image) { showToast('Load an image first'); return; }

  if (_lastEffectAdj) {
    Object.keys(_lastEffectAdj).forEach(key => { state.adj[key] = 0; });
  }
  if (_lastEffectFilter) {
    state.activeFilter = 'Original';
  }

  _currentEffectObj = effect;
  _lastEffectAdj = {};
  _lastEffectFilter = effect.filter || null;

  Object.entries(effect.adj).forEach(([key, val]) => {
    const finalVal = val * amount;
    state.adj[key] = finalVal;
    _lastEffectAdj[key] = finalVal;

    if (opts.syncAdjSliders) {
      const slider = document.querySelector(`input[data-adj="${key}"]`);
      if (slider) {
        slider.value = finalVal;
        const disp = slider.closest('.adj-row') && slider.closest('.adj-row').querySelector('.av');
        if (disp) disp.textContent = Math.round(finalVal);
        updateSliderFill(slider);
      }
    }
  });

  if (effect.filter) {
    state.activeFilter = amount > 0.05 ? effect.filter : 'Original';
    updateFilterUI();
  }

  updateCanvasStyle();
  renderVignette();
  renderGrain();
  renderDust();
  renderLightLeaks();
  renderBkBlur();
  if (opts.commitHistory) saveHistory();
  if (opts.showToast && amount === 1.0) showEffectNameBadge(effect.label);

  QA('.effect-card').forEach(c => c.classList.remove('active'));
  const activeCard = document.querySelector(`.effect-card[data-effect="${effect.name}"]`);
  if (activeCard && amount > 0) activeCard.classList.add('active');

  const intensityWrapper = document.getElementById('effectIntensityWrapper');
  const intensitySlider = document.getElementById('effectIntensitySlider');
  const intensityVal = document.getElementById('effectIntensityVal');
  
  if (intensityWrapper && intensitySlider && intensityVal) {
    if (amount === 1.0) {
      intensityWrapper.style.display = 'block';
      intensitySlider.value = 100;
      intensityVal.textContent = 100;
      updateSliderFill(intensitySlider);
    } else if (amount === 0) {
      intensityWrapper.style.display = 'none';
    }
  }
}

function initEffects() {
  const tab = $('effectsTab');
  if (!tab) return;

  const groups = {
    cinematic:    '🎬 Cinematic',
    portrait:     '👤 Portrait',
    wedding:      '💍 Wedding / Romantic',
    professional: '🌟 Professional',
  };

  // ─ Build HTML — reset row, effect intensity slider, and the effect cards ─
  let html =
    '<div class="tool-reset-row">' +
      '<button class="btn-reset-tools" id="effResetBtn" title="Reset all effects">' +
        '<svg viewBox="0 0 16 16"><path d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/></svg>' +
        'Reset Effects' +
      '</button>' +
    '</div>' +
    '<div class="adj-row" style="margin-top: 15px; margin-bottom: 25px; display: none;" id="effectIntensityWrapper">' +
      '<div class="adj-header">' +
        '<span class="al">Intensity</span>' +
        '<span class="av" id="effectIntensityVal">100</span>' +
      '</div>' +
      '<input type="range" id="effectIntensitySlider" min="0" max="100" value="100">' +
    '</div>';

  let lastGroup = null;
  EFFECTS.forEach(effect => {
    if (effect.group !== lastGroup) {
      if (lastGroup !== null) html += '</div>';
      html += `<div class="effect-cat-hd">${groups[effect.group]}</div>`;
      html += '<div class="effect-cards">';
      lastGroup = effect.group;
    }
    html += `<div class="effect-card" data-effect="${effect.name}" title="${effect.label}">` +
            `<span class="effect-icon">${effect.icon}</span>` +
            `<span class="effect-label">${effect.label}</span>` +
            `</div>`;
  });
  if (lastGroup !== null) html += '</div>';
  tab.innerHTML = html;

  // Amount slider logic
  const effectIntensityWrapper = $('effectIntensityWrapper');
  const effectIntensitySlider = $('effectIntensitySlider');
  const effectIntensityVal = $('effectIntensityVal');
  let _effectIntensityRaf = 0;

  if (effectIntensitySlider) {
    effectIntensitySlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (effectIntensityVal) effectIntensityVal.textContent = val;
      updateSliderFill(effectIntensitySlider);
      if (_currentEffectObj) {
        cancelAnimationFrame(_effectIntensityRaf);
        _effectIntensityRaf = requestAnimationFrame(() => {
          applyEffect(_currentEffectObj, val / 100, {
            commitHistory: false,
            syncAdjSliders: false,
            showToast: false,
          });
        });
      }
    });

    // Commit a single history state once the user finishes dragging.
    effectIntensitySlider.addEventListener('change', () => {
      if (!_currentEffectObj) return;
      const val = parseInt(effectIntensitySlider.value, 10) || 0;
      applyEffect(_currentEffectObj, val / 100, {
        commitHistory: true,
        syncAdjSliders: true,
        showToast: false,
      });
    });
  }

  // ─ Live Preview on Main Canvas helpers ─
  let _liveOriginalAdj = null;
  let _liveOriginalFilter = null;

  function _previewEffectOnMain(eff) {
    if (!state.image) return;
    if (!_liveOriginalAdj) {
      _liveOriginalAdj = Object.assign({}, state.adj);
      _liveOriginalFilter = state.activeFilter;
    }
    
    // Simulate what applyEffect does, without committing to history or UI
    const simAdj = Object.assign({}, _liveOriginalAdj);
    if (_lastEffectAdj) Object.keys(_lastEffectAdj).forEach(k => { simAdj[k] = 0; });
    Object.assign(simAdj, eff.adj);
    
    const simFilter = eff.filter || (_lastEffectFilter ? 'Original' : _liveOriginalFilter);
    const fs = buildFilterString(simAdj, simFilter);
    
    // Apply fast to main canvas live
    mainCanvas.style.filter = fs;
    
    // Optional: could render vignette/grain live here too, but CSS filter is instant and premium
  }

  function _restoreMainCanvasPreview() {
    if (!state.image || !_liveOriginalAdj) return;
    const fs = buildFilterString(_liveOriginalAdj, _liveOriginalFilter);
    mainCanvas.style.filter = fs;
    _liveOriginalAdj = null;
    _liveOriginalFilter = null;
  }

  // ─ Reset button ─
  $('effResetBtn').addEventListener('click', () => {
    if (!state.image) return;
    if (_lastEffectAdj) {
      Object.keys(_lastEffectAdj).forEach(k => { state.adj[k] = 0; });
      _lastEffectAdj = null;
    }
    if (_lastEffectFilter) {
      state.activeFilter = 'Original';
      updateFilterUI();
      _lastEffectFilter = null;
    }
    _currentEffectObj = null;
    if (effectIntensityWrapper) effectIntensityWrapper.style.display = 'none';

    updateAllSliders();
    updateCanvasStyle();
    renderVignette();
    renderGrain();
    renderBkBlur();
    hideEffectNameBadge();
    saveHistory();
    QA('.effect-card').forEach(c => c.classList.remove('active'));
    showToast('↺ Effects cleared');
  });

  // ─ Desktop: hover = live preview, leave = restore ─
  tab.addEventListener('mouseover', e => {
    const card = e.target.closest('.effect-card');
    if (!card) return;
    const eff = EFFECTS.find(f => f.name === card.dataset.effect);
    if (eff) _previewEffectOnMain(eff);
  });
  tab.addEventListener('mouseleave', () => {
    _restoreMainCanvasPreview();
  });

  // ─ Mobile: touchstart = live preview, tap = apply ─
  let _touchPreviewEff = null;
  tab.addEventListener('touchstart', e => {
    const card = e.target.closest('.effect-card');
    if (!card) return;
    const eff = EFFECTS.find(f => f.name === card.dataset.effect);
    if (!eff) return;
    _touchPreviewEff = eff;
    _previewEffectOnMain(eff);
  }, { passive: true });

  tab.addEventListener('touchmove', e => {
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const card = el && el.closest('.effect-card');
    if (!card) {
      _restoreMainCanvasPreview();
      _touchPreviewEff = null;
      return;
    }
    const eff = EFFECTS.find(f => f.name === card.dataset.effect);
    if (eff && eff !== _touchPreviewEff) {
      _touchPreviewEff = eff;
      _previewEffectOnMain(eff);
    }
  }, { passive: true });

  tab.addEventListener('touchend', e => {
    const card = e.target.closest('.effect-card');
    if (!card || !_touchPreviewEff) {
      _restoreMainCanvasPreview();
      return;
    }
    if (card.dataset.effect === _touchPreviewEff.name) {
      _restoreMainCanvasPreview(); // Clean up sim state
      applyEffect(_touchPreviewEff, 1.0);
    }
    _touchPreviewEff = null;
  }, { passive: true });

  // ─ Click (desktop) ─
  tab.addEventListener('click', e => {
    const card = e.target.closest('.effect-card');
    if (!card) return;
    const eff = EFFECTS.find(f => f.name === card.dataset.effect);
    if (!eff) return;
    _restoreMainCanvasPreview(); // Clean up sim state before real apply
    applyEffect(eff, 1.0);
  });
}

function updateAllSliders() {
  QA('.adj-row input[type="range"]').forEach(slider => {
    const key = slider.dataset.adj;
    if (key && state.adj[key] !== undefined) {
      slider.value = state.adj[key];
      const row  = slider.closest('.adj-row');
      const disp = row && row.querySelector('.av');
      if (disp) disp.textContent = state.adj[key];
      updateSliderFill(slider);
    }
  });
}

function updateSliderFill(slider) {
  const min = parseFloat(slider.min !== '' ? slider.min : 0);
  const max = parseFloat(slider.max !== '' ? slider.max : 100);
  const val = parseFloat(slider.value !== '' ? slider.value : 0);
  const pct = ((val - min) / (max - min) * 100).toFixed(1);
  slider.style.setProperty('--sl-fill', pct + '%');
}

// ═══════════════════════════════════════════════════════════
//  FILTER PRESETS
// ═══════════════════════════════════════════════════════════

function generateFilterThumbnails() {
  if (!state.image) return;

  const THUMB_W = 68, THUMB_H = 50;
  const DPR = Math.min(window.devicePixelRatio || 1, 2); // cap at 2× — enough for Retina
  const renderToken = ++_filterThumbRenderToken;

  // Bottom strip
  const strip = $('filterStrip');
  strip.innerHTML = '';

  // Right panel grid
  const grid = $('filterGridRight');
  if (grid) grid.innerHTML = '';

  let lastGroup = null;

  const createItem = (f) => {
    const thumbCanvas = document.createElement('canvas');
    // Draw at physical pixels so CSS scale-down gives a sharp Retina thumbnail
    thumbCanvas.width  = THUMB_W * DPR;
    thumbCanvas.height = THUMB_H * DPR;
    const tCtx = thumbCanvas.getContext('2d');
    if (tCtx) {
      if (DPR !== 1) tCtx.scale(DPR, DPR);
      tCtx.filter = f.css || 'none';
      tCtx.drawImage(state.image, 0, 0, THUMB_W, THUMB_H);
      tCtx.filter = 'none';
    }

    const wrap = document.createElement('div');
    wrap.className = 'filter-cv-wrap';
    wrap.appendChild(thumbCanvas);

    const lbl = document.createElement('span');
    lbl.className = 'filter-label';
    // Human-readable label: strip internal suffix like _IG
    const displayName = f.label || f.name.replace(/_[A-Z]+$/, '').replace(/([A-Z])/g, ' $1').trim();
    lbl.textContent = displayName;

    const item = document.createElement('div');
    item.className = 'filter-thumb' + (f.name === state.activeFilter ? ' active' : '');
    if (f.premium) item.classList.add('premium');
    item.dataset.filter = f.name;
    item.appendChild(wrap);
    item.appendChild(lbl);

    // Premium badge appended directly to item (not wrap) to avoid overflow:hidden clipping
    if (f.premium) {
      const groupMeta = FILTER_GROUP_META[f.group] || {
        badge: 'PRO',
        title: 'Premium',
      };
      const badge = document.createElement('span');
      badge.className = 'filter-prem-badge';
      badge.innerHTML = `<svg width="7" height="7" viewBox="0 0 16 16" fill="currentColor"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg> ${groupMeta.badge}`;
      badge.title = groupMeta.title;
      item.appendChild(badge);
    }

    item.addEventListener('click', () => applyFilter(f.name));
    item.addEventListener('touchend', e => {
      e.preventDefault();
      applyFilter(f.name);
    }, { passive: false });

    return item;
  };

  const batchSize = 4;
  let index = 0;

  const renderBatch = () => {
    if (renderToken !== _filterThumbRenderToken) return;

    const stripFrag = document.createDocumentFragment();
    const gridFrag = grid ? document.createDocumentFragment() : null;
    let rendered = 0;

    while (index < FILTERS.length && rendered < batchSize) {
      const f = FILTERS[index];

      // ── Group header + separator when group changes ──
      if (f.group && f.group !== lastGroup) {
        const groupMeta = FILTER_GROUP_META[f.group] || {
          heading: f.group,
          badge: 'PRO',
          title: 'Premium',
        };

        const sep = document.createElement('div');
        sep.className = 'filter-strip-sep';
        stripFrag.appendChild(sep);

        if (gridFrag) {
          const hd = document.createElement('div');
          hd.className = 'filter-group-hd';
          hd.innerHTML = `<span>${groupMeta.heading}</span><span class="fgh-badge">${groupMeta.badge}</span>`;
          gridFrag.appendChild(hd);
        }
        lastGroup = f.group;
      }

      stripFrag.appendChild(createItem(f));
      if (gridFrag) gridFrag.appendChild(createItem(f));

      index += 1;
      rendered += 1;
    }

    strip.appendChild(stripFrag);
    if (grid && gridFrag) grid.appendChild(gridFrag);

    if (index < FILTERS.length) {
      requestAnimationFrame(renderBatch);
      return;
    }

    // Remove placeholder text only once the full set has rendered.
    const placeholder = $('filterPlaceholder');
    if (placeholder) placeholder.remove();
  };

  requestAnimationFrame(renderBatch);
}

function applyFilter(name) {
  const selectedFilter = FILTERS.find(f => f.name === name);
  if (name === 'BestMatch') {
    state.activeFilter = getAdaptiveVscoFilterName();
  } else {
    state.activeFilter = name;
  }
  updateCanvasStyle();
  updateFilterUI();
  saveHistory();
  const f = FILTERS.find(f => f.name === state.activeFilter) || selectedFilter;
  const displayName = f && f.label
    ? f.label.replace(/[\u{1F300}-\u{1FFFF}]/gu, '').trim()
    : name.replace(/_[A-Z]+$/, '').replace(/([A-Z])/g, ' $1').trim();
  showEffectNameBadge(displayName);
}

function updateFilterUI() {
  QA('.filter-thumb').forEach(el => {
    el.classList.toggle('active', el.dataset.filter === state.activeFilter);
  });
}

// ═══════════════════════════════════════════════════════════
//  TOOLS
// ═══════════════════════════════════════════════════════════

function initTools() {
  QA('[data-tool]').forEach(btn => {
    btn.addEventListener('click', () => selectTool(btn.dataset.tool));
  });
}

function selectTool(name) {
  if (!name) return;

  // Cancel previous active tool actions
  if (state.cropActive) cancelCrop();
  dismissTextOverlay();

  state.tool = name;

  // On mobile: auto-close left panel after tool selection
  if (window.innerWidth <= 767) {
    $('leftPanel') && $('leftPanel').classList.remove('open');
    $('mobileOverlay') && $('mobileOverlay').classList.remove('active');
  }

  // Update button states
  QA('[data-tool]').forEach(b => b.classList.toggle('active', b.dataset.tool === name));

  // Show/hide option panels — eraser reuses brush options
  QA('.opt-panel').forEach(p => p.classList.add('hidden'));
  const optKey = (name === 'eraser') ? 'brush' : name;
  const panel = $(optKey + 'Options');
  if (panel) panel.classList.remove('hidden');

  // Sync eraser mode checkbox
  if ($('eraserMode')) $('eraserMode').checked = (name === 'eraser');

  // Canvas cursor
  const cursors = {
    select: 'grab', crop: 'crosshair', rotate: 'default',
    brush: 'crosshair', eraser: 'crosshair', text: 'text',
  };
  mainCanvas.style.cursor = cursors[name] || 'default';

  $('statusMode').textContent = name.charAt(0).toUpperCase() + name.slice(1);

  // Tool-specific activation
  if (name === 'crop' && state.image) startCrop();
  if (name === 'crop' && !state.image) showToast('Load an image first');
  if (name === 'text' && !state.image) showToast('Load an image first');
}

// ═══════════════════════════════════════════════════════════
//  CROP TOOL
// ═══════════════════════════════════════════════════════════

function initCropTool() {
  $('applyCrop').addEventListener('click', applyCrop);
  $('cancelCrop').addEventListener('click', cancelCrop);

  // Aspect ratio chips
  QA('[data-ratio]').forEach(btn => {
    btn.addEventListener('click', () => {
      QA('[data-ratio]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.dataset.ratio;
      if (val === 'free') { state.cropAspect = null; return; }
      const [w, h] = val.split(':').map(Number);
      state.cropAspect = w / h;
      enforceAspect();
      updateCropBoxUI();
    });
  });

  // Draggable crop box interaction
  const cropBoxEl = $('cropBox');
  let action = null;   // 'move' | 'resize-ne' etc.
  let startMouse = {}, startBox = {};

  const getCvPos = (clientX, clientY) => {
    const r  = mainCanvas.getBoundingClientRect();
    return {
      x: (clientX - r.left) / state.zoom,
      y: (clientY - r.top)  / state.zoom,
    };
  };

  cropBoxEl.addEventListener('mousedown', e => {
    if (e.target.classList.contains('crop-handle')) {
      action = 'resize-' + e.target.dataset.h;
    } else {
      action = 'move';
    }
    startMouse = { x: e.clientX, y: e.clientY };
    startBox   = { ...state.cropBox };
    e.preventDefault();
  });

  window.addEventListener('mousemove', e => {
    if (!action) return;
    const dx = (e.clientX - startMouse.x) / state.zoom;
    const dy = (e.clientY - startMouse.y) / state.zoom;
    const CW = mainCanvas.width, CH = mainCanvas.height;

    if (action === 'move') {
      state.cropBox.x = clamp(startBox.x + dx, 0, CW - state.cropBox.w);
      state.cropBox.y = clamp(startBox.y + dy, 0, CH - state.cropBox.h);
    } else {
      let { x, y, w, h } = startBox;
      const dir = action.replace('resize-', '');
      if (dir.includes('e')) w = Math.max(20, w + dx);
      if (dir.includes('s')) h = Math.max(20, h + dy);
      if (dir.includes('w')) { x += dx; w = Math.max(20, w - dx); }
      if (dir.includes('n')) { y += dy; h = Math.max(20, h - dy); }
      if (state.cropAspect) h = w / state.cropAspect;
      state.cropBox = {
        x: clamp(x, 0, CW - 20),
        y: clamp(y, 0, CH - 20),
        w: clamp(w, 20, CW - x),
        h: clamp(h, 20, CH - y),
      };
    }
    updateCropBoxUI();
  });

  window.addEventListener('mouseup', () => { action = null; });

  // Touch support for crop handles on mobile
  const getTouchCvPos = t => {
    const r = mainCanvas.getBoundingClientRect();
    return { x: (t.clientX - r.left) / state.zoom, y: (t.clientY - r.top) / state.zoom };
  };

  cropBoxEl.addEventListener('touchstart', e => {
    if (e.target.classList.contains('crop-handle')) {
      action = 'resize-' + e.target.dataset.h;
    } else {
      action = 'move';
    }
    startMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    startBox = { ...state.cropBox };
    e.preventDefault();
    // Add non-passive move only while dragging so it never blocks panel scroll
    document.addEventListener('touchmove', onCropTouchMove, { passive: false });
  }, { passive: false });

  const onCropTouchMove = e => {
    if (!action) return;
    const dx = (e.touches[0].clientX - startMouse.x) / state.zoom;
    const dy = (e.touches[0].clientY - startMouse.y) / state.zoom;
    const CW = mainCanvas.width, CH = mainCanvas.height;
    if (action === 'move') {
      state.cropBox.x = clamp(startBox.x + dx, 0, CW - state.cropBox.w);
      state.cropBox.y = clamp(startBox.y + dy, 0, CH - state.cropBox.h);
    } else {
      let { x, y, w, h } = startBox;
      const dir = action.replace('resize-', '');
      if (dir.includes('e')) w = Math.max(20, w + dx);
      if (dir.includes('s')) h = Math.max(20, h + dy);
      if (dir.includes('w')) { x += dx; w = Math.max(20, w - dx); }
      if (dir.includes('n')) { y += dy; h = Math.max(20, h - dy); }
      if (state.cropAspect) h = w / state.cropAspect;
      state.cropBox = {
        x: clamp(x, 0, CW - 20), y: clamp(y, 0, CH - 20),
        w: clamp(w, 20, CW - x), h: clamp(h, 20, CH - y),
      };
    }
    updateCropBoxUI();
    e.preventDefault();
  };

  window.addEventListener('touchend', () => {
    action = null;
    document.removeEventListener('touchmove', onCropTouchMove);
  });
}

function startCrop() {
  state.cropActive = true;
  $('cropOverlay').classList.remove('hidden');
  state.cropBox = {
    x: mainCanvas.width  * 0.1,
    y: mainCanvas.height * 0.1,
    w: mainCanvas.width  * 0.8,
    h: mainCanvas.height * 0.8,
  };
  updateCropBoxUI();
}

function updateCropBoxUI() {
  const cb     = state.cropBox;
  const canvR  = mainCanvas.getBoundingClientRect();
  const contR  = $('canvasArea').getBoundingClientRect();
  const scaleX = canvR.width  / mainCanvas.width;
  const scaleY = canvR.height / mainCanvas.height;
  const el     = $('cropBox');

  el.style.left   = (canvR.left - contR.left + cb.x * scaleX) + 'px';
  el.style.top    = (canvR.top  - contR.top  + cb.y * scaleY) + 'px';
  el.style.width  = (cb.w * scaleX) + 'px';
  el.style.height = (cb.h * scaleY) + 'px';
}

function enforceAspect() {
  if (!state.cropAspect) return;
  state.cropBox.h = state.cropBox.w / state.cropAspect;
}

function applyCrop() {
  if (!state.image || !state.cropActive) return;
  showLoading(true);

  const { x, y, w, h } = state.cropBox;
  const iw = Math.max(1, Math.round(w));
  const ih = Math.max(1, Math.round(h));

  const tmp = document.createElement('canvas');
  tmp.width  = iw; tmp.height = ih;
  tmp.getContext('2d').drawImage(mainCanvas, Math.round(x), Math.round(y), iw, ih, 0, 0, iw, ih);

  mainCanvas.width  = vigCanvas.width  = grainCanvas.width  = dustCanvas.width = leakCanvas.width = bkBlurCanvas.width  = iw;
  mainCanvas.height = vigCanvas.height = grainCanvas.height = dustCanvas.height = leakCanvas.height = bkBlurCanvas.height = ih;
  mainCtx.drawImage(tmp, 0, 0);
  bumpCanvasRevision();

  state.imageWidth = iw; state.imageHeight = ih;

  cancelCrop();
  fitToScreen();
  renderVignette();
  renderGrain();
  saveHistory();
  updateFileInfo();
  showLoading(false);
  showToast('✓ Crop applied — ' + iw + '×' + ih);
}

function cancelCrop() {
  state.cropActive = false;
  $('cropOverlay').classList.add('hidden');
}

// ═══════════════════════════════════════════════════════════
//  ROTATE & FLIP
// ═══════════════════════════════════════════════════════════

function initRotateTool() {
  const guard = () => { if (!state.image) { showToast('Load an image first'); return false; } return true; };

  $('rotateLeft') .addEventListener('click', () => { if (guard()) bakeRotate(-90); });
  $('rotateRight').addEventListener('click', () => { if (guard()) bakeRotate(90);  });
  $('flipH')      .addEventListener('click', () => { if (guard()) { state.flipH = !state.flipH; renderFromImage(); saveHistory(); showToast('↔ Flipped'); } });
  $('flipV')      .addEventListener('click', () => { if (guard()) { state.flipV = !state.flipV; renderFromImage(); saveHistory(); showToast('↕ Flipped'); } });
}

function bakeRotate(deg) {
  const rad  = deg * Math.PI / 180;
  const W    = mainCanvas.width, H = mainCanvas.height;
  const newW = Math.abs(Math.round(W * Math.cos(rad) + H * Math.abs(Math.sin(rad))));
  const newH = Math.abs(Math.round(H * Math.cos(rad) + W * Math.abs(Math.sin(rad))));

  const tmp  = document.createElement('canvas');
  tmp.width  = newW; tmp.height = newH;
  const tCtx = tmp.getContext('2d');
  tCtx.translate(newW / 2, newH / 2);
  tCtx.rotate(rad);
  tCtx.drawImage(mainCanvas, -W / 2, -H / 2);

  mainCanvas.width  = vigCanvas.width  = grainCanvas.width  = dustCanvas.width = leakCanvas.width = bkBlurCanvas.width  = newW;
  mainCanvas.height = vigCanvas.height = grainCanvas.height = dustCanvas.height = leakCanvas.height = bkBlurCanvas.height = newH;
  mainCtx.drawImage(tmp, 0, 0);
  bumpCanvasRevision();

  state.imageWidth = newW; state.imageHeight = newH;
  fitToScreen();
  renderVignette();
  renderGrain();
  updateFileInfo();
  saveHistory();
  showToast('✓ Rotated ' + deg + '°');
}

// ═══════════════════════════════════════════════════════════
//  CANVAS HOVER (colour display; eyedropper tool removed)
// ═══════════════════════════════════════════════════════════

function initCanvasHover() {
  let hoverRaf = 0;
  let lastEvent = null;

  const updateHoverColor = () => {
    hoverRaf = 0;
    if (!lastEvent || !state.image || state.isDrawing) return;

    const pos = getCanvasPos(lastEvent);
    if (pos.x < 0 || pos.y < 0 || pos.x >= mainCanvas.width || pos.y >= mainCanvas.height) return;

    try {
      const px = mainCtx.getImageData(Math.round(pos.x), Math.round(pos.y), 1, 1).data;
      const hex = '#' + [px[0], px[1], px[2]].map(v => v.toString(16).padStart(2, '0')).join('');
      $('statusColor').textContent = hex.toUpperCase() + '  ·  RGB ' + px[0] + ',' + px[1] + ',' + px[2];
    } catch (_) {}
  };

  // Show pixel colour in RGB chip on mouse hover (desktop only)
  mainCanvas.addEventListener('mousemove', e => {
    if (!state.image) return;
    lastEvent = e;
    if (hoverRaf) return;
    hoverRaf = requestAnimationFrame(updateHoverColor);
  });
}

function initBrushTool() {
  $('brushSize')   .addEventListener('input', () => $('brushSizeVal').textContent = $('brushSize').value);
  $('brushOpacity').addEventListener('input', () => $('brushOpacityVal').textContent = $('brushOpacity').value + '%');

  // Mouse events
  mainCanvas.addEventListener('mousedown', e => startBrush(getCanvasPos(e)));
  mainCanvas.addEventListener('mousemove', e => {
    if (!state.isDrawing) return;
    continueBrush(getCanvasPos(e));
  });
  window.addEventListener('mouseup', () => endBrush());

  // Touch events
  mainCanvas.addEventListener('touchstart', e => {
    if (state.tool !== 'brush' && state.tool !== 'eraser') return;
    e.preventDefault();
    startBrush(getCanvasPosTouch(e.touches[0]));
  }, { passive: false });

  mainCanvas.addEventListener('touchmove', e => {
    if (!state.isDrawing) return;
    e.preventDefault();
    continueBrush(getCanvasPosTouch(e.touches[0]));
  }, { passive: false });

  mainCanvas.addEventListener('touchend', () => endBrush());
}

function startBrush(pos) {
  if (state.tool !== 'brush' && state.tool !== 'eraser') return;
  if (!state.image) return;
  state.isDrawing = true;
  state.currentStroke = {
    color:  $('brushColor').value,
    size:   parseInt($('brushSize').value),
    opacity: parseInt($('brushOpacity').value) / 100,
    eraser: state.tool === 'eraser' || (state.tool === 'brush' && $('eraserMode') && $('eraserMode').checked),
    last: pos,
  };
}

function continueBrush(pos) {
  if (!state.isDrawing || !state.currentStroke) return;
  const s = state.currentStroke;
  mainCtx.save();
  mainCtx.globalCompositeOperation = s.eraser ? 'destination-out' : 'source-over';
  mainCtx.globalAlpha   = s.opacity;
  mainCtx.strokeStyle   = s.color;
  mainCtx.lineWidth     = s.size;
  mainCtx.lineCap       = 'round';
  mainCtx.lineJoin      = 'round';
  mainCtx.beginPath();
  mainCtx.moveTo(s.last.x, s.last.y);
  mainCtx.lineTo(pos.x, pos.y);
  mainCtx.stroke();
  mainCtx.restore();
  s.last = pos;
}

function endBrush() {
  if (!state.isDrawing) return;
  state.isDrawing    = false;
  state.currentStroke = null;
  bumpCanvasRevision();
  saveHistory();
}

// ═══════════════════════════════════════════════════════════
//  TEXT TOOL
// ═══════════════════════════════════════════════════════════

// ── Text overlay drag state ──
let _tobDragging = false, _tobOffX = 0, _tobOffY = 0;
let _textFontPreviewInitialized = false;
let _textLiveUiRaf = 0;
let _lastTextPreviewSig = '';
let _textFontPreviewHoverTimer = 0;

const TEXT_EFFECTS = {
  none:      { id: 'none' },
  shadow:    { id: 'shadow' },
  outline:   { id: 'outline' },
  neon:      { id: 'neon' },
  softglow:  { id: 'softglow' },
  gold:      { id: 'gold' },
  frost:     { id: 'frost' },
  cinema:    { id: 'cinema' },
  silver:    { id: 'silver' },
  rosegold:  { id: 'rosegold' },
  holo:      { id: 'holo' },
  bevel:     { id: 'bevel' },
  glitch:    { id: 'glitch' },
  duotone:   { id: 'duotone' },
  ember:     { id: 'ember' },
  glasspro:  { id: 'glasspro' },
  platinum:  { id: 'platinum' },
};

function parseTextStyleSelection(rawValue) {
  const value = String(rawValue || '').trim();
  if (!value) return { fontFamily: 'sans-serif', effectId: 'none' };
  const split = value.split('||');
  const fontFamily = (split[0] || 'sans-serif').trim();
  const effectIdRaw = (split[1] || 'none').trim().toLowerCase();
  const effectId = TEXT_EFFECTS[effectIdRaw] ? effectIdRaw : 'none';
  return { fontFamily, effectId };
}

function _clearTextFxStyles(el) {
  el.style.textShadow = 'none';
  el.style.webkitTextStroke = '0px transparent';
  el.style.background = 'none';
  el.style.backgroundClip = 'border-box';
  el.style.webkitBackgroundClip = 'border-box';
  el.style.webkitTextFillColor = '';
  el.style.filter = 'none';
}

function _applyOverlayTextEffect(el, effectId, color, sizePx) {
  _clearTextFxStyles(el);
  const glowA = Math.max(1, Math.round(sizePx * 0.18));
  const glowB = Math.max(2, Math.round(sizePx * 0.4));
  const glowC = Math.max(4, Math.round(sizePx * 0.7));
  const strokePx = Math.max(1, Math.round(sizePx * 0.06));

  switch (effectId) {
    case 'shadow':
      el.style.textShadow = `0 ${Math.max(1, Math.round(sizePx * 0.1))}px ${Math.max(3, Math.round(sizePx * 0.28))}px rgba(0,0,0,0.55)`;
      break;
    case 'outline':
      el.style.webkitTextStroke = `${strokePx}px rgba(0,0,0,0.8)`;
      break;
    case 'neon':
      el.style.textShadow =
        `0 0 ${glowA}px ${color}, 0 0 ${glowB}px ${color}, 0 0 ${glowC}px rgba(255,255,255,0.85)`;
      break;
    case 'softglow':
      el.style.textShadow =
        `0 0 ${Math.max(2, Math.round(sizePx * 0.25))}px rgba(255,255,255,0.65), 0 ${Math.max(1, Math.round(sizePx * 0.04))}px ${Math.max(3, Math.round(sizePx * 0.35))}px rgba(0,0,0,0.35)`;
      break;
    case 'gold':
      el.style.background = 'linear-gradient(180deg, #fff6bf 0%, #ffd35f 34%, #f6a814 64%, #c77a00 100%)';
      el.style.backgroundClip = 'text';
      el.style.webkitBackgroundClip = 'text';
      el.style.webkitTextFillColor = 'transparent';
      el.style.textShadow = `0 ${Math.max(1, Math.round(sizePx * 0.08))}px ${Math.max(2, Math.round(sizePx * 0.2))}px rgba(0,0,0,0.35)`;
      break;
    case 'frost':
      el.style.background = 'linear-gradient(180deg, #ffffff 0%, #d8ebff 45%, #7db8ff 100%)';
      el.style.backgroundClip = 'text';
      el.style.webkitBackgroundClip = 'text';
      el.style.webkitTextFillColor = 'transparent';
      el.style.textShadow = `0 0 ${Math.max(2, Math.round(sizePx * 0.22))}px rgba(167, 219, 255, 0.7)`;
      break;
    case 'cinema':
      el.style.webkitTextStroke = `${strokePx}px rgba(0,0,0,0.9)`;
      el.style.textShadow =
        `0 ${Math.max(1, Math.round(sizePx * 0.08))}px ${Math.max(3, Math.round(sizePx * 0.18))}px rgba(0,0,0,0.75), 0 0 ${Math.max(3, Math.round(sizePx * 0.3))}px rgba(255,255,255,0.2)`;
      break;
    case 'silver':
      el.style.background = 'linear-gradient(180deg, #ffffff 0%, #e8edf2 28%, #b5c0cb 56%, #7a8794 100%)';
      el.style.backgroundClip = 'text';
      el.style.webkitBackgroundClip = 'text';
      el.style.webkitTextFillColor = 'transparent';
      el.style.textShadow = `0 ${Math.max(1, Math.round(sizePx * 0.05))}px ${Math.max(2, Math.round(sizePx * 0.16))}px rgba(0,0,0,0.32)`;
      break;
    case 'rosegold':
      el.style.background = 'linear-gradient(180deg, #ffe7dd 0%, #f9b9a0 36%, #dc7f62 68%, #9f4f3f 100%)';
      el.style.backgroundClip = 'text';
      el.style.webkitBackgroundClip = 'text';
      el.style.webkitTextFillColor = 'transparent';
      el.style.textShadow = `0 ${Math.max(1, Math.round(sizePx * 0.07))}px ${Math.max(2, Math.round(sizePx * 0.2))}px rgba(70,20,10,0.35)`;
      break;
    case 'holo':
      el.style.background = 'linear-gradient(120deg, #7ff7ff 0%, #7fa8ff 18%, #b68cff 35%, #ff8fd4 55%, #9cf0c0 72%, #fff59b 100%)';
      el.style.backgroundClip = 'text';
      el.style.webkitBackgroundClip = 'text';
      el.style.webkitTextFillColor = 'transparent';
      el.style.textShadow = `0 0 ${Math.max(3, Math.round(sizePx * 0.25))}px rgba(140,255,255,0.45)`;
      break;
    case 'bevel':
      el.style.webkitTextStroke = `${Math.max(1, Math.round(sizePx * 0.045))}px rgba(0,0,0,0.5)`;
      el.style.textShadow =
        `0 -1px 0 rgba(255,255,255,0.65), 0 1px 0 rgba(0,0,0,0.45), 0 ${Math.max(1, Math.round(sizePx * 0.05))}px ${Math.max(2, Math.round(sizePx * 0.16))}px rgba(0,0,0,0.35)`;
      break;
    case 'glitch':
      el.style.textShadow =
        `${Math.max(1, Math.round(sizePx * 0.03))}px 0 0 rgba(255,0,80,0.8), -${Math.max(1, Math.round(sizePx * 0.03))}px 0 0 rgba(0,220,255,0.8), 0 ${Math.max(1, Math.round(sizePx * 0.06))}px ${Math.max(2, Math.round(sizePx * 0.2))}px rgba(0,0,0,0.45)`;
      break;
    case 'duotone':
      el.style.background = 'linear-gradient(180deg, #7bdcff 0%, #6a7bff 48%, #ff5ebc 100%)';
      el.style.backgroundClip = 'text';
      el.style.webkitBackgroundClip = 'text';
      el.style.webkitTextFillColor = 'transparent';
      el.style.textShadow = `0 0 ${Math.max(2, Math.round(sizePx * 0.16))}px rgba(76,126,255,0.45)`;
      break;
    case 'ember':
      el.style.background = 'linear-gradient(180deg, #fff3b0 0%, #ffca5e 30%, #ff7d28 62%, #b63200 100%)';
      el.style.backgroundClip = 'text';
      el.style.webkitBackgroundClip = 'text';
      el.style.webkitTextFillColor = 'transparent';
      el.style.textShadow = `0 0 ${Math.max(3, Math.round(sizePx * 0.24))}px rgba(255,126,44,0.55), 0 ${Math.max(1, Math.round(sizePx * 0.05))}px ${Math.max(2, Math.round(sizePx * 0.18))}px rgba(0,0,0,0.45)`;
      break;
    case 'glasspro':
      el.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(198,230,255,0.92) 45%, rgba(120,186,255,0.88) 100%)';
      el.style.backgroundClip = 'text';
      el.style.webkitBackgroundClip = 'text';
      el.style.webkitTextFillColor = 'transparent';
      el.style.webkitTextStroke = `${Math.max(1, Math.round(sizePx * 0.03))}px rgba(255,255,255,0.55)`;
      el.style.textShadow = `0 0 ${Math.max(3, Math.round(sizePx * 0.24))}px rgba(153,214,255,0.55), 0 ${Math.max(1, Math.round(sizePx * 0.04))}px ${Math.max(2, Math.round(sizePx * 0.18))}px rgba(0,0,0,0.28)`;
      break;
    case 'platinum':
      el.style.background = 'linear-gradient(180deg, #ffffff 0%, #f5f7fb 22%, #d4dbe5 52%, #919eac 78%, #eff3f9 100%)';
      el.style.backgroundClip = 'text';
      el.style.webkitBackgroundClip = 'text';
      el.style.webkitTextFillColor = 'transparent';
      el.style.textShadow = `0 ${Math.max(1, Math.round(sizePx * 0.06))}px ${Math.max(2, Math.round(sizePx * 0.18))}px rgba(0,0,0,0.28)`;
      break;
  }
}

function _applyOverlayTextEffectPreview(el, effectId, color, sizePx) {
  _clearTextFxStyles(el);
  const strokePx = Math.max(1, Math.round(sizePx * 0.04));
  switch (effectId) {
    case 'outline':
    case 'cinema':
    case 'bevel':
      el.style.webkitTextStroke = `${strokePx}px rgba(0,0,0,0.7)`;
      break;
    case 'neon':
    case 'holo':
    case 'duotone':
    case 'ember':
    case 'glasspro':
      el.style.textShadow = `0 0 ${Math.max(2, Math.round(sizePx * 0.22))}px ${color}`;
      break;
    case 'shadow':
    case 'softglow':
    case 'frost':
    case 'gold':
    case 'silver':
    case 'rosegold':
    case 'platinum':
      el.style.textShadow = `0 ${Math.max(1, Math.round(sizePx * 0.06))}px ${Math.max(2, Math.round(sizePx * 0.18))}px rgba(0,0,0,0.35)`;
      break;
    case 'glitch':
      el.style.textShadow =
        `${Math.max(1, Math.round(sizePx * 0.02))}px 0 0 rgba(255,0,80,0.65), -${Math.max(1, Math.round(sizePx * 0.02))}px 0 0 rgba(0,220,255,0.65)`;
      break;
  }
}

function _setOverlayPos(clientX, clientY) {
  const box = $('textOverlayBox');
  const ar  = $('canvasArea').getBoundingClientRect();
  box.style.left = (clientX - ar.left) + 'px';
  box.style.top  = (clientY - ar.top)  + 'px';
  _clampOverlayToCanvasArea();
}

function _clampOverlayToCanvasArea() {
  const box = $('textOverlayBox');
  if (!box || box.classList.contains('hidden')) return;
  const area = $('canvasArea').getBoundingClientRect();
  const br = box.getBoundingClientRect();

  const minLeft = 2;
  const minTop  = 2;
  const maxLeft = Math.max(minLeft, area.width  - br.width  - 2);
  const maxTop  = Math.max(minTop,  area.height - br.height - 2);

  const rawLeft = parseFloat(box.style.left) || 0;
  const rawTop  = parseFloat(box.style.top)  || 0;
  const left = clamp(rawLeft, minLeft, maxLeft);
  const top  = clamp(rawTop,  minTop,  maxTop);

  box.style.left = left + 'px';
  box.style.top  = top  + 'px';
}

function _resetCtxTextFx(ctx) {
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.lineWidth = 1;
}

function _applyCanvasTextEffect(ctx, effectId, color, sizePx, x, y, lineH, align, line, innerWidthPx, colorSettings) {
  _resetCtxTextFx(ctx);
  const glowA = Math.max(1, Math.round(sizePx * 0.18));
  const glowB = Math.max(2, Math.round(sizePx * 0.4));
  const glowC = Math.max(4, Math.round(sizePx * 0.7));
  const strokePx = Math.max(1, Math.round(sizePx * 0.06));
  const gradStartX = align === 'center' ? x - innerWidthPx / 2 : (align === 'right' ? x - innerWidthPx : x);
  const baseFill = _resolveCanvasTextFill(
    ctx,
    colorSettings || { mode: 'solid', color1: color, color2: color, angle: 45 },
    gradStartX,
    y,
    innerWidthPx,
    lineH
  );
  const useCustomOnPremium = _FIXED_GRADIENT_EFFECTS.has(effectId) && _isCustomGradientMode(colorSettings);

  switch (effectId) {
    case 'shadow':
      ctx.fillStyle = baseFill;
      ctx.shadowColor = 'rgba(0,0,0,0.55)';
      ctx.shadowBlur = Math.max(3, Math.round(sizePx * 0.28));
      ctx.shadowOffsetY = Math.max(1, Math.round(sizePx * 0.1));
      ctx.fillText(line, x, y);
      break;
    case 'outline':
      ctx.lineWidth = strokePx;
      ctx.strokeStyle = 'rgba(0,0,0,0.8)';
      ctx.fillStyle = baseFill;
      ctx.strokeText(line, x, y);
      ctx.fillText(line, x, y);
      break;
    case 'neon':
      ctx.fillStyle = baseFill;
      ctx.shadowColor = color;
      ctx.shadowBlur = glowC;
      ctx.fillText(line, x, y);
      _resetCtxTextFx(ctx);
      ctx.shadowColor = 'rgba(255,255,255,0.85)';
      ctx.shadowBlur = glowA;
      ctx.fillText(line, x, y);
      break;
    case 'softglow':
      ctx.fillStyle = baseFill;
      ctx.shadowColor = 'rgba(255,255,255,0.65)';
      ctx.shadowBlur = Math.max(2, Math.round(sizePx * 0.25));
      ctx.fillText(line, x, y);
      _resetCtxTextFx(ctx);
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = Math.max(3, Math.round(sizePx * 0.35));
      ctx.shadowOffsetY = Math.max(1, Math.round(sizePx * 0.04));
      ctx.fillText(line, x, y);
      break;
    case 'gold': {
      if (useCustomOnPremium) {
        ctx.fillStyle = baseFill;
      } else {
        const g = ctx.createLinearGradient(gradStartX, y, gradStartX + innerWidthPx, y + lineH);
        g.addColorStop(0, '#fff6bf');
        g.addColorStop(0.34, '#ffd35f');
        g.addColorStop(0.64, '#f6a814');
        g.addColorStop(1, '#c77a00');
        ctx.fillStyle = g;
      }
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = Math.max(2, Math.round(sizePx * 0.2));
      ctx.shadowOffsetY = Math.max(1, Math.round(sizePx * 0.08));
      ctx.fillText(line, x, y);
      break;
    }
    case 'frost': {
      if (useCustomOnPremium) {
        ctx.fillStyle = baseFill;
      } else {
        const g = ctx.createLinearGradient(gradStartX, y, gradStartX + innerWidthPx, y + lineH);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(0.45, '#d8ebff');
        g.addColorStop(1, '#7db8ff');
        ctx.fillStyle = g;
      }
      ctx.shadowColor = 'rgba(167, 219, 255, 0.7)';
      ctx.shadowBlur = Math.max(2, Math.round(sizePx * 0.22));
      ctx.fillText(line, x, y);
      break;
    }
    case 'cinema':
      ctx.lineWidth = strokePx;
      ctx.strokeStyle = 'rgba(0,0,0,0.9)';
      ctx.fillStyle = baseFill;
      ctx.shadowColor = 'rgba(0,0,0,0.75)';
      ctx.shadowBlur = Math.max(3, Math.round(sizePx * 0.18));
      ctx.shadowOffsetY = Math.max(1, Math.round(sizePx * 0.08));
      ctx.strokeText(line, x, y);
      ctx.fillText(line, x, y);
      break;
    case 'silver': {
      if (useCustomOnPremium) {
        ctx.fillStyle = baseFill;
      } else {
        const g = ctx.createLinearGradient(gradStartX, y, gradStartX + innerWidthPx, y + lineH);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(0.28, '#e8edf2');
        g.addColorStop(0.56, '#b5c0cb');
        g.addColorStop(1, '#7a8794');
        ctx.fillStyle = g;
      }
      ctx.shadowColor = 'rgba(0,0,0,0.32)';
      ctx.shadowBlur = Math.max(2, Math.round(sizePx * 0.16));
      ctx.shadowOffsetY = Math.max(1, Math.round(sizePx * 0.05));
      ctx.fillText(line, x, y);
      break;
    }
    case 'rosegold': {
      if (useCustomOnPremium) {
        ctx.fillStyle = baseFill;
      } else {
        const g = ctx.createLinearGradient(gradStartX, y, gradStartX + innerWidthPx, y + lineH);
        g.addColorStop(0, '#ffe7dd');
        g.addColorStop(0.36, '#f9b9a0');
        g.addColorStop(0.68, '#dc7f62');
        g.addColorStop(1, '#9f4f3f');
        ctx.fillStyle = g;
      }
      ctx.shadowColor = 'rgba(70,20,10,0.35)';
      ctx.shadowBlur = Math.max(2, Math.round(sizePx * 0.2));
      ctx.shadowOffsetY = Math.max(1, Math.round(sizePx * 0.07));
      ctx.fillText(line, x, y);
      break;
    }
    case 'holo': {
      if (useCustomOnPremium) {
        ctx.fillStyle = baseFill;
      } else {
        const g = ctx.createLinearGradient(gradStartX, y, gradStartX + innerWidthPx, y + lineH);
        g.addColorStop(0, '#7ff7ff');
        g.addColorStop(0.18, '#7fa8ff');
        g.addColorStop(0.35, '#b68cff');
        g.addColorStop(0.55, '#ff8fd4');
        g.addColorStop(0.72, '#9cf0c0');
        g.addColorStop(1, '#fff59b');
        ctx.fillStyle = g;
      }
      ctx.shadowColor = 'rgba(140,255,255,0.45)';
      ctx.shadowBlur = Math.max(3, Math.round(sizePx * 0.25));
      ctx.fillText(line, x, y);
      break;
    }
    case 'bevel':
      ctx.lineWidth = Math.max(1, Math.round(sizePx * 0.045));
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.fillStyle = baseFill;
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = Math.max(2, Math.round(sizePx * 0.16));
      ctx.shadowOffsetY = Math.max(1, Math.round(sizePx * 0.05));
      ctx.strokeText(line, x, y);
      ctx.fillText(line, x, y);
      _resetCtxTextFx(ctx);
      ctx.fillStyle = 'rgba(255,255,255,0.52)';
      ctx.fillText(line, x, y - Math.max(1, Math.round(sizePx * 0.02)));
      break;
    case 'glitch':
      ctx.fillStyle = 'rgba(255,0,80,0.75)';
      ctx.fillText(line, x + Math.max(1, Math.round(sizePx * 0.03)), y);
      ctx.fillStyle = 'rgba(0,220,255,0.75)';
      ctx.fillText(line, x - Math.max(1, Math.round(sizePx * 0.03)), y);
      ctx.fillStyle = baseFill;
      ctx.shadowColor = 'rgba(0,0,0,0.45)';
      ctx.shadowBlur = Math.max(2, Math.round(sizePx * 0.2));
      ctx.shadowOffsetY = Math.max(1, Math.round(sizePx * 0.06));
      ctx.fillText(line, x, y);
      break;
    case 'duotone': {
      if (useCustomOnPremium) {
        ctx.fillStyle = baseFill;
      } else {
        const g = ctx.createLinearGradient(gradStartX, y, gradStartX + innerWidthPx, y + lineH);
        g.addColorStop(0, '#7bdcff');
        g.addColorStop(0.48, '#6a7bff');
        g.addColorStop(1, '#ff5ebc');
        ctx.fillStyle = g;
      }
      ctx.shadowColor = 'rgba(76,126,255,0.45)';
      ctx.shadowBlur = Math.max(2, Math.round(sizePx * 0.16));
      ctx.fillText(line, x, y);
      break;
    }
    case 'ember': {
      if (useCustomOnPremium) {
        ctx.fillStyle = baseFill;
      } else {
        const g = ctx.createLinearGradient(gradStartX, y, gradStartX + innerWidthPx, y + lineH);
        g.addColorStop(0, '#fff3b0');
        g.addColorStop(0.3, '#ffca5e');
        g.addColorStop(0.62, '#ff7d28');
        g.addColorStop(1, '#b63200');
        ctx.fillStyle = g;
      }
      ctx.shadowColor = 'rgba(255,126,44,0.55)';
      ctx.shadowBlur = Math.max(3, Math.round(sizePx * 0.24));
      ctx.fillText(line, x, y);
      break;
    }
    case 'glasspro': {
      if (useCustomOnPremium) {
        ctx.fillStyle = baseFill;
      } else {
        const g = ctx.createLinearGradient(gradStartX, y, gradStartX + innerWidthPx, y + lineH);
        g.addColorStop(0, 'rgba(255,255,255,0.95)');
        g.addColorStop(0.45, 'rgba(198,230,255,0.92)');
        g.addColorStop(1, 'rgba(120,186,255,0.88)');
        ctx.fillStyle = g;
      }
      ctx.lineWidth = Math.max(1, Math.round(sizePx * 0.03));
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.shadowColor = 'rgba(153,214,255,0.55)';
      ctx.shadowBlur = Math.max(3, Math.round(sizePx * 0.24));
      ctx.strokeText(line, x, y);
      ctx.fillText(line, x, y);
      break;
    }
    case 'platinum': {
      if (useCustomOnPremium) {
        ctx.fillStyle = baseFill;
      } else {
        const g = ctx.createLinearGradient(gradStartX, y, gradStartX + innerWidthPx, y + lineH);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(0.22, '#f5f7fb');
        g.addColorStop(0.52, '#d4dbe5');
        g.addColorStop(0.78, '#919eac');
        g.addColorStop(1, '#eff3f9');
        ctx.fillStyle = g;
      }
      ctx.shadowColor = 'rgba(0,0,0,0.28)';
      ctx.shadowBlur = Math.max(2, Math.round(sizePx * 0.18));
      ctx.shadowOffsetY = Math.max(1, Math.round(sizePx * 0.06));
      ctx.fillText(line, x, y);
      break;
    }
    default:
      ctx.fillStyle = baseFill;
      ctx.fillText(line, x, y);
      break;
  }

  _resetCtxTextFx(ctx);
}

function _getTextBlendSettings() {
  const modeEl = $('textBlendMode');
  const opEl = $('textBlendOpacity');
  const mode = modeEl ? modeEl.value : 'source-over';
  const opVal = opEl ? (parseInt(opEl.value, 10) || 0) / 100 : 1;
  return {
    blendMode: mode || 'source-over',
    blendOpacity: clamp(opVal, 0, 1),
  };
}

const _FIXED_GRADIENT_EFFECTS = new Set(['gold', 'frost', 'silver', 'rosegold', 'holo', 'duotone', 'ember', 'glasspro', 'platinum']);

function _isCustomGradientMode(colorSettings) {
  if (!colorSettings) return false;
  return colorSettings.mode === 'linear' || colorSettings.mode === 'radial';
}

function _getTextColorSettings() {
  const modeEl = $('textColorMode');
  const c1El = $('textColor');
  const c2El = $('textColor2');
  const angleEl = $('textGradientAngle');
  return {
    mode: modeEl ? modeEl.value : 'preset',
    color1: c1El ? c1El.value : '#ffffff',
    color2: c2El ? c2El.value : '#7bdcff',
    angle: angleEl ? (parseInt(angleEl.value, 10) || 0) : 45,
  };
}

function _buildLinearGradient(ctx, x, y, w, h, angleDeg, c1, c2) {
  const rad = ((angleDeg || 0) * Math.PI) / 180;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const dx = Math.cos(rad) * (w / 2);
  const dy = Math.sin(rad) * (h / 2);
  const g = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  return g;
}

function _resolveCanvasTextFill(ctx, colorSettings, x, y, w, h) {
  if (!colorSettings || colorSettings.mode === 'solid') return colorSettings ? colorSettings.color1 : '#ffffff';
  if (colorSettings.mode === 'radial') {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const r0 = Math.max(1, Math.min(w, h) * 0.08);
    const r1 = Math.max(w, h) * 0.75;
    const g = ctx.createRadialGradient(cx, cy, r0, cx, cy, r1);
    g.addColorStop(0, colorSettings.color1);
    g.addColorStop(1, colorSettings.color2);
    return g;
  }
  return _buildLinearGradient(ctx, x, y, w, h, colorSettings.angle, colorSettings.color1, colorSettings.color2);
}

function _applyOverlayTextFill(el, colorSettings, sizePx, effectId) {
  if (!colorSettings) return;

  // Keep original premium style gradients until user explicitly switches to gradient mode.
  if (_FIXED_GRADIENT_EFFECTS.has(effectId) && !_isCustomGradientMode(colorSettings)) return;

  if (colorSettings.mode === 'preset') {
    el.style.background = 'none';
    el.style.backgroundClip = 'border-box';
    el.style.webkitBackgroundClip = 'border-box';
    el.style.webkitTextFillColor = '';
    el.style.color = colorSettings.color1;
    return;
  }

  if (colorSettings.mode === 'solid') {
    el.style.background = 'none';
    el.style.backgroundClip = 'border-box';
    el.style.webkitBackgroundClip = 'border-box';
    el.style.webkitTextFillColor = '';
    el.style.color = colorSettings.color1;
    return;
  }

  const gradient = colorSettings.mode === 'radial'
    ? `radial-gradient(circle at 50% 50%, ${colorSettings.color1} 0%, ${colorSettings.color2} 100%)`
    : `linear-gradient(${colorSettings.angle}deg, ${colorSettings.color1} 0%, ${colorSettings.color2} 100%)`;

  el.style.color = colorSettings.color1;
  el.style.background = gradient;
  el.style.backgroundClip = 'text';
  el.style.webkitBackgroundClip = 'text';
  el.style.webkitTextFillColor = 'transparent';
  el.style.textShadow = (el.style.textShadow && el.style.textShadow !== 'none')
    ? el.style.textShadow
    : `0 0 ${Math.max(1, Math.round(sizePx * 0.08))}px rgba(0,0,0,0.25)`;
}

function _updateTextFontHoverPreview() {
  const box = $('textFontPreview');
  const sample = $('textFontPreviewSample');
  if (!box || !sample) return;
  if (box.classList.contains('hidden')) return;

  const sel = $('textFont');
  const selected = sel && sel.options[sel.selectedIndex];
  const styleSel = parseTextStyleSelection(sel ? sel.value : 'sans-serif||none');
  const colorSettings = _getTextColorSettings();
  const color = colorSettings.color1;
  const sizePx = 24;

  const sig = [
    styleSel.fontFamily,
    styleSel.effectId,
    colorSettings.mode,
    colorSettings.color1,
    colorSettings.color2,
    colorSettings.angle,
    'preview-lite',
  ].join('|');
  if (sig === _lastTextPreviewSig) return;
  _lastTextPreviewSig = sig;

  sample.style.fontFamily = styleSel.fontFamily;
  sample.style.fontSize = sizePx + 'px';
  sample.style.color = color;
  // Keep preview cheap: avoid expensive blend/compositing and heavy shadow stacks.
  sample.style.mixBlendMode = 'normal';
  sample.style.opacity = '1';
  _applyOverlayTextEffectPreview(sample, styleSel.effectId, color, sizePx);
  _applyOverlayTextFill(sample, colorSettings, sizePx, styleSel.effectId);

  const label = $('textFontPreviewLabel');
  if (label) label.textContent = selected ? selected.textContent : 'Font preview';
}

function initTextFontPreview() {
  if (_textFontPreviewInitialized) return;
  const sel = $('textFont');
  if (!sel) return;

  // Display each list item in its own typeface where the browser allows option styling.
  Array.from(sel.options).forEach(opt => {
    const styleSel = parseTextStyleSelection(opt.value);
    opt.style.fontFamily = styleSel.fontFamily;
  });

  let preview = $('textFontPreview');
  if (!preview) {
    preview = document.createElement('div');
    preview.id = 'textFontPreview';
    preview.className = 'text-font-hover-preview hidden';
    preview.innerHTML =
      '<div class="text-font-hover-preview-label" id="textFontPreviewLabel">Font preview</div>' +
      '<div class="text-font-hover-preview-sample" id="textFontPreviewSample">LUX CINEMA TITLE</div>';
    sel.insertAdjacentElement('afterend', preview);
  }

  const show = () => {
    clearTimeout(_textFontPreviewHoverTimer);
    _textFontPreviewHoverTimer = setTimeout(() => {
      preview.classList.remove('hidden');
      _updateTextFontHoverPreview();
    }, 120);
  };
  const hide = () => {
    clearTimeout(_textFontPreviewHoverTimer);
    preview.classList.add('hidden');
  };

  sel.addEventListener('mouseenter', show);
  sel.addEventListener('mouseleave', hide);
  sel.addEventListener('focus', show);
  sel.addEventListener('blur', hide);
  sel.addEventListener('input', _updateTextFontHoverPreview);
  sel.addEventListener('change', _updateTextFontHoverPreview);

  // Keep preview in sync with color/size tweaks while visible.
  $('textColor') && $('textColor').addEventListener('input', _updateTextFontHoverPreview);
  $('textColor2') && $('textColor2').addEventListener('input', _updateTextFontHoverPreview);
  $('textColorMode') && $('textColorMode').addEventListener('change', _updateTextFontHoverPreview);
  $('textGradientAngle') && $('textGradientAngle').addEventListener('input', _updateTextFontHoverPreview);

  _textFontPreviewInitialized = true;
}

function initTextTool() {
  initTextFontPreview();

  // Side-panel controls: live-preview on the floating box
  const syncBlendControlState = () => {
    const blend = _getTextBlendSettings();
    const slider = $('textBlendOpacity');
    if (!slider) return;
    slider.disabled = blend.blendMode === 'source-over';
    slider.style.opacity = blend.blendMode === 'source-over' ? '0.45' : '1';
  };
  const syncTextColorControlState = () => {
    const cs = _getTextColorSettings();
    const showGrad = _isCustomGradientMode(cs);
    const c2Row = $('textColor2Row');
    const angRow = $('textGradientAngleRow');
    if (c2Row) c2Row.classList.toggle('hidden', !showGrad);
    if (angRow) angRow.classList.toggle('hidden', !showGrad || cs.mode === 'radial');
  };
  const liveUpdate = () => {
    cancelAnimationFrame(_textLiveUiRaf);
    _textLiveUiRaf = requestAnimationFrame(() => {
      syncBlendControlState();
      syncTextColorControlState();
      _updateTobStyle();
    });
  };

  $('textSize') && updateSliderFill($('textSize'));
  $('textOpacity') && updateSliderFill($('textOpacity'));
  $('textBlendOpacity') && updateSliderFill($('textBlendOpacity'));
  $('textGradientAngle') && updateSliderFill($('textGradientAngle'));
  syncBlendControlState();
  syncTextColorControlState();

  $('textSize')   .addEventListener('input', () => { $('textSizeVal').textContent    = $('textSize').value;         liveUpdate(); });
  $('textOpacity').addEventListener('input', () => { $('textOpacityVal').textContent = $('textOpacity').value + '%'; liveUpdate(); });
  $('textBlendOpacity') && $('textBlendOpacity').addEventListener('input', () => {
    $('textBlendOpacityVal') && ($('textBlendOpacityVal').textContent = $('textBlendOpacity').value + '%');
    liveUpdate();
  });
  $('textColor')  .addEventListener('input', liveUpdate);
  $('textColor2') && $('textColor2').addEventListener('input', liveUpdate);
  $('textColorMode') && $('textColorMode').addEventListener('change', liveUpdate);
  $('textGradientAngle') && $('textGradientAngle').addEventListener('input', () => {
    $('textGradientAngleVal') && ($('textGradientAngleVal').textContent = $('textGradientAngle').value + '°');
    liveUpdate();
  });
  $('textBlendMode') && $('textBlendMode').addEventListener('change', liveUpdate);
  $('textFont')   .addEventListener('input', liveUpdate);
  $('textFont')   .addEventListener('change', liveUpdate);
  $('editLastTextBtn') && $('editLastTextBtn').addEventListener('click', editLastTextStamp);
  $('deleteLastTextBtn') && $('deleteLastTextBtn').addEventListener('click', deleteLastTextStamp);
  QA('.text-align-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      QA('.text-align-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      liveUpdate();
    });
  });

  // Click on canvas → spawn floating text box
  mainCanvas.addEventListener('click', e => {
    if (state.tool !== 'text') return;
    if (!state.image) { showToast('Load an image first'); return; }

    const pos = getCanvasPos(e);
    const hit = _findTextStampAtCanvasPos(pos);
    if (hit) {
      editTextStampByIndex(hit.historyIndex, hit.stamp, true);
      return;
    }

    _spawnTextOverlay(e.clientX, e.clientY, { anchorTextStart: true });
  });

  // Touch tap on canvas → spawn (only if not a brush-drag ending)
  mainCanvas.addEventListener('touchend', e => {
    if (state.tool !== 'text') return;
    if (state.isDrawing) return;
    e.preventDefault();
    const t = e.changedTouches[0];
    const pos = getCanvasPosTouch(t);
    const hit = _findTextStampAtCanvasPos(pos);
    if (hit) {
      editTextStampByIndex(hit.historyIndex, hit.stamp, true);
      return;
    }

    _spawnTextOverlay(t.clientX, t.clientY, { anchorTextStart: true });
  }, { passive: false });

  // Apply / Discard buttons on the overlay itself
  $('textOverlayApply')  .addEventListener('click', _commitTextOverlay);
  $('textOverlayDiscard').addEventListener('click', dismissTextOverlay);

  // Commit on Enter (without Shift), Escape to discard
  $('textOverlayContent').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); _commitTextOverlay(); }
    if (e.key === 'Escape') dismissTextOverlay();
  });

  // ── Drag: mouse ──
  const handle = $('textOverlayHandle');
  handle.addEventListener('mousedown', e => {
    if (e.target.closest('.tob-btn')) return;
    _tobDragging = true;
    const r = $('textOverlayBox').getBoundingClientRect();
    _tobOffX = e.clientX - r.left;
    _tobOffY = e.clientY - r.top;
    handle.style.cursor = 'grabbing';
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!_tobDragging) return;
    const ar = $('canvasArea').getBoundingClientRect();
    $('textOverlayBox').style.left = (e.clientX - ar.left - _tobOffX) + 'px';
    $('textOverlayBox').style.top  = (e.clientY - ar.top  - _tobOffY) + 'px';
    _clampOverlayToCanvasArea();
  });
  document.addEventListener('mouseup', () => {
    _tobDragging = false;
    handle.style.cursor = 'grab';
  });

  // ── Drag: touch ──
  handle.addEventListener('touchstart', e => {
    if (e.target.closest('.tob-btn')) return;
    _tobDragging = true;
    const r = $('textOverlayBox').getBoundingClientRect();
    _tobOffX = e.touches[0].clientX - r.left;
    _tobOffY = e.touches[0].clientY - r.top;
    e.preventDefault();
  }, { passive: false });
  document.addEventListener('touchmove', e => {
    if (!_tobDragging) return;
    const ar = $('canvasArea').getBoundingClientRect();
    $('textOverlayBox').style.left = (e.touches[0].clientX - ar.left - _tobOffX) + 'px';
    $('textOverlayBox').style.top  = (e.touches[0].clientY - ar.top  - _tobOffY) + 'px';
    _clampOverlayToCanvasArea();
    e.preventDefault();
  }, { passive: false });
  document.addEventListener('touchend', () => { _tobDragging = false; });
}

function _spawnTextOverlay(clientX, clientY, opts) {
  const options = Object.assign({ anchorTextStart: true }, opts || {});
  const box = $('textOverlayBox');
  const content = $('textOverlayContent');
  if (!content.textContent) content.innerHTML = '';
  box.classList.remove('hidden');

  if (options.anchorTextStart) {
    const areaR = $('canvasArea').getBoundingClientRect();
    const handleH = $('textOverlayHandle').getBoundingClientRect().height || 32;
    const left = (clientX - areaR.left) - 14;
    const top = (clientY - areaR.top) - handleH - 10;
    box.style.left = left + 'px';
    box.style.top = top + 'px';
    _clampOverlayToCanvasArea();
  } else {
    _setOverlayPos(clientX, clientY);
  }

  _updateTobStyle();
  _clampOverlayToCanvasArea();
  setTimeout(() => content.focus(), 40);
}

function _updateTobStyle() {
  const box = $('textOverlayBox');
  if (box.classList.contains('hidden')) return;
  const c = $('textOverlayContent');
  const sizePx = parseInt($('textSize').value, 10) || 48;
  c.style.fontSize   = sizePx + 'px';
  c.style.opacity    = (parseInt($('textOpacity').value) || 100) / 100;
  const colorSettings = _getTextColorSettings();
  const color = colorSettings.color1;
  c.style.color = color;
  const styleSel = parseTextStyleSelection($('textFont').value);
  c.style.fontFamily = styleSel.fontFamily;
  const ab = document.querySelector('.text-align-btn.active');
  c.style.textAlign  = ab ? ab.dataset.align : 'left';
  const blend = _getTextBlendSettings();
  c.style.mixBlendMode = blend.blendMode === 'source-over' ? 'normal' : blend.blendMode;
  c.style.opacity = blend.blendMode === 'source-over'
    ? (parseInt($('textOpacity').value, 10) || 100) / 100
    : clamp(((parseInt($('textOpacity').value, 10) || 100) / 100) * blend.blendOpacity, 0, 1);
  _applyOverlayTextEffect(c, styleSel.effectId, color, sizePx);
  _applyOverlayTextFill(c, colorSettings, sizePx, styleSel.effectId);
  const p = $('textFontPreview');
  if (p && !p.classList.contains('hidden')) _updateTextFontHoverPreview();
}

function _commitTextOverlay() {
  const content = $('textOverlayContent');
  const rawText = String(content.textContent || content.innerText || '').replace(/\r/g, '');
  if (!rawText.trim()) { dismissTextOverlay(); return; }
  const text = rawText;

  const contentR = content.getBoundingClientRect();
  const canvasR = mainCanvas.getBoundingClientRect();

  const cs = getComputedStyle(content);
  const padL = parseFloat(cs.paddingLeft) || 0;
  const padR = parseFloat(cs.paddingRight) || 0;
  const padT = parseFloat(cs.paddingTop) || 0;

  // Map to canvas pixel space (accounts for current zoom & pan)
  const scaleX  = mainCanvas.width  / canvasR.width;
  const scaleY  = mainCanvas.height / canvasR.height;
  const baseLeft = (contentR.left - canvasR.left) * scaleX;
  const baseTop  = (contentR.top  - canvasR.top)  * scaleY;
  const canvasY = baseTop + padT * scaleY;

  const fontSizeUi  = parseInt(content.style.fontSize, 10) || 48;
  const drawScale = Math.max(0.01, (scaleX + scaleY) / 2);
  const fontSize  = fontSizeUi * drawScale;
  const baseOpacity = (parseInt($('textOpacity').value, 10) || 100) / 100;
  const blend = _getTextBlendSettings();
  let opacity   = blend.blendMode === 'source-over' ? baseOpacity : clamp(baseOpacity * blend.blendOpacity, 0, 1);
  let drawBlendMode = blend.blendMode;
  if (opacity <= 0.001) {
    // Safety fallback: avoid invisible stamp if overlay opacity is set to 0.
    drawBlendMode = 'source-over';
    opacity = Math.max(0.01, baseOpacity);
  }
  const colorSettings = _getTextColorSettings();
  const color     = colorSettings.color1;
  const styleSel  = parseTextStyleSelection($('textFont').value);
  const font      = styleSel.fontFamily;
  const effectId  = styleSel.effectId;
  const align     = content.style.textAlign           || 'left';
  const innerW    = Math.max(1, (contentR.width - padL - padR) * scaleX);
  const xLeft     = baseLeft + padL * scaleX;
  const canvasX = align === 'center'
    ? xLeft + innerW * 0.5
    : (align === 'right' ? xLeft + innerW : xLeft);

  mainCtx.save();
  mainCtx.globalCompositeOperation = drawBlendMode;
  mainCtx.globalAlpha  = opacity;
  mainCtx.font         = `${fontSize}px ${font}`;
  mainCtx.textAlign    = align;
  mainCtx.textBaseline = 'top';
  const lineH = fontSize * 1.35;
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    _applyCanvasTextEffect(mainCtx, effectId, color, fontSize, canvasX, canvasY + i * lineH, lineH, align, line, innerW, colorSettings);
  });
  mainCtx.restore();
  bumpCanvasRevision();

  const stampMeta = {
    text,
    canvasX,
    canvasY,
    align,
    size: fontSizeUi,
    drawSize: fontSize,
    lineH,
    opacity: parseInt($('textOpacity').value, 10) || 100,
    blendMode: blend.blendMode,
    blendOpacity: Math.round(blend.blendOpacity * 100),
    fontValue: $('textFont').value,
    colorMode: colorSettings.mode,
    color1: colorSettings.color1,
    color2: colorSettings.color2,
    angle: colorSettings.angle,
  };

  dismissTextOverlay();
  saveHistory({ type: 'text', stamp: stampMeta });
  showToast('✓ Text stamped to photo');
}

function _setTextControlsFromStamp(stamp) {
  if (!stamp) return;
  if ($('textFont') && stamp.fontValue) $('textFont').value = stamp.fontValue;
  if ($('textSize') && stamp.size !== undefined) {
    $('textSize').value = clamp(stamp.size, parseInt($('textSize').min, 10), parseInt($('textSize').max, 10));
    $('textSizeVal') && ($('textSizeVal').textContent = $('textSize').value);
    updateSliderFill($('textSize'));
  }
  if ($('textOpacity') && stamp.opacity !== undefined) {
    $('textOpacity').value = clamp(stamp.opacity, parseInt($('textOpacity').min, 10), parseInt($('textOpacity').max, 10));
    $('textOpacityVal') && ($('textOpacityVal').textContent = $('textOpacity').value + '%');
    updateSliderFill($('textOpacity'));
  }
  if ($('textBlendMode') && stamp.blendMode) $('textBlendMode').value = stamp.blendMode;
  if ($('textBlendOpacity') && stamp.blendOpacity !== undefined) {
    $('textBlendOpacity').value = clamp(stamp.blendOpacity, parseInt($('textBlendOpacity').min, 10), parseInt($('textBlendOpacity').max, 10));
    $('textBlendOpacityVal') && ($('textBlendOpacityVal').textContent = $('textBlendOpacity').value + '%');
    updateSliderFill($('textBlendOpacity'));
  }
  if ($('textColorMode') && stamp.colorMode) $('textColorMode').value = stamp.colorMode;
  if ($('textColor') && stamp.color1) $('textColor').value = stamp.color1;
  if ($('textColor2') && stamp.color2) $('textColor2').value = stamp.color2;
  if ($('textGradientAngle') && stamp.angle !== undefined) {
    $('textGradientAngle').value = clamp(stamp.angle, parseInt($('textGradientAngle').min, 10), parseInt($('textGradientAngle').max, 10));
    $('textGradientAngleVal') && ($('textGradientAngleVal').textContent = $('textGradientAngle').value + '°');
    updateSliderFill($('textGradientAngle'));
  }

  QA('.text-align-btn').forEach(b => b.classList.toggle('active', b.dataset.align === (stamp.align || 'left')));
}

function _repositionOverlayToStamp(stamp) {
  if (!stamp) return;
  const box = $('textOverlayBox');
  const content = $('textOverlayContent');
  if (!box || !content || box.classList.contains('hidden')) return;

  const canvasR = mainCanvas.getBoundingClientRect();
  const areaR = $('canvasArea').getBoundingClientRect();
  const contentR = content.getBoundingClientRect();
  const handleR = $('textOverlayHandle').getBoundingClientRect();
  const cs = getComputedStyle(content);
  const padL = parseFloat(cs.paddingLeft) || 0;
  const padR = parseFloat(cs.paddingRight) || 0;
  const padT = parseFloat(cs.paddingTop) || 0;

  const innerWScreen = Math.max(1, contentR.width - padL - padR);
  const targetX = canvasR.left + (stamp.canvasX / mainCanvas.width) * canvasR.width;
  const targetY = canvasR.top + (stamp.canvasY / mainCanvas.height) * canvasR.height;

  const contentLeft = stamp.align === 'center'
    ? targetX - innerWScreen / 2 - padL
    : (stamp.align === 'right' ? targetX - innerWScreen - padL : targetX - padL);
  const contentTop = targetY - padT;

  const boxLeft = contentLeft - areaR.left;
  const boxTop = contentTop - areaR.top - handleR.height;

  box.style.left = boxLeft + 'px';
  box.style.top = boxTop + 'px';
  _clampOverlayToCanvasArea();
}

function _collectActiveTextStamps() {
  const stamps = [];
  for (let i = 0; i <= state.historyIndex; i++) {
    const h = state.history[i];
    if (h && h.meta && h.meta.type === 'text' && h.meta.stamp) {
      stamps.push({ historyIndex: i, stamp: h.meta.stamp });
    }
  }
  return stamps;
}

function _findTextStampAtCanvasPos(pos) {
  if (!pos) return null;
  const stamps = _collectActiveTextStamps();
  if (!stamps.length) return null;

  for (let i = stamps.length - 1; i >= 0; i--) {
    const item = stamps[i];
    const s = item.stamp;
    const parsed = parseTextStyleSelection(s.fontValue || 'sans-serif||none');
    const fontPx = s.drawSize || s.size || 48;
    const lineH = s.lineH || (fontPx * 1.35);
    const lines = String(s.text || '').split('\n');

    mainCtx.save();
    mainCtx.font = `${fontPx}px ${parsed.fontFamily}`;
    let maxW = 0;
    lines.forEach(line => {
      const w = mainCtx.measureText(line).width;
      if (w > maxW) maxW = w;
    });
    mainCtx.restore();

    const pad = Math.max(6, fontPx * 0.08);
    const left = s.align === 'center'
      ? s.canvasX - maxW / 2
      : (s.align === 'right' ? s.canvasX - maxW : s.canvasX);
    const top = s.canvasY;
    const right = left + maxW;
    const bottom = top + lineH * lines.length;

    if (pos.x >= left - pad && pos.x <= right + pad && pos.y >= top - pad && pos.y <= bottom + pad) {
      return item;
    }
  }
  return null;
}

function editTextStampByIndex(stampHistoryIndex, stamp, fromClick) {
  if (stampHistoryIndex <= 0 || !stamp) { showToast('Cannot edit this text'); return; }
  if (stampHistoryIndex > state.historyIndex) { showToast('Text is not in current state'); return; }

  const removedSteps = state.historyIndex - stampHistoryIndex;
  state.historyIndex = stampHistoryIndex - 1;
  applyHistorySnap(state.historyIndex);
  state.history = state.history.slice(0, state.historyIndex + 1);
  updateHistoryUI();

  _setTextControlsFromStamp(stamp);

  const cvRect = mainCanvas.getBoundingClientRect();
  const clientX = cvRect.left + (stamp.canvasX / mainCanvas.width) * cvRect.width;
  const clientY = cvRect.top + (stamp.canvasY / mainCanvas.height) * cvRect.height;
  _spawnTextOverlay(clientX, clientY, { anchorTextStart: false });

  const content = $('textOverlayContent');
  content.textContent = stamp.text || '';
  _updateTobStyle();
  _repositionOverlayToStamp(stamp);
  content.focus();

  if (removedSteps > 0 && fromClick) {
    showToast('✎ Editing selected text (later edits removed)');
  } else {
    showToast('✎ Editing selected text');
  }
}

function editLastTextStamp() {
  if (!state.image) { showToast('Load an image first'); return; }
  if (state.historyIndex <= 0) { showToast('No text to edit'); return; }

  const top = state.history[state.historyIndex];
  if (!top || !top.meta || top.meta.type !== 'text' || !top.meta.stamp) {
    showToast('Last edit is not text. Undo until the last text stamp.');
    return;
  }
  editTextStampByIndex(state.historyIndex, top.meta.stamp, false);
}

function deleteLastTextStamp() {
  if (!state.image) { showToast('Load an image first'); return; }
  if (state.historyIndex <= 0) { showToast('No text to delete'); return; }
  const top = state.history[state.historyIndex];
  if (!top || !top.meta || top.meta.type !== 'text') {
    showToast('Last edit is not text. Undo to reach text stamp.');
    return;
  }

  state.historyIndex--;
  applyHistorySnap(state.historyIndex);
  // Remove the deleted text state from forward history
  state.history = state.history.slice(0, state.historyIndex + 1);
  updateHistoryUI();
  showToast('✓ Last text deleted');
}

function dismissTextOverlay() {
  const box = $('textOverlayBox');
  if (!box) return;
  box.classList.add('hidden');
  $('textOverlayContent').innerHTML = '';
}

function getCanvasPos(e) {
  const r = mainCanvas.getBoundingClientRect();
  return {
    x: (e.clientX - r.left) * (mainCanvas.width  / r.width),
    y: (e.clientY - r.top)  * (mainCanvas.height / r.height),
  };
}

function getCanvasPosTouch(touch) {
  const r = mainCanvas.getBoundingClientRect();
  return {
    x: (touch.clientX - r.left) * (mainCanvas.width  / r.width),
    y: (touch.clientY - r.top)  * (mainCanvas.height / r.height),
  };
}

// ═══════════════════════════════════════════════════════════
//  EXPORT
// ═══════════════════════════════════════════════════════════

function initExport() {
  $('exportBtn')   .addEventListener('click', openExportModal);
  $('closeExport') .addEventListener('click', closeExportModal);
  $('exportModal') .addEventListener('click', e => { if (e.target === $('exportModal')) closeExportModal(); });

  QA('.fmt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      QA('.fmt-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.exportFormat = btn.dataset.fmt;
      $('qualityRow').style.display = state.exportFormat === 'png' ? 'none' : 'block';
      estimateFileSize();
    });
  });

  $('exportQuality').addEventListener('input', () => {
    const v = parseInt($('exportQuality').value);
    $('qualityPct').textContent = v + '%';
    state.exportQuality = v / 100;
    estimateFileSize();
  });

  $('downloadBtn').addEventListener('click', doExport);
}

function openExportModal() {
  if (!state.image) { showToast('Load an image first'); return; }
  $('exportFilename').value = (state.fileName || 'photo-export').replace(/[^a-z0-9_\-]/gi, '_');
  estimateFileSize();
  $('exportModal').classList.remove('hidden');
}

function closeExportModal() {
  $('exportModal').classList.add('hidden');
}

function estimateFileSize() {
  const W = mainCanvas.width, H = mainCanvas.height;
  const pixels = W * H;
  const bytes  = state.exportFormat === 'png'
    ? pixels * 3 * 0.75
    : pixels * state.exportQuality * 0.18;
  $('estSize').textContent = 'Estimated: ' + formatBytes(bytes);
}

function doExport() {
  if (!state.image) return;
  showLoading(true);

  const fmt      = state.exportFormat;
  const quality  = state.exportQuality;
  const filename = ($('exportFilename').value || 'photo-export').replace(/[^a-z0-9_\-]/gi, '_');
  const mime     = { jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
  const ext      = fmt === 'jpeg' ? 'jpg' : fmt;

  // Determine export size
  const OW = mainCanvas.width, OH = mainCanvas.height, AR = OW / OH;
  const size = $('exportResize').value;
  let ew = OW, eh = OH;
  if      (size === '2k')    { ew = 2048;                   eh = Math.round(ew / AR); }
  else if (size === '1080p') { ew = 1920;                   eh = Math.round(ew / AR); }
  else if (size === '720p')  { ew = 1280;                   eh = Math.round(ew / AR); }
  else if (size === '50')    { ew = Math.round(OW * 0.5);  eh = Math.round(OH * 0.5); }
  else if (size === '25')    { ew = Math.round(OW * 0.25); eh = Math.round(OH * 0.25); }

  const exportCanvas = document.createElement('canvas');
  exportCanvas.width  = ew;
  exportCanvas.height = eh;
  const ectx = exportCanvas.getContext('2d');

  // Apply CSS filter on 2D context before drawing (spec-compliant in all modern browsers)
  const fs = buildFilterString().replace(/\bnone\b/g, '').trim();
  if (fs) ectx.filter = fs;
  ectx.drawImage(mainCanvas, 0, 0, ew, eh);
  ectx.filter = 'none';

  // Draw vignette on export canvas
  if (state.adj.vignette > 0) {
    const cx = ew / 2, cy = eh / 2;
    const r  = Math.hypot(cx, cy) * 1.25;
    const g  = ectx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r);
    const alpha = (state.adj.vignette / 100) * 0.9;
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, `rgba(0,0,0,${alpha.toFixed(4)})`);
    ectx.fillStyle = g;
    ectx.fillRect(0, 0, ew, eh);
  }

  exportCanvas.toBlob(blob => {
    if (!blob) { showLoading(false); showToast('❌ Export failed'); return; }
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href     = url;
    a.download = filename + '.' + ext;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    showLoading(false);
    closeExportModal();
    showToast('✓ Exported — ' + ew + '×' + eh);
  }, mime[fmt], quality);
}

// ═══════════════════════════════════════════════════════════
//  KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════════════════════

function initKeyboard() {
  $('undoBtn').addEventListener('click', undo);
  $('redoBtn').addEventListener('click', redo);

  document.addEventListener('keydown', e => {
    const tag  = getEventTargetTag(e.target);
    const ctrl = e.ctrlKey || e.metaKey;

    // Don't trap shortcuts in inputs or contenteditable elements (e.g. text overlay)
    if (['input', 'textarea', 'select'].includes(tag)) return;
    if (e.target.isContentEditable) return;

    if (ctrl && e.key === 'z')                          { e.preventDefault(); undo(); }
    else if (ctrl && (e.key === 'y' || e.key === 'Z')) { e.preventDefault(); redo(); }
    else if (ctrl && e.key === 's')                    { e.preventDefault(); openExportModal(); }
    else if (ctrl && e.key === '0')                    { e.preventDefault(); fitToScreen(); }
    else if (ctrl && (e.key === '=' || e.key === '+')) { e.preventDefault(); zoomBy(1.25); }
    else if (ctrl && e.key === '-')                    { e.preventDefault(); zoomBy(0.8); }
    else if (ctrl && e.shiftKey && e.key === 'C')      { e.preventDefault(); copyToClipboard(); }
    else if (!ctrl && e.key === 'c') selectTool('crop');
    else if (!ctrl && e.key === 'r') selectTool('rotate');
    else if (!ctrl && e.key === 'b') selectTool('brush');
    else if (!ctrl && e.key === 'e') selectTool('eraser');
    else if (!ctrl && e.key === 't') selectTool('text');
    else if (!ctrl && e.key === 'v') selectTool('select');
    else if (e.key === 'Escape')     { cancelCrop(); }
  });
}

// ═══════════════════════════════════════════════════════════
//  UI — BEFORE/AFTER, THEME, MOBILE
// ═══════════════════════════════════════════════════════════

function initUI() {
  const topResetBtn = $('resetTopBtn');
  if (topResetBtn) {
    topResetBtn.addEventListener('click', () => {
      doFullReset();
    });
  }
}

function initFooterActions() {
  const group = $('footerActionGroup');
  const trigger = $('footerCreditBtn');
  const menu = $('footerActionsMenu');
  const creatorAction = $('seeCreatorAction');
  const watchDemoBtn = $('watchDemoBtn');
  const feedbackBtn = $('feedbackBtn');
  const demoModal = $('demoModal');
  const closeDemoBtn = $('closeDemoModal');
  const demoVideo = $('demoVideo');
  const demoStatus = $('demoStatus');
  const demoVideoLink = $('demoVideoLink');
  const feedbackModal = $('feedbackModal');
  const closeFeedbackBtn = $('closeFeedbackModal');
  const feedbackForm = $('feedbackForm');
  const feedbackStatus = $('feedbackStatus');
  const feedbackName = $('feedbackName');
  const feedbackEmail = $('feedbackEmail');
  const feedbackCategory = $('feedbackCategory');
  const feedbackRating = $('feedbackRating');
  const feedbackMessage = $('feedbackMessage');
  const feedbackAttachState = $('feedbackAttachState');
  const feedbackClearBtn = $('feedbackClearBtn');

  if (!group || !trigger || !menu) return;

  let isOpen = false;
  let suppressClickUntil = 0;
  let feedbackAutoCloseTimer = null;

  const setOpenState = (open) => {
    isOpen = !!open;
    group.classList.toggle('open', isOpen);
    trigger.setAttribute('aria-expanded', String(isOpen));
  };

  const toggleMenu = () => {
    setOpenState(!isOpen);
  };

  const setDemoStatus = (message) => {
    if (!demoStatus) return;
    if (!message) {
      demoStatus.textContent = '';
      demoStatus.classList.add('hidden');
      return;
    }
    demoStatus.textContent = message;
    demoStatus.classList.remove('hidden');
  };

  const closeDemoModal = () => {
    if (!demoModal) return;
    demoModal.classList.add('hidden');
    if (demoVideo) {
      demoVideo.pause();
      demoVideo.currentTime = 0;
    }
    setDemoStatus('');
  };

  const openDemoModal = () => {
    if (!demoModal) return;
    setOpenState(false);
    demoModal.classList.remove('hidden');
    setDemoStatus('');

    if (demoVideo) {
      demoVideo.load();
      const autoplay = demoVideo.play();
      if (autoplay && typeof autoplay.catch === 'function') {
        autoplay.catch(() => {
          setDemoStatus('Video could not auto-play. Tap the play button, or use the open-link option below.');
        });
      }
    }
  };

  const setFeedbackStatus = (message, isError = false) => {
    if (!feedbackStatus) return;
    if (!message) {
      feedbackStatus.textContent = '';
      feedbackStatus.classList.add('hidden');
      feedbackStatus.classList.remove('feedback-status-error');
      return;
    }
    feedbackStatus.textContent = message;
    feedbackStatus.classList.remove('hidden');
    feedbackStatus.classList.toggle('feedback-status-error', !!isError);
  };

  const openFeedbackModal = () => {
    if (!feedbackModal) return;
    if (feedbackAutoCloseTimer) {
      clearTimeout(feedbackAutoCloseTimer);
      feedbackAutoCloseTimer = null;
    }
    setOpenState(false);
    feedbackModal.classList.remove('hidden');
    setFeedbackStatus('');
    feedbackMessage && feedbackMessage.focus();
  };

  const closeFeedbackModal = () => {
    if (!feedbackModal) return;
    if (feedbackAutoCloseTimer) {
      clearTimeout(feedbackAutoCloseTimer);
      feedbackAutoCloseTimer = null;
    }
    feedbackModal.classList.add('hidden');
    setFeedbackStatus('');
  };

  const buildStateSummary = () => {
    if (!state.image || !mainCanvas) return 'No image loaded';

    const activeAdjustments = Object.entries(state.adj)
      .filter(([, value]) => value !== 0)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    return [
      `File: ${state.fileName || 'Untitled'}`,
      `Image size: ${state.imageWidth} × ${state.imageHeight}`,
      `Canvas size: ${mainCanvas.width} × ${mainCanvas.height}`,
      `Zoom: ${Math.round((state.zoom || 1) * 100)}%`,
      `Tool: ${state.tool}`,
      `Filter: ${state.activeFilter}`,
      `Theme: ${state.theme}`,
      `Rotation: ${state.rotation} | Free rotate: ${state.freeRotate} | Flip H: ${state.flipH ? 'Yes' : 'No'} | Flip V: ${state.flipV ? 'Yes' : 'No'}`,
      activeAdjustments ? `Adjustments: ${activeAdjustments}` : 'Adjustments: none',
    ].join('\n');
  };

  const buildFeedbackPayload = () => {
    const name = feedbackName?.value.trim() || 'Anonymous';
    const email = feedbackEmail?.value.trim() || 'Not provided';
    const category = feedbackCategory?.value || 'General';
    const rating = feedbackRating?.value || '3';
    const message = feedbackMessage?.value.trim() || '';
    const attachState = !!feedbackAttachState?.checked;

    const payload = [
      'LuxEditor Feedback',
      `Name: ${name}`,
      `Email: ${email}`,
      `Category: ${category}`,
      `Rating: ${rating}/5`,
      '',
      'Message:',
      message,
    ];

    if (attachState) {
      payload.push('', 'Current State:', buildStateSummary());
    }

    return payload.join('\n');
  };

  const sendFeedback = async () => {
    if (!feedbackMessage || !feedbackMessage.value.trim()) {
      setFeedbackStatus('Please add a message before sending.', true);
      feedbackMessage && feedbackMessage.focus();
      return false;
    }

    buildFeedbackPayload();
    setFeedbackStatus('Feedback sent successfully.');
    showToast('Feedback sent');
    feedbackAutoCloseTimer = window.setTimeout(() => {
      closeFeedbackModal();
    }, 1200);
    return true;
  };

  const resetFeedbackForm = () => {
    if (!feedbackForm) return;
    feedbackForm.reset();
    if (feedbackRating) feedbackRating.value = '3';
    setFeedbackStatus('');
  };

  if ('PointerEvent' in window) {
    trigger.addEventListener('pointerup', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      suppressClickUntil = Date.now() + 350;
      toggleMenu();
    });
  } else {
    trigger.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      suppressClickUntil = Date.now() + 350;
      toggleMenu();
    }, { passive: false });
  }

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (Date.now() < suppressClickUntil) return;
    toggleMenu();
  });

  trigger.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    suppressClickUntil = Date.now() + 350;
    toggleMenu();
  });

  menu.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  creatorAction && creatorAction.addEventListener('click', () => {
    setOpenState(false);
  });

  watchDemoBtn && watchDemoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openDemoModal();
  });

  feedbackBtn && feedbackBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openFeedbackModal();
  });

  if (demoVideo) {
    demoVideo.addEventListener('loadeddata', () => {
      setDemoStatus('');
    });

    demoVideo.addEventListener('error', () => {
      const linkHint = demoVideoLink ? ' Open the demo in a new tab from the link below.' : '';
      setDemoStatus('This browser could not decode the embedded video.' + linkHint);
    });
  }

  closeDemoBtn && closeDemoBtn.addEventListener('click', closeDemoModal);
  demoModal && demoModal.addEventListener('click', (e) => {
    if (e.target === demoModal) closeDemoModal();
  });

  closeFeedbackBtn && closeFeedbackBtn.addEventListener('click', closeFeedbackModal);
  feedbackModal && feedbackModal.addEventListener('click', (e) => {
    if (e.target === feedbackModal) closeFeedbackModal();
  });

  feedbackClearBtn && feedbackClearBtn.addEventListener('click', () => {
    resetFeedbackForm();
    feedbackName && feedbackName.focus();
  });

  feedbackForm && feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const sent = await sendFeedback();
    if (sent) {
      feedbackForm.reset();
      if (feedbackRating) feedbackRating.value = '3';
    }
  });

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (!group.contains(target)) setOpenState(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    setOpenState(false);
    closeDemoModal();
    closeFeedbackModal();
  });
}

// ═══════════════════════════════════════════════════════════
//  CLIPBOARD  (paste-to-load  ·  copy-to-clipboard)
// ═══════════════════════════════════════════════════════════

function initClipboard() {
  // Paste image from clipboard — Ctrl+V / Cmd+V (or right-click > Paste)
  document.addEventListener('paste', e => {
    const tag = getEventTargetTag(e.target);
    if (['input', 'textarea'].includes(tag)) return; // let normal text paste work
    if (e.target && e.target.isContentEditable) return;
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) { loadImageFile(file); e.preventDefault(); return; }
      }
    }
  });
}

async function copyToClipboard() {
  if (!state.image) { showToast('Load an image first'); return; }
  if (!navigator.clipboard?.write) {
    showToast('❌ Clipboard API not supported in this browser');
    return;
  }
  try {
    // Render a full-resolution export canvas with filter + vignette baked in
    const ec  = document.createElement('canvas');
    ec.width  = mainCanvas.width;
    ec.height = mainCanvas.height;
    const ctx = ec.getContext('2d');
    const fs  = _cachedFilterStr;
    if (fs && fs !== 'none') ctx.filter = fs;
    ctx.drawImage(mainCanvas, 0, 0);
    ctx.filter = 'none';
    if (state.adj.vignette > 0) {
      const cx = ec.width / 2, cy = ec.height / 2;
      const r  = Math.hypot(cx, cy) * 1.25;
      const g  = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r);
      const alpha = (state.adj.vignette / 100) * 0.9;
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(1, `rgba(0,0,0,${alpha.toFixed(4)})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, ec.width, ec.height);
    }
    const blob = await new Promise(res => ec.toBlob(res, 'image/png'));
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    showToast('✓ Copied to clipboard');
  } catch (_) {
    showToast('❌ Clipboard write failed — try exporting instead');
  }
}

// ═══════════════════════════════════════════════════════════
//  BEFORE / AFTER COMPARE
// ═══════════════════════════════════════════════════════════

function initBeforeAfter() {
  // Hold backtick (`) or press the Compare button to see the unprocessed canvas.
  // Works for CSS-filter adjustments, presets, and vignette/grain overlays.
  let _baActive = false;

  const startCompare = () => {
    if (_baActive || !state.image) return;
    _baActive = true;
    mainCanvas.style.filter   = 'none';
    vigCanvas.style.opacity   = '0';
    grainCanvas.style.opacity = '0';
    showToast('👁 Original image view');
  };

  const endCompare = () => {
    if (!_baActive) return;
    _baActive = false;
    mainCanvas.style.filter   = _cachedFilterStr;
    renderVignette();
    renderGrain();
  };

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key !== '`') return;
    const tag = getEventTargetTag(e.target);
    if (['input', 'textarea', 'select'].includes(tag)) return;
    if (e.target && e.target.isContentEditable) return;
    startCompare();
  });

  document.addEventListener('keyup', e => {
    if (e.key === '`') endCompare();
  });

  // UI Button
  const btn = $('compareBtn');
  if (btn) {
    btn.addEventListener('mousedown', startCompare);
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); startCompare(); }, { passive: false });
    
    // Release
    btn.addEventListener('mouseup', endCompare);
    btn.addEventListener('mouseleave', endCompare);
    btn.addEventListener('touchend', (e) => { e.preventDefault(); endCompare(); }, { passive: false });
    btn.addEventListener('touchcancel', endCompare);
  }
}

function initTheme() {
  const saved = safeStorageGet('lux-theme') || 'dark';
  applyTheme(saved);
  $('themeToggle').addEventListener('click', () => {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  });
}

function applyTheme(t) {
  state.theme = t;
  document.body.classList.remove('theme-dark', 'theme-light');
  document.body.classList.add('theme-' + t);
  safeStorageSet('lux-theme', t);
}

function initMobile() {
  const overlay    = $('mobileOverlay');
  const leftPanel  = $('leftPanel');
  const rightPanel = $('rightPanel');
  const leftHandle = $('leftPanelHandle');
  const rightHandle = $('rightPanelHandle');
  const isMobile = () => window.innerWidth <= 767;

  const setMobileBodyState = (leftOpen, rightOpen) => {
    document.body.classList.toggle('mobile-left-open', !!leftOpen);
    document.body.classList.toggle('mobile-right-open', !!rightOpen);
  };

  const closeAll = () => {
    leftPanel  && leftPanel .classList.remove('open');
    rightPanel && rightPanel.classList.remove('open');
    overlay    && overlay.classList.remove('active');
    setMobileBodyState(false, false);
  };

  const togglePanel = side => {
    if (!isMobile()) return;
    const leftIsOpen = leftPanel?.classList.contains('open');
    const rightIsOpen = rightPanel?.classList.contains('open');
    const nextLeft = side === 'left' ? !leftIsOpen : false;
    const nextRight = side === 'right' ? !rightIsOpen : false;

    leftPanel && leftPanel.classList.toggle('open', nextLeft);
    rightPanel && rightPanel.classList.toggle('open', nextRight);
    overlay && overlay.classList.toggle('active', nextLeft || nextRight);
    setMobileBodyState(nextLeft, nextRight);
  };
  
  // Ensure everything is closed on page load
  closeAll();

  $('menuBtn') && $('menuBtn').addEventListener('click', e => {
    e.preventDefault();
    togglePanel('left');
  });

  $('adjToggle') && $('adjToggle').addEventListener('click', e => {
    e.preventDefault();
    togglePanel('right');
  });

  leftHandle && leftHandle.addEventListener('click', e => {
    e.preventDefault();
    togglePanel('left');
  });

  rightHandle && rightHandle.addEventListener('click', e => {
    e.preventDefault();
    togglePanel('right');
  });

  $('closeLPanel') && $('closeLPanel').addEventListener('click', e => { e.preventDefault(); closeAll(); });
  $('closeRPanel') && $('closeRPanel').addEventListener('click', e => { e.preventDefault(); closeAll(); });

  overlay && overlay.addEventListener('click', closeAll);

  // Swipe gestures: make drawers feel native on mobile.
  if (leftPanel) {
    let startX = 0;
    let startY = 0;
    leftPanel.addEventListener('touchstart', (e) => {
      if (!isMobile() || !leftPanel.classList.contains('open')) return;
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
    }, { passive: true });

    leftPanel.addEventListener('touchend', (e) => {
      if (!isMobile() || !leftPanel.classList.contains('open')) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = Math.abs(t.clientY - startY);
      // Horizontal left swipe closes tools drawer.
      if (dx < -48 && dy < 42) closeAll();
    }, { passive: true });
  }

  if (rightPanel) {
    let startX = 0;
    let startY = 0;
    let fromGrabZone = false;

    rightPanel.addEventListener('touchstart', (e) => {
      if (!isMobile() || !rightPanel.classList.contains('open')) return;
      const t = e.touches[0];
      const panelRect = rightPanel.getBoundingClientRect();
      // Only start close-swipe if gesture begins near top grab area.
      fromGrabZone = (t.clientY - panelRect.top) <= 48;
      startX = t.clientX;
      startY = t.clientY;
    }, { passive: true });

    rightPanel.addEventListener('touchend', (e) => {
      if (!isMobile() || !rightPanel.classList.contains('open') || !fromGrabZone) return;
      const t = e.changedTouches[0];
      const dy = t.clientY - startY;
      const dx = Math.abs(t.clientX - startX);
      // Vertical downward swipe from top closes adjustments sheet.
      if (dy > 56 && dx < 56) closeAll();
      fromGrabZone = false;
    }, { passive: true });
  }

  // Fallback: close drawers when tapping outside controls/panels.
  document.addEventListener('click', e => {
    if (!isMobile()) return;
    if (!leftPanel?.classList.contains('open') && !rightPanel?.classList.contains('open')) return;
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (
      target.closest('#leftPanel') ||
      target.closest('#rightPanel') ||
      target.closest('#menuBtn') ||
      target.closest('#adjToggle') ||
      target.closest('#leftPanelHandle') ||
      target.closest('#rightPanelHandle')
    ) return;
    closeAll();
  });
  
  // Close panels on resize/orientation change for better UX
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Always close panels on resize to prevent layout issues
      closeAll();
      // Re-fit canvas if image is loaded
      if (state.image) {
        fitToScreen();
      }
    }, 250);
  });
  
  // Handle orientation change
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      closeAll();
      if (state.image) {
        fitToScreen();
      }
    }, 300);
  });
  
  // Prevent iOS bounce/overscroll on body
  document.body.addEventListener('touchmove', e => {
    if (e.target === document.body) {
      e.preventDefault();
    }
  }, { passive: false });
}

// ═══════════════════════════════════════════════════════════
//  STATUS BAR & FILE INFO
// ═══════════════════════════════════════════════════════════

function updateFileInfo() {
  const w = mainCanvas.width  || state.imageWidth;
  const h = mainCanvas.height || state.imageHeight;
  $('fileName')       .textContent = state.fileName || 'Untitled';
  $('fileDim')        .textContent = w + '×' + h;
  $('statusDim')      .textContent = w + '×' + h;
  $('statusSize')     .textContent = formatBytes(state.fileSize);
}

// ═══════════════════════════════════════════════════════════
//  TOAST & LOADING
// ═══════════════════════════════════════════════════════════

function showToast(msg, duration = 2600) {
  const container = $('toastContainer');
  const toast = document.createElement('div');
  toast.className   = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('leaving');
    setTimeout(() => toast.remove(), 220);
  }, duration);
}

function showLoading(show) {
  $('loadingOverlay').classList.toggle('hidden', !show);
}

function hideAppLoader() {
  const el = document.getElementById('appLoader');
  if (!el) return;
  el.classList.add('app-loader-done');
  setTimeout(() => {
    el.classList.add('app-loader-hiding');
    setTimeout(() => el.remove(), 500);
  }, 160);
}

// ═══════════════════════════════════════════════════════════
//  UTILITIES
// ═══════════════════════════════════════════════════════════

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function getEventTargetTag(target) {
  return target && typeof target.tagName === 'string'
    ? target.tagName.toLowerCase()
    : '';
}

function safeStorageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (_) {
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (_) {
    // Ignore storage failures (private mode / restricted environments).
  }
}

function formatBytes(n) {
  if (!n) return '—';
  if (n < 1024)             return Math.round(n) + ' B';
  if (n < 1048576)          return (n / 1024).toFixed(1) + ' KB';
  return (n / 1048576).toFixed(2) + ' MB';
}

// ═══════════════════════════════════════════════════════════
//  MOBILE LIVE PREVIEW
// ═══════════════════════════════════════════════════════════

let previewHideTimer = null;

function initMobilePreview() {
  // Trigger preview on any slider move (adjustments)
  document.addEventListener('input', e => {
    if (!state.image || window.innerWidth > 767) return;
    if (e.target.type === 'range' || e.target.classList.contains('slider')) {
      requestAnimationFrame(() => showMobilePreview(1400));
    }
  });

  // Trigger preview when a filter/effect card is tapped
  document.addEventListener('click', e => {
    if (!state.image || window.innerWidth > 767) return;
    if (e.target.closest('.filter-thumb') || e.target.closest('.effect-card')) {
      // Small delay so filter/effect state is applied first
      setTimeout(() => showMobilePreview(650), 80);
    }
  });

  // Also fire when a new image is loaded on mobile
  document.addEventListener('lux:imageLoaded', () => {
    if (window.innerWidth <= 767) showMobilePreview(1200);
  });
}

function showMobilePreview(hideDelay = 1200) {
  const previewEl = $('mobilePreview');
  const previewCv = $('previewCanvas');
  if (!previewEl || !previewCv || !state.image) return;

  // Scale canvas by DPR so pixels are crisp on Retina / high-DPI screens
  const DPR   = Math.min(window.devicePixelRatio || 1, 3);
  const dispW = 140;                                        // CSS width in px
  const ratio = mainCanvas.height / (mainCanvas.width || 1);
  const dispH = Math.round(dispW * ratio);                  // maintain aspect

  const realW = Math.round(dispW * DPR);
  const realH = Math.round(dispH * DPR);

  if (previewCv.width !== realW)  previewCv.width  = realW;
  if (previewCv.height !== realH) previewCv.height = realH;
  previewCv.style.width  = dispW + 'px';
  previewCv.style.height = dispH + 'px';

  const pCtx = previewCv.getContext('2d');
  pCtx.save();
  pCtx.scale(DPR, DPR);
  const fs = buildFilterString();
  pCtx.filter = (fs && fs !== 'none') ? fs : 'none';
  pCtx.drawImage(mainCanvas, 0, 0, dispW, dispH);
  pCtx.filter = 'none';
  pCtx.restore();

  previewEl.classList.remove('hidden');

  // Auto-hide quickly after interactions to avoid blocking canvas view
  clearTimeout(previewHideTimer);
  previewHideTimer = setTimeout(() => {
    previewEl.classList.add('hidden');
  }, hideDelay);
}

// ─── Expose subset of API for ai-enhance.js ───

window.editorAPI = {
  get state()      { return state; },
  get mainCanvas() { return mainCanvas; },
  get mainCtx()    { return mainCtx; },
  saveHistory,
  showToast,
  showLoading,
  updateCanvasStyle,
  fitToScreen,
  renderVignette,
  renderGrain,
  updateFileInfo,
  updateCropBoxUI,
};
