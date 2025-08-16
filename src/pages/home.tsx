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
import { useHistory } from 'react-router-dom';
import backgroundDecor from '../assets/images/background_orange.png';
import cardHopaIcon from '../assets/images/card_hopa_icon.png';
import userAvatar from '../assets/images/avatar.png';
import './home.css';
import { ArrowForward, ArrowForwardIos, ArrowForwardIosOutlined, ArrowForwardIosRounded, ArrowForwardRounded, ArrowRight, ArrowRightAlt, ArrowRightAltRounded } from '@mui/icons-material';

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
  const history = useHistory();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleLaunchConsensus = () => {
    history.push('/launch');
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
        <IonToolbar style={{ 
          '--background': 'linear-gradient(135deg, #ff5a5e 0%, #ff7a7e 100%)', 
          '--color': '#ffffff',
          '--min-height': '80px',
          '--padding-top': '16px',
          '--padding-bottom': '16px',
        }}>
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'row-reverse',
            alignItems: 'center', 
            justifyContent: 'space-between', 
            px: 2,
            height: '100%',
            
          }}>
            
            <Typography variant="h3" sx={{ 
              color: '#ffffff', 
              fontWeight: 700,
              textAlign: 'center',
              flex: 1,
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}>
              合拍 Hopa
            </Typography>
            <IconButton sx={{ 
              color: '#ffffff',
              
              background: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
              }
            }}>
              <SettingsIcon />
            </IconButton>
          </Box>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        {/* 背景装饰 */}
        <Box
          sx={{
            position: 'fixed',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '800px',
            zIndex: -1,
            opacity: 0.5,
            pointerEvents: 'none',
          }}
        >
          <img
            src={backgroundDecor}
            alt="背景装饰"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>
        
        <Box>
          {/* 用户头像与应用问候语 */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'start', 
            justifyContent: 'center',
            px: 3,
            py: 1 
           }}>
            <UserAvatar username="Julia" size="large" src={userAvatar} />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                ml: 2,
              }}
            >
              <Typography variant="h4" sx={{fontWeight: 600, color: '#333' }}>
                Hi, Julia!
              </Typography>
              <Typography variant="h4" sx={{fontWeight: 600,  color: '#333' }}>
                今天有什么计划？
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Box sx={{ p: 2, 
          backgroundColor: 'rgba(254, 233, 233, 0.71)',
          boxShadow: '0px 1.0589px 4.23561px rgba(0, 0, 0, 0.2)',
          borderRadius: '54.004px 54.004px 0 0',
          mt: 2,
        }}>
          {/* 发起共识区域 */}
          <Box sx={{ mb: 1, textAlign: 'center' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon sx={{ fontSize: 24 }} />}
              onClick={handleLaunchConsensus}
              className="gradient-button-primary"
              sx={{
                width:"70%",
                borderRadius: 5,
                px: 4,
                py: 1.5,
                fontSize: '1.3rem',
                fontWeight: 600,
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
              }}
            >
              发起共识
            </Button>
          </Box>

          {/* 切换栏 */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs 
              centered
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
            {/* 当前共识卡片 - 手账本风格 */}
            <Box 
              sx={{ 
                mb: 3, 
                cursor: 'pointer',
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.3s ease',
                },
              }}
            >
              {/* 手账本主体 */}
              <Box
                sx={{
                  background: 'radial-gradient(100% 242.54% at 0% 13.32%, rgba(255, 89, 93, 0.7) 0%, rgba(255, 120, 42, 0.7) 100%)',
                  borderRadius: '30px',
                  boxShadow: '0 8px 32px rgba(255, 90, 94, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(20px)',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                {/* 内层卡片 */}
                <Box
                  sx={{
                    background: 'rgba(250, 250, 250, 0.58)',
                    borderRadius: '19px',
                    ml: '12px',
                    mb: '12px',
                    padding: '20px',
                    backdropFilter: 'blur(21px)',
                    boxShadow: 'inset 0 2px 8px rgba(255, 255, 255, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {/* 左上角装饰图标 */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '-15px',
                      left: '-10px',
                      width: '96px',
                      height: '96px',
                      // background: 'linear-gradient(141.51deg, #FF595D 8.05%, #FF782A 93.21%)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      // boxShadow: '0 4px 16px rgba(255, 90, 94, 0.3)',
                      // border: '2px solid rgba(255, 255, 255, 0.3)',
                      zIndex: 2,
                      background: "transparent",
                      transform: 'rotate(8deg)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '2px',
                        left: '2px',
                        right: '2px',
                        bottom: '2px',
                        // background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        // backdropFilter: 'blur(5px)',
                      },
                    }}
                  >
                    <img
                      src={cardHopaIcon}
                      alt="Hopa装饰"
                      style={{
                        width: '128px',
                        height: '128px',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                      }}
                    />
                  </Box>

                  {/* 右上角状态标签 */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'linear-gradient(90deg, #FF595D 0%, #FF782A 100%)',
                      borderRadius: '20px',
                      padding: '6px 12px',
                      boxShadow: '0 4px 12px rgba(255, 90, 94, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#ffffff', 
                        fontWeight: 700,
                        fontSize: '14px',
                        letterSpacing: '0.5px',
                      }}
                    >
                      当前共识
                    </Typography>
                    <ArrowForwardIosRounded sx={{ fontSize: 14, color: '#ffffff' }} />
                
                  </Box>

                  {/* 内容区域 */}
                  <Box sx={{ pt: 5 }}>
                    {/* 标题区域 */}
                    <Box sx={{ mb: 1 }}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 700, 
                          color: '#C42024',
                          fontSize: '28px',
                          lineHeight: 1.2,
                          mb: 1,
                          background: 'linear-gradient(90.55deg, #C42024 11.41%, #FF595D 94.77%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        「{mockConsensusData.title}」
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: '#C42024', 
                            fontWeight: 700,
                            fontSize: '16px',
                          }}
                        >
                          已合拍！
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#C42024', 
                            fontWeight: 700,
                            fontSize: '14px',
                          }}
                        >
                          {mockConsensusData.date}
                        </Typography>
                      </Box>
                    </Box>

                    {/* 分隔线 */}
                    <Box 
                      sx={{ 
                        height: '1px', 
                        background: 'linear-gradient(90deg, transparent 0%, #737373 50%, transparent 100%)',
                        mb: 1,
                        opacity: 0.6,
                      }} 
                    />

                    {/* 进度条区域 */}
                    <Box sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            background: '#444444',
                            borderRadius: '22px',
                            padding: '3px 8px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#ffffff', 
                              fontWeight: 700,
                              fontSize: '12px',
                              letterSpacing: '0.5px',
                            }}
                          >
                            签名进度
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#4E4E4E', 
                            fontWeight: 700,
                            fontSize: '12px',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                        >
                          查看更多
                        </Typography>
                      </Box>

                      {/* 进度条容器 */}
                      <Box sx={{ position: 'relative', mb: 1 }}>
                        {/* 背景进度条 */}
                        <Box
                          sx={{
                            height: '20px',
                            background: 'rgba(217, 217, 217, 0.56)',
                            borderRadius: '30px',
                            overflow: 'hidden',
                            position: 'relative',
                          }}
                        >
                          {/* 填充进度条 */}
                          <Box
                            sx={{
                              height: '100%',
                              width: `${mockConsensusData.progress}%`,
                              background: 'linear-gradient(90deg, #FF595D 0%, #FF792C 98.89%)',
                              borderRadius: '30px',
                              boxShadow: 'inset 0 2px 8px rgba(255, 255, 255, 0.3)',
                              position: 'relative',
                              transition: 'width 0.8s ease',
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                right: '0',
                                bottom: '0',
                                background: 'radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)',
                                borderRadius: '30px',
                              },
                            }}
                          />
                        </Box>

                        {/* 进度条标签 */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: '#4E4E4E', 
                              fontWeight: 700,
                              fontSize: '10px',
                            }}
                          >
                            开始签名
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: '#4E4E4E', 
                              fontWeight: 700,
                              fontSize: '10px',
                            }}
                          >
                            达成共识
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

             
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* 共识里程碑 */}
            
            <Box sx={{ display: 'flex', gap: 1 ,mt:1}}>
              <Card className="gradient-card" sx={{ flex: 1, cursor: 'pointer',
                
               }}>
                <CardContent sx={{ 
                  textAlign: 'center', 
                  py: 3
                }}>
                <Box
                    sx={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'linear-gradient(90deg, #FF595D 0%, #FF782A 100%)',
                      borderRadius: '20px',
                      padding: '3px 6px',
                      boxShadow: '0 4px 12px rgba(255, 90, 94, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        textAlign: 'center',
                        m:"auto",
                        color: '#ffffff', 
                        fontWeight: 700,
                        fontSize: '10px',
                        fontFamily: "AlimamaShuHeiTi",
                        letterSpacing: '0.5px',
                      }}
                    >
                      去看看
                    </Typography>
                    <ArrowForwardIosRounded sx={{ fontSize: 14, color: '#ffffff' }} />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'start',
                      my: 3,
                      ml: 2,
                    }}
                  >
                      <TrendingUpIcon sx={{ fontSize: 40, color: '#ff5a5e'}} />
                      <Typography variant="h1" sx={{ fontWeight: 700, color: '#ff5a5e',
                          ml:2
                      }}>
                        12
                      </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontSize: '16px',fontWeight: 700,color: '#666' }}>
                    本年度共识达成
                  </Typography>
                </CardContent>
              </Card>
              
              <Card  className="gradient-card" sx={{ flex: 1, cursor: 'pointer' }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box
                    sx={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'linear-gradient(90deg, #FF595D 0%, #FF782A 100%)',
                      borderRadius: '20px',
                      padding: '3px 6px',
                      boxShadow: '0 4px 12px rgba(255, 90, 94, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        textAlign: 'center',
                        m:"auto",
                        color: '#ffffff', 
                        fontWeight: 700,
                        fontSize: '10px',
                        fontFamily: "AlimamaShuHeiTi",
                        letterSpacing: '0.5px',
                      }}
                    >
                      去看看
                    </Typography>
                    <ArrowForwardIosRounded sx={{ fontSize: 14, color: '#ffffff' }} />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', my: 3, ml: 2 }}>
                    <CalendarTodayIcon sx={{ fontSize: 40, color: '#ff5a5e'}} />
                    <Typography variant="h1" sx={{ fontWeight: 700, color: '#ff5a5e', ml: 2 }}>
                      3
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontSize: '16px',fontWeight: 700, color: '#666' }}>
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
