import React, { ReactNode } from 'react';
import { Box, Typography, Button, BoxProps, useTheme, useMediaQuery } from '@mui/material';

interface PageHeaderProps extends BoxProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  titleVariant?: 'h4' | 'h5' | 'h6';
  subtitleVariant?: 'subtitle1' | 'subtitle2' | 'body1' | 'body2';
  divider?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  titleVariant = 'h4',
  subtitleVariant = 'subtitle1',
  divider = true,
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box 
      sx={{ 
        mb: 4,
        ...sx,
      }}
      {...props}
    >
      <Box 
        display="flex" 
        flexDirection={isMobile ? 'column' : 'row'} 
        alignItems={isMobile ? 'flex-start' : 'center'}
        justifyContent="space-between"
        gap={2}
        mb={2}
      >
        <Box>
          <Typography 
            variant={titleVariant} 
            component="h1" 
            fontWeight={600}
            gutterBottom={!subtitle}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant={subtitleVariant} 
              color="text.secondary"
              sx={{ 
                mt: isMobile ? 0.5 : 0,
                maxWidth: 800,
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {action && (
          <Box 
            sx={{ 
              mt: isMobile ? 1 : 0,
              width: isMobile ? '100%' : 'auto',
              '& .MuiButton-root': {
                width: isMobile ? '100%' : 'auto',
              },
            }}
          >
            {action}
          </Box>
        )}
      </Box>
      
      {divider && (
        <Box 
          sx={{ 
            height: 1, 
            bgcolor: 'divider',
            mt: 2,
            mb: 3,
          }} 
        />
      )}
    </Box>
  );
};

export default PageHeader;
