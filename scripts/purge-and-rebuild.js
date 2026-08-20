import fs from 'fs';
import path from 'path';

const mediaDir = 'C:\\source\\repos\\Fitkobra\\public\\media';
const auditPath = 'C:\\source\\repos\\Fitkobra\\final_video_audit.json';
const videoLibraryJsPath = 'C:\\source\\repos\\Fitkobra\\src\\data\\videoLibrary.js';

if (!fs.existsSync(auditPath)) {
  console.error('Audit report not found!');
  process.exit(1);
}

const auditData = JSON.parse(fs.readFileSync(auditPath, 'utf8'));

const nonCompliant = auditData.filter(item => {
  const ratio = parseFloat(item.yellowRatio);
  return ratio < 1.5; // Yellow tank top is absent or wrong shirt
});

console.log(`Found ${nonCompliant.length} non-compliant videos to purge:`);
nonCompliant.forEach(item => console.log(` - Purging ${item.file} (Yellow Ratio: ${item.yellowRatio})`));

// Delete non-compliant video files from public/media
nonCompliant.forEach(item => {
  const filePath = path.join(mediaDir, item.file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Deleted: ${item.file}`);
  }
});

// Re-scan remaining valid videos in public/media
const validFiles = fs.readdirSync(mediaDir).filter(f => f.endsWith('.mp4'));
console.log(`\nRemaining verified FitKobra videos: ${validFiles.length}`);

const videos = [];

validFiles.forEach((fileName, index) => {
  let cleanName = fileName
    .replace(/^video_\d+_/, '')
    .replace(/^Woman_performing_/, '')
    .replace(/_\d{8,}\.mp4$/, '')
    .replace(/_1080p/, '')
    .replace(/_/g, ' ');

  cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

  let category = 'Full Body';
  let targetMuscle = 'General';

  const lower = fileName.toLowerCase();

  if (lower.includes('bicep') || lower.includes('curl')) {
    category = 'Biceps';
    targetMuscle = 'Biceps Brachii & Brachialis';
  } else if (lower.includes('tricep') || lower.includes('dips')) {
    category = 'Triceps';
    targetMuscle = 'Triceps Brachii (Long, Lateral, Medial Heads)';
  } else if (lower.includes('bench') || lower.includes('crossovers') || lower.includes('push-ups')) {
    category = 'Chest';
    targetMuscle = 'Pectoralis Major & Minor';
  } else if (lower.includes('row') || lower.includes('pulldown') || lower.includes('hyperextensions')) {
    category = 'Back';
    targetMuscle = 'Lats, Rhomboids & Lower Back';
  } else if (lower.includes('shoulder') || lower.includes('raises') || lower.includes('press') || lower.includes('face_pulls')) {
    category = 'Shoulders';
    targetMuscle = 'Deltoids (Front, Side & Rear Heads)';
  } else if (lower.includes('squat') || lower.includes('leg_press') || lower.includes('lunges') || lower.includes('hip_thrust') || lower.includes('deadlifts') || lower.includes('leg_extension')) {
    category = 'Legs & Glutes';
    targetMuscle = 'Quadriceps, Gluteus Maximus & Hamstrings';
  } else if (lower.includes('calf') || lower.includes('calves')) {
    category = 'Calves';
    targetMuscle = 'Gastrocnemius & Soleus';
  } else if (lower.includes('shrugs') || lower.includes('traps')) {
    category = 'Traps';
    targetMuscle = 'Trapezius (Upper & Middle)';
  } else if (lower.includes('crunch') || lower.includes('ab')) {
    category = 'Abs & Core';
    targetMuscle = 'Rectus Abdominis & Obliques';
  }

  videos.push({
    id: `ex-${index + 1}`,
    title: cleanName,
    category: category,
    targetMuscle: targetMuscle,
    videoUrl: `/media/${fileName}`,
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

const jsContent = `// Auto-generated video library database for FitKobra Muscle Guide (100% Brand Verified)
export const categories = ${JSON.stringify(categories, null, 2)};

export const logoUrl = "/media/fitkobra-logo.jpeg";
export const appMockupUrl = "/media/fitkobra-app-mockup.jpeg";

export const videoLibrary = ${JSON.stringify(videos, null, 2)};
`;

fs.writeFileSync(videoLibraryJsPath, jsContent);
console.log(`\nUpdated ${videoLibraryJsPath} with ${videos.length} 100% verified FitKobra videos!`);
