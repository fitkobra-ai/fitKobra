import { app } from './firebase';
import 'react-native-get-random-values';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';
import { queryOfflineKnowledge, findHighConfidenceKnowledgeMatch, checkMedicalSafetyGuardrail } from '../constants/OfflineAIKnowledgeBase';

let ai: any = null;
let visionModel: any = null;
let textModel: any = null;

async function initAI() {
  if (!ai) {
    try {
      ai = getAI(app, { backend: new GoogleAIBackend() });
      visionModel = getGenerativeModel(ai, { model: 'gemini-flash-latest' });
      textModel = getGenerativeModel(ai, { model: 'gemini-flash-latest' });
    } catch (e) {
      console.error("Failed to initialize Vertex AI:", e);
    }
  }
}

export interface RecipeResult {
  recipeName: string;
  ingredients: string[];
  instructions: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  servingGrams?: number;
  isFood?: boolean;
}

export async function generateRecipeFromImages(base64Images: string[], mimeType: string): Promise<RecipeResult | null> {
  await initAI();
  if (!visionModel) return null;
  
  try {
    const prompt = `
      Analyze the provided image(s). 
      FIRST, determine if the images contain food, ingredients, or a meal. If they DO NOT contain food (e.g. they are a person, a computer screen, code, an object, a building, etc.), you MUST return exactly this JSON and nothing else:
      { "isFood": false }
      
      If they DO contain food:
      1. If it's a SINGLE raw ingredient (like just an apple, or just a bowl of rice), identify it simply (e.g. "Apple" or "White Rice"). Do not invent a complex recipe for it. Just provide its macros and maybe a simple tip in instructions.
      2. If multiple ingredients are shown across the images, identify them and suggest a healthy recipe or meal prep idea that can be made using these combined ingredients.
      
      IMPORTANT: Be highly aware of Indian cuisine and dishes. If the food resembles an Indian dish (like Besan Chilla, Dosa, Idli, Poha, Dal, Sabzi), identify it correctly rather than giving a Western equivalent (e.g. use "Besan Chilla / Savory Pancake" rather than just "Oatmeal Pancake").
      Provide alternative names separated by a slash if it crosses cultural boundaries.
      You MUST respond with a perfectly formatted JSON object with NO markdown wrapping (no \`\`\`json or \`\`\`).
      The JSON object must have exactly this structure:
      {
        "isFood": true,
        "recipeName": "Name of the dish / Item",
        "servingGrams": 200,
        "ingredients": ["ingredient 1", "ingredient 2"],
        "instructions": ["step 1", "step 2"],
        "calories": 450,
        "protein": 30,
        "carbs": 40,
        "fats": 15
      }
    `;

    const imageParts = base64Images.map(base64 => ({
      inlineData: {
        data: base64,
        mimeType
      }
    }));

    const result = await visionModel.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();
    
    // Clean up potential markdown formatting if the model disobeys
    let cleanText = responseText.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '').trim();
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/```/g, '').trim();
    }

    return JSON.parse(cleanText) as RecipeResult;
  } catch (error) {
    console.error('Error generating recipe:', error);
    return null;
  }
}

export async function generateWorkoutAdvice(
  historyContext: string,
  userMessage: string,
  isOfflineMode: boolean = false
): Promise<string> {
  // 0. Immediate Medical Safety Guardrail check across both online & offline modes
  const medicalGuardrail = checkMedicalSafetyGuardrail(userMessage);
  if (medicalGuardrail) {
    return medicalGuardrail;
  }

  // 1. If explicit Offline Mode is enabled by user, query local Offline Knowledge Engine directly
  if (isOfflineMode) {
    return queryOfflineKnowledge(userMessage);
  }

  // 2. Smart AI Token & Speed Optimization: If local knowledge engine has an exact or high-confidence match,
  // return it instantly (<5ms) without spending unnecessary AI API tokens or network latency.
  const instantMatch = findHighConfidenceKnowledgeMatch(userMessage);
  if (instantMatch) {
    return instantMatch;
  }

  // 3. Online Mode: Clean race with guaranteed clearTimeout
  let timeoutId: any = null;
  try {
    const timeoutPromise = new Promise<string>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error('Gemini API timeout')), 3500);
    });

    const onlinePromise = (async () => {
      await initAI();
      if (!textModel) throw new Error('Text model initialization failed');

      const systemPrompt = `
        You are FitKobra AI, an elite personal fitness & wellness coach.
        Your goal is to provide general, science-based fitness and sports nutrition guidance for healthy individuals.
        
        CRITICAL MEDICAL & LEGAL BOUNDARY INSTRUCTIONS:
        - You are NOT a doctor or Registered Dietitian (RD).
        - NEVER diagnose medical conditions or prescribe therapeutic meal plans (Medical Nutrition Therapy / MNT) to treat, cure, or manage diseases (e.g. diabetes, chronic kidney disease, severe food allergies, eating disorders, hypertension, thyroid conditions).
        - If a user mentions a medical condition or severe food allergy, REFUSE to generate a therapeutic meal plan and instruct them to consult a licensed medical professional or Registered Dietitian.
        
        Tone: Encouraging, professional, energetic, and deeply knowledgeable.
        Format: Use clear bullet points, bold text for emphasis, and keep paragraphs short and punchy.
        
        Tailor advice based on user history:
        ${historyContext}
      `;

      const chat = textModel.startChat({
        history: [
          { role: 'user', parts: [{ text: systemPrompt }] },
          { role: 'model', parts: [{ text: 'Understood. I am ready to coach my client to peak performance.' }] }
        ]
      });

      const result = await chat.sendMessage(userMessage);
      const reply = result?.response?.text();
      if (reply && reply.trim().length > 0) return reply;
      throw new Error('Empty Gemini response');
    })();

    const res = await Promise.race([onlinePromise, timeoutPromise]);
    if (timeoutId) clearTimeout(timeoutId);
    return res;
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId);
    console.warn('Gemini AI online call fallback to local offline knowledge engine:', error);
  }

  // 3. Fallback to Local Offline Knowledge Engine instantly
  return queryOfflineKnowledge(userMessage);
}

export async function parseVoiceWorkout(transcription: string): Promise<any | null> {
  await initAI();
  if (!textModel) return null;
  
  try {
    const prompt = `
      You are a fitness parsing assistant.
      The user said: "${transcription}"
      Extract the workout data and return ONLY a raw JSON object (no markdown, no backticks).
      Structure:
      {
        "type": "running" | "cycling" | "weightlifting" | "swimming" | "yoga" | "walking" | "hiit" | "other",
        "durationMinutes": 30,
        "caloriesBurned": 250,
        "distanceKm": 5.0
      }
    `;

    const result = await textModel.generateContent(prompt);
    let text = result.response.text().trim();
    if (text.startsWith('```json')) text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    if (text.startsWith('```')) text = text.replace(/```/g, '').trim();
    
    return JSON.parse(text);
  } catch (err) {
    console.error('parseVoiceWorkout error:', err);
    return null;
  }
}

export async function recalculateMacrosForFood(foodName: string, grams: number = 100): Promise<any | null> {
  const ratio = (grams || 100) / 100;
  return {
    calories: Math.round(150 * ratio),
    protein: Math.round(10 * ratio),
    carbs: Math.round(20 * ratio),
    fats: Math.round(5 * ratio),
  };
}
