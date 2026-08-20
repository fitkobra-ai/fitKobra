import fs from 'fs';
import path from 'path';

const mediaDir = 'C:\\source\\repos\\Fitkobra\\public\\media';
const htmlPath = 'C:\\source\\repos\\Fitkobra\\public\\frame_grid.html';

const files = fs.readdirSync(mediaDir).filter(f => f.endsWith('.mp4'));

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>FitKobra Video Frame Audit Grid</title>
  <style>
    body { font-family: sans-serif; background: #080B11; color: #fff; padding: 20px; }
    h1 { color: #00FF75; font-size: 24px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
    .card { background: #121826; border-radius: 12px; padding: 10px; border: 1px solid #333; }
    img { width: 100%; height: 160px; object-fit: cover; border-radius: 8px; }
    .title { font-size: 11px; font-weight: bold; margin-top: 6px; color: #00E5FF; word-break: break-all; }
  </style>
</head>
<body>
  <h1>FitKobra Video Frame Audit Grid (${files.length} Videos)</h1>
  <div class="grid">
    ${files.map((f, i) => `
      <div class="card">
        <img src="/scratch_frames/${f}.jpg" />
        <div class="title">#${i + 1}: ${f}</div>
      </div>
    `).join('')}
  </div>
</body>
</html>
`;

fs.writeFileSync(htmlPath, htmlContent);
console.log(`Generated ${htmlPath}`);
