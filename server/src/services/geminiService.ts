import { GoogleGenerativeAI } from '@google/generative-ai';
import { ICustomer } from '../models/Customer';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generateMatchScoreAndExplanation = async (customer: ICustomer, match: ICustomer) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  let prompt = `You are a professional matchmaker AI. Evaluate compatibility and return ONLY a number (0-100) on the first line, followed by a brief explanation.

Customer Profile: ${JSON.stringify({
    name: `${customer.firstName} ${customer.lastName}`,
    age: customer.age,
    gender: customer.gender,
    city: customer.city,
    height: customer.height,
    income: customer.income,
    designation: customer.designation,
    maritalStatus: customer.maritalStatus,
    languages: customer.languages,
    religion: customer.religion,
    wantKids: customer.wantKids,
    openToRelocate: customer.openToRelocate,
    openToPets: customer.openToPets
  })}

Potential Match Profile: ${JSON.stringify({
    name: `${match.firstName} ${match.lastName}`,
    age: match.age,
    gender: match.gender,
    city: match.city,
    height: match.height,
    income: match.income,
    designation: match.designation,
    maritalStatus: match.maritalStatus,
    languages: match.languages,
    religion: match.religion,
    wantKids: match.wantKids,
    openToRelocate: match.openToRelocate,
    openToPets: match.openToPets
  })}

Matching Criteria:`;

  if (customer.gender === 'Male') {
    prompt += `
For Male Customer matching with Female:
- Age: Prefer women 2-5 years younger (High priority if she's younger)
- Income: Prefer women earning 20-40% less (shows traditional dynamic)
- Height: Prefer women 5-15cm shorter (physical compatibility)
- Children: High priority if both want kids (family planning alignment)
- Religious compatibility (same religion is a plus)
- City compatibility for future planning
- Language compatibility for communication`;
  } else {
    prompt += `
For Female Customer matching with Male:
- Professional compatibility (similar field/designation level)
- Values alignment (relocation, pets, lifestyle preferences)
- Language compatibility for communication
- Income stability (prefer men with equal or higher income)
- Age preference (men 1-8 years older preferred)
- Height preference (men taller preferred)
- Family values and religious compatibility
- Educational background and career ambitions`;
  }

  prompt += `

Provide score (0-100) on first line, then explanation starting with match level like:
- "High Potential Match: [reason]" for 80-100 scores
- "Good Compatibility: [reason]" for 65-79 scores  
- "Average Match: [reason]" for 50-64 scores
- "Limited Compatibility: [reason]" for below 50 scores`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const lines = response.split('\n').filter(line => line.trim() !== '');
    
    // Extract score from first line
    const scoreMatch = lines[0].match(/\d+/);
    const score = scoreMatch ? parseInt(scoreMatch[0], 10) : 50;
    
    // Get explanation (everything after first line)
    const explanation = lines.slice(1).join(' ').trim() || 'Compatible match based on profile analysis.';
    
    return { score, explanation };
  } catch (error) {
    console.error('Gemini API error:', error);
    // Fallback scoring logic
    let fallbackScore = 50;
    let fallbackExplanation = 'Average Match: Basic compatibility detected.';
    
    if (customer.gender === 'Male') {
      if (match.age < customer.age) fallbackScore += 15;
      if (match.income < customer.income) fallbackScore += 10;
      if (match.height < customer.height) fallbackScore += 10;
      if (customer.wantKids === match.wantKids) fallbackScore += 15;
    } else {
      if (match.age > customer.age) fallbackScore += 10;
      if (match.income >= customer.income) fallbackScore += 15;
      if (match.height > customer.height) fallbackScore += 10;
      if (customer.languages.some(lang => match.languages.includes(lang))) fallbackScore += 15;
    }
    
    if (fallbackScore >= 80) fallbackExplanation = 'High Potential Match: Strong compatibility indicators found.';
    else if (fallbackScore >= 65) fallbackExplanation = 'Good Compatibility: Several matching preferences detected.';
    
    return { score: Math.min(fallbackScore, 100), explanation: fallbackExplanation };
  }
};

export const generateIntro = async (customer: ICustomer, match: ICustomer) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `Generate a warm, professional email introduction for a matchmaker presenting ${match.firstName} to ${customer.firstName}. 

Customer details:
- Name: ${customer.firstName} ${customer.lastName}
- Age: ${customer.age}
- Profession: ${customer.designation}
- Location: ${customer.city}

Match details:
- Name: ${match.firstName} ${match.lastName}
- Age: ${match.age}
- Profession: ${match.designation}
- Location: ${match.city}

Write a personalized introduction under 80 words that highlights their compatibility. Start with "Dear ${customer.firstName}," and focus on why they might be a good match based on their profiles.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Gemini API error for intro:', error);
    // Fallback intro
    return `Dear ${customer.firstName}, I'd like to introduce you to ${match.firstName}, a ${match.age}-year-old ${match.designation} from ${match.city}. Based on your profiles, I believe you both share compatible values and life goals. ${match.firstName} seems like someone who would appreciate your perspective and lifestyle. I think this could be a wonderful connection worth exploring.`;
  }
};