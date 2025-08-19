import React, { useEffect, useState } from 'react';
import { Customer, Match } from '../types';
import { fetchMatches } from '../services/api';
import Button from './ui/Button';

interface Props {
  customer: Customer;
}

interface MatchCardProps {
  match: Match;
  onSendMatch: (match: Match) => void;
}

// Enhanced Match Card Component with AI indicators
const MatchCard: React.FC<MatchCardProps> = ({ match, onSendMatch }) => {
  // Parse AI explanation to extract match level
  const getMatchLevel = (explanation: string) => {
    if (explanation.includes('High Potential')) return 'high';
    if (explanation.includes('Good Compatibility')) return 'good';
    if (explanation.includes('Average Match')) return 'average';
    if (explanation.includes('Limited Compatibility')) return 'low';
    return 'average';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-700 bg-green-100 border-green-300';
    if (score >= 65) return 'text-blue-700 bg-blue-100 border-blue-300';
    if (score >= 50) return 'text-yellow-700 bg-yellow-100 border-yellow-300';
    return 'text-red-700 bg-red-100 border-red-300';
  };

  const getMatchBadge = (level: string) => {
    const badges = {
      high: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
      good: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
      average: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white',
      low: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
    };
    return badges[level as keyof typeof badges] || badges.average;
  };

  const getMatchLevelText = (level: string) => {
    const texts = {
      high: 'High Potential',
      good: 'Good Match',
      average: 'Average Match',
      low: 'Limited Match'
    };
    return texts[level as keyof typeof texts] || 'Match';
  };

  const matchLevel = getMatchLevel(match.explanation);

  return (
    <div className="border-2 border-gray-200 rounded-xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
      {/* Header with Name, AI Badge, and Score */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{match.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-gray-600">{match.age} years • {match.city}</span>
              <span className="text-sm text-gray-500">• {match.designation}</span>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getMatchBadge(matchLevel)}`}>
              🤖 {getMatchLevelText(matchLevel)}
            </span>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-xl text-lg font-bold border-2 ${getScoreColor(match.score)}`}>
          {match.score}%
        </div>
      </div>

      {/* Quick Profile Info */}
      <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm">
          <span className="font-semibold text-gray-700">Height:</span>
          <span className="ml-2 text-gray-600">{match.height} cm</span>
        </div>
        <div className="text-sm">
          <span className="font-semibold text-gray-700">Income:</span>
          <span className="ml-2 text-gray-600">₹{(match.income / 100000).toFixed(1)}L</span>
        </div>
      </div>

      {/* AI Explanation Section */}
      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-400">
        <div className="flex items-start space-x-3">
          <span className="text-2xl mt-1">🧠</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
              AI Compatibility Analysis
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                Powered by Gemini
              </span>
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{match.explanation}</p>
          </div>
        </div>
      </div>

      {/* AI Generated Introduction Preview */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-l-4 border-purple-400">
        <div className="flex items-start space-x-3">
          <span className="text-2xl mt-1">✍️</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800 mb-2">AI-Generated Introduction</p>
            <p className="text-sm text-gray-700 italic leading-relaxed">"{match.intro}"</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <Button 
          onClick={() => onSendMatch(match)}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <span>📧</span>
          <span>Send Match</span>
        </Button>
      </div>
    </div>
  );
};

// Enhanced Modal Component for Send Match
interface SendMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
  match: Match;
}

