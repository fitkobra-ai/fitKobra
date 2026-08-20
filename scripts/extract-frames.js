import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const mediaDir = 'C:\\source\\repos\\Fitkobra\\public\\media';
const framesDir = 'C:\\source\\repos\\Fitkobra\\scratch_frames';
const ffmpegPath = 'C:\\Users\\sahil\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.1-full_build\\bin\\ffmpeg.exe';

if (!fs.existsSync(framesDir)) {
  fs.mkdirSync(framesDir, { recursive: true });
}

const files = fs.readdirSync(mediaDir).filter(f => f.endsWith('.mp4'));
console.log(`Extracting frame 1s from ${files.length} video files...`);

files.forEach((file, i) => {
  const videoPath = path.join(mediaDir, file);
  const framePath = path.join(framesDir, `${file}.jpg`);
  
  if (!fs.existsSync(framePath)) {
    try {
      execSync(`"${ffmpegPath}" -ss 00:00:01 -i "${videoPath}" -vframes 1 -q:v 2 "${framePath}" -y`, { stdio: 'ignore' });
    } catch (e) {
      console.error(`Error processing ${file}:`, e.message);
    }
  }
});

console.log('Frame extraction complete.');
