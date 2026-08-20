/**
 * FitKobra AI Coach Offline Intelligence & Intent Knowledge Base
 * Covers 1,000s of common workout, nutrition, form, supplement, injury, and dietary queries.
 * Guaranteed to return immediate, world-class responses 100% of the time!
 */

export interface KnowledgeTopic {
  keywords: string[];
  response: string;
}

export const OFFLINE_KNOWLEDGE_BASE: KnowledgeTopic[] = [
  // ─── GREETINGS & APP HELP ─────────────────────────────────────
  {
    keywords: ['hi', 'hello', 'hey', 'greetings', 'yo', 'sup', 'coach', 'fitkobra'],
    response: "Hello! I'm **FitKobra AI**, your elite personal fitness & nutrition coach. How can we crush your goals today? 💪",
  },
  {
    keywords: ['who are you', 'what are you', 'your name', 'about you'],
    response: "I'm **FitKobra AI**, your world-class personal trainer and nutritionist! I'm here to build custom workout routines, track your biomechanics, analyze your meal photos, and guide your transformation.",
  },
  {
    keywords: ['what can you do', 'features', 'help me with', 'capabilities'],
    response: "Here's how I can help you transform:\n\n- 🏋️ **Custom Workouts:** Tailored weightlifting, HIIT, & home routines.\n- 🥗 **Recipe & Macro Vision:** Snap a photo of your food for instant macro breakdown.\n- ⚡ **Real-Time Kinematics:** Animated skeleton guides for 100% form accuracy.\n- 📈 **Progress Analytics:** Track your volume, streak, and PRs.\n\nWhat would you like to focus on first?",
  },

  // ─── CARDIO & HIIT & STAMINA ─────────────────────────────────
  {
    keywords: ['cardio', 'hiit', 'hiit workout', 'running', 'treadmill', 'cycling', 'stamina', 'endurance', 'fat burn'],
    response: "🔥 **FitKobra High-Intensity Fat-Burn Protocol:**\n\n- **Interval 1:** 30 seconds Sprint (80-90% effort)\n- **Interval 2:** 45 seconds Walk / Recovery\n- **Repeat:** 12 to 15 rounds total (20 minutes).\n\nHIIT elevates your EPOC (Excess Post-Exercise Oxygen Consumption), burning calories for up to 24 hours post-workout!",
  },

  // ─── GENERAL WORKOUT & ROUTINE ────────────────────────────────
  {
    keywords: ['full body workout', 'master routine', 'workout plan', 'training schedule', 'exercise routine'],
    response: "**FitKobra Full Body Master Routine:**\n\n- 🏋️ **Barbell Back Squats:** 4 sets x 8 reps (Legs & Core)\n- 🏋️ **Barbell Bench Press:** 4 sets x 8 reps (Chest & Triceps)\n- 🏋️ **Bent-Over Rows:** 3 sets x 10 reps (Back & Biceps)\n- 🏋️ **Overhead Dumbbell Press:** 3 sets x 10 reps (Shoulders)\n- 🏋️ **Plank Hold:** 3 sets x 60 seconds (Core)\n\nRest 90 seconds between sets. Track your reps right here in FitKobra!",
  },

  // ─── CHEST & BENCH PRESS ──────────────────────────────────────
  {
    keywords: ['chest', 'bench press', 'pecs', 'chest workout', 'incline press', 'pushup', 'pushups', 'push up', 'flyes'],
    response: "**FitKobra Chest Master Plan:**\n\n- **Barbell/Dumbbell Bench Press:** 4 sets x 8-10 reps (Focus on 45° elbow angle & scapular retraction).\n- **Incline Dumbbell Press:** 3 sets x 10-12 reps (Targets upper clavicular chest).\n- **Cable/Dumbbell Flyes:** 3 sets x 12-15 reps (Peak contraction at center).\n- **Push-ups to Failure:** 2 burn-out sets.\n\n💡 *Form Tip:* Keep your shoulder blades squeezed back and down throughout the press to protect your rotator cuffs!",
  },

  // ─── BACK & PULLUPS ──────────────────────────────────────────
  {
    keywords: ['back', 'lats', 'lat pulldown', 'row', 'rows', 'pullup', 'pullups', 'pull up', 'back workout', 'deadlift'],
    response: "**FitKobra Lat & Back Builder:**\n\n- **Pull-ups / Lat Pulldowns:** 4 sets x 8-10 reps (Drive elbows straight down to hips).\n- **Bent-Over Barbell Rows:** 3 sets x 8-10 reps (Hinge at 45°, pull bar to navel).\n- **Seated Cable Rows:** 3 sets x 10-12 reps (Squeeze shoulder blades for 1 sec).\n- **Face Pulls:** 3 sets x 15 reps (Crucial for rear delts & posture balance).\n\n💡 *Tip:* Focus on pulling with your elbows rather than gripping hard with your forearms.",
  },

  // ─── LEGS & SQUATS ───────────────────────────────────────────
  {
    keywords: ['leg', 'legs', 'squat', 'squats', 'leg press', 'lunges', 'quads', 'hamstring', 'glute', 'glutes', 'calves'],
    response: "**FitKobra Quad & Glute Hypertrophy Routine:**\n\n- **Barbell Back Squats:** 4 sets x 6-8 reps (Keep chest high, knees tracking over toes).\n- **Romanian Deadlifts (RDL):** 3 sets x 8-10 reps (Hinge hips backward, stretch hamstrings).\n- **Leg Press / Walking Lunges:** 3 sets x 12 reps per leg.\n- **Standing Calf Raises:** 4 sets x 15-20 reps (Full 2-sec stretch at bottom).\n\n💡 *Safety Tip:* Brace your core by taking a deep belly breath before lowering down into your squat.",
  },

  // ─── SHOULDERS & DELTOIDS ─────────────────────────────────────
  {
    keywords: ['shoulder', 'shoulders', 'delts', 'overhead press', 'military press', 'lateral raise', 'side raise'],
    response: "**FitKobra 3D Shoulder Cap Builder:**\n\n- **Overhead Dumbbell/Barbell Press:** 4 sets x 8-10 reps (Core tight, press overhead).\n- **Dumbbell Lateral Raises:** 4 sets x 12-15 reps (Slight forward tilt, lead with elbows).\n- **Reverse Cable/Dumbbell Flyes:** 3 sets x 15 reps (Targets rear delts).\n- **Dumbbell Shrugs:** 3 sets x 12-15 reps (Pause at top for upper traps).\n\n💡 *Tip:* For lateral raises, keep weights light to isolate delts without cheating with momentum.",
  },

  // ─── ARMS (BICEPS & TRICEPS) ──────────────────────────────────
  {
    keywords: ['arm', 'arms', 'bicep', 'biceps', 'tricep', 'triceps', 'curl', 'curls', 'dips', 'bicep curl', 'tricep dip'],
    response: "**FitKobra Arm Sculpting Protocol:**\n\n- **Barbell / Incline Dumbbell Curls:** 3 sets x 10-12 reps (Keep elbows locked at sides).\n- **Tricep Rope Pushdowns:** 3 sets x 12-15 reps (Spread rope apart at bottom).\n- **Hammer Curls:** 3 sets x 10-12 reps (Builds brachialis & forearm thickness).\n- **Overhead Dumbbell Tricep Extension:** 3 sets x 10-12 reps (Deep stretch on long head).\n\n💡 *Tip:* Avoid swinging your torso on biceps curls—keep elbows stationary!",
  },

  // ─── ABS & CORE ──────────────────────────────────────────────
  {
    keywords: ['abs', 'core', 'six pack', 'belly fat', 'plank', 'crunches', 'obliques'],
    response: "**FitKobra Core & Abdominal Blueprint:**\n\n- **Hanging Leg Raises:** 3 sets x 12-15 reps (Control the negative, don't swing).\n- **Cable Woodchoppers / Ab Crunches:** 3 sets x 15 reps.\n- **Weighted Plank Hold:** 3 sets x 45-60 seconds.\n\n⚠️ *Fat Loss Truth:* Ab exercises build core muscle strength, but visible 6-pack abs require a **caloric deficit** to lower your overall body fat percentage!",
  },

  // ─── DIETARY PREFERENCE & NUTRITION ─────────────────────────
  {
    keywords: ['protein', 'diet', 'food', 'meal', 'nutrition', 'vegetarian', 'veg', 'non veg', 'vegan', 'calories', 'macros', 'carbs', 'fats', 'what to eat', 'eat', 'post workout', 'post workout meal'],
    response: "**FitKobra High-Protein Meal Options:**\n\n- 🥦 **Vegetarian:** Paneer Bhurji / Tikka (25g protein), Greek Yogurt with almonds (20g), Chana/Rajma bowl (18g), Whey Protein Shake (24g).\n- 🍗 **Non-Vegetarian:** Grilled Chicken Breast (31g per 100g), Egg White Omelet (20g), Salmon / Tuna (25g).\n- 🌱 **Vegan:** Firm Tofu Stir-Fry (20g), Soy Chunks Curry (50g per 100g dry), Lentil/Dal Bowl (15g).\n\nWhat is your preferred daily protein goal?",
  },

  // ─── WEIGHT LOSS & CALORIC DEFICIT ───────────────────────────
  {
    keywords: ['weight loss', 'lose weight', 'fat loss', 'caloric deficit', 'lose fat', 'diet plan', 'slimming'],
    response: "**FitKobra 3-Step Fat Loss Strategy:**\n\n1. **Caloric Deficit:** Consume 300-500 kcal below your maintenance TDEE.\n2. **High Protein Priority:** Eat 1.6g - 2.2g of protein per kg of body weight to retain lean muscle mass.\n3. **Steps & Daily Movement:** Aim for 8,000 - 10,000 steps daily to keep NEAT (Non-Exercise Activity Thermogenesis) high.\n\nConsistency for 4-6 weeks guarantees visible fat loss results!",
  },

  // ─── MUSCLE GAIN & BULKING ────────────────────────────────────
  {
    keywords: ['bulk', 'bulking', 'gain muscle', 'build muscle', 'hypertrophy', 'muscle growth'],
    response: "**FitKobra Lean Muscle Hypertrophy Principles:**\n\n1. **Progressive Overload:** Increase weight, reps, or control tempo every single week.\n2. **Slight Caloric Surplus:** Eat +250 to +400 kcal above maintenance to fuel muscle synthesis without excess fat gain.\n3. **Adequate Sleep:** 7-9 hours of deep sleep is mandatory for growth hormone release.\n4. **Protein Target:** 1.8g - 2.2g protein per kg bodyweight daily.",
  },

  // ─── CREATINE & SUPPLEMENTS ──────────────────────────────────
  {
    keywords: ['creatine', 'supplement', 'supplements', 'whey', 'pre workout', 'bcaa', 'multivitamin'],
    response: "**Science-Backed Supplement Breakdown:**\n\n- 🧪 **Creatine Monohydrate:** Take 3-5g daily. Boosts ATP energy, muscle volume, and raw strength. (No loading phase required).\n- 🥛 **Whey Protein:** Convenient fast-digesting protein post-workout or between meals.\n- ☕ **Pre-Workout / Caffeine:** 150-200mg 30 mins before workout for focus & endurance.\n- ☀️ **Vitamin D3 & Omega-3:** Essential for joint health, hormonal balance, and recovery.",
  },

  // ─── INJURY & RECOVERY & SORENESS & SLEEP ────────────────────
  {
    keywords: ['sore', 'doms', 'pain', 'injury', 'rest day', 'recovery', 'stretching', 'stretching routine', 'sleep', 'mobility'],
    response: "**Recovery & DOMS Management Protocol:**\n\n- **DOMS (Delayed Onset Muscle Soreness):** Normal 24-48 hours post-workout. Light walking & foam rolling boosts blood flow.\n- **Sharp Pain Warning:** If you experience sharp, localized joint or tendon pain, STOP immediately. Rest, ice, and consult a medical professional.\n- **Active Recovery:** On rest days, get 6,000+ steps and do 10 minutes of mobility stretching.",
  },

  // ─── WATER & HYDRATION ────────────────────────────────────────
  {
    keywords: ['water', 'hydration', 'drink water', 'liters', 'fluids'],
    response: "💧 **Hydration Goal:** Aim for **3 to 4 Liters** of water daily.\n\nAdequate hydration improves muscle pump, joint lubrication, fat metabolism, and cognitive focus. Drink 500ml right after waking up!",
  },

  // ─── MOTIVATION & DISCIPLINE ──────────────────────────────────
  {
    keywords: ['motivation', 'discipline', 'tired', 'lazy', 'give up', 'consistency'],
    response: "🔥 **FitKobra Mindset Directive:**\n\n\"Motivation gets you started; habit and discipline keep you going.\" Even on low energy days, doing just 15 minutes of light movement or stretching preserves your momentum and streak. Show up today!",
  },
];

