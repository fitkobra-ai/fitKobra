import { execSync } from 'child_process';
import fs from 'fs';

const ffmpegPath = `C:\\Users\\sahil\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.1-full_build\\bin\\ffmpeg.exe`;
const inputFile = `C:\\source\\repos\\Fitkobra\\public\\media_backup\\video_18_Woman_performing_cable_crossovers_1080p_202608111900.mp4`;
const outputFile = `C:\\source\\repos\\Fitkobra\\public\\media\\video_18_Woman_performing_cable_crossovers_1080p_202608111900.mp4`;

console.log('Optimizing sample video with forced keyframe GOP and audio strip...');
// CRF 18 is visually transparent / broadcast quality.
// -g 24 forces a keyframe every 1 second (at 24fps)
// -an removes audio stream to eliminate audio clock sync frame drops in HTML5 video
const cmd = `"${ffmpegPath}" -y -i "${inputFile}" -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p -g 24 -keyint_min 24 -an -movflags +faststart "${outputFile}"`;

execSync(cmd, { stdio: 'inherit' });
console.log('Sample video optimized successfully!');
