import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Customer } from '../types';
import { getCustomers } from '../services/api';
import { 
  Search, 
  Filter, 
  Plus, 
  RefreshCw, 
  X, 
  ChevronDown, 
  Eye,
  MoreVertical,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

// Mock data for filters
const GENDERS = ['Male', 'Female', 'Other'];
const AGE_RANGES = ['18-25', '26-35', '36-45', '46-55', '56+'];
const LOCATIONS = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'];

// Status configuration
const statusConfig = {
  active: { label: 'Active', color: 'bg-green-100 text-green-800', dot: 'bg-green-400' },
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-400' },
  inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-800', dot: 'bg-gray-400' },
  suspended: { label: 'Suspended', color: 'bg-red-100 text-red-800', dot: 'bg-red-400' },
};

const statusTabs = [
  { value: 'all', label: 'All', count: 124 },
  { value: 'active', label: 'Active', count: 84 },
  { value: 'pending', label: 'Pending', count: 12 },
  { value: 'inactive', label: 'Inactive', count: 28 },
];

interface FilterState {
  status: string;
  gender: string;
  ageRange: string;
  location: string;
  hasPhotos: boolean;
  hasProfile: boolean;
}

const CustomerList: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    gender: '',
    ageRange: '',
    location: '',
    hasPhotos: false,
    hasProfile: false,
  });
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(12);

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        status: filters.status === 'all' ? '' : filters.status,
        ...filters,
      });
      setCustomers(data.customers || data.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCustomers();
  }, [currentPage, filters, searchQuery]);

  // Handle filter changes
  const handleFilterChange = (field: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle tab change
  const handleTabChange = (newValue: string) => {
    setSelectedTab(newValue);
    handleFilterChange('status', newValue === 'all' ? '' : newValue);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: 'all',
      gender: '',
      ageRange: '',
      location: '',
      hasPhotos: false,
      hasProfile: false,
    });
    setSearchQuery('');
    setSelectedTab('all');
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.gender) count++;
    if (filters.ageRange) count++;
    if (filters.location) count++;
    if (filters.hasPhotos) count++;
    if (filters.hasProfile) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600">Manage your customer profiles</p>
          </div>
          <button
            onClick={() => navigate('/customers/new')}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-card border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchCustomers()}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            {searchQuery && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          
          {/* Filter Button */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors ${
                activeFiltersCount > 0 ? 'bg-primary-50 border-primary-300 text-primary-700' : 'bg-white text-gray-700'
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary-600 text-white">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            
            <button
              onClick={fetchCustomers}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Filter Dropdown */}
        {filterOpen && (
          <div className="mt-4 p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  value={filters.gender}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Genders</option>
                  {GENDERS.map((gender) => (
                    <option key={gender} value={gender.toLowerCase()}>
                      {gender}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
                <select
                  value={filters.ageRange}
                  onChange={(e) => handleFilterChange('ageRange', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Ages</option>
                  {AGE_RANGES.map((range) => (
                    <option key={range} value={range}>
                      {range} years
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Locations</option>
                  {LOCATIONS.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-col justify-end">
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.hasPhotos}
                      onChange={(e) => handleFilterChange('hasPhotos', e.target.checked)}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Has Photos</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.hasProfile}
                      onChange={(e) => handleFilterChange('hasProfile', e.target.checked)}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Complete Profile</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={clearFilters}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Clear All
              </button>
              <button
                onClick={() => setFilterOpen(false)}
                className="px-4 py-1 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedTab === tab.value
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center">
                  {tab.label}
                  <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    selectedTab === tab.value 
                      ? 'bg-primary-100 text-primary-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tab.count}
                  </span>
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-card p-6 animate-pulse">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : customers.length === 0 ? (
        // Empty State
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
            <Users className="h-full w-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || activeFiltersCount > 0 
              ? "Try adjusting your search or filters to find customers." 
              : "Get started by adding your first customer."
            }
          </p>
          {!searchQuery && activeFiltersCount === 0 && (
            <button
              onClick={() => navigate('/customers/new')}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Customer
            </button>
          )}
        </div>
      ) : (
        // Customer Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow duration-200"
              onClick={() => navigate(`/customers/${customer.id}`)}
              style={{ cursor: 'pointer' }}
              >
                <div className="flex items-center space-x-4"> 
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                      {customer.firstName?.[0]}{customer.lastName?.[0]}
                    </div>  
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">
                      {customer.firstName} {customer.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {customer.email}
                    </p>
                  </div>
                </div>
          
              </div>