import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';

const Layout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TDC Matchmaker Dashboard
          </Typography>
          {/* Add user menu/avatar here */}
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
      <Box component="footer" sx={{ p: 2, bgcolor: 'background.paper', mt: 'auto' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          {new Date().getFullYear()} TDC Matchmaker
        </Typography>
      </Box>
      <Toaster position="bottom-right" />
    </Box>
  );
};

export default Layout;
