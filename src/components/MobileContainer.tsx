import React from 'react';
import { Box, BoxProps } from '@mui/material';

interface MobileContainerProps extends BoxProps {
  children: React.ReactNode;
}

const MobileContainer: React.FC<MobileContainerProps> = ({ children, ...props }) => {
  return (
    <Box
      sx={{
        height: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        // 针对不同设备的适配
        '@media (max-width: 768px)': {
          height: '100vh',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        },
        // 针对长屏设备（如1080x2400）
        '@media screen and (min-height: 2000px)': {
          height: '100vh',
          maxHeight: '100vh',
        },
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default MobileContainer;
