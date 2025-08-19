import { GoogleGenerativeAI } from '@google/generative-ai';
import { ICustomer } from '../models/Customer';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const getAIScoreAndExplanation = async (
  customer: ICustomer,
  potentialMatch: ICustomer
): Promise<{ score: number; explanation: string }> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
    You are a matchmaking AI. Your task is to evaluate the compatibility between two profiles.
    Provide a compatibility score from 0 to 100 and a brief explanation for your reasoning.

    Profile 1 (Customer):
    - Gender: ${customer.gender}
    - Age: ${new Date().getFullYear() - new Date(customer.dateOfBirth).getFullYear()}
    - Income: ${customer.income}
    - Religion: ${customer.religion}
    - Caste: ${customer.caste}
    - Marital Status: ${customer.maritalStatus}
    - Want Kids: ${customer.wantKids}
    - Open to Relocate: ${customer.openToRelocate}

    Profile 2 (Potential Match):
    - Gender: ${potentialMatch.gender}
    - Age: ${new Date().getFullYear() - new Date(potentialMatch.dateOfBirth).getFullYear()}
    - Income: ${potentialMatch.income}
    - Religion: ${potentialMatch.religion}
    - Caste: ${potentialMatch.caste}
    - Marital Status: ${potentialMatch.maritalStatus}
    - Want Kids: ${potentialMatch.wantKids}
    - Open to Relocate: ${potentialMatch.openToRelocate}

    Based on the provided details, what is the compatibility score and explanation?
    Return the response in JSON format with "score" and "explanation" keys.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    const parsed = JSON.parse(text);
    return {
      score: parsed.score,
      explanation: parsed.explanation,
    };
  } catch (error) {
    console.error('Error with Gemini API:', error);
    return {
      score: 50,
      explanation: 'Could not generate AI score due to an error.',
    };
  }
};
