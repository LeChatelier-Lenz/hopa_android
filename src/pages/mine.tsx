import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Chip,
  LinearProgress,
} from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ShareIcon from '@mui/icons-material/Share';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import UserAvatar from '../components/UserAvatar';
import './mine.css';

const Mine: React.FC = () => {
  const history = useHistory();
  
  // 模拟用户数据
  const userData = {
    name: '张三',
    avatar: 'https://via.placeholder.com/80x80/ff5a5e/ffffff?text=张',
    hopaValue: 85,
    totalConsensus: 12,
    completedConsensus: 9,
    currentConsensus: 3,
  };

  // 模拟共识链路数据
  const consensusHistory = [
    {
      id: '1',
      title: '周末聚餐地点选择',
      date: '2024-01-15',
      status: 'completed',
      participants: 8,
    },
    {
      id: '2',
      title: '团队建设活动',
      date: '2024-01-10',
      status: 'completed',
      participants: 12,
    },
    {
      id: '3',
      title: '项目技术方案讨论',
      date: '2024-01-08',
      status: 'completed',
      participants: 6,
    },
    {
      id: '4',
      title: '年度旅行计划',
      date: '2024-01-05',
      status: 'in_progress',
      participants: 15,
    },
  ];

  const menuItems = [
    {
      id: 'personalization',
      title: '深度个性化',
      icon: <PersonIcon />,
      description: '完善个人偏好设置',
    },
    {
      id: 'calendar',
      title: '同步到日历',
      icon: <CalendarTodayIcon />,
      description: '将共识活动同步到日历',
    },
    {
      id: 'faq',
      title: '常见问题',
      icon: <HelpOutlineIcon />,
      description: '查看使用帮助',
    },
    {
      id: 'settings',
      title: '更多设置',
      icon: <SettingsIcon />,
      description: '应用设置和隐私',
    },
  ];

  const handleMenuItemClick = (id: string) => {
    console.log('Menu item clicked:', id);
    if (id === 'personalization') {
      history.push('/preferences');
    }
  };

  const handleQrCodeClick = () => {
    console.log('QR code clicked');
  };

  const handleShareClick = () => {
    console.log('Share clicked');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#ff5a5e', '--color': '#ffffff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
            <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
              个人主页
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton sx={{ color: '#ffffff' }} onClick={handleQrCodeClick}>
                <QrCodeIcon />
              </IconButton>
              <IconButton sx={{ color: '#ffffff' }} onClick={handleShareClick}>
                <ShareIcon />
              </IconButton>
            </Box>
          </Box>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <Box sx={{ p: 2 }}>
          {/* 用户基本信息 */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <UserAvatar
                  username={userData.name}
                  src={userData.avatar}
                  size="large"
                  sx={{ mr: 3 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                    {userData.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1" sx={{ color: '#ff5a5e', fontWeight: 600, mr: 1 }}>
                      Hopa值: {userData.hopaValue}
                    </Typography>
                    <Chip
                      label="活跃用户"
                      size="small"
                      sx={{
                        bgcolor: '#ff5a5e',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        height: 20,
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    已参与 {userData.totalConsensus} 个共识活动
                  </Typography>
                </Box>
              </Box>

              {/* 共识统计 */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff5a5e', mb: 0.5 }}>
                    {userData.completedConsensus}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    已完成
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff5a5e', mb: 0.5 }}>
                    {userData.currentConsensus}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    进行中
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff5a5e', mb: 0.5 }}>
                    {Math.round((userData.completedConsensus / userData.totalConsensus) * 100)}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    达成率
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* 共识链路 */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ color: '#ff5a5e', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                  共识链路
                </Typography>
              </Box>
              
              <Box sx={{ position: 'relative' }}>
                {/* 连接线 */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: 20,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    bgcolor: '#ff5a5e',
                    opacity: 0.3,
                  }}
                />
                
                {consensusHistory.map((item, index) => (
                  <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {/* 节点 */}
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: item.status === 'completed' ? '#ff5a5e' : '#ccc',
                        border: '2px solid #fff',
                        boxShadow: '0 0 0 2px #ff5a5e',
                        zIndex: 1,
                        mr: 2,
                      }}
                    />
                    
                    {/* 内容 */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333', mb: 0.5 }}>
                        {item.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {item.date}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {item.participants}人参与
                        </Typography>
                        <Chip
                          label={item.status === 'completed' ? '已完成' : '进行中'}
                          size="small"
                          sx={{
                            bgcolor: item.status === 'completed' ? '#e8f5e8' : '#fff3cd',
                            color: item.status === 'completed' ? '#2e7d32' : '#856404',
                            fontSize: '0.7rem',
                            height: 20,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* 个人主页选项 */}
          <Card>
            <CardContent sx={{ p: 0 }}>
              <List>
                {menuItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItemButton
                      onClick={() => handleMenuItemClick(item.id)}
                      sx={{ py: 2 }}
                    >
                      <ListItemIcon sx={{ color: '#ff5a5e' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.title}
                        secondary={item.description}
                        primaryTypographyProps={{
                          sx: { fontWeight: 500, color: '#333' },
                        }}
                        secondaryTypographyProps={{
                          sx: { color: '#666', fontSize: '0.875rem' },
                        }}
                      />
                      <ChevronRightIcon sx={{ color: '#ccc' }} />
                    </ListItemButton>
                    {index < menuItems.length - 1 && (
                      <Box sx={{ borderBottom: '1px solid #f0f0f0', ml: 4 }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </IonContent>
    </IonPage>
  );
};

export default Mine;
