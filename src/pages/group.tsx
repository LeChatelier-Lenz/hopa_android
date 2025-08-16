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
  Tab,
  Tabs,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import ConsensusPostCard from '../components/ConsensusPostCard';
import backgroundDecor from '../assets/images/background_orange.png';
import './group.css';

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
      id={`group-tabpanel-${index}`}
      aria-labelledby={`group-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const Group: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 模拟帖子数据
  const mockPosts = [
    {
      id: '1',
      user: {
        id: 'user1',
        name: '李小明',
        hopaValue: 85,
      },
      content: {
        title: '周末去哪里玩？',
        description: '想找几个朋友一起出去玩，大家有什么推荐的地方吗？最好是户外活动，天气这么好不想浪费。',
        image: 'https://via.placeholder.com/300x200/ff5a5e/ffffff?text=户外活动',
      },
      stats: {
        likes: 12,
        comments: 8,
        isLiked: false,
        isBookmarked: false,
      },
      tags: ['户外', '周末', '朋友聚会'],
    },
    {
      id: '2',
      user: {
        id: 'user2',
        name: '王小红',
        hopaValue: 92,
      },
      content: {
        title: '晚餐吃什么？',
        description: '今天想尝试新的餐厅，大家有什么推荐吗？最好是中餐，价格不要太贵。',
      },
      stats: {
        likes: 5,
        comments: 3,
        isLiked: true,
        isBookmarked: true,
      },
      tags: ['美食', '中餐', '晚餐'],
    },
    {
      id: '3',
      user: {
        id: 'user3',
        name: '张大山',
        hopaValue: 78,
      },
      content: {
        title: '电影选择困难症',
        description: '最近有什么好看的电影推荐吗？动作片或者科幻片都可以，不要恐怖片。',
        image: 'https://via.placeholder.com/300x200/ff5a5e/ffffff?text=电影推荐',
      },
      stats: {
        likes: 18,
        comments: 15,
        isLiked: false,
        isBookmarked: false,
      },
      tags: ['电影', '动作片', '科幻片'],
    },
    {
      id: '4',
      user: {
        id: 'user4',
        name: '陈小美',
        hopaValue: 88,
      },
      content: {
        title: '学习计划制定',
        description: '想制定一个学习计划，每天学习2小时，大家有什么好的建议吗？',
      },
      stats: {
        likes: 7,
        comments: 4,
        isLiked: false,
        isBookmarked: false,
      },
      tags: ['学习', '计划', '自我提升'],
    },
  ];

  // 模拟合拍搭子数据
  const mockPartners = [
    {
      id: '1',
      name: '李小明',
      avatar: 'https://via.placeholder.com/60x60/ff5a5e/ffffff?text=李',
      hopaValue: 85,
      interests: ['户外运动', '摄影', '美食'],
      compatibility: 92,
    },
    {
      id: '2',
      name: '王小红',
      avatar: 'https://via.placeholder.com/60x60/ff5a5e/ffffff?text=王',
      hopaValue: 92,
      interests: ['阅读', '旅行', '音乐'],
      compatibility: 88,
    },
    {
      id: '3',
      name: '张大山',
      avatar: 'https://via.placeholder.com/60x60/ff5a5e/ffffff?text=张',
      hopaValue: 78,
      interests: ['电影', '游戏', '科技'],
      compatibility: 85,
    },
  ];

  const handleLike = (id: string) => {
    console.log('Like post:', id);
  };

  const handleBookmark = (id: string) => {
    console.log('Bookmark post:', id);
  };

  const handleComment = (id: string) => {
    console.log('Comment on post:', id);
  };

  const handlePostClick = (id: string) => {
    console.log('Click post:', id);
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
            alignItems: 'center', 
            justifyContent: 'space-between', 
            px: 2,
            height: '100%',
          }}>
            <Box sx={{ flex: 1 }} />
            <Typography variant="h3" sx={{ 
              color: '#ffffff', 
              fontWeight: 700,
              textAlign: 'center',
              // flex: 1,
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}>
              共识圈子
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                width: '100px',
                bgcolor: 'rgba(255,255,255,0.2)',
                color: '#ffffff',
                // flex: 1,
                justifyContent: 'flex-end',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                },
              }}
            >
              发帖
            </Button>
          </Box>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        {/* 背景装饰 */}
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '800px',
            zIndex: -1,
            opacity: 0.2,
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
        
        <Box sx={{ p: 2 }}>
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
              <Tab label="合拍帖" />
              <Tab label="合拍搭子" />
            </Tabs>
          </Box>

          {/* 合拍帖内容 */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
              {mockPosts.map((post) => (
                <ConsensusPostCard
                  key={post.id}
                  {...post}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                  onComment={handleComment}
                  onClick={handlePostClick}
                />
              ))}
            </Box>
          </TabPanel>

          {/* 合拍搭子内容 */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                推荐合拍搭子
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                基于你的兴趣和偏好，为你推荐潜在的合拍搭子
              </Typography>
            </Box>

            {mockPartners.map((partner) => (
              <Card key={partner.id} sx={{ mb: 2, cursor: 'pointer', '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.12)' } }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={partner.avatar}
                      sx={{ width: 60, height: 60, mr: 2, bgcolor: '#ff5a5e' }}
                    >
                      {partner.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                        {partner.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#ff5a5e', fontWeight: 500, mb: 0.5 }}>
                        Hopa值: {partner.hopaValue}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        合拍度: {partner.compatibility}%
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: '#ff5a5e',
                        color: '#ff5a5e',
                        '&:hover': {
                          borderColor: '#e64549',
                          bgcolor: 'rgba(255, 90, 94, 0.04)',
                        },
                      }}
                    >
                      关注
                    </Button>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                      兴趣标签:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {partner.interests.map((interest, index) => (
                        <Chip
                          key={index}
                          label={interest}
                          size="small"
                          sx={{
                            bgcolor: '#f0f0f0',
                            color: '#666',
                            fontSize: '0.75rem',
                            height: 24,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </TabPanel>
        </Box>
      </IonContent>
    </IonPage>
  );
};

export default Group;
