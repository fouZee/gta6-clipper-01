// gta6-clipper-01 entry (Node 22, standard library only).
//
// The entry is the video itself: this program's only job is to hand the
// house the video's address. It reads VIDEO.json from the repository root,
// checks the address is a real YouTube video address (a Short, a watch page
// or a youtu.be link), and copies VIDEO.json to /output/VIDEO.json, where
// the gate reads it. A placeholder or a non-YouTube address is refused
// instead of being copied, so a bad VIDEO.json fails loudly here rather
// than silently at the gate. Nothing this program writes about the video
// is scored; the video's views decide the places.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const videoPath = join(BOT_DIR, 'VIDEO.json');
const parsed: unknown = JSON.parse(readFileSync(videoPath, 'utf8'));
if (typeof parsed !== 'object' || parsed === null || typeof (parsed as { url?: unknown }).url !== 'string') {
  console.error('VIDEO.json must hold {"url": "<youtube address>"}');
  process.exit(1);
}
const url = (parsed as { url: string }).url;
if (!/^https:\/\/(www\.)?(youtube\.com\/(shorts\/|watch\?v=)|youtu\.be\/)/.test(url)) {
  console.error(`VIDEO.json url is not a YouTube video address: ${url}`);
  process.exit(1);
}
mkdirSync(OUTPUT_DIR, { recursive: true });
copyFileSync(videoPath, join(OUTPUT_DIR, 'VIDEO.json'));
