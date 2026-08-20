import fs from 'fs';
import path from 'path';

const sourceDir = 'C:\\Users\\sahil\\Downloads\\FitKobra';
const targetDir = 'C:\\source\\repos\\Fitkobra\\public\\media';
const outputJsPath = 'C:\\source\\repos\\Fitkobra\\src\\data\\videoLibrary.js';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy images first
const logoSource = path.join(sourceDir, 'FitKobra_fitness_logo_design_4K_202608111423.jpeg');
const appMockupSource = path.join(sourceDir, 'IMG_4979.PNG_4K_202608101452.jpeg_4K_202608111513.jpeg');

if (fs.existsSync(logoSource)) {
  fs.copyFileSync(logoSource, path.join(targetDir, 'fitkobra-logo.jpeg'));
}
if (fs.existsSync(appMockupSource)) {
  fs.copyFileSync(appMockupSource, path.join(targetDir, 'fitkobra-app-mockup.jpeg'));
}

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(fullPath));
    } else if (file.endsWith('.mp4')) {
      results.push(fullPath);
    }
  });
  return results;
}

const videoFiles = walkDir(sourceDir);
console.log(`Found ${videoFiles.length} video files.`);

const videos = [];

videoFiles.forEach((file, index) => {
  const relPath = path.relative(sourceDir, file);
  const pathParts = relPath.split(path.sep);
  
  let rawCategory = pathParts.length > 1 ? pathParts[0] : 'General';
  const fileName = path.basename(file);

  // Clean category name
  let category = 'Full Body';
  let targetMuscle = 'General';
  
  if (rawCategory.includes('Back')) {
    category = 'Back';
    targetMuscle = 'Lats, Rhomboids & Lower Back';
  } else if (rawCategory.includes('Biceps')) {
    category = 'Biceps';
    targetMuscle = 'Biceps Brachii & Brachialis';
  } else if (rawCategory.includes('Chest')) {
    category = 'Chest';
    targetMuscle = 'Pectoralis Major & Minor';
  } else if (rawCategory.includes('Triceps')) {
    category = 'Triceps';
    targetMuscle = 'Triceps Brachii (Long, Lateral, Medial Heads)';
  } else if (rawCategory.includes('Front Delts')) {
    category = 'Shoulders';
    targetMuscle = 'Anterior Deltoid (Front)';
  } else if (rawCategory.includes('Side Delts')) {
    category = 'Shoulders';
    targetMuscle = 'Lateral Deltoid (Side Cap)';
  } else if (rawCategory.includes('Rear Delts')) {
    category = 'Shoulders';
    targetMuscle = 'Posterior Deltoid (Rear)';
  } else if (rawCategory.toLowerCase().includes('shoulders')) {
    category = 'Shoulders';
    targetMuscle = 'Deltoids & Rotator Cuff';
  } else if (rawCategory.includes('Quadriceps') || rawCategory.includes('Glutes')) {
    category = 'Legs & Glutes';
    targetMuscle = 'Quadriceps, Gluteus Maximus & Hamstrings';
  } else if (rawCategory.includes('Calves')) {
    category = 'Calves';
    targetMuscle = 'Gastrocnemius & Soleus';
  } else if (rawCategory.includes('Traps')) {
    category = 'Traps';
    targetMuscle = 'Trapezius (Upper & Middle)';
  } else if (fileName.toLowerCase().includes('crunch') || fileName.toLowerCase().includes('ab')) {
    category = 'Abs & Core';
    targetMuscle = 'Rectus Abdominis & Obliques';
  }

  // Generate clean title
  let cleanName = fileName
    .replace(/^Woman_performing_/, '')
    .replace(/_\d{8,}\.mp4$/, '')
    .replace(/_1080p/, '')
    .replace(/_/g, ' ');

  cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

  const safeName = `video_${index + 1}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const targetPath = path.join(targetDir, safeName);

  fs.copyFileSync(file, targetPath);

  videos.push({
    id: `ex-${index + 1}`,
    title: cleanName,
    category: category,
    targetMuscle: targetMuscle,
    rawCategory: rawCategory,
    videoUrl: `/media/${safeName}`,
    setsReps: '3-4 Sets x 8-12 Reps',
    tips: [
      'Maintain controlled tempo on eccentric phase (2-3 seconds).',
      'Keep core fully engaged throughout the movement.',
      'Squeeze target muscle at peak contraction for maximum strength and hypertrophy gains.'
    ],
    difficulty: index % 3 === 0 ? 'Intermediate' : index % 3 === 1 ? 'Beginner' : 'Advanced'
  });
});

const categories = ['All', 'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs & Glutes', 'Abs & Core', 'Traps', 'Calves'];

const jsContent = `// Auto-generated video library database for FitKobra Muscle Guide
export const categories = ${JSON.stringify(categories, null, 2)};

export const logoUrl = "/media/fitkobra-logo.jpeg";
export const appMockupUrl = "/media/fitkobra-app-mockup.jpeg";

export const videoLibrary = ${JSON.stringify(videos, null, 2)};
`;

const dataDir = path.dirname(outputJsPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(outputJsPath, jsContent);
console.log(`Successfully generated ${outputJsPath} with ${videos.length} exercise videos!`);
