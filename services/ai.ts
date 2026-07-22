import { app } from './firebase';
import 'react-native-get-random-values';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';

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
}

export async function generateRecipeFromImage(base64Image: string, mimeType: string): Promise<RecipeResult | null> {
  await initAI();
  if (!visionModel) return null;
  
  try {
    const prompt = `
      Analyze this image of food or ingredients. 
      Identify the food and suggest a healthy recipe. 
      You MUST respond with a perfectly formatted JSON object with NO markdown wrapping (no \`\`\`json or \`\`\`).
      The JSON object must have exactly this structure:
      {
        "recipeName": "Name of the dish",
        "ingredients": ["ingredient 1", "ingredient 2"],
        "instructions": ["step 1", "step 2"],
        "calories": 450,
        "protein": 30,
        "carbs": 40,
        "fats": 15
      }
    `;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType
      }
    };

    const result = await visionModel.generateContent([prompt, imagePart]);
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

const FAQ_CACHE: Record<string, string> = {
  "hi": "Hello! I'm KinexFit AI, your elite personal fitness and nutrition coach. How can we crush your goals today? 💪",
  "hello": "Hi there! I'm your KinexFit AI Coach. Ready to get 1% better today?",
  "who are you": "I'm KinexFit AI, your world-class personal trainer and nutritionist! I'm here to build custom workouts, analyze your nutrition, and keep you motivated.",
  "what can you do": "I can create tailored workout routines, suggest healthy meals based on your macros, answer complex fitness questions, and analyze your workout history to keep you progressing!",
  "thanks": "You're very welcome! Keep up the amazing work. Let me know if you need anything else! 🔥",
  "thank you": "You got it! I'm always here to help you push your limits.",
  "how are you": "I'm fully charged and ready to help you train! What are we focusing on today?",
  "good morning": "Good morning! Rise and grind. Ready for today's workout?",
  "good night": "Good night! Rest up—recovery is just as important as the workout. Catch you tomorrow!"
};

export async function generateWorkoutAdvice(historyContext: string, userMessage: string): Promise<string> {
  const cleanUserMsg = userMessage.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '');
  if (FAQ_CACHE[cleanUserMsg]) {
    return FAQ_CACHE[cleanUserMsg];
  }

  await initAI();
  if (!textModel) {
    return "I'm having trouble loading my AI model right now. Please check your internet connection and try again!";
  }
  try {
    const systemPrompt = `
      You are KinexFit AI, an elite, world-class personal trainer and sports nutritionist.
      Your goal is to provide highly accurate, science-based fitness and nutrition advice.
      
      Tone: Encouraging, professional, energetic, and deeply knowledgeable.
      Format: Use clear bullet points, bold text for emphasis, and keep paragraphs short and punchy.
      
      Always tailor your advice based on the user's recent workout history and daily steps:
      ${historyContext}
      
      CRITICAL INSTRUCTIONS:
      - Keep responses engaging but concise. Avoid long walls of text.
      - Never break character. You are a passionate fitness coach.
      - If asked generic questions, be helpful but bring it back to their fitness journey.
    `;
    
    const chat = textModel.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Understood. I am fully primed and ready to coach my client to greatness.' }] }
      ]
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  } catch (error) {
    console.error('Error generating advice:', error);
    return "I'm having trouble connecting to my coaching brain right now. Let's try again later!";
  }
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
        "type": "run" | "cycle" | "lift" | "yoga" | "swim" | "hiit" | "walk" | "other",
        "durationSeconds": number (calculate total seconds),
        "distanceKm": number (convert miles to km if needed, else 0 or null),
        "caloriesBurned": number (estimate if not provided, e.g. 10 per min for run, 5 for walk)
      }
    `;

    const result = await textModel.generateContent(prompt);
    let cleanText = result.response.text().trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '').trim();
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/```/g, '').trim();
    }
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Error parsing voice workout:', error);
    return null;
  }
}
