import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { createWorker } from 'tesseract.js';

const mediaDir = 'C:\\source\\repos\\Fitkobra\\public\\media';
const framesDir = 'C:\\source\\repos\\Fitkobra\\public\\scratch_frames';

const files = fs.readdirSync(mediaDir).filter(f => f.endsWith('.mp4'));

async function verifyAll() {
  const worker = await createWorker('eng');
  const auditReport = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const framePath = path.join(framesDir, `${file}.jpg`);

    if (!fs.existsSync(framePath)) {
      auditReport.push({ index: i + 1, file, valid: false, reason: 'No frame extracted' });
      continue;
    }

    // 1. Get image metadata first
    const image = sharp(framePath);
    const metadata = await image.metadata();
    const w = metadata.width || 600;
    const h = metadata.height || 600;

    const { data } = await sharp(framePath)
      .extract({ left: Math.floor(w * 0.2), top: 0, width: Math.floor(w * 0.6), height: Math.floor(h * 0.6) })
      .raw()
      .toBuffer({ resolveWithObject: true });

    let yellowCount = 0;
    for (let j = 0; j < data.length; j += 3) {
      const r = data[j];
      const g = data[j + 1];
      const b = data[j + 2];
      if (r > 130 && g > 120 && b < 110 && (r - b) > 30 && (g - b) > 30) {
        yellowCount++;
      }
    }
    const totalPixels = w * h * 0.36;
    const yellowRatio = (yellowCount / totalPixels) * 100;

    // 2. OCR check
    const cropTemp = path.join(framesDir, `temp_crop_${i}.jpg`);
    await sharp(framePath)
      .extract({ left: Math.floor(w * 0.2), top: Math.floor(h * 0.1), width: Math.floor(w * 0.6), height: Math.floor(h * 0.5) })
      .grayscale()
      .normalize()
      .toFile(cropTemp);


    const { data: { text } } = await worker.recognize(cropTemp);
    const cleanText = text.replace(/\s+/g, ' ').trim();

    if (fs.existsSync(cropTemp)) fs.unlinkSync(cropTemp);

    const hasYellowShirt = yellowRatio > 1.5;
    const mentionsFitKobra = /fit\s*kobra/i.test(cleanText) || /kobra/i.test(cleanText) || /wellness/i.test(cleanText) || /fitness/i.test(cleanText);

    auditReport.push({
      index: i + 1,
      file,
      yellowRatio: yellowRatio.toFixed(2) + '%',
      hasYellowShirt,
      mentionsFitKobra,
      textSnippet: cleanText.substring(0, 50),
      isCompliant: hasYellowShirt // The official FitKobra videos feature the yellow tank top
    });

    console.log(`[${i + 1}/${files.length}] ${file} | Yellow: ${yellowRatio.toFixed(1)}% | Text: "${cleanText.substring(0, 30)}" => ${hasYellowShirt ? 'VALID' : 'REMOVE'}`);
  }

  await worker.terminate();

  fs.writeFileSync('C:\\source\\repos\\Fitkobra\\final_video_audit.json', JSON.stringify(auditReport, null, 2));
  console.log('Final video audit complete!');
}

verifyAll();
