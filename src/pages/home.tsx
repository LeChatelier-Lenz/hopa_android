import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
  Tab,
  Tabs,
  Typography,
  Stack,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import UserAvatar from '../components/UserAvatar';
import './home.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const Home: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const mockConsensusData = {
    title: "周末聚餐地点选择",
    date: "2024-01-15",
    status: "进行中",
    progress: 75,
    participants: 8,
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#ff5a5e', '--color': '#ffffff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
            <UserAvatar username="张三" size="small" />
            <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
              合拍 Hopa
            </Typography>
            <IconButton sx={{ color: '#ffffff' }}>
              <SettingsIcon />
            </IconButton>
          </Box>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <Box sx={{ p: 2 }}>
          {/* 发起共识区域 */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                bgcolor: '#ff5a5e',
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(255, 90, 94, 0.3)',
                '&:hover': {
                  bgcolor: '#e64549',
                },
              }}
            >
              发起共识
            </Button>
          </Box>

          {/* 切换栏 */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  color: '#666',
                  fontWeight: 500,
                  '&.Mui-selected': {
                    color: '#ff5a5e',
                  },
                },
                '& .MuiTabs-indicator': {
                  bgcolor: '#ff5a5e',
                },
              }}
            >
              <Tab label="共识看板" />
              <Tab label="为你推荐" />
              <Tab label="全部分类" />
            </Tabs>
          </Box>

          {/* 共识看板内容 */}
          <TabPanel value={tabValue} index={0}>
            {/* 当前共识卡片 */}
            <Card sx={{ mb: 3, cursor: 'pointer', '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.12)' } }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                    {mockConsensusData.title}
                  </Typography>
                  <Chip 
                    label={mockConsensusData.status} 
                    size="small"
                    sx={{ 
                      bgcolor: '#ff5a5e', 
                      color: '#ffffff',
                      fontWeight: 500,
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarTodayIcon sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {mockConsensusData.date}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', ml: 2 }}>
                    {mockConsensusData.participants}人参与
                  </Typography>
                </Box>

                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      达成进度
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ff5a5e', fontWeight: 500 }}>
                      {mockConsensusData.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={mockConsensusData.progress}
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
              </CardContent>
            </Card>

            {/* 共识里程碑 */}
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
              共识里程碑
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Card sx={{ flex: 1, cursor: 'pointer', '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.12)' } }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <TrendingUpIcon sx={{ fontSize: 40, color: '#ff5a5e', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff5a5e', mb: 0.5 }}>
                    12
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    本年度共识达成
                  </Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ flex: 1, cursor: 'pointer', '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.12)' } }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <CalendarTodayIcon sx={{ fontSize: 40, color: '#ff5a5e', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff5a5e', mb: 0.5 }}>
                    3
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    待完成共识
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>

          {/* 为你推荐内容 */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="body1" sx={{ color: '#666', textAlign: 'center', py: 4 }}>
              基于你的偏好，为你推荐相关共识活动
            </Typography>
          </TabPanel>

          {/* 全部分类内容 */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="body1" sx={{ color: '#666', textAlign: 'center', py: 4 }}>
              浏览所有共识分类和活动
            </Typography>
          </TabPanel>
        </Box>
      </IonContent>
    </IonPage>
  );
};

export default Home;
