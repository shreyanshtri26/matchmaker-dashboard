import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Avatar,
  Chip,
  Button,
  Modal,
  Paper,
  TextField,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Person as PersonIcon,
  Cake as CakeIcon,
  LocationCity as LocationCityIcon,
  AttachMoney as AttachMoneyIcon,
  Work as WorkIcon,
  Favorite as FavoriteIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { getCustomerById, getMatchSuggestions, addNoteToCustomer } from '../services/api';
import { Customer, MatchSuggestion } from '../types';

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<MatchSuggestion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [note, setNote] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [customerData, suggestionsData] = await Promise.all([
          getCustomerById(id),
          getMatchSuggestions(id),
        ]);
        setCustomer(customerData);
        setSuggestions(suggestionsData);
      } catch (err) {
        console.error('Failed to fetch customer details:', err);
        setError('Failed to load customer details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [id]);

  const handleSendMatch = (suggestion: MatchSuggestion) => {
    setSelectedMatch(suggestion);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMatch(null);
  };

  const handleAddNote = async () => {
    if (!id || !note) return;
    try {
      const updatedCustomer = await addNoteToCustomer(id, note);
      setCustomer(updatedCustomer);
      setNote('');
    } catch (err) {
      console.error('Failed to add note:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', p: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error || !customer) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error || 'Customer not found.'}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 1 : 3, width: '100%' }}>
      <Grid container spacing={3}>
        {/* Customer Profile */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ width: 80, height: 80, mr: 2 }}>
                  {customer.firstName.charAt(0)}
                  {customer.lastName.charAt(0)}
                </Avatar>
                <div>
                  <Typography variant="h5">{`${customer.firstName} ${customer.lastName}`}</Typography>
                  <Chip label={customer.status} color="primary" size="small" />
                </div>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MailIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">{customer.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">{customer.phoneNumber}</Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notes
              </Typography>
              <List>
                {customer.notes.map((note, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={note} />
                  </ListItem>
                ))}
              </List>
              <Box sx={{ mt: 2 }}>
                <TextField
                  label="New Note"
                  fullWidth
                  multiline
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <Button
                  variant="contained"
                  sx={{ mt: 1 }}
                  onClick={handleAddNote}
                >
                  Add Note
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Match Suggestions */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Match Suggestions
              </Typography>
              {suggestions.map((suggestion) => (
                <Box key={suggestion._id} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">{`${suggestion.profile.firstName} ${suggestion.profile.lastName}`}</Typography>
                  <Typography variant="body2">{`Score: ${suggestion.score}`}</Typography>
                  <Typography variant="body2">{suggestion.explanation}</Typography>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={() => handleSendMatch(suggestion)}
                  >
                    Send Match
                  </Button>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Send Match Modal */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Paper
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Send Match to {customer.firstName}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to send {selectedMatch?.profile.firstName}'s profile to {customer.firstName}?
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button variant="contained" onClick={handleCloseModal} sx={{ ml: 1 }}>
              Send
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
};

export default CustomerDetail;
