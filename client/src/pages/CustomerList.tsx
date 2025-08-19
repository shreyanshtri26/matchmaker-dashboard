import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Grid,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { Customer, CustomerStatus } from '../types';
import { getCustomers } from '../services/api';
import PageHeader from '../components/common/PageHeader';
import CustomerStatusChip from '../components/customers/CustomerStatusChip';

// Mock data for filters
const GENDERS = ['Male', 'Female', 'Other'];
const AGE_RANGES = ['18-25', '26-35', '36-45', '46-55', '56+'];
const LOCATIONS = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'];

// Mock data for tabs
const statusTabs = [
  { value: 'all', label: 'All', count: 124 },
  { value: 'active', label: 'Active', count: 84 },
  { value: 'pending', label: 'Pending', count: 12 },
  { value: 'inactive', label: 'Inactive', count: 28 },
];

const CustomerList: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  // State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState({
    status: 'all',
    gender: '',
    ageRange: '',
    location: '',
    hasPhotos: false,
    hasProfile: false,
  });
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      // In a real app, you would pass the filters to your API
      const data = await getCustomers({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        search: searchQuery,
        status: filters.status === 'all' ? '' : filters.status,
        ...filters,
      });
      setCustomers(data.customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCustomers();
  }, [paginationModel, filters]);

  // Handle filter changes
  const handleFilterChange = (field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
    setPaginationModel(prev => ({
      ...prev,
      page: 0, // Reset to first page when filters change
    }));
  };

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
    handleFilterChange('status', newValue === 'all' ? '' : newValue);
  };

  // Handle row click
  const handleRowClick = (params: any) => {
    navigate(`/customers/${params.id}`);
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

  // Columns configuration
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 180,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            src={params.row.profilePicture} 
            alt={params.row.firstName}
            sx={{ width: 36, height: 36 }}
          />
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {params.row.firstName} {params.row.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {params.row.id.slice(0, 8)}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'age',
      headerName: 'Age',
      width: 80,
      valueGetter: (params) => {
        const birthDate = new Date(params.row.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      },
    },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 100,
      valueFormatter: (params) => 
        params.value ? params.value.charAt(0).toUpperCase() + params.value.slice(1) : '',
    },
    {
      field: 'location',
      headerName: 'Location',
      flex: 1,
      minWidth: 120,
      valueGetter: (params) => `${params.row.city}, ${params.row.country}`,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <CustomerStatusChip status={params.value} />
      ),
    },
    {
      field: 'lastActive',
      headerName: 'Last Active',
      width: 150,
      valueFormatter: (params) => 
        new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Button 
          size="small" 
          variant="outlined"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/customers/${params.row.id}`);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', p: isMobile ? 1 : 3 }}>
      <PageHeader 
        title="Customers"
        subtitle="Manage your customer profiles"
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/customers/new')}
          >
            Add Customer
          </Button>
        }
      />

      {/* Search and Filter Bar */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 3, 
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
          <TextField
            placeholder="Search customers..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchCustomers()}
            sx={{ flex: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setFilterOpen(true)}
            sx={{ ml: 'auto' }}
          >
            Filters
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchCustomers}
          >
            Refresh
          </Button>
        </Box>

        {/* Active filters */}
        <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
          {Object.entries(filters).map(([key, value]) => {
            if (!value || (typeof value === 'string' && value === 'all')) return null;
            
            let label = '';
            if (key === 'status') label = `Status: ${value}`;
            else if (key === 'gender') label = `Gender: ${value}`;
            else if (key === 'ageRange') label = `Age: ${value}`;
            else if (key === 'location') label = `Location: ${value}`;
            else if (key === 'hasPhotos' && value) label = 'With Photos';
            else if (key === 'hasProfile' && value) label = 'Profile Complete';
            
            if (!label) return null;
            
            return (
              <Chip
                key={key}
                label={label}
                onDelete={() => handleFilterChange(key, key === 'status' ? 'all' : '')}
                size="small"
                sx={{ 
                  '& .MuiChip-deleteIcon': {
                    color: 'inherit',
                    opacity: 0.7,
                    '&:hover': { opacity: 1 },
                  },
                }}
              />
            );
          })}
          
          {(Object.values(filters).some(v => v && v !== 'all') || searchQuery) && (
            <Button
              size="small"
              onClick={clearFilters}
              sx={{ ml: 1 }}
            >
              Clear all
            </Button>
          )}
        </Box>
      </Paper>

      {/* Status Tabs */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          mb: 3,
          '& .MuiTabs-indicator': {
            height: 3,
          },
        }}
      >
        {statusTabs.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{tab.label}</span>
                <Chip
                  label={tab.count}
                  size="small"
                  sx={{
                    height: 20,
                    minWidth: 20,
                    '& .MuiChip-label': {
                      px: 0.5,
                      fontSize: '0.7rem',
                    },
                  }}
                />
              </Box>
            }
            sx={{
              minHeight: 48,
              textTransform: 'none',
              fontWeight: selectedTab === tab.value ? 600 : 400,
              '&.Mui-selected': {
                color: 'primary.main',
              },
            }}
          />
        ))}
      </Tabs>

      {/* Data Grid */}
      <Paper 
        elevation={0} 
        sx={{ 
          height: 'calc(100vh - 300px)', 
          width: '100%',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <DataGrid
          rows={customers}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pagination
          checkboxSelection
          disableRowSelectionOnClick
          onRowClick={handleRowClick}
          rowCount={customers.length} // In a real app, this would come from the API
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: theme.palette.background.default,
              borderBottom: `1px solid ${theme.palette.divider}`,
            },
            '& .MuiDataGrid-cell': {
              borderBottom: `1px solid ${theme.palette.divider}`,
            },
            '& .MuiDataGrid-row': {
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.light + '22',
                '&:hover': {
                  backgroundColor: theme.palette.primary.light + '33',
                },
              },
            },
          }}
        />
      </Paper>

      {/* Filter Dialog */}
      <Dialog 
        open={filterOpen} 
        onClose={() => setFilterOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Filter Customers</Typography>
            <IconButton onClick={() => setFilterOpen(false)}>
              <ClearIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small" margin="normal">
                <InputLabel>Gender</InputLabel>
                <Select
                  value={filters.gender}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                  label="Gender"
                >
                  <MenuItem value="">All Genders</MenuItem>
                  {GENDERS.map((gender) => (
                    <MenuItem key={gender} value={gender.toLowerCase()}>
                      {gender}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small" margin="normal">
                <InputLabel>Age Range</InputLabel>
                <Select
                  value={filters.ageRange}
                  onChange={(e) => handleFilterChange('ageRange', e.target.value)}
                  label="Age Range"
                >
                  <MenuItem value="">All Ages</MenuItem>
                  {AGE_RANGES.map((range) => (
                    <MenuItem key={range} value={range}>
                      {range} years
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small" margin="normal">
                <InputLabel>Location</InputLabel>
                <Select
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  label="Location"
                >
                  <MenuItem value="">All Locations</MenuItem>
                  {LOCATIONS.map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.hasPhotos}
                    onChange={(e) => handleFilterChange('hasPhotos', e.target.checked)}
                    color="primary"
                  />
                }
                label="Has Profile Photos"
              />
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.hasProfile}
                    onChange={(e) => handleFilterChange('hasProfile', e.target.checked)}
                    color="primary"
                  />
                }
                label="Profile Complete"
                sx={{ ml: 3 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button onClick={clearFilters} color="inherit">
            Clear All
          </Button>
          <Button 
            onClick={() => setFilterOpen(false)} 
            variant="contained" 
            color="primary"
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerList;
