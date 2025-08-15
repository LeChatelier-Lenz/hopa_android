import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
} from '@mui/material';
import {
  Error,
  Home,
  Refresh,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';

interface ErrorPageProps {
  error?: string;
  errorCode?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ 
  error = '页面加载失败', 
  errorCode = '404' 
}) => {
  const history = useHistory();

  const handleGoHome = () => {
    history.push('/home');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          p: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
            border: '1px solid rgba(255, 90, 94, 0.1)',
          }}
        >
          {/* 错误图标 */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #ff5a5e, #ff7a7e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
              boxShadow: '0 4px 20px rgba(255, 90, 94, 0.3)',
            }}
          >
            <Error sx={{ fontSize: 40, color: 'white' }} />
          </Box>

          {/* 错误代码 */}
          <Typography
            variant="h1"
            sx={{
              fontSize: '4rem',
              fontWeight: 700,
              color: '#ff5a5e',
              marginBottom: 1,
              textShadow: '0 2px 10px rgba(255, 90, 94, 0.3)',
            }}
          >
            {errorCode}
          </Typography>

          {/* 错误信息 */}
          <Typography
            variant="h5"
            sx={{
              color: 'text.primary',
              marginBottom: 2,
              fontWeight: 600,
            }}
          >
            {error}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ marginBottom: 3, maxWidth: 400 }}
          >
            抱歉，页面出现了问题。请尝试刷新页面或返回首页。
          </Typography>

          {/* 操作按钮 */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<Home />}
              onClick={handleGoHome}
              sx={{
                background: 'linear-gradient(45deg, #ff5a5e, #ff7a7e)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #ff4a4e, #ff6a6e)',
                },
                minWidth: 120,
              }}
            >
              返回首页
            </Button>

            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              sx={{
                borderColor: '#ff5a5e',
                color: '#ff5a5e',
                '&:hover': {
                  borderColor: '#ff4a4e',
                  backgroundColor: 'rgba(255, 90, 94, 0.04)',
                },
                minWidth: 120,
              }}
            >
              刷新页面
            </Button>
          </Box>

          {/* 联系支持 */}
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="body2" color="text.secondary">
              如果问题持续存在，请联系我们的技术支持
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#ff5a5e',
                fontWeight: 500,
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
              onClick={() => {
                // 这里可以添加联系支持的逻辑
                console.log('联系支持');
              }}
            >
              support@hopa.app
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ErrorPage;
