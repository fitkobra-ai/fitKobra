import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = '/home/ubuntu/.gemini/antigravity/brain/6b7c88c3-b30e-4dc5-9cbe-78e6e96b5e27';
const EMBLEM_PATH = '/home/ubuntu/.gemini/antigravity/scratch/github_repos/KinexFit/assets/images/fitkobra-icon-emblem.png';
const HALF_BODY_PATH = '/home/ubuntu/.gemini/antigravity/brain/6b7c88c3-b30e-4dc5-9cbe-78e6e96b5e27/coach_half_body.png';

async function run() {
  const emblemBuffer = await fs.promises.readFile(EMBLEM_PATH);
  const emblemBase64 = `data:image/png;base64,${emblemBuffer.toString('base64')}`;

  const halfBodyBuffer = await fs.promises.readFile(HALF_BODY_PATH);
  const halfBodyBase64 = `data:image/png;base64,${halfBodyBuffer.toString('base64')}`;

  const width = 1080;
  const height = 2400;

  const phoneW = 880;
  const phoneH = 1800;
  const phoneX = (width - phoneW) / 2;
  const phoneY = 440;

  const screenX = phoneX + 16;
  const screenY = phoneY + 16;
  const screenW = phoneW - 32;
  const screenH = phoneH - 32;

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
        <rect x="${screenX}" y="${screenY}" width="${screenW}" height="${screenH}" rx="48" />
      </clipPath>
      <clipPath id="halfBodyClip">
        <rect x="0" y="0" width="330" height="380" rx="24" />
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
      <text x="0" y="0" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="52" letter-spacing="1">24/7 AI PERSONAL COACH</text>
      <text x="0" y="55" fill="url(#neonText)" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="25" letter-spacing="1">Custom Workout Splits &amp; Intelligent Advice</text>
    </g>

    <!-- Phone Device Frame -->
    <g filter="url(#phoneShadow)">
      <rect x="${phoneX}" y="${phoneY}" width="${phoneW}" height="${phoneH}" rx="60" fill="#151D2A" stroke="#2A3950" stroke-width="6"/>
      <rect x="${phoneX + 10}" y="${phoneY + 10}" width="${phoneW - 20}" height="${phoneH - 20}" rx="52" fill="#0C1017" stroke="#000000" stroke-width="4"/>

      <!-- Dynamic Island -->
      <rect x="${width / 2 - 100}" y="${phoneY + 28}" width="200" height="34" rx="17" fill="#000000" />
      <circle cx="${width / 2 + 65}" cy="${phoneY + 45}" r="6" fill="#1E293B"/>

      <!-- Clipped Screen Content -->
      <g clip-path="url(#screenClip)">
        <rect x="${screenX}" y="${screenY}" width="${screenW}" height="${screenH}" fill="#080B11"/>

        <!-- Header -->
        <g transform="translate(${screenX + 40}, ${screenY + 70})">
          <text x="0" y="24" fill="#94A3B8" font-family="system-ui, sans-serif" font-weight="600" font-size="18">INTERACTIVE COACH</text>
          <text x="0" y="60" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="900" font-size="34">Maya AI Trainer</text>
        </g>

        <!-- Hero AI Coach Profile Card with Half Body Photo -->
        <g transform="translate(${screenX + 40}, ${screenY + 150})">
          <rect width="${screenW - 80}" height="380" rx="28" fill="#0E1626" stroke="#1E2D4A" stroke-width="2"/>
          
          <!-- Half Body Image on Left Side -->
          <g transform="translate(0, 0)" clip-path="url(#halfBodyClip)">
            <image href="${halfBodyBase64}" x="-10" y="-10" width="350" height="400" preserveAspectRatio="xMidYMid slice"/>
          </g>

          <!-- Coach Details on Right Side -->
          <g transform="translate(350, 35)">
            <rect x="0" y="0" width="160" height="32" rx="8" fill="#00FF75" fill-opacity="0.15" stroke="#00FF75" stroke-width="1"/>
            <text x="80" y="21" text-anchor="middle" fill="#00FF75" font-family="system-ui, sans-serif" font-weight="800" font-size="14">⚡ ONLINE NOW</text>

            <text x="0" y="72" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="900" font-size="28">Coach Maya</text>
            <text x="0" y="100" fill="#00D2FF" font-family="system-ui, sans-serif" font-weight="700" font-size="16">Hypertrophy &amp; Nutrition Expert</text>

            <text x="0" y="135" fill="#E2E8F0" font-family="system-ui, sans-serif" font-weight="500" font-size="16">Tailored workout routines,</text>
            <text x="0" y="160" fill="#E2E8F0" font-family="system-ui, sans-serif" font-weight="500" font-size="16">form cues &amp; macro targets.</text>

            <g transform="translate(0, 215)">
              <rect x="0" y="0" width="350" height="52" rx="16" fill="#00FF75"/>
              <text x="175" y="33" text-anchor="middle" fill="#05080E" font-family="system-ui, sans-serif" font-weight="900" font-size="18">💬 CHAT WITH MAYA</text>
            </g>
          </g>
        </g>

        <!-- User Message Bubble -->
        <g transform="translate(${screenX + 140}, ${screenY + 555})">
          <rect width="${screenW - 180}" height="115" rx="22" fill="#00FF75" fill-opacity="0.15" stroke="#00FF75" stroke-width="1.5"/>
          <text x="24" y="44" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="700" font-size="20">Can you build me a 4-day Upper/Lower split?</text>
          <text x="24" y="78" fill="#00FF75" font-family="system-ui, sans-serif" font-weight="600" font-size="16">Goal: Muscle Hypertrophy • 4 Days/Week</text>
        </g>

        <!-- Coach Answer Bubble with 4-Day Plan -->
        <g transform="translate(${screenX + 40}, ${screenY + 690})">
          <rect width="${screenW - 80}" height="455" rx="26" fill="#0E1626" stroke="#1E2D4A" stroke-width="2"/>
          
          <g transform="translate(30, 32)">
            <text x="0" y="24" fill="#00D2FF" font-family="system-ui, sans-serif" font-weight="800" font-size="22">🤖 Maya AI Coach</text>
            <text x="0" y="58" fill="#E2E8F0" font-family="system-ui, sans-serif" font-weight="500" font-size="17">Here is your tailored 4-Day Progressive Overload Split:</text>
            
            <rect x="0" y="78" width="${screenW - 140}" height="54" rx="14" fill="#152238"/>
            <text x="20" y="112" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="700" font-size="16">Day 1: Upper Power (Incline Press, Heavy Rows, Arms)</text>

            <rect x="0" y="142" width="${screenW - 140}" height="54" rx="14" fill="#152238"/>
            <text x="20" y="176" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="700" font-size="16">Day 2: Lower Quad Focus (Squats, Leg Press, Calves)</text>

            <rect x="0" y="206" width="${screenW - 140}" height="54" rx="14" fill="#152238"/>
            <text x="20" y="240" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="700" font-size="16">Day 3: Upper Hypertrophy (Cable Flyes, Lat Pulldowns)</text>

            <rect x="0" y="270" width="${screenW - 140}" height="54" rx="14" fill="#152238"/>
            <text x="20" y="304" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="700" font-size="16">Day 4: Lower Hamstrings &amp; Glutes (RDLs, Hip Thrusts)</text>

            <rect x="0" y="338" width="${screenW - 140}" height="54" rx="16" fill="#00FF75"/>
            <text x="${(screenW - 140) / 2}" y="371" text-anchor="middle" fill="#05080E" font-family="system-ui, sans-serif" font-weight="900" font-size="19">⚡ SAVE SPLIT TO MY WORKOUTS</text>
          </g>
        </g>

        <!-- Nutrition & Recovery Plan Card -->
        <g transform="translate(${screenX + 40}, ${screenY + 1165})">
          <rect width="${screenW - 80}" height="175" rx="24" fill="#111B2E" stroke="#00D2FF" stroke-width="1.5"/>
          <text x="30" y="40" fill="#00D2FF" font-family="system-ui, sans-serif" font-weight="800" font-size="20">🥗 Macro &amp; Recovery Plan</text>
          <text x="30" y="78" fill="#E2E8F0" font-family="system-ui, sans-serif" font-weight="600" font-size="17">Target Protein: 165g / day (2.0g/kg body weight)</text>
          <text x="30" y="115" fill="#94A3B8" font-family="system-ui, sans-serif" font-weight="500" font-size="15">Rest Timer: 90-120s between heavy compound sets</text>
          <text x="30" y="150" fill="#00FF75" font-family="system-ui, sans-serif" font-weight="700" font-size="15">✓ Calibrated for Hypertrophy &amp; Lean Muscle Retention</text>
        </g>

        <!-- Quick AI Suggestions Card -->
        <g transform="translate(${screenX + 40}, ${screenY + 1360})">
          <rect width="${screenW - 80}" height="240" rx="24" fill="#0E1626" stroke="#1E2D4A" stroke-width="1.5"/>
          <text x="30" y="42" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="800" font-size="20">Suggested Questions for Maya</text>

          <rect x="30" y="65" width="${screenW - 140}" height="50" rx="14" fill="#152238"/>
          <text x="50" y="97" fill="#E2E8F0" font-family="system-ui, sans-serif" font-weight="600" font-size="16">⚡ &quot;How much protein should I eat in a caloric deficit?&quot;</text>

          <rect x="30" y="125" width="${screenW - 140}" height="50" rx="14" fill="#152238"/>
          <text x="50" y="157" fill="#E2E8F0" font-family="system-ui, sans-serif" font-weight="600" font-size="16">⚡ &quot;Help me break through my bench press plateau&quot;</text>
        </g>

        <!-- Bottom Tab Bar -->
        <g transform="translate(${screenX}, ${screenY + screenH - 110})">
          <rect width="${screenW}" height="110" fill="#080C14" stroke="#1E2D4A" stroke-width="1.5"/>
          ${[
            { label: 'Home', icon: '🏠' },
            { label: 'Workouts', icon: '💪' },
            { label: 'AI Coach', icon: '🤖' },
            { label: 'Scan', icon: '📸' },
            { label: 'Profile', icon: '👤' },
          ].map((tab, i) => {
            const isActive = i === 2;
            const tabW = screenW / 5;
            const tx = i * tabW + tabW / 2;
            return `
              <g transform="translate(${tx}, 40)">
                <text x="0" y="0" text-anchor="middle" font-size="28">${tab.icon}</text>
                <text x="0" y="32" text-anchor="middle" fill="${isActive ? '#00FF75' : '#64748B'}" font-family="system-ui, sans-serif" font-weight="${isActive ? '800' : '600'}" font-size="16">${tab.label}</text>
              </g>
            `;
          }).join('')}
        </g>
      </g>
    </g>
  </svg>
  `;

  const outputPath = path.join(ARTIFACTS_DIR, 'screenshot_4_ai_personal_coach.png');
  await sharp(Buffer.from(svg)).png().toFile(outputPath);
  console.log(`✅ Generated Refined Half Body Coach Screenshot: ${outputPath}`);
}

run().catch(console.error);