const SendMatchModal: React.FC<SendMatchModalProps> = ({ isOpen, onClose, customer, match }) => {
  if (!isOpen) return null;

  const handleSend = () => {
    // Mock email sending
    alert(`✅ Match successfully sent!\n\nIntroduction email sent to ${customer.firstName} about ${match.name}.\n\nAI-generated message:\n"${match.intro}"`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Send Match Proposal</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Match Summary */}
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Match Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-semibold">To:</span> {customer.firstName} {customer.lastName}</div>
              <div><span className="font-semibold">Match:</span> {match.name}</div>
              <div><span className="font-semibold">Compatibility Score:</span> {match.score}%</div>
              <div><span className="font-semibold">Match Level:</span> {match.explanation.split(':')[0]}</div>
            </div>
          </div>

          {/* AI Introduction Preview */}
          <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="font-bold text-lg mb-3 flex items-center">
              <span className="mr-2">✍️</span>
              AI-Generated Introduction Email
            </h3>
            <div className="bg-white p-4 rounded border italic text-gray-700">
              {match.intro}
            </div>
          </div>

          {/* Match Profile Details */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-lg mb-3">Profile Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="font-semibold">Age:</span> {match.age} years</div>
              <div><span className="font-semibold">City:</span> {match.city}</div>
              <div><span className="font-semibold">Profession:</span> {match.designation}</div>
              <div><span className="font-semibold">Height:</span> {match.height} cm</div>
              <div><span className="font-semibold">Income:</span> ₹{(match.income / 100000).toFixed(1)}L/year</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button 
              onClick={onClose}
              variant="secondary"
              className="px-6 py-2"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSend}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-2 flex items-center space-x-2"
            >
              <span>📧</span>
              <span>Send Introduction</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main MatchSuggestions Component
const MatchSuggestions: React.FC<Props> = ({ customer }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true);
        console.log(`Loading matches for ${customer.firstName}...`);
        const data = await fetchMatches(customer._id);
        setMatches(data);
        console.log(`Loaded ${data.length} matches`);
      } catch (error) {
        console.error('Failed to load matches:', error);
        alert('Failed to load matches. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadMatches();
  }, [customer._id]);

  const handleSendMatch = (match: Match) => {
    setSelectedMatch(match);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMatch(null);
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 mb-2">🤖 AI is analyzing potential matches...</p>
          <p className="text-sm text-gray-500">Evaluating compatibility across 100+ profiles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-3xl font-bold text-gray-800">AI-Powered Match Suggestions</h2>
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              🚀 Powered by Google Gemini AI
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">
          Advanced AI matching for <span className="font-semibold">{customer.firstName} {customer.lastName}</span> 
          using gender-specific compatibility algorithms
        </p>

        {/* Enhanced Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-700">{matches.length}</p>
                <p className="text-sm text-blue-600 font-medium">Total AI Matches</p>
              </div>
              <span className="text-3xl">🎯</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-green-700">
                  {matches.filter(m => m.score >= 80).length}
                </p>
                <p className="text-sm text-green-600 font-medium">High Potential</p>
              </div>
              <span className="text-3xl">⭐</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-purple-700">
                  {matches.length > 0 ? Math.round(matches.reduce((acc, m) => acc + m.score, 0) / matches.length) : 0}%
                </p>
                <p className="text-sm text-purple-600 font-medium">Avg Score</p>
              </div>
              <span className="text-3xl">📊</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-orange-700">
                  {matches.filter(m => m.score >= 65).length}
                </p>
                <p className="text-sm text-orange-600 font-medium">Good+ Matches</p>
              </div>
              <span className="text-3xl">💝</span>
            </div>
          </div>
        </div>
      </div>

      {/* Match Results */}
      <div>
        {matches.length === 0 ? (
          <div className="text-center p-12 bg-gray-50 rounded-xl">
            <span className="text-6xl mb-4 block">🔍</span>
            <p className="text-xl text-gray-600 mb-2">No compatible matches found</p>
            <p className="text-gray-500">Try adjusting search criteria or check back later for new profiles.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              Recommended Matches (Sorted by AI Compatibility Score)
            </h3>
            {matches.map((match) => (
              <MatchCard 
                key={match.id} 
                match={match} 
                onSendMatch={handleSendMatch}
              />
            ))}
          </div>
        )}
      </div>

      {/* Send Match Modal */}
      {selectedMatch && (
        <SendMatchModal
          isOpen={showModal}
          onClose={handleCloseModal}
          customer={customer}
          match={selectedMatch}
        />
      )}
    </div>
  );
};

export default MatchSuggestions;