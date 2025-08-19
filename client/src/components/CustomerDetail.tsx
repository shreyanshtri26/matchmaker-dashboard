import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Customer } from '../types';
import { fetchCustomer } from '../services/api';
import MatchSuggestions from './MatchSuggestions';
import Button from './ui/Button';

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCustomer = async () => {
      if (id) {
        try {
          const data = await fetchCustomer(id);
          setCustomer(data);
        } catch (error) {
          console.error('Failed to load customer:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadCustomer();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Customer not found</p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-2 justify-between">
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="primary"
              className="mb-2 sm:mb-0"
            >
              ←   Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Customer Info Card */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex justify-center">
            {customer.firstName} {customer.lastName}
          </h2>
          
          {/* Personal Details */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Personal Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <label className="text-sm font-medium text-gray-600">Gender</label>
                <p className="text-gray-900">{customer.gender}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <label className="text-sm font-medium text-gray-600">Age</label>
                <p className="text-gray-900">{customer.age} years</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                <p className="text-gray-900">{customer.dob}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <label className="text-sm font-medium text-gray-600">Height</label>
                <p className="text-gray-900">{customer.height} cm</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <label className="text-sm font-medium text-gray-600">Marital Status</label>
                <p className="text-gray-900">{customer.maritalStatus}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <label className="text-sm font-medium text-gray-600">Siblings</label>
                <p className="text-gray-900">{customer.siblings}</p>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Location</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <label className="text-sm font-medium text-gray-600">Country</label>
                <p className="text-gray-900">{customer.country}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <label className="text-sm font-medium text-gray-600">City</label>
                <p className="text-gray-900">{customer.city}</p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900 break-all">{customer.email}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-gray-900">{customer.phone}</p>
              </div>
            </div>
          </div>

          {/* Education & Career */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Education & Career</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <label className="text-sm font-medium text-gray-600">College</label>
                <p className="text-gray-900">{customer.college}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <label className="text-sm font-medium text-gray-600">Degree</label>
                <p className="text-gray-900">{customer.degree}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <label className="text-sm font-medium text-gray-600">Company</label>
                <p className="text-gray-900">{customer.company}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <label className="text-sm font-medium text-gray-600">Designation</label>
                <p className="text-gray-900">{customer.designation}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded sm:col-span-2 lg:col-span-2">
                <label className="text-sm font-medium text-gray-600">Annual Income</label>
                <p className="text-gray-900">₹{(customer.income / 100000).toFixed(1)} Lakhs</p>
              </div>
            </div>
          </div>

          {/* Cultural Background */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Cultural Background</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <label className="text-sm font-medium text-gray-600">Religion</label>
                <p className="text-gray-900">{customer.religion}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <label className="text-sm font-medium text-gray-600">Caste</label>
                <p className="text-gray-900">{customer.caste}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded sm:col-span-2 lg:col-span-1">
                <label className="text-sm font-medium text-gray-600">Languages</label>
                <p className="text-gray-900">{customer.languages.join(', ')}</p>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Preferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <label className="text-sm font-medium text-gray-600">Want Kids</label>
                <p className="text-gray-900">{customer.wantKids}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <label className="text-sm font-medium text-gray-600">Open to Relocate</label>
                <p className="text-gray-900">{customer.openToRelocate}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <label className="text-sm font-medium text-gray-600">Open to Pets</label>
                <p className="text-gray-900">{customer.openToPets}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <Button 
              onClick={() => alert('Notes saved!')} 
              className="flex-1 sm:flex-none"
            >
              Save Notes
            </Button>
            <Button 
              variant="secondary"
              onClick={() => window.print()}
              className="flex-1 sm:flex-none"
            >
              Print Profile
            </Button>
          </div>
        </div>

        {/* Match Suggestions */}
        <MatchSuggestions customer={customer} />
      </div>
    </div>
  );
};

export default CustomerDetail;