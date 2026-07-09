import { getVertexAI, getGenerativeModel } from 'firebase/vertexai';
import { app } from './firebase';

// Initialize Vertex AI
const vertexAI = getVertexAI(app);

// Initialize Models
const visionModel = getGenerativeModel(vertexAI, { model: 'gemini-1.5-flash' });
const textModel = getGenerativeModel(vertexAI, { model: 'gemini-1.5-pro' });

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

export async function generateWorkoutAdvice(historyContext: string, userMessage: string): Promise<string> {
  try {
    const systemPrompt = `
      You are an expert AI Personal Trainer for FitPulse.
      The user will ask for workout advice. 
      You have access to their recent workout history:
      ${historyContext}
      
      Keep your responses concise, motivating, and actionable. Do not use markdown headers, just plain text and bullet points.
    `;
    
    const chat = textModel.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Understood. I am ready to coach.' }] }
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
