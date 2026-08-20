import fs from 'fs';
import path from 'path';
import { createWorker } from 'tesseract.js';

const framesDir = 'C:\\source\\repos\\Fitkobra\\scratch_frames';

async function runOCR() {
  const worker = await createWorker('eng');
  const files = fs.readdirSync(framesDir).filter(f => f.endsWith('.jpg'));
  console.log(`Processing OCR for ${files.length} frames...`);

  const results = [];

  for (const file of files) {
    const filePath = path.join(framesDir, file);
    try {
      const { data: { text } } = await worker.recognize(filePath);
      const cleanText = text.replace(/\s+/g, ' ').trim();
      const hasFitKobra = /fit\s*kobra/i.test(cleanText);
      const hasKobra = /kobra/i.test(cleanText);
      
      results.push({
        file,
        hasFitKobra,
        hasKobra,
        detectedText: cleanText
      });
      console.log(`[${hasFitKobra ? 'VALID' : 'CHECK'}] ${file} => "${cleanText.substring(0, 60)}"`);
    } catch (e) {
      console.error(`Error on ${file}:`, e.message);
    }
  }

  await worker.terminate();

  fs.writeFileSync('C:\\source\\repos\\Fitkobra\\ocr_results.json', JSON.stringify(results, null, 2));
  console.log('OCR analysis complete. Saved to ocr_results.json.');
}

runOCR();
