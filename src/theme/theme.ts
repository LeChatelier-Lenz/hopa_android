import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#ff5a5e',
      light: '#ff7a7e',
      dark: '#e64549',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f50057',
      light: '#ff5983',
      dark: '#c51162',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"PingFang SC", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
    // 标题字体使用阿里妈妈数黑体
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      fontFamily: '"AlimamaShuHeiTi", "PingFang SC", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
      fontFamily: '"AlimamaShuHeiTi", "PingFang SC", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 500,
      fontFamily: '"AlimamaShuHeiTi", "PingFang SC", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
    },
    h4: {
      fontSize: '1.125rem',
      fontWeight: 500,
      fontFamily: '"AlimamaShuHeiTi", "PingFang SC", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 500,
      fontFamily: '"AlimamaShuHeiTi", "PingFang SC", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 500,
      fontFamily: '"AlimamaShuHeiTi", "PingFang SC", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      fontFamily: '"AlimamaShuHeiTi", "PingFang SC", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      fontFamily: '"AlimamaShuHeiTi", "PingFang SC", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      fontFamily: '"AlimamaShuHeiTi", "PingFang SC", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
          fontFamily: '"AlimamaShuHeiTi", "PingFang SC", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
        },
        contained: {
          boxShadow: '0 2px 8px rgba(255, 90, 94, 0.3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontFamily: '"AlimamaShuHeiTi", "PingFang SC", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"AlimamaShuHeiTi", "PingFang SC", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-h1, &.MuiTypography-h2, &.MuiTypography-h3, &.MuiTypography-h4, &.MuiTypography-h5, &.MuiTypography-h6': {
            fontFamily: '"AlimamaShuHeiTi", "PingFang SC", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
          },
        },
      },
    },
  },
});
