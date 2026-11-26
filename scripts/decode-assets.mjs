// Prebuild: renders the raster placeholder assets straight into public/:
//   public/media/og.png          (1200x630 — Open Graph / Twitter card)
//   public/apple-touch-icon.png   (180x180 — iOS home-screen icon)
//
// Pure Node (zlib + a hand-rolled PNG writer) — the repo is synced through
// a text-only API transport, so no binary files are committed. Real media
// always wins: existing files are never overwritten. To ship real assets,
// drop them into public/ and remove the matching .gitignore entries.
//
// Text content comes from src/data/site.ts (single source of truth);
// colours mirror tailwind.config.js.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// --- content (parsed from src/data/site.ts) -------------------------------
const site = readFileSync(join(root, 'src/data/site.ts'), 'utf8');
const name = site.match(/name:\s*'([^']+)'/)?.[1] ?? 'Alexander Mutsala Nzaywa';
const tagline = site.match(/tagline:\s*'([^']+)'/)?.[1] ?? 'Data engineer';
const role = tagline.split(' ').slice(0, 2).join(' ').toUpperCase();

// palette — keep in sync with tailwind.config.js
const INK = [215, 226, 234]; // #D7E2EA
const MUTED = [150, 161, 170];
const ACCENT = [243, 148, 25]; // #F39419
const BG = [12, 12, 12]; // #0C0C0C

// --- minimal PNG writer (8-bit RGB, non-interlaced) ------------------------
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
function writePng(dest, w, h, px) {
  const stride = w * 3;
  const raw = Buffer.alloc((stride + 1) * h);
  for (let y = 0; y < h; y += 1) {
    raw[y * (stride + 1)] = 0; // filter: none
    px.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour RGB
  writeFileSync(dest, Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]));
}

// --- tiny 5x7 bitmap font ---------------------------------------------------
const GLYPHS = {
  ' ': [0, 0, 0, 0, 0, 0, 0],
  A: [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  B: [0b11110, 0b10001, 0b10001, 0b11110, 0b10001, 0b10001, 0b11110],
  C: [0b01110, 0b10001, 0b10000, 0b10000, 0b10000, 0b10001, 0b01110],
  D: [0b11110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b11110],
  E: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
  F: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000],
  G: [0b01110, 0b10001, 0b10000, 0b10111, 0b10001, 0b10001, 0b01111],
  H: [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  I: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b11111],
  J: [0b00111, 0b00010, 0b00010, 0b00010, 0b00010, 0b10010, 0b01100],
  K: [0b10001, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010, 0b10001],
  L: [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
  M: [0b10001, 0b11011, 0b10101, 0b10101, 0b10001, 0b10001, 0b10001],
  N: [0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001, 0b10001],
  O: [0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  P: [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000],
  Q: [0b01110, 0b10001, 0b10001, 0b10001, 0b10101, 0b10010, 0b01101],
  R: [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001],
  S: [0b01111, 0b10000, 0b10000, 0b01110, 0b00001, 0b00001, 0b11110],
  T: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
  U: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  V: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01010, 0b00100],
  W: [0b10001, 0b11011, 0b10101, 0b10101, 0b10101, 0b10101, 0b01010],
  X: [0b10001, 0b10001, 0b01010, 0b00100, 0b01010, 0b10001, 0b10001],
  Y: [0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100, 0b00100],
  Z: [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b10000, 0b11111],
  '-': [0, 0, 0, 0b11111, 0, 0, 0],
  '.': [0, 0, 0, 0, 0, 0b00110, 0b00110],
};

function canvas(w, h) {
  return { w, h, px: Buffer.alloc(w * h * 3) };
}
function fillRect(c, x0, y0, w, h, [r, g, b]) {
  for (let y = y0; y < y0 + h; y += 1) {
    for (let x = x0; x < x0 + w; x += 1) {
      const i = (y * c.w + x) * 3;
      c.px[i] = r;
      c.px[i + 1] = g;
      c.px[i + 2] = b;
    }
  }
}
function gradient(c, top, bottom) {
  for (let y = 0; y < c.h; y += 1) {
    const t = y / (c.h - 1);
    const col = [0, 1, 2].map((i) => Math.round(top[i] + (bottom[i] - top[i]) * t));
    fillRect(c, 0, y, c.w, 1, col);
  }
}
function textWidth(text, scale) {
  const chars = text.toUpperCase().split('').filter((ch) => GLYPHS[ch] !== undefined);
  return Math.max(chars.length * 7 * scale - 2 * scale, 0);
}
function drawText(c, text, centerX, y0, scale, color) {
  const chars = text.toUpperCase().split('').filter((ch) => GLYPHS[ch] !== undefined);
  let x = Math.round(centerX - textWidth(text, scale) / 2);
  for (const ch of chars) {
    const rows = GLYPHS[ch];
    for (let r = 0; r < 7; r += 1) {
      for (let col = 0; col < 5; col += 1) {
        if ((rows[r] >> (4 - col)) & 1) {
          fillRect(c, x + col * scale, y0 + r * scale, scale, scale, color);
        }
      }
    }
    x += 7 * scale;
  }
}

// --- og.png: 1200x630 card --------------------------------------------------
function renderOg() {
  const c = canvas(1200, 630);
  gradient(c, [20, 21, 24], BG);
  const frame = [38, 39, 43];
  fillRect(c, 0, 0, 1200, 2, frame);
  fillRect(c, 0, 628, 1200, 2, frame);
  fillRect(c, 0, 0, 2, 630, frame);
  fillRect(c, 1198, 0, 2, 630, frame);
  drawText(c, name.toUpperCase(), 600, 234, 6, INK);
  fillRect(c, 480, 330, 240, 8, ACCENT);
  drawText(c, role, 600, 372, 6, MUTED);
  return c;
}

// --- apple-touch-icon.png: 180x180 monogram --------------------------------
function renderApple() {
  const c = canvas(180, 180);
  fillRect(c, 0, 0, 180, 180, BG);
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join('');
  drawText(c, initials, 90, 52, 10, INK);
  fillRect(c, 70, 138, 40, 6, ACCENT);
  return c;
}

for (const [dest, c] of [
  ['public/media/og.png', renderOg()],
  ['public/apple-touch-icon.png', renderApple()],
]) {
  const file = join(root, dest);
  if (existsSync(file)) {
    console.log(`${dest} exists — keeping it`);
  } else {
    writePng(file, c.w, c.h, c.px);
    console.log(`generated ${dest} (${c.w}x${c.h})`);
  }
}
