import React from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Divider,
  Chip,
  useTheme,
  Skeleton,
  SxProps,
  Theme,
} from '@mui/material';
import { Match } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

interface RecentMatchesProps {
  matches: Match[];
  maxItems?: number;
  loading?: boolean;
  sx?: SxProps<Theme>;
}

const RecentMatches: React.FC<RecentMatchesProps> = ({
  matches,
  maxItems = 5,
  loading = false,
  sx = {},
}) => {
  const theme = useTheme();
  
  // Sort matches by creation date (newest first) and limit to maxItems
  const recentMatches = [...matches]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, maxItems);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'withdrawn':
        return 'default';
      default:
        return 'info';
    }
  };

  if (loading) {
    return (
      <Box sx={sx}>
        {[...Array(3)].map((_, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Box display="flex" alignItems="center" gap={2} p={2}>
              <Skeleton variant="circular" width={48} height={48} />
              <Box sx={{ flex: 1 }}>
                <Skeleton width="60%" height={24} />
                <Skeleton width="40%" height={20} />
              </Box>
              <Skeleton width={80} height={32} />
            </Box>
            {index < 2 && <Divider />}
          </Box>
        ))}
      </Box>
    );
  }

  if (recentMatches.length === 0) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          p: 4,
          textAlign: 'center',
          ...sx 
        }}
      >
        <Typography variant="body1" color="text.secondary" gutterBottom>
          No recent matches found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          New matches will appear here
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ p: 0, ...sx }}>
      {recentMatches.map((match, index) => (
        <React.Fragment key={match.id}>
          <ListItem 
            alignItems="flex-start" 
            component={Link}
            to={`/matches/${match.id}`}
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                borderRadius: 1,
              },
              transition: 'background-color 0.2s',
            }}
          >
            <ListItemAvatar>
              <Box sx={{ position: 'relative' }}>
                <Avatar 
                  src={match.customer.profilePicture} 
                  alt={match.customer.firstName}
                  sx={{ width: 48, height: 48 }}
                />
                <Avatar 
                  src={match.match.profilePicture} 
                  alt={match.match.firstName}
                  sx={{
                    width: 24,
                    height: 24,
                    position: 'absolute',
                    bottom: -4,
                    right: -4,
                    border: `2px solid ${theme.palette.background.paper}`,
                  }}
                />
              </Box>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="subtitle1" component="div">
                  {`${match.customer.firstName} & ${match.match.firstName}`}
                </Typography>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: 'block' }}
                  >
                    Match score: {Math.round(match.matchScore)}%
                  </Typography>
                  <Typography
                    component="span"
                    variant="caption"
                    color="text.secondary"
                  >
                    {formatDistanceToNow(new Date(match.createdAt), { addSuffix: true })}
                  </Typography>
                </React.Fragment>
              }
              sx={{ ml: 1 }}
            />
            <Chip
              label={match.status.charAt(0).toUpperCase() + match.status.slice(1)}
              color={getStatusColor(match.status) as any}
              size="small"
              sx={{ 
                textTransform: 'capitalize',
                minWidth: 80,
                '& .MuiChip-label': {
                  px: 1,
                },
              }}
            />
          </ListItem>
          {index < recentMatches.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default RecentMatches;
