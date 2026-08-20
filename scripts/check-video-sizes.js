import fs from 'fs';
import path from 'path';

const mediaDir = 'C:\\source\\repos\\Fitkobra\\public\\media';
const files = fs.readdirSync(mediaDir).filter(f => f.endsWith('.mp4'));

let totalSize = 0;
const fileStats = files.map(file => {
  const filePath = path.join(mediaDir, file);
  const stat = fs.statSync(filePath);
  const sizeMB = (stat.size / (1024 * 1024)).toFixed(2);
  totalSize += stat.size;
  return { file, sizeMB: parseFloat(sizeMB) };
});

fileStats.sort((a, b) => b.sizeMB - a.sizeMB);

console.log(`Total MP4 files: ${files.length}`);
console.log(`Total Size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
console.log('Top 10 largest files:');
console.table(fileStats.slice(0, 10));
