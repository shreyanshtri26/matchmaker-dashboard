import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerList from './CustomerList';
import Button from './ui/Button'; // Assuming you have this reusable button component

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');       // Remove the JWT token
    navigate('/');                          // Redirect to login page
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="primary" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <CustomerList />
    </div>
  );
};

export default Dashboard;
