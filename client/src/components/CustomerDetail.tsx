import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Customer } from '../types';
import { fetchCustomer } from '../services/api';
import MatchSuggestions from './MatchSuggestions';
import Button from './ui/Button';

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const loadCustomer = async () => {
      if (id) {
        const data = await fetchCustomer(id);
        setCustomer(data);
      }
    };
    loadCustomer();
  }, [id]);

  if (!customer) return <div>Loading...</div>;

  return (
    <div className="p-8 bg-background">
      <h2 className="mb-4 text-2xl font-bold">{`${customer.firstName} ${customer.lastName}`}</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <p><strong>Gender:</strong> {customer.gender}</p>
        <p><strong>Date of Birth:</strong> {customer.dob}</p>
        <p><strong>Country:</strong> {customer.country}</p>
        <p><strong>City:</strong> {customer.city}</p>
        <p><strong>Height:</strong> {customer.height} cm</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Phone:</strong> {customer.phone}</p>
        <p><strong>Undergraduate College:</strong> {customer.college}</p>
        <p><strong>Degree:</strong> {customer.degree}</p>
        <p><strong>Income:</strong> ${customer.income}</p>
        <p><strong>Current Company:</strong> {customer.company}</p>
        <p><strong>Designation:</strong> {customer.designation}</p>
        <p><strong>Marital Status:</strong> {customer.maritalStatus}</p>
        <p><strong>Languages Known:</strong> {customer.languages.join(', ')}</p>
        <p><strong>Siblings:</strong> {customer.siblings}</p>
        <p><strong>Caste:</strong> {customer.caste}</p>
        <p><strong>Religion:</strong> {customer.religion}</p>
        <p><strong>Want Kids:</strong> {customer.wantKids}</p>
        <p><strong>Open to Relocate:</strong> {customer.openToRelocate}</p>
        <p><strong>Open to Pets:</strong> {customer.openToPets}</p>
      </div>
      <MatchSuggestions customer={customer} />
      <Button onClick={() => alert('Notes saved!')} className="mt-4">Save Notes</Button>
    </div>
  );
};

export default CustomerDetail;