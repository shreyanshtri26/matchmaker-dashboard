import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Customer } from '../types';
import { fetchCustomers } from '../services/api';

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await fetchCustomers();
        setCustomers(data);
      } catch (error) {
        console.error('Failed to load customers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  if (loading) {
    return <div>Loading customers...</div>;
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden sm:block">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Age</th>
              <th className="border border-gray-300 px-4 py-2 text-left">City</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Gender</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Marital Status</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer._id}
                onClick={() => navigate(`/customer/${customer._id}`)}
                className="cursor-pointer hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="border border-gray-300 px-4 py-2">{`${customer.firstName} ${customer.lastName}`}</td>
                <td className="border border-gray-300 px-4 py-2">{customer.age}</td>
                <td className="border border-gray-300 px-4 py-2">{customer.city}</td>
                <td className="border border-gray-300 px-4 py-2">{customer.gender}</td>
                <td className="border border-gray-300 px-4 py-2">{customer.maritalStatus}</td>
                <td className="border border-gray-300 px-4 py-2">{customer.statusTag || 'Active'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-4">
        {customers.map((customer) => (
          <div
            key={customer._id}
            onClick={() => navigate(`/customer/${customer._id}`)}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-150"
          >
            <h3 className="font-semibold text-lg">{`${customer.firstName} ${customer.lastName}`}</h3>
            <p className="text-sm text-gray-600">{customer.statusTag || 'Active'}</p>
            <p>Age: {customer.age}</p>
            <p>City: {customer.city}</p>
            <p>Gender: {customer.gender}</p>
            <p>Marital Status: {customer.maritalStatus}</p>
            <p className="text-primary font-medium">View Details →</p>
          </div>    
        ))}

        {customers.length === 0 && !loading && (
          <div>No customers found. Check your connection or try refreshing the page.</div>
        )}
      </div>
    </>
  );
};

export default CustomerList;
