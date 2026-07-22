import { initializeApp } from 'firebase/app';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';
import { FIREBASE_CONFIG } from './config/firebase.config';

async function testAI() {
  console.log('Initializing Firebase...');
  const app = initializeApp(FIREBASE_CONFIG);
  
  console.log('Initializing AI...');
  const ai = getAI(app, { backend: new GoogleAIBackend() });
  const model = getGenerativeModel(ai, { model: 'gemini-flash-latest' });

  console.log('Sending message to Gemini...');
  try {
    const result = await model.generateContent("Hello, are you working?");
    console.log('Success! Response:', result.response.text());
  } catch (error) {
    console.error('Error from Gemini API:', error);
  }
}

testAI();
