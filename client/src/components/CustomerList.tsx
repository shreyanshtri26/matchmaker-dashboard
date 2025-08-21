import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCustomers } from '../services/api';
import { Customer } from '../types';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

  // Updated sort options - only the requested fields
  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'age', label: 'Age' },
    { value: 'city', label: 'City' },
    { value: 'gender', label: 'Gender' },
    { value: 'maritalStatus', label: 'Marital Status' }
  ];

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        const data = await fetchCustomers();
        setCustomers(data);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  // Keyboard shortcut for search focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('customer-search') as HTMLInputElement;
        searchInput?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const processedCustomers = useMemo(() => {
    let result = customers;

    // Apply search filter - search by name only
    if (searchTerm.trim()) {
      result = result.filter(customer => 
        `${customer.firstName} ${customer.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase().trim())
      );
    }

    // Apply sorting - only for the allowed fields
    result = [...result].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
          break;
        case 'age':
          aValue = a.age;
          bValue = b.age;
          break;
        case 'city':
          aValue = a.city || '';
          bValue = b.city || '';
          break;
        case 'gender':
          aValue = a.gender || '';
          bValue = b.gender || '';
          break;
        case 'maritalStatus':
          aValue = a.maritalStatus || '';
          bValue = b.maritalStatus || '';
          break;
        default:
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const comparison = aValue.toString().localeCompare(bValue.toString());
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [customers, searchTerm, sortBy, sortOrder]);

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('name');
    setSortOrder('asc');
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading customers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar - Name only */}
          <div className="flex-1 relative">
            <div className="relative">
              <Input
                id="customer-search"
                type="text"
                placeholder="Search by name... (Ctrl+K)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-8"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl font-semibold leading-none"
                  type="button"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex gap-2 items-center">
            <div className="text-sm text-gray-600 font-medium whitespace-nowrap">
              Sort by:
            </div>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={sortOptions}
              className="min-w-[140px]"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 min-w-[40px] flex items-center justify-center"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
        </div>

        {/* Results Info and Clear Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="text-sm text-gray-600">
            {searchTerm ? (
              <>
                Found <span className="font-semibold">{processedCustomers.length}</span> result(s) for "{searchTerm}"
                {processedCustomers.length !== customers.length && (
                  <span className="text-gray-500"> (of {customers.length} total)</span>
                )}
              </>
            ) : (
              <>Showing <span className="font-semibold">{processedCustomers.length}</span> customers</>
            )}
          </div>

          {(searchTerm || sortBy !== 'name' || sortOrder !== 'asc') && (
            <Button
              variant="secondary"
              size="sm"
              onClick={clearFilters}
              className="text-xs"
            >
              Clear All Filters
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marital Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {processedCustomers.map((customer) => (
              <tr key={customer._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {`${customer.firstName} ${customer.lastName}`}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer.age}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer.city}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer.gender}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer.maritalStatus}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {customer.statusTag || 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                    size="sm"
                    onClick={() => navigate(`/customer/${customer._id}`)}
                    className="mr-2 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors duration-200"
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {processedCustomers.map((customer) => (
          <div key={customer._id} className="bg-white rounded-lg shadow p-4 border">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {`${customer.firstName} ${customer.lastName}`}
              </h3>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                {customer.statusTag || 'Active'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
              <div><span className="font-medium">Age:</span> {customer.age}</div>
              <div><span className="font-medium">City:</span> {customer.city}</div>
              <div><span className="font-medium">Gender:</span> {customer.gender}</div>
              <div><span className="font-medium">Marital Status:</span> {customer.maritalStatus}</div>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => navigate(`/customer/${customer._id}`)}
                className="flex-1 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors duration-200"
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {processedCustomers.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-500 text-lg mb-2">
            {searchTerm ? 'No customers found' : 'No customers available'}
          </div>
          {searchTerm && (
            <div className="text-gray-400 text-sm mb-4">
              Try adjusting your search terms or clear the filters
            </div>
          )}
          {searchTerm && (
            <Button variant="secondary" size="sm" onClick={clearSearch}>
              Clear Search
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerList;