import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const cropDir = 'C:\\source\\repos\\Fitkobra\\scratch_cropped';
const mediaDir = 'C:\\source\\repos\\Fitkobra\\public\\media';

const files = fs.readdirSync(mediaDir).filter(f => f.endsWith('.mp4'));

async function analyzeColors() {
  const colorData = [];

  for (let file of files) {
    const frameFile = path.join(cropDir, `temp_${files.indexOf(file)}_1.jpg`);
    if (fs.existsSync(frameFile)) {
      const { data, info } = await sharp(frameFile)
        .raw()
        .toBuffer({ resolveWithObject: true });

      let rSum = 0, gSum = 0, bSum = 0, count = 0;
      let yellowPixels = 0;

      for (let i = 0; i < data.length; i += info.channels) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        rSum += r;
        gSum += g;
        bSum += b;

        // Yellow detection: R > 150, G > 150, B < 120
        if (r > 140 && g > 130 && b < 110) {
          yellowPixels++;
        }
      }

      const total = info.width * info.height;
      const yellowRatio = (yellowPixels / total) * 100;

      colorData.push({
        file,
        yellowRatio: yellowRatio.toFixed(1),
        avgRGB: `${Math.round(rSum / total)}, ${Math.round(gSum / total)}, ${Math.round(bSum / total)}`
      });
    }
  }

  fs.writeFileSync('C:\\source\\repos\\Fitkobra\\color_audit.json', JSON.stringify(colorData, null, 2));
  console.log('Color audit complete.');
}

analyzeColors();
