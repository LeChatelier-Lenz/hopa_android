import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
} from '@mui/material';
import {
  SportsEsports,
  ArrowBack,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';

const GamePage: React.FC = () => {
  const history = useHistory();

  const handleGoBack = () => {
    history.goBack();
  };

  return (
    <Container maxWidth="md">
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
          {/* 游戏图标 */}
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #ff5a5e, #ff7a7e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
              boxShadow: '0 4px 20px rgba(255, 90, 94, 0.3)',
            }}
          >
            <SportsEsports sx={{ fontSize: 50, color: 'white' }} />
          </Box>

          {/* 标题 */}
          <Typography
            variant="h4"
            sx={{
              color: 'text.primary',
              marginBottom: 2,
              fontWeight: 600,
            }}
          >
            共识达成游戏
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ marginBottom: 3 }}
          >
            游戏功能正在开发中...
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ marginBottom: 4, maxWidth: 500 }}
          >
            这里将是合拍Hopa的核心游戏功能，通过有趣的2D游戏方式帮助用户快速达成共识。
            游戏将包含AI驱动的分歧解决机制和互动式问题回答环节。
          </Typography>

          {/* 返回按钮 */}
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={handleGoBack}
            sx={{
              background: 'linear-gradient(45deg, #ff5a5e, #ff7a7e)',
              '&:hover': {
                background: 'linear-gradient(45deg, #ff4a4e, #ff6a6e)',
              },
              minWidth: 150,
            }}
          >
            返回发起页面
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default GamePage;
