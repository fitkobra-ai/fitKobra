import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const ffmpegPath = `C:\\Users\\sahil\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.1-full_build\\bin\\ffmpeg.exe`;
const mediaDir = 'C:\\source\\repos\\Fitkobra\\public\\media';
const backupDir = 'C:\\source\\repos\\Fitkobra\\public\\media_backup';

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const files = fs.readdirSync(mediaDir).filter(f => f.endsWith('.mp4'));

console.log(`Starting video optimization for ${files.length} videos...`);

let totalOldSize = 0;
let totalNewSize = 0;

files.forEach((file, index) => {
  const srcPath = path.join(mediaDir, file);
  const backupPath = path.join(backupDir, file);
  const tempPath = path.join(mediaDir, `temp_${file}`);

  const oldSize = fs.statSync(srcPath).size;
  totalOldSize += oldSize;

  // Move original to backup if not backed up yet
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(srcPath, backupPath);
  }

  // FFmpeg command: H.264, CRF 25, 720p scaling, -movflags +faststart, -an (no audio)
  const cmd = `"${ffmpegPath}" -y -i "${srcPath}" -c:v libx264 -crf 25 -preset fast -vf "scale='min(720,iw)':-2" -movflags +faststart -an "${tempPath}"`;

  try {
    execSync(cmd, { stdio: 'pipe' });
    const newSize = fs.statSync(tempPath).size;
    totalNewSize += newSize;

    // Replace original with optimized version
    fs.renameSync(tempPath, srcPath);

    const oldMB = (oldSize / (1024 * 1024)).toFixed(2);
    const newMB = (newSize / (1024 * 1024)).toFixed(2);
    const reduction = (((oldSize - newSize) / oldSize) * 100).toFixed(1);

    console.log(`[${index + 1}/${files.length}] Optimized ${file}: ${oldMB} MB -> ${newMB} MB (-${reduction}%)`);
  } catch (err) {
    console.error(`Failed to optimize ${file}:`, err.message);
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  }
});

console.log(`\n========================================`);
console.log(`Optimization Complete!`);
console.log(`Original Total: ${(totalOldSize / (1024 * 1024)).toFixed(2)} MB`);
console.log(`Optimized Total: ${(totalNewSize / (1024 * 1024)).toFixed(2)} MB`);
console.log(`Overall Savings: ${(((totalOldSize - totalNewSize) / totalOldSize) * 100).toFixed(1)}% reduction!`);
console.log(`========================================\n`);
