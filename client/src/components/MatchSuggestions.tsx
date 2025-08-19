import React, { useEffect, useState } from 'react';
import { Customer, Match } from '../types';
import { fetchMatches } from '../services/api';
import Button from './ui/Button';

interface Props {
  customer: Customer;
}

const MatchSuggestions: React.FC<Props> = ({ customer }) => {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const loadMatches = async () => {
      const data = await fetchMatches(customer._id);
      setMatches(data);
    };
    loadMatches();
  }, [customer._id]);

  const handleSendMatch = (match: Match) => {
    alert(`Mock email sent to ${customer.firstName} introducing ${match.name}! Intro: ${match.intro}`);
  };

  return (
    <div>
      <h3 className="mb-4 text-xl font-bold">Suggested Matches</h3>
      <ul>
        {matches.map((match) => (
          <li key={match.id} className="mb-4 p-4 border rounded">
            <p><strong>Name:</strong> {match.name}</p>
            <p><strong>Score:</strong> {match.score}</p>
            <p><strong>Explanation:</strong> {match.explanation}</p>
            <p><strong>Intro:</strong> {match.intro}</p>
            <Button onClick={() => handleSendMatch(match)}>Send Match</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchSuggestions;