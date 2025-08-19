import Customer, { ICustomer } from '../models/Customer';
import Match from '../models/Match';
import { getAIScoreAndExplanation } from './geminiService';

export const getMatchSuggestions = async (customerId: string) => {
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new Error('Customer not found');
  }

  let query = {};
  if (customer.gender === 'Male') {
    query = {
      gender: 'Female',
      dateOfBirth: { $gt: customer.dateOfBirth }, // Younger
      income: { $lt: customer.income }, // Earns less
      height: { $lt: customer.height }, // Shorter
      wantKids: customer.wantKids,
    };
  } else {
    query = {
      gender: 'Male',
      openToRelocate: customer.openToRelocate,
      // Add more thoughtful logic for female customers
      religion: customer.religion,
      caste: customer.caste,
    };
  }

  const potentialMatches = await Customer.find(query).limit(10);

  const suggestions = await Promise.all(
    potentialMatches.map(async (match) => {
      const { score, explanation } = await getAIScoreAndExplanation(
        customer,
        match
      );
      const newMatch = new Match({
        customer: customerId,
        profile: match._id,
        score,
        explanation,
      });
      await newMatch.save();
      return newMatch.populate('profile');
    })
  );

  return suggestions;
};
