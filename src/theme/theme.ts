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
      main: '#6366f1', // 靛蓝色，与主色调形成和谐对比
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fefefe', // 更温暖的白色
      paper: '#ffffff',
    },
    // 添加自定义颜色
    success: {
      main: '#10b981', // 翠绿色
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b', // 琥珀色
      light: '#fbbf24',
      dark: '#d97706',
    },
    info: {
      main: '#3b82f6', // 天蓝色
      light: '#60a5fa',
      dark: '#2563eb',
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
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
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #ff5a5e 0%, #ff7a7e 100%)',
          boxShadow: '0 4px 15px rgba(255, 90, 94, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #ff4a4e 0%, #ff6a6e 100%)',
            boxShadow: '0 6px 20px rgba(255, 90, 94, 0.5)',
          },
        },
        outlined: {
          borderColor: '#ff5a5e',
          color: '#ff5a5e',
          '&:hover': {
            backgroundColor: 'rgba(255, 90, 94, 0.08)',
            borderColor: '#ff4a4e',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
          background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)',
          border: '1px solid rgba(255, 90, 94, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
          },
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
          borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(255, 90, 94, 0.1) 0%, rgba(255, 122, 126, 0.1) 100%)',
          border: '1px solid rgba(255, 90, 94, 0.2)',
          color: '#ff5a5e',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, rgba(255, 90, 94, 0.15) 0%, rgba(255, 122, 126, 0.15) 100%)',
            transform: 'scale(1.05)',
          },
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
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)',
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.3s ease',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ff5a5e',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ff5a5e',
                borderWidth: 2,
              },
            },
          },
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          '& .MuiStepLabel-root': {
            '& .MuiStepLabel-label': {
              color: '#6b7280',
              fontWeight: 500,
            },
            '&.Mui-active .MuiStepLabel-label': {
              color: '#ff5a5e',
              fontWeight: 600,
            },
            '&.Mui-completed .MuiStepLabel-label': {
              color: '#10b981',
              fontWeight: 600,
            },
          },
        },
      },
    },
  },
});
