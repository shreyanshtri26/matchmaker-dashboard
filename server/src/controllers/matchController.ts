import { Request, Response } from 'express';
import CustomerModel from '../models/Customer';
import { generateMatchScoreAndExplanation, generateIntro } from '../services/geminiService';

export const getMatches = async (req: Request, res: Response) => {
  try {
    const customer = await CustomerModel.findById(req.params.customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const oppositeGender = customer.gender === 'Male' ? 'Female' : 'Male';
    const potentialMatches = await CustomerModel.find({ gender: oppositeGender, isDummy: true }).limit(10);

    const matches = await Promise.all(
      potentialMatches.map(async (match) => {
        const { score, explanation } = await generateMatchScoreAndExplanation(customer, match);
        const intro = await generateIntro(customer, match);
        return {
          id: match._id,
          name: `${match.firstName} ${match.lastName}`,
          score,
          explanation,
          intro,
        };
      })
    );

    // Filter and sort by score
    const filteredMatches = matches.filter((m) => m.score > 50).sort((a, b) => b.score - a.score);

    res.json(filteredMatches);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};