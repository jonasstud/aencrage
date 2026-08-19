/**
 * Calcule les peaks audio pour tous les fonds de type "son" qui n'ont pas encore
 * d'entrée dans lib/audio-peaks.json, puis met à jour ce fichier.
 *
 * Usage : npm run generate-peaks
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { AudioContext } from "node-web-audio-api";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const cacheFile = join(projectRoot, "lib/audio-peaks.json");
const publicDir = join(projectRoot, "public");
const NUM_BARS = 150; // doit correspondre à FondModal.tsx

// Charger le cache existant
let cache = {};
try {
  cache = JSON.parse(readFileSync(cacheFile, "utf8"));
} catch {
  // fichier absent ou vide, on repart de zéro
}

// Extraire les paires { id, audioSrc } depuis fondsThemes.ts
const themesContent = readFileSync(
  join(projectRoot, "lib/fondsThemes.ts"),
  "utf8"
);

const lines = themesContent.split("\n");
const audioFonds = [];
let lastId = null;

for (const line of lines) {
  const idMatch = line.match(/id:\s*"([^"]+)"/);
  if (idMatch) lastId = idMatch[1];

  const audioMatch = line.match(/audioSrc:\s*"([^"]+)"/);
  if (audioMatch && lastId) {
    audioFonds.push({ id: lastId, audioSrc: audioMatch[1] });
    lastId = null;
  }
}

if (audioFonds.length === 0) {
  console.log("Aucun fond audio trouvé dans fondsThemes.ts.");
  process.exit(0);
}

// Calculer les peaks manquants
let updated = false;

for (const { id, audioSrc } of audioFonds) {
  if (cache[id]) {
    console.log(`✓ ${id} — peaks déjà en cache`);
    continue;
  }

  const filePath = join(publicDir, audioSrc);
  console.log(`⟳ ${id} — calcul depuis ${filePath}...`);

  try {
    const fileBuffer = readFileSync(filePath);
    const arrayBuffer = fileBuffer.buffer.slice(
      fileBuffer.byteOffset,
      fileBuffer.byteOffset + fileBuffer.byteLength
    );

    const ctx = new AudioContext();
    const decoded = await ctx.decodeAudioData(arrayBuffer);
    await ctx.close();

    const data = decoded.getChannelData(0);
    const blockSize = Math.floor(data.length / NUM_BARS);
    const rawPeaks = [];

    for (let i = 0; i < NUM_BARS; i++) {
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum += data[i * blockSize + j] ** 2;
      }
      rawPeaks.push(Math.sqrt(sum / blockSize));
    }

    const maxVal = Math.max(...rawPeaks, 0.001);
    cache[id] = rawPeaks.map((p) => parseFloat(Math.max(0.04, p / maxVal).toFixed(4)));
    updated = true;
    console.log(`  ✓ peaks calculés (${NUM_BARS} barres)`);
  } catch (err) {
    console.error(`  ✗ Erreur pour ${id}:`, err.message);
  }
}

if (updated) {
  writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
  console.log(`\n✓ lib/audio-peaks.json mis à jour.`);
} else {
  console.log(`\nAucune mise à jour nécessaire.`);
}
