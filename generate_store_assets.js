import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = '/home/ubuntu/.gemini/antigravity/brain/6b7c88c3-b30e-4dc5-9cbe-78e6e96b5e27';
const EMBLEM_PATH = '/home/ubuntu/.gemini/antigravity/scratch/github_repos/KinexFit/assets/images/fitkobra-icon-emblem.png';
const AVATAR_PATH = '/home/ubuntu/.gemini/antigravity/brain/6b7c88c3-b30e-4dc5-9cbe-78e6e96b5e27/coach_avatar_headshot.png';

function escapeXml(unsafe) {
  return String(unsafe).replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

async function getEmblemBase64() {
  const emblemBuffer = await fs.promises.readFile(EMBLEM_PATH);
  return `data:image/png;base64,${emblemBuffer.toString('base64')}`;
}

async function getAvatarBase64() {
  const avatarBuffer = await fs.promises.readFile(AVATAR_PATH);
  return `data:image/png;base64,${avatarBuffer.toString('base64')}`;
}

// BOTTOM TAB BAR HELPER
function renderBottomTabBar(x, y, w, h, activeIndex = 0) {
  const barH = 110;
  const barY = y + h - barH;
  const tabs = [
    { label: 'Home', icon: '🏠' },
    { label: 'Workouts', icon: '💪' },
    { label: 'AI Coach', icon: '🤖' },
    { label: 'Scan', icon: '📸' },
    { label: 'Profile', icon: '👤' },
  ];
  const tabW = w / tabs.length;

  return `
    <g transform="translate(${x}, ${barY})">
      <rect width="${w}" height="${barH}" fill="#080C14" stroke="#1E2D4A" stroke-width="1.5"/>
      ${tabs.map((tab, i) => {
        const isActive = i === activeIndex;
        const tx = i * tabW + tabW / 2;
        return `
          <g transform="translate(${tx}, 40)">
            <text x="0" y="0" text-anchor="middle" font-size="28">${tab.icon}</text>
            <text x="0" y="32" text-anchor="middle" fill="${isActive ? '#00FF75' : '#64748B'}" font-family="system-ui, sans-serif" font-weight="${isActive ? '800' : '600'}" font-size="16">${tab.label}</text>
          </g>
        `;
      }).join('')}
    </g>
  `;
}

// PHONE SCREENSHOT HELPER (1080 x 2400)
async function generatePhoneScreenshot(filename, title, subtitle, renderPhoneContent, emblemBase64) {
  const width = 1080;
  const height = 2400;

  const phoneW = 880;
  const phoneH = 1800;
  const phoneX = (width - phoneW) / 2;
  const phoneY = 440;

  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#060911" />
        <stop offset="35%" stop-color="#0B132B" />
        <stop offset="100%" stop-color="#05080E" />
      </linearGradient>
      <radialGradient id="topGlow" cx="50%" cy="12%" r="45%">
        <stop offset="0%" stop-color="#00FF75" stop-opacity="0.25" />
        <stop offset="100%" stop-color="#00FF75" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="neonText" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#00FF75" />
        <stop offset="100%" stop-color="#00D2FF" />
      </linearGradient>
      <filter id="phoneShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="24" stdDeviation="30" flood-color="#000000" flood-opacity="0.85"/>
      </filter>
      <clipPath id="screenClip">
        <rect x="${phoneX + 16}" y="${phoneY + 16}" width="${phoneW - 32}" height="${phoneH - 32}" rx="48" />
      </clipPath>
      <clipPath id="avatarClip">
        <circle cx="55" cy="55" r="50" />
      </clipPath>
    </defs>

    <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
    <rect width="${width}" height="${height}" fill="url(#topGlow)"/>

    <!-- Top Badge -->
    <g transform="translate(${width / 2}, 110)" text-anchor="middle">
      <image href="${emblemBase64}" x="-35" y="0" width="70" height="70"/>
      <text x="0" y="98" fill="#94A3B8" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="20" letter-spacing="4">FITKOBRA AI</text>
    </g>

    <!-- Headline and Subtitle -->
    <g transform="translate(${width / 2}, 265)" text-anchor="middle">
      <text x="0" y="0" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="52" letter-spacing="1">${escapeXml(title)}</text>
      <text x="0" y="55" fill="url(#neonText)" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="25" letter-spacing="1">${escapeXml(subtitle)}</text>
    </g>

    <g filter="url(#phoneShadow)">
      <rect x="${phoneX}" y="${phoneY}" width="${phoneW}" height="${phoneH}" rx="60" fill="#151D2A" stroke="#2A3950" stroke-width="6"/>
      <rect x="${phoneX + 10}" y="${phoneY + 10}" width="${phoneW - 20}" height="${phoneH - 20}" rx="52" fill="#0C1017" stroke="#000000" stroke-width="4"/>

      <!-- Dynamic Island -->
      <rect x="${width / 2 - 100}" y="${phoneY + 28}" width="200" height="34" rx="17" fill="#000000" />
      <circle cx="${width / 2 + 65}" cy="${phoneY + 45}" r="6" fill="#1E293B"/>

      <!-- Clipped Screen Content -->
      <g clip-path="url(#screenClip)">
        ${renderPhoneContent(phoneX + 16, phoneY + 16, phoneW - 32, phoneH - 32)}
      </g>
    </g>
  </svg>
  `;

  const outputPath = path.join(ARTIFACTS_DIR, filename);
  await sharp(Buffer.from(svg)).png().toFile(outputPath);
  console.log(`✅ Generated Phone Screenshot: ${outputPath}`);
}

// SCREENSHOT 4: 24/7 AI PERSONAL FITNESS COACH (WITH MODEL AVATAR)
async function generateScreenshot4(emblemBase64, avatarBase64) {
  return generatePhoneScreenshot(
    'screenshot_4_ai_personal_coach.png',
    '24/7 AI PERSONAL COACH',
    'Custom Workout Splits & Intelligent Advice',
    (x, y, w, h) => `
      <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#080B11"/>

      <!-- AI Coach Header Profile with Avatar -->
      <g transform="translate(${x + 40}, ${y + 80})">
        <rect width="${w - 80}" height="140" rx="26" fill="#0E1626" stroke="#1E2D4A" stroke-width="2"/>
        
        <!-- Avatar Circle -->
        <g transform="translate(20, 15)">
          <circle cx="55" cy="55" r="52" fill="#00FF75" fill-opacity="0.3"/>
          <g clip-path="url(#avatarClip)">
            <image href="${avatarBase64}" x="5" y="5" width="100" height="100"/>
          </g>
          <!-- Online status green dot -->
          <circle cx="92" cy="92" r="11" fill="#00FF75" stroke="#080B11" stroke-width="3"/>
        </g>

        <!-- Profile Details -->
        <g transform="translate(150, 42)">
          <text x="0" y="24" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="900" font-size="26">Maya • AI Fitness Coach</text>
          <text x="0" y="55" fill="#00FF75" font-family="system-ui, sans-serif" font-weight="700" font-size="16">⚡ Active Now • Personalized Training</text>
          <text x="0" y="80" fill="#94A3B8" font-family="system-ui, sans-serif" font-weight="500" font-size="14">Hypertrophy &amp; Nutrition Specialist</text>
        </g>
      </g>

      <!-- Chat Bubble 1: User Question -->
      <g transform="translate(${x + 140}, ${y + 245})">
        <rect width="${w - 180}" height="130" rx="24" fill="#00FF75" fill-opacity="0.15" stroke="#00FF75" stroke-width="1.5"/>
        <text x="24" y="48" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="700" font-size="20">Can you build me a 4-day Upper/Lower split?</text>
        <text x="24" y="88" fill="#00FF75" font-family="system-ui, sans-serif" font-weight="600" font-size="16">Goal: Muscle Hypertrophy • 4 Days/Week</text>
      </g>

      <!-- Chat Bubble 2: Coach Maya Answer -->
      <g transform="translate(${x + 40}, ${y + 400})">
        <rect width="${w - 80}" height="490" rx="26" fill="#0E1626" stroke="#1E2D4A" stroke-width="2"/>
        
        <g transform="translate(30, 38)">
          <text x="0" y="24" fill="#00D2FF" font-family="system-ui, sans-serif" font-weight="800" font-size="24">🤖 Coach Maya</text>
          <text x="0" y="65" fill="#E2E8F0" font-family="system-ui, sans-serif" font-weight="500" font-size="18">Here is your tailored 4-Day Progressive Overload Split:</text>
          
          <rect x="0" y="90" width="${w - 140}" height="60" rx="14" fill="#152238"/>
          <text x="20" y="128" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="700" font-size="17">Day 1: Upper Power (Incline Press, Heavy Rows, Arms)</text>

          <rect x="0" y="165" width="${w - 140}" height="60" rx="14" fill="#152238"/>
          <text x="20" y="203" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="700" font-size="17">Day 2: Lower Quad Focus (Squats, Leg Press, Calves)</text>

          <rect x="0" y="240" width="${w - 140}" height="60" rx="14" fill="#152238"/>
          <text x="20" y="278" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="700" font-size="17">Day 3: Upper Hypertrophy (Cable Flyes, Lat Pulldowns)</text>

          <rect x="0" y="315" width="${w - 140}" height="60" rx="14" fill="#152238"/>
          <text x="20" y="353" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="700" font-size="17">Day 4: Lower Posterior Chain (RDLs, Hip Thrusts)</text>

          <rect x="0" y="390" width="${w - 140}" height="56" rx="16" fill="#00FF75"/>
          <text x="${(w - 140) / 2}" y="426" text-anchor="middle" fill="#05080E" font-family="system-ui, sans-serif" font-weight="900" font-size="20">⚡ SAVE SPLIT TO WORKOUT ROUTINES</text>
        </g>
      </g>

      <!-- Smart Nutrition & Recovery Advice Card -->
      <g transform="translate(${x + 40}, ${y + 915})">
        <rect width="${w - 80}" height="200" rx="26" fill="#111B2E" stroke="#00D2FF" stroke-width="1.5"/>
        <text x="30" y="45" fill="#00D2FF" font-family="system-ui, sans-serif" font-weight="800" font-size="22">🥗 Macro &amp; Recovery Plan</text>
        <text x="30" y="85" fill="#E2E8F0" font-family="system-ui, sans-serif" font-weight="600" font-size="18">Target Daily Protein: 165g (2.0g/kg body weight)</text>
        <text x="30" y="125" fill="#94A3B8" font-family="system-ui, sans-serif" font-weight="500" font-size="16">Recommended Rest: 90-120 seconds between compound sets</text>
        <text x="30" y="165" fill="#00FF75" font-family="system-ui, sans-serif" font-weight="700" font-size="16">✓ Optimized for Hypertrophy &amp; Lean Gains</text>
      </g>

      <!-- Quick AI Prompts -->
      <g transform="translate(${x + 40}, ${y + 1135})">
        <rect width="${w - 80}" height="240" rx="26" fill="#0E1626" stroke="#1E2D4A" stroke-width="1.5"/>
        <text x="30" y="40" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="800" font-size="20">Suggested Questions for Maya</text>

        <rect x="30" y="60" width="${w - 140}" height="48" rx="14" fill="#152238"/>
        <text x="50" y="90" fill="#E2E8F0" font-family="system-ui, sans-serif" font-weight="600" font-size="16">⚡ &quot;How much protein should I eat for a caloric deficit?&quot;</text>

        <rect x="30" y="118" width="${w - 140}" height="48" rx="14" fill="#152238"/>
        <text x="50" y="148" fill="#E2E8F0" font-family="system-ui, sans-serif" font-weight="600" font-size="16">⚡ &quot;What are the best warm-ups for barbell squats?&quot;</text>

        <rect x="30" y="176" width="${w - 140}" height="48" rx="14" fill="#152238"/>
        <text x="50" y="206" fill="#E2E8F0" font-family="system-ui, sans-serif" font-weight="600" font-size="16">⚡ &quot;Help me break through my bench press plateau&quot;</text>
      </g>

      ${renderBottomTabBar(x, y, w, h, 2)}
    `,
    emblemBase64
  );
}

async function run() {
  const emblemBase64 = await getEmblemBase64();
  const avatarBase64 = await getAvatarBase64();
  await generateScreenshot4(emblemBase64, avatarBase64);
  console.log('🎉 SCREENSHOT 4 REGENERATED WITH COACH AVATAR!');
}

run().catch(console.error);
