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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 bg-clip-text text-transparent">MatchMaker Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome back! 👋
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleLogout}
                className="hover:bg-red-50 hover:text-red-700 hover:border-red-200"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <p className="text-gray-600">Search, sort, and manage your customer profiles</p>
        </div>
        
        <CustomerList />
      </main>
    </div>
  );
};

export default Dashboard;