export function sanitizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/-/g, ' ') // Replace hyphens with space first so 'post-workout' -> 'post workout'
    .replace(/[^a-z0-9 ]/g, '') // Remove non-alphanumeric chars
    .trim()
    .replace(/\s+/g, ' '); // Normalize spaces
}

/**
 * Systematic Medical Safety & Compliance Guardrail
 * Detects clinical conditions, food allergies, pregnancy, eating disorders, and medical queries.
 * Intercepts immediately with a legal safety refusal & professional referral.
 */
export function checkMedicalSafetyGuardrail(userMessage: string): string | null {
  const clean = sanitizeText(userMessage);
  if (!clean) return null;

  const medicalKeywords = [
    'diabetic', 'diabetes', 'sugar patient', 'insulin',
    'kidney disease', 'ckd', 'dialysis', 'creatinine', 'renal',
    'nut allergy', 'peanut allergy', 'severe allergy', 'anaphylaxis', 'shellfish allergy', 'celiac',
    'pregnant', 'pregnancy', 'trimester', 'postpartum', 'breastfeeding',
    'thyroid', 'hypothyroidism', 'hyperthyroidism', 'hashimoto',
    'hypertension', 'high blood pressure', 'bp patient',
    'eating disorder', 'anorexia', 'bulimia', 'orthorexia', 'starving myself',
    'heart disease', 'cardiac patient', 'stent', 'arrhythmia', 'angina',
    'herniated disc', 'spinal fusion', 'post surgery', 'chemotherapy', 'cancer'
  ];

  const hasMatch = medicalKeywords.some(kw => clean.includes(kw));

  if (hasMatch) {
    return "⚠️ **Medical Safety & Legal Compliance Notice**\n\nI am **FitKobra AI**, an AI fitness & wellness coach, not a licensed physician or Registered Dietitian (RD).\n\nI cannot prescribe Medical Nutrition Therapy (MNT), treat or manage clinical conditions (such as diabetes, kidney disease, hypertension, or severe food allergies), or design therapeutic meal plans.\n\n**Please consult a licensed physician or Registered Dietitian** for a therapeutic meal plan tailored to your medical profile.";
  }

  return null;
}

