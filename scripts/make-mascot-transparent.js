import sharp from 'sharp';
import fs from 'fs';

const inputPath = 'C:\\source\\repos\\Fitkobra\\public\\media\\cute-cobra-mascot.png';
const outputPath = 'C:\\source\\repos\\Fitkobra\\public\\media\\cute-cobra-mascot-transparent.png';

async function processImage() {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixelData = new Uint8ClampedArray(data.buffer);

  for (let i = 0; i < pixelData.length; i += 4) {
    const r = pixelData[i];
    const g = pixelData[i + 1];
    const b = pixelData[i + 2];

    // If pixel is near pure black (shadow/background), fade out alpha
    const brightness = (r + g + b) / 3;
    if (brightness < 20) {
      pixelData[i + 3] = 0; // Fully transparent
    } else if (brightness < 45) {
      // Smooth alpha edge transition
      pixelData[i + 3] = Math.floor(((brightness - 20) / 25) * 255);
    }
  }

  await sharp(pixelData, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  })
  .png()
  .toFile(outputPath);

  console.log(`Saved transparent mascot to ${outputPath}`);
}

processImage();
