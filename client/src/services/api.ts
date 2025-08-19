import { Customer, Match } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const login = async (username: string, password: string): Promise<{ token: string }> => {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Invalid credentials');
  return res.json();
};

export const fetchCustomers = async (): Promise<Customer[]> => {
  const res = await fetch(`${API_BASE}/customers`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

export const fetchCustomer = async (id: string): Promise<Customer> => {
  const res = await fetch(`${API_BASE}/customers/${id}`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

export const fetchMatches = async (customerId: string): Promise<Match[]> => {
  const res = await fetch(`${API_BASE}/matches/${customerId}`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};