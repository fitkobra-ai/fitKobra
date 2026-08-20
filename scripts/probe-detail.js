import { execSync } from 'child_process';

const ffprobePath = `C:\\Users\\sahil\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.1-full_build\\bin\\ffprobe.exe`;
const sampleFile = `C:\\source\\repos\\Fitkobra\\public\\media_backup\\video_18_Woman_performing_cable_crossovers_1080p_202608111900.mp4`;

console.log('--- Probing Backup Video Detail ---');
try {
  const jsonOutput = execSync(`"${ffprobePath}" -v error -show_format -show_streams -of json "${sampleFile}"`).toString();
  console.log(jsonOutput);
} catch (err) {
  console.error('Error:', err.message);
}
