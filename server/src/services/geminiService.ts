import { GoogleGenerativeAI } from '@google/generative-ai';
import { ICustomer } from '../models/Customer';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generateMatchScoreAndExplanation = async (customer: ICustomer, match: ICustomer) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  let prompt = `Evaluate compatibility between Customer A and Potential Match B. Return a score (0-100) and a short explanation.\n\nCustomer A: ${JSON.stringify(customer)}\nPotential Match B: ${JSON.stringify(match)}\n`;

  if (customer.gender === 'Male') {
    prompt += 'For males: Prioritize women who are younger, earn less, shorter, and have matching views on children.';
  } else {
    prompt += 'For females: Prioritize compatibility on profession, values, relocation preferences, pets, and languages.';
  }

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  const [scoreStr, explanation] = response.split('\n'); // Assume format: score\nexplanation
  const score = parseInt(scoreStr.trim(), 10) || 50;

  return { score, explanation: explanation.trim() };
};

export const generateIntro = async (customer: ICustomer, match: ICustomer) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const prompt = `Generate a short, personalized email intro for introducing ${match.firstName} to ${customer.firstName}. Keep it under 100 words.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};