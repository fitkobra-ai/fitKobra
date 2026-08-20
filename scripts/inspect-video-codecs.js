import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const ffprobePath = `C:\\Users\\sahil\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.1-full_build\\bin\\ffprobe.exe`;
const mediaDir = 'C:\\source\\repos\\Fitkobra\\public\\media';
const backupDir = 'C:\\source\\repos\\Fitkobra\\public\\media_backup';

const files = fs.readdirSync(mediaDir).filter(f => f.endsWith('.mp4'));

if (files.length > 0) {
  const sampleFile = files[0];
  const currentPath = path.join(mediaDir, sampleFile);
  const backupPath = path.join(backupDir, sampleFile);

  console.log(`--- Inspecting CURRENT file: ${sampleFile} ---`);
  try {
    const currentInfo = execSync(`"${ffprobePath}" -v error -select_streams v:0 -show_entries stream=codec_name,pix_fmt,r_frame_rate,bit_rate -of json "${currentPath}"`).toString();
    console.log('Current Video Info:', currentInfo);
  } catch (err) {
    console.error('Error probing current:', err.message);
  }

  if (fs.existsSync(backupPath)) {
    console.log(`\n--- Inspecting BACKUP file: ${sampleFile} ---`);
    try {
      const backupInfo = execSync(`"${ffprobePath}" -v error -select_streams v:0 -show_entries stream=codec_name,pix_fmt,r_frame_rate,bit_rate -of json "${backupPath}"`).toString();
      console.log('Backup Video Info:', backupInfo);
    } catch (err) {
      console.error('Error probing backup:', err.message);
    }
  }
}
