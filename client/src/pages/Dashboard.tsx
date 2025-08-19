import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import {
  People as PeopleIcon,
  Favorite as FavoriteIcon,
  ChatBubble as ChatIcon,
  EventAvailable as EventIcon,
  Timeline as TimelineIcon,
  NotificationsActive as NotificationsIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { Customer, Match, Activity } from '../types';
import StatCard from '../components/dashboard/StatCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import RecentMatches from '../components/dashboard/RecentMatches';
import MatchSuccessRate from '../components/dashboard/MatchSuccessRate';
import { getDashboardStats } from '../services/api';

interface DashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  pendingApprovals: number;
  totalMatches: number;
  successfulMatches: number;
  matchRate: number;
  recentActivities: Activity[];
  recentMatches: Match[];
  monthlyTrends: {
    month: string;
    matches: number;
    successRate: number;
  }[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ width: '100%', p: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 1 : 3, width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {user?.firstName || 'Matchmaker'}!
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Here's what's happening with your matches today.
      </Typography>

      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Customers"
              value={stats?.totalCustomers || 0}
              icon={<PeopleIcon />}
              color={theme.palette.primary.main}
              trend={12.5} // Example trend value
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Matches"
              value={stats?.activeCustomers || 0}
              icon={<FavoriteIcon />}
              color={theme.palette.success.main}
              trend={8.3}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending Approvals"
              value={stats?.pendingApprovals || 0}
              icon={<EventIcon />}
              color={theme.palette.warning.main}
              trend={-3.2}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Successful Matches"
              value={stats?.successfulMatches || 0}
              icon={<TimelineIcon />}
              color={theme.palette.info.main}
              trend={24.1}
              suffix={`/ ${stats?.totalMatches || 0}`}
            />
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ mb: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Match Success Rate
                </Typography>
                <Box sx={{ height: 300 }}>
                  <MatchSuccessRate data={stats?.monthlyTrends || []} />
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Matches
                </Typography>
                <RecentMatches matches={stats?.recentMatches || []} />
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 1, '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' }, borderRadius: 1 }}>
                    <PeopleIcon color="primary" sx={{ mr: 1 }} />
                    <Typography>Add New Customer</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 1, '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' }, borderRadius: 1 }}>
                    <FavoriteIcon color="secondary" sx={{ mr: 1 }} />
                    <Typography>Suggest Matches</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 1, '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' }, borderRadius: 1 }}>
                    <ChatIcon color="info" sx={{ mr: 1 }} />
                    <Typography>View Messages</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 1, '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' }, borderRadius: 1 }}>
                    <NotificationsIcon color="warning" sx={{ mr: 1 }} />
                    <Typography>Notifications</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <ActivityFeed activities={stats?.recentActivities || []} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
