import { Request, Response } from 'express';
import { getMatchSuggestions } from '../services/matchingService';

export const getSuggestions = async (req: Request, res: Response) => {
  try {
    const suggestions = await getMatchSuggestions(req.params.id);
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
