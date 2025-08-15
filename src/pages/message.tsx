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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Badge,
  Divider,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import UserAvatar from '../components/UserAvatar';
import './message.css';

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
      id={`message-tabpanel-${index}`}
      aria-labelledby={`message-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const Message: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 模拟消息数据
  const mockLikesMessages = [
    {
      id: '1',
      user: {
        name: '李小明',
        avatar: 'https://via.placeholder.com/40x40/ff5a5e/ffffff?text=李',
      },
      action: '赞了你的帖子',
      target: '周末去哪里玩？',
      time: '2分钟前',
      isRead: false,
    },
    {
      id: '2',
      user: {
        name: '王小红',
        avatar: 'https://via.placeholder.com/40x40/ff5a5e/ffffff?text=王',
      },
      action: '收藏了你的帖子',
      target: '晚餐吃什么？',
      time: '1小时前',
      isRead: true,
    },
    {
      id: '3',
      user: {
        name: '张大山',
        avatar: 'https://via.placeholder.com/40x40/ff5a5e/ffffff?text=张',
      },
      action: '赞了你的评论',
      target: '在"电影选择困难症"中',
      time: '3小时前',
      isRead: false,
    },
  ];

  const mockFollowMessages = [
    {
      id: '1',
      user: {
        name: '陈小美',
        avatar: 'https://via.placeholder.com/40x40/ff5a5e/ffffff?text=陈',
      },
      action: '关注了你',
      time: '30分钟前',
      isRead: false,
    },
    {
      id: '2',
      user: {
        name: '刘小强',
        avatar: 'https://via.placeholder.com/40x40/ff5a5e/ffffff?text=刘',
      },
      action: '关注了你',
      time: '2小时前',
      isRead: true,
    },
  ];

  const mockCommentMessages = [
    {
      id: '1',
      user: {
        name: '李小明',
        avatar: 'https://via.placeholder.com/40x40/ff5a5e/ffffff?text=李',
      },
      action: '评论了你的帖子',
      target: '周末去哪里玩？',
      comment: '我推荐去爬山，天气很好！',
      time: '10分钟前',
      isRead: false,
    },
    {
      id: '2',
      user: {
        name: '王小红',
        avatar: 'https://via.placeholder.com/40x40/ff5a5e/ffffff?text=王',
      },
      action: '@了你',
      target: '在"晚餐吃什么？"中',
      comment: '@张三 你觉得这家餐厅怎么样？',
      time: '1小时前',
      isRead: true,
    },
    {
      id: '3',
      user: {
        name: '张大山',
        avatar: 'https://via.placeholder.com/40x40/ff5a5e/ffffff?text=张',
      },
      action: '回复了你的评论',
      target: '在"电影选择困难症"中',
      comment: '我也觉得这部电影不错！',
      time: '2小时前',
      isRead: false,
    },
  ];

  const renderMessageItem = (message: any, index: number) => (
    <React.Fragment key={message.id}>
      <ListItemButton sx={{ py: 1.5 }}>
        <ListItemAvatar>
          <Badge
            color="error"
            variant="dot"
            invisible={message.isRead}
            sx={{
              '& .MuiBadge-dot': {
                bgcolor: '#ff5a5e',
              },
            }}
          >
            <UserAvatar
              username={message.user.name}
              src={message.user.avatar}
              size="small"
            />
          </Badge>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                {message.user.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                {message.action}
              </Typography>
              {message.target && (
                <Typography variant="body2" sx={{ color: '#ff5a5e', fontWeight: 500 }}>
                  "{message.target}"
                </Typography>
              )}
            </Box>
          }
          secondary={
            <Box>
              {message.comment && (
                <Typography variant="body2" sx={{ color: '#666', mt: 0.5, fontStyle: 'italic' }}>
                  "{message.comment}"
                </Typography>
              )}
              <Typography variant="caption" sx={{ color: '#999' }}>
                {message.time}
              </Typography>
            </Box>
          }
          sx={{
            '& .MuiListItemText-primary': {
              mb: 0.5,
            },
          }}
        />
      </ListItemButton>
      {index < (tabValue === 0 ? mockLikesMessages.length : tabValue === 1 ? mockFollowMessages.length : mockCommentMessages.length) - 1 && (
        <Divider variant="inset" component="li" />
      )}
    </React.Fragment>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#ff5a5e', '--color': '#ffffff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
            <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
              消息
            </Typography>
          </Box>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <Box sx={{ p: 2 }}>
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
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FavoriteIcon sx={{ fontSize: 18 }} />
                    <span>赞和收藏</span>
                    <Badge
                      badgeContent={mockLikesMessages.filter(m => !m.isRead).length}
                      color="error"
                      sx={{
                        '& .MuiBadge-badge': {
                          bgcolor: '#ff5a5e',
                          fontSize: '0.75rem',
                          minWidth: 16,
                          height: 16,
                        },
                      }}
                    />
                  </Box>
                }
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonAddIcon sx={{ fontSize: 18 }} />
                    <span>新增关注</span>
                    <Badge
                      badgeContent={mockFollowMessages.filter(m => !m.isRead).length}
                      color="error"
                      sx={{
                        '& .MuiBadge-badge': {
                          bgcolor: '#ff5a5e',
                          fontSize: '0.75rem',
                          minWidth: 16,
                          height: 16,
                        },
                      }}
                    />
                  </Box>
                }
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ChatBubbleIcon sx={{ fontSize: 18 }} />
                    <span>评论和@</span>
                    <Badge
                      badgeContent={mockCommentMessages.filter(m => !m.isRead).length}
                      color="error"
                      sx={{
                        '& .MuiBadge-badge': {
                          bgcolor: '#ff5a5e',
                          fontSize: '0.75rem',
                          minWidth: 16,
                          height: 16,
                        },
                      }}
                    />
                  </Box>
                }
              />
            </Tabs>
          </Box>

          {/* 赞和收藏消息 */}
          <TabPanel value={tabValue} index={0}>
            <List sx={{ p: 0 }}>
              {mockLikesMessages.map((message, index) => renderMessageItem(message, index))}
            </List>
          </TabPanel>

          {/* 新增关注消息 */}
          <TabPanel value={tabValue} index={1}>
            <List sx={{ p: 0 }}>
              {mockFollowMessages.map((message, index) => renderMessageItem(message, index))}
            </List>
          </TabPanel>

          {/* 评论和@消息 */}
          <TabPanel value={tabValue} index={2}>
            <List sx={{ p: 0 }}>
              {mockCommentMessages.map((message, index) => renderMessageItem(message, index))}
            </List>
          </TabPanel>
        </Box>
      </IonContent>
    </IonPage>
  );
};

export default Message;
