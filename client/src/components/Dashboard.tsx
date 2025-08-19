import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerList from './CustomerList';
import Button from './ui/Button';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
            MatchMaker Dashboard
          </h1>
          <Button 
            variant="primary" 
            onClick={handleLogout}
            className="w-full sm:w-auto"
          >
            Logout
          </Button>
        </div>

        {/* Customer List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <CustomerList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;