import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { usePreferences } from '../context/PreferencesContext';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MobileContainer from '../components/MobileContainer';
import './preferences-complete.css';

const PreferencesComplete: React.FC = () => {
  const { preferences } = usePreferences();
  
  // 添加调试信息
  console.log('PreferencesComplete component loaded');
  console.log('Current preferences:', preferences);
  
  // 模拟个性化建议
  const personalizedSuggestions = [
    {
      category: '沟通风格',
      suggestion: '基于你的偏好，我们建议在共识过程中采用直接表达和小组讨论相结合的方式。',
      icon: <TrendingUpIcon />,
    },
    {
      category: 'AI辅助',
      suggestion: 'AI将作为问题引导者和信息整理者，帮助你更高效地达成共识。',
      icon: <PsychologyIcon />,
    },
    {
      category: '反馈机制',
      suggestion: '你将收到实时反馈和可视化展示，让共识过程更加透明。',
      icon: <CheckCircleIcon />,
    },
  ];

  const handleBackToHome = () => {
    console.log('Navigating to home');
    window.location.href = '/home';
  };

  const handleStartConsensus = () => {
    console.log('Starting consensus');
    // 跳转到发起共识页面
    window.location.href = '/home';
  };

  // 如果preferences为空，显示加载状态
  if (!preferences || Object.keys(preferences).length === 0) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar style={{ '--background': '#ff5a5e', '--color': '#ffffff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
              <IconButton 
                sx={{ color: '#ffffff', mr: 2 }}
                onClick={handleBackToHome}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                设置完成
              </Typography>
            </Box>
          </IonToolbar>
        </IonHeader>
        
                 <IonContent fullscreen>
           <MobileContainer sx={{ 
             p: 2, 
             textAlign: 'center',
             paddingBottom: 'env(safe-area-inset-bottom)',
           }}>
            <Typography variant="h5" sx={{ color: '#333', mb: 2 }}>
              正在加载偏好设置...
            </Typography>
            <Button
              variant="contained"
              onClick={handleBackToHome}
              sx={{
                bgcolor: '#ff5a5e',
                '&:hover': {
                  bgcolor: '#e64549',
                },
              }}
            >
              返回首页
            </Button>
                     </MobileContainer>
         </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#ff5a5e', '--color': '#ffffff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
            <IconButton 
              sx={{ color: '#ffffff', mr: 2 }}
              onClick={handleBackToHome}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
              设置完成
            </Typography>
          </Box>
        </IonToolbar>
      </IonHeader>
      
             <IonContent fullscreen>
         <MobileContainer sx={{ 
           p: 2,
           paddingBottom: 'env(safe-area-inset-bottom)',
         }}>
          {/* 完成状态 */}
          <Card sx={{ mb: 3, textAlign: 'center', bgcolor: '#f8f9fa' }}>
            <CardContent sx={{ py: 4 }}>
              <CheckCircleIcon sx={{ fontSize: 80, color: '#ff5a5e', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                个性化设置完成！
              </Typography>
              <Typography variant="body1" sx={{ color: '#666' }}>
                我们已经根据你的偏好为你定制了专属的共识体验
              </Typography>
            </CardContent>
          </Card>

          {/* 个性化建议 */}
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
            个性化建议
          </Typography>
          
          {personalizedSuggestions.map((suggestion, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#ff5a5e', mr: 2, mt: 0.5 }}>
                    {suggestion.icon}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                      {suggestion.category}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                      {suggestion.suggestion}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}

          {/* 你的偏好总结 */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
                你的偏好总结
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Object.entries(preferences).map(([questionId, options]) => (
                  options.map((option, index) => (
                    <Chip
                      key={`${questionId}-${index}`}
                      label={option}
                      size="small"
                      sx={{
                        bgcolor: '#ff5a5e',
                        color: '#ffffff',
                        fontSize: '0.8rem',
                      }}
                    />
                  ))
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* 下一步行动 */}
          <Card sx={{ mb: 3, bgcolor: '#fff3cd', border: '1px solid #ffeaa7' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#856404', mb: 2 }}>
                下一步
              </Typography>
              <Typography variant="body2" sx={{ color: '#856404', mb: 2 }}>
                现在你可以开始使用合拍Hopa进行共识活动了。AI将根据你的偏好为你提供个性化的建议和辅助。
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleBackToHome}
                  sx={{
                    borderColor: '#ff5a5e',
                    color: '#ff5a5e',
                    '&:hover': {
                      borderColor: '#e64549',
                      bgcolor: 'rgba(255, 90, 94, 0.04)',
                    },
                  }}
                >
                  返回首页
                </Button>
                <Button
                  variant="contained"
                  onClick={handleStartConsensus}
                  sx={{
                    bgcolor: '#ff5a5e',
                    '&:hover': {
                      bgcolor: '#e64549',
                    },
                  }}
                >
                  发起共识
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* 个性化程度 */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
                个性化程度
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    个性化匹配度
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ff5a5e', fontWeight: 500 }}>
                    95%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={95}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: '#f0f0f0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#ff5a5e',
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
                基于你的偏好设置，我们为你提供了高度个性化的共识体验。你可以随时在设置中调整这些偏好。
              </Typography>
            </CardContent>
          </Card>
                 </MobileContainer>
       </IonContent>
    </IonPage>
  );
};

export default PreferencesComplete;
