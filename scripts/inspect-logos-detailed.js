import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import sharp from 'sharp';
import { createWorker } from 'tesseract.js';

const mediaDir = 'C:\\source\\repos\\Fitkobra\\public\\media';
const ffmpegPath = 'C:\\Users\\sahil\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.1-full_build\\bin\\ffmpeg.exe';
const cropDir = 'C:\\source\\repos\\Fitkobra\\scratch_cropped';

if (!fs.existsSync(cropDir)) {
  fs.mkdirSync(cropDir, { recursive: true });
}

const videos = fs.readdirSync(mediaDir).filter(f => f.endsWith('.mp4'));

async function analyzeAll() {
  const worker = await createWorker('eng');
  const report = [];

  for (const [index, video] of videos.entries()) {
    const videoPath = path.join(mediaDir, video);
    
    // Extract 3 frame timestamps: 1s, 2s, 3s
    let detectedTexts = [];
    let isFitKobraConfirmed = false;

    for (let sec of [1, 2, 3]) {
      const frameTemp = path.join(cropDir, `temp_${index}_${sec}.jpg`);
      const cropTemp = path.join(cropDir, `crop_${index}_${sec}.jpg`);

      try {
        execSync(`"${ffmpegPath}" -ss 00:00:0${sec} -i "${videoPath}" -vframes 1 -q:v 2 "${frameTemp}" -y`, { stdio: 'ignore' });
        
        if (fs.existsSync(frameTemp)) {
          const metadata = await sharp(frameTemp).metadata();
          const w = metadata.width;
          const h = metadata.height;

          // Crop middle 60% width, top 20%-70% height where shirt is
          await sharp(frameTemp)
            .extract({
              left: Math.floor(w * 0.15),
              top: Math.floor(h * 0.1),
              width: Math.floor(w * 0.7),
              height: Math.floor(h * 0.6)
            })
            .grayscale()
            .normalize()
            .toFile(cropTemp);

          const { data: { text } } = await worker.recognize(cropTemp);
          const clean = text.replace(/\s+/g, ' ').trim();
          detectedTexts.push(clean);

          if (/fit\s*kobra/i.test(clean) || /kobra/i.test(clean) || /fitness.*wellness/i.test(clean)) {
            isFitKobraConfirmed = true;
          }
        }
      } catch (err) {
        // ignore individual frame error
      }
    }

    report.push({
      video,
      isFitKobraConfirmed,
      detectedTexts
    });

    console.log(`[${index + 1}/${videos.length}] ${video} => Confirmed: ${isFitKobraConfirmed ? 'YES' : 'NO'}`);
  }

  await worker.terminate();
  fs.writeFileSync('C:\\source\\repos\\Fitkobra\\video_logo_audit.json', JSON.stringify(report, null, 2));
  console.log('Detailed video logo audit complete!');
}

analyzeAll();