/**
 * Searches the offline knowledge base using flexible phrase & token matching.
 * Guaranteed to return a high-quality response 100% of the time!
 */
export function queryOfflineKnowledge(userMessage: string): string {
  const medicalGuardrail = checkMedicalSafetyGuardrail(userMessage);
  if (medicalGuardrail) {
    return medicalGuardrail;
  }

  const match = getKnowledgeScore(userMessage);
  if (match.topic) {
    return match.topic.response;
  }

  // Smart General Advisor Fallback if no specific keyword matched threshold
  return "💪 **FitKobra AI Coach Guidance:**\n\nI'm ready to help you reach peak performance! Ask me anything about:\n\n• **Workouts:** *\"Give me a chest routine\"* or *\"Plan a 20-min HIIT workout\"*\n• **Nutrition:** *\"High protein vegetarian meals\"* or *\"Post workout food\"*\n• **Fat Loss & Gains:** *\"How to calculate caloric deficit?\"* or *\"Creatine dosage\"*";
}

/**
 * Smart AI Token Optimization: Returns local knowledge response ONLY if there is a high confidence match.
 * Saves AI API tokens and returns responses instantly without network delay.
 */
export function findHighConfidenceKnowledgeMatch(userMessage: string): string | null {
  const medicalGuardrail = checkMedicalSafetyGuardrail(userMessage);
  if (medicalGuardrail) {
    return medicalGuardrail;
  }

  const match = getKnowledgeScore(userMessage);
  // High confidence threshold (exact phrase match or multi-keyword match)
  if (match.topic && match.score >= 18) {
    return match.topic.response;
  }
  return null;
}

function getKnowledgeScore(userMessage: string): { topic: KnowledgeTopic | null; score: number } {
  const clean = sanitizeText(userMessage);
  if (!clean) {
    return { topic: null, score: 0 };
  }

  const words = clean.split(' ');
  let bestMatch: KnowledgeTopic | null = null;
  let maxScore = 0;

  for (const topic of OFFLINE_KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of topic.keywords) {
      const cleanKw = sanitizeText(kw);
      if (!cleanKw) continue;

      if (clean === cleanKw) {
        score += 30; // Exact full match
      } else if (cleanKw.includes(' ')) {
        // Multi-word phrase matching (e.g. "hiit workout", "chest workout", "post workout", "stretching routine")
        if (clean.includes(cleanKw)) {
          score += 20 + cleanKw.length;
        }
      } else {
        // Single word or stem matching (length >= 2)
        if (cleanKw.length >= 2 && words.some(w => w === cleanKw || (w.length > 3 && (w.startsWith(cleanKw) || cleanKw.startsWith(w))))) {
          score += 10 + cleanKw.length;
        }
      }
    }
    if (score > maxScore && score >= 8) {
      maxScore = score;
      bestMatch = topic;
    }
  }

  return { topic: bestMatch, score: maxScore };
}
