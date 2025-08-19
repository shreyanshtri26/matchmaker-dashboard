import React from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  useTheme,
  Skeleton,
  SxProps,
  Theme,
  Avatar,
  Chip,
} from '@mui/material';
import { 
  PersonAdd as PersonAddIcon,
  Favorite as FavoriteIcon,
  Message as MessageIcon,
  EventNote as EventIcon,
  CheckCircle as CheckCircleIcon,
  Block as BlockIcon,
  Edit as EditIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { Activity } from '../../types';

interface ActivityFeedProps {
  activities: Activity[];
  maxItems?: number;
  loading?: boolean;
  sx?: SxProps<Theme>;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'login':
      return <NotificationsIcon color="info" />;
    case 'profile_view':
      return <PersonAddIcon color="primary" />;
    case 'profile_edit':
      return <EditIcon color="warning" />;
    case 'match_sent':
      return <FavoriteIcon color="error" />;
    case 'match_accepted':
      return <CheckCircleIcon color="success" />;
    case 'match_rejected':
      return <BlockIcon color="error" />;
    case 'message_sent':
      return <MessageIcon color="info" />;
    case 'note_added':
      return <EventIcon color="secondary" />;
    default:
      return <NotificationsIcon color="action" />;
  }
};

const getActivityText = (activity: Activity) => {
  const { type, description, metadata } = activity;
  const userName = metadata?.userName || 'a user';
  
  switch (type) {
    case 'login':
      return `${userName} logged in`;
    case 'profile_view':
      return `Viewed profile of ${metadata?.targetName || 'a customer'}`;
    case 'profile_edit':
      return `Updated profile for ${metadata?.targetName || 'a customer'}`;
    case 'match_sent':
      return `Sent match between ${metadata?.customer1 || 'customer 1'} and ${metadata?.customer2 || 'customer 2'}`;
    case 'match_accepted':
      return `Match accepted by ${metadata?.customerName || 'a customer'}`;
    case 'match_rejected':
      return `Match declined by ${metadata?.customerName || 'a customer'}`;
    case 'message_sent':
      return `New message from ${userName}`;
    case 'note_added':
      return `Added a note to ${metadata?.targetName || 'a profile'}`;
    default:
      return description || 'Activity occurred';
  }
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  maxItems = 5,
  loading = false,
  sx = {},
}) => {
  const theme = useTheme();

  // Sort activities by date (newest first) and limit to maxItems
  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, maxItems);

  if (loading) {
    return (
      <Box sx={sx}>
        {[...Array(3)].map((_, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Box display="flex" alignItems="center" gap={2} p={1}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton width="80%" height={20} />
                <Skeleton width="60%" height={16} />
              </Box>
            </Box>
            {index < 2 && <Divider />}
          </Box>
        ))}
      </Box>
    );
  }

  if (recentActivities.length === 0) {
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
        <Typography variant="body1" color="text.secondary">
          No recent activities
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Activities will appear here
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ p: 0, ...sx }}>
      {recentActivities.map((activity, index) => (
        <React.Fragment key={activity.id}>
          <ListItem 
            alignItems="flex-start"
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                borderRadius: 1,
              },
              transition: 'background-color 0.2s',
              py: 1.5,
              px: 2,
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
              <Avatar 
                sx={{
                  bgcolor: 'transparent',
                  color: 'inherit',
                  width: 36,
                  height: 36,
                }}
              >
                {getActivityIcon(activity.type)}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography 
                  variant="body2" 
                  component="div"
                  sx={{
                    fontWeight: 500,
                    lineHeight: 1.4,
                  }}
                >
                  {getActivityText(activity)}
                </Typography>
              }
              secondary={
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: 'inline-block',
                    mt: 0.5,
                  }}
                >
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </Typography>
              }
              sx={{ m: 0 }}
            />
            {activity.metadata?.priority === 'high' && (
              <Chip 
                label="High" 
                size="small" 
                color="error" 
                sx={{ 
                  height: 20,
                  fontSize: '0.65rem',
                  '& .MuiChip-label': { px: 0.75 },
                }} 
              />
            )}
          </ListItem>
          {index < recentActivities.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default ActivityFeed;
