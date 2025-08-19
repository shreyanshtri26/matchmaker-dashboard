import React from 'react';
import CustomerList from './CustomerList';

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 bg-background">
      <h1 className="mb-6 text-3xl font-bold">Matchmaker Dashboard</h1>
      <CustomerList />
    </div>
  );
};

export default Dashboard;