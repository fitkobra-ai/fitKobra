import fs from 'fs';

const libraryPath = 'C:\\source\\repos\\Fitkobra\\src\\data\\videoLibrary.js';
let content = fs.readFileSync(libraryPath, 'utf8');

// Match videoUrl entries and add posterUrl
content = content.replace(/"videoUrl": "(\/media\/([^"]+)\.mp4)"/g, (match, fullUrl, fileName) => {
  return `"videoUrl": "${fullUrl}",\n    "posterUrl": "/media/thumbnails/${fileName}.webp"`;
});

fs.writeFileSync(libraryPath, content, 'utf8');
console.log('Successfully updated videoLibrary.js with posterUrl entries!');
