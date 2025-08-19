import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Customer } from '../types';
import { fetchCustomers } from '../services/api';

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCustomers = async () => {
      const data = await fetchCustomers();
      setCustomers(data);
    };
    loadCustomers();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Name</th>
            <th className="px-4 py-2 border-b">Age</th>
            <th className="px-4 py-2 border-b">City</th>
            <th className="px-4 py-2 border-b">Marital Status</th>
            <th className="px-4 py-2 border-b">Status Tag</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr
              key={customer._id}
              onClick={() => navigate(`/customer/${customer._id}`)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <td className="px-4 py-2 border-b">{`${customer.firstName} ${customer.lastName}`}</td>
              <td className="px-4 py-2 border-b">{customer.age}</td>
              <td className="px-4 py-2 border-b">{customer.city}</td>
              <td className="px-4 py-2 border-b">{customer.maritalStatus}</td>
              <td className="px-4 py-2 border-b">{customer.statusTag || 'Active'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;