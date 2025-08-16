import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Card,
  CardContent,
  TextField,
  IconButton,
  Chip,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Send,
  PlayArrow,
  Settings,
  PersonAdd,
  Circle,
  AccessTime,
  ExitToApp,
  Share,
  ContentCopy,
  Chat,
  WhatsApp,
  Close,
} from '@mui/icons-material';

interface RoomMember {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'ready' | 'invited';
  isHost: boolean;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system';
}

interface ConsensusRoomProps {
  roomId: string;
  consensusTitle: string;
  maxParticipants: number;
  currentUserId: string;
  onStartGame: () => void;
  onLeaveRoom: () => void;
}

const ConsensusRoom: React.FC<ConsensusRoomProps> = ({
  roomId,
  consensusTitle,
  maxParticipants,
  currentUserId,
  onStartGame,
  onLeaveRoom,
}) => {
  const [message, setMessage] = useState('');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteType, setInviteType] = useState<'link' | 'friends'>('link');
  const [roomLink] = useState(`https://hopa.app/room/${roomId}`);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [chatHeight, setChatHeight] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  
  // 模拟好友列表
  const [friends] = useState([
    { id: '1', name: '李四', avatar: '/api/placeholder/40/40', status: 'online' as const },
    { id: '2', name: '王五', avatar: '/api/placeholder/40/40', status: 'offline' as const },
    { id: '3', name: '赵六', avatar: '/api/placeholder/40/40', status: 'online' as const },
    { id: '4', name: '钱七', avatar: '/api/placeholder/40/40', status: 'online' as const },
  ]);
  
  const [members, setMembers] = useState<RoomMember[]>([
    {
      id: 'user1',
      name: '张三',
      avatar: '/api/placeholder/40/40',
      status: 'ready',
      isHost: true,
    },
    {
      id: 'user2',
      name: '李四',
      avatar: '/api/placeholder/40/40',
      status: 'online',
      isHost: false,
    },
  ]);
  
  const [pendingInvitations, setPendingInvitations] = useState<{[key: string]: string}>(
    {'user3': '王五'}
  );
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: 'system',
      senderName: '系统',
      content: '欢迎来到共识房间！',
      timestamp: new Date(),
      type: 'system',
    },
    {
      id: '2',
      senderId: 'user1',
      senderName: '张三',
      content: '大家好，准备开始共识征程吧！',
      timestamp: new Date(),
      type: 'text',
    },
  ]);

  const chatRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const currentUser = members.find(m => m.id === currentUserId);
  const isHost = currentUser?.isHost || false;
  const readyCount = members.filter(m => m.status === 'ready').length;
  const onlineCount = members.filter(m => m.status === 'online' || m.status === 'ready').length;
  // 只有所有在线成员都准备好才能开始游戏
  const canStartGame = onlineCount > 0 && readyCount === onlineCount;

  // 自动滚动到聊天底部
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // 模拟用户状态变化
  useEffect(() => {
    // 模拟王五加入流程
    const wangwuTimer = setTimeout(() => {
      // 先显示邀请消息
      setChatMessages(prev => [...prev, {
        id: Date.now().toString() + '_invite',
        senderId: 'system',
        senderName: '系统',
        content: '张三（房主）已邀请王五...',
        timestamp: new Date(),
        type: 'system',
      }]);
      
      // 2秒后显示加入消息并更新状态
      setTimeout(() => {
        setPendingInvitations(prev => {
          const newPending = { ...prev };
          delete newPending['user3'];
          return newPending;
        });
        
        setMembers(prev => [...prev, {
          id: 'user3',
          name: '王五',
          avatar: '/api/placeholder/40/40',
          status: 'online',
          isHost: false,
        }]);
        
        setChatMessages(prev => [...prev, {
          id: Date.now().toString() + '_join',
          senderId: 'system',
          senderName: '系统',
          content: '王五已加入房间',
          timestamp: new Date(),
          type: 'system',
        }]);
        
        // 再等3秒后变为准备状态
        setTimeout(() => {
          setMembers(prev => prev.map(member => 
            member.id === 'user3' 
              ? { ...member, status: 'ready' as const }
              : member
          ));
          
          setChatMessages(prev => [...prev, {
            id: Date.now().toString() + '_ready',
            senderId: 'system',
            senderName: '系统',
            content: '王五已准备就绪',
            timestamp: new Date(),
            type: 'system',
          }]);
        }, 3000);
        
        // 让李四也在6秒后准备好
        setTimeout(() => {
          setMembers(prev => prev.map(member => 
            member.id === 'user2' 
              ? { ...member, status: 'ready' as const }
              : member
          ));
          
          setChatMessages(prev => [...prev, {
            id: Date.now().toString() + '_lisiready',
            senderId: 'system',
            senderName: '系统',
            content: '李四已准备就绪',
            timestamp: new Date(),
            type: 'system',
          }]);
        }, 6000);
      }, 2000);
    }, 3000);

    return () => clearTimeout(wangwuTimer);
  }, []);

  // 聊天区域大小调整功能
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      e.preventDefault();
      
      const container = document.querySelector('body');
      if (!container) return;
      
      const viewportHeight = window.innerHeight;
      const newHeight = Math.max(150, Math.min(viewportHeight * 0.6, viewportHeight - e.clientY - 140));
      
      setChatHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  // 复制链接功能
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(roomLink);
      setShowCopySuccess(true);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  // 邀请好友
  const handleInviteFriend = (friendId: string) => {
    const friend = friends.find(f => f.id === friendId);
    if (!friend) return;
    
    // 添加到等待邀请列表
    setPendingInvitations(prev => ({
      ...prev,
      [`pending_${friendId}`]: friend.name
    }));
    
    // 显示邀请消息
    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      senderId: 'system',
      senderName: '系统',
      content: `张三（房主）已邀请${friend.name}...`,
      timestamp: new Date(),
      type: 'system',
    }]);
    
    // 模拟2-5秒后加入
    setTimeout(() => {
      setPendingInvitations(prev => {
        const newPending = { ...prev };
        delete newPending[`pending_${friendId}`];
        return newPending;
      });
      
      setMembers(prev => [...prev, {
        id: `pending_${friendId}`,
        name: friend.name,
        avatar: friend.avatar,
        status: 'online',
        isHost: false,
      }]);
      
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        senderId: 'system',
        senderName: '系统',
        content: `${friend.name}已加入房间`,
        timestamp: new Date(),
        type: 'system',
      }]);
      
      // 自动准备（赵六、钱七等邀请的成员应该自动准备）
      setTimeout(() => {
        setMembers(prev => prev.map(member => 
          member.id === `pending_${friendId}` 
            ? { ...member, status: 'ready' as const }
            : member
        ));
        
        setChatMessages(prev => [...prev, {
          id: Date.now().toString(),
          senderId: 'system',
          senderName: '系统',
          content: `${friend.name}已准备就绪`,
          timestamp: new Date(),
          type: 'system',
        }]);
      }, 1000 + Math.random() * 2000); // 1-3秒后自动准备
    }, 2000 + Math.random() * 3000);
    
    // 关闭邀请对话框
    setShowInviteDialog(false);
  };

  // 分享到社交平台
  const handleShareLink = (platform: string) => {
    console.log('分享到:', platform);
    // 这里添加实际分享逻辑
  };

  const handleSendMessage = () => {
    if (message.trim() && currentUser) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: currentUserId,
        senderName: currentUser.name,
        content: message.trim(),
        timestamp: new Date(),
        type: 'text',
      };
      setChatMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleReady = () => {
    if (currentUser && !isHost) {
      setMembers(prev => prev.map(member => 
        member.id === currentUserId 
          ? { ...member, status: member.status === 'ready' ? 'online' : 'ready' }
          : member
      ));
    }
  };

  const getStatusColor = (status: RoomMember['status']) => {
    switch (status) {
      case 'ready': return '#4caf50';
      case 'online': return '#2196f3';
      case 'offline': return '#9e9e9e';
      case 'invited': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const getStatusText = (status: RoomMember['status']) => {
    switch (status) {
      case 'ready': return '准备就绪';
      case 'online': return '在线';
      case 'offline': return '离线';
      case 'invited': return '邀请中';
      default: return '未知';
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* 房间信息栏 */}
      <Paper 
        elevation={2}
        sx={{ 
          p: { xs: 1.5, sm: 2 }, 
          background: 'linear-gradient(135deg, #ff5a5e 0%, #ff7a7e 100%)',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              {consensusTitle}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              房间号: {roomId} | {onlineCount}/{maxParticipants}人 | {readyCount}人已准备
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton sx={{ color: 'white', p: { xs: 0.5, sm: 1 } }}>
              <Settings sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <IconButton onClick={onLeaveRoom} sx={{ color: 'white', p: { xs: 0.5, sm: 1 } }}>
              <ExitToApp sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* 成员区域 */}
      <Box sx={{ 
        p: { xs: 1.5, sm: 2 }, 
        height: `calc(100vh - 140px - ${chatHeight}px)`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              队伍成员
            </Typography>
            <IconButton
              size="small"
              onClick={() => setShowInviteDialog(true)}
              sx={{
                bgcolor: '#ff5a5e',
                color: 'white',
                width: 24,
                height: 24,
                '&:hover': {
                  bgcolor: '#ff4a4e',
                },
              }}
            >
              <PersonAdd sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
          <Chip 
            label={`${onlineCount}/${maxParticipants}`}
            size="small"
            sx={{ 
              bgcolor: 'rgba(255, 90, 94, 0.1)', 
              color: '#ff5a5e',
              fontWeight: 500,
            }}
          />
        </Box>

        {/* 成员网格 */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: 'repeat(2, 1fr)', 
            sm: 'repeat(3, 1fr)', 
            md: 'repeat(4, 1fr)' 
          },
          gap: { xs: 1.5, sm: 2 },
          overflow: 'auto',
          flex: 1,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: 2 },
        }}>
          {members.map((member) => (
            <Card 
              key={member.id}
              sx={{ 
                cursor: 'pointer',
                border: member.id === currentUserId ? '2px solid #ff5a5e' : '1px solid #e0e0e0',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.15)' 
                },
                position: 'relative',
                background: member.status === 'ready' ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05))' : 'white',
                minHeight: { xs: 130, sm: 150 },
                height: 'auto',
              }}
            >
              <CardContent sx={{ 
                textAlign: 'center', 
                p: { xs: 1.5, sm: 2 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: { xs: 110, sm: 130 }
              }}>
                {member.isHost && (
                  <Chip
                    label="房主"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      bgcolor: '#ff5a5e',
                      color: 'white',
                      fontSize: '0.65rem',
                      height: 20,
                    }}
                  />
                )}
                
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: getStatusColor(member.status),
                        border: '2px solid white',
                      }}
                    />
                  }
                >
                  <Avatar
                    src={member.avatar}
                    sx={{ 
                      width: { xs: 45, sm: 55 }, 
                      height: { xs: 45, sm: 55 }, 
                      mx: 'auto', 
                      mb: 1,
                      border: member.status === 'ready' ? '3px solid #4caf50' : '2px solid #f0f0f0',
                      boxShadow: member.status === 'ready' ? '0 0 10px rgba(76, 175, 80, 0.3)' : 'none',
                    }}
                  />
                </Badge>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 0.5,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    color: member.status === 'ready' ? '#2e7d32' : 'text.primary',
                  }}
                >
                  {member.name}
                </Typography>
                
                <Chip
                  label={getStatusText(member.status)}
                  size="small"
                  sx={{
                    bgcolor: getStatusColor(member.status),
                    color: 'white',
                    fontSize: '0.65rem',
                    height: 20,
                    fontWeight: 500,
                  }}
                />
              </CardContent>
            </Card>
          ))}
          
          {/* 空位占位符 */}
          {Array.from({ length: Math.max(0, maxParticipants - members.length) }).map((_, index) => (
            <Card 
              key={`empty-${index}`}
              sx={{ 
                border: '2px dashed #e0e0e0', 
                borderRadius: 2,
                minHeight: { xs: 110, sm: 130 },
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: '#ff5a5e',
                  bgcolor: 'rgba(255, 90, 94, 0.02)',
                },
              }}
            >
              <CardContent 
                sx={{ 
                  textAlign: 'center', 
                  p: { xs: 1.5, sm: 2 }, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  height: '100%' 
                }}
              >
                <PersonAdd sx={{ fontSize: { xs: 24, sm: 30 }, color: '#9e9e9e', mb: 1 }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  等待加入
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* 拖拽调整手柄 */}
      <Box
        ref={resizeRef}
        onMouseDown={handleResizeStart}
        sx={{
          height: 12,
          bgcolor: '#f8f9fa',
          borderTop: '1px solid #e0e0e0',
          borderBottom: '1px solid #e0e0e0',
          cursor: 'ns-resize',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: 'rgba(255, 90, 94, 0.08)',
            borderColor: 'rgba(255, 90, 94, 0.2)',
          },
          position: 'relative',
          '&::before': {
            content: '""',
            width: 40,
            height: 3,
            bgcolor: '#ccc',
            borderRadius: 2,
            position: 'absolute',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          },
          '&:hover::before': {
            bgcolor: '#ff5a5e',
          },
          userSelect: 'none',
        }}
      />

      {/* 聊天区域 */}
      <Paper 
        elevation={3}
        sx={{ 
          height: `${chatHeight}px`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 聊天标题 */}
        <Box sx={{ p: { xs: 1.5, sm: 2 }, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            队伍聊天
          </Typography>
        </Box>

        {/* 聊天消息列表 */}
        <Box 
          ref={chatRef}
          sx={{ 
            flex: 1, 
            overflow: 'auto', 
            p: { xs: 1, sm: 1.5 },
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: 2 },
          }}
        >
          {chatMessages.map((msg) => (
            <Box key={msg.id} sx={{ mb: 1 }}>
              {msg.type === 'system' ? (
                <Box sx={{ textAlign: 'center', py: 0.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    {msg.content}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Avatar sx={{ width: { xs: 20, sm: 24 }, height: { xs: 20, sm: 24 } }} />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 500, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                          {msg.senderName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>
                          <AccessTime sx={{ fontSize: 8, mr: 0.5 }} />
                          {msg.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          bgcolor: msg.senderId === currentUserId ? '#e3f2fd' : '#f5f5f5',
                          p: { xs: 0.75, sm: 1 },
                          borderRadius: 1,
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        }}
                      >
                        {msg.content}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          ))}
        </Box>

        {/* 聊天输入框 */}
        <Box sx={{ p: { xs: 1.5, sm: 2 }, borderTop: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="输入消息..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              multiline
              maxRows={2}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                },
              }}
            />
            <IconButton 
              onClick={handleSendMessage}
              disabled={!message.trim()}
              sx={{ 
                color: '#ff5a5e',
                p: { xs: 0.75, sm: 1 },
                '&:disabled': { color: '#ccc' },
              }}
            >
              <Send sx={{ fontSize: { xs: 18, sm: 20 } }} />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* 底部操作区域 */}
      <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2 }, borderTop: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {!isHost && (
              <Button
                variant={currentUser?.status === 'ready' ? 'contained' : 'outlined'}
                onClick={toggleReady}
                size={window.innerWidth < 600 ? 'small' : 'medium'}
                sx={{
                  bgcolor: currentUser?.status === 'ready' ? '#4caf50' : 'transparent',
                  borderColor: '#4caf50',
                  color: currentUser?.status === 'ready' ? 'white' : '#4caf50',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  '&:hover': {
                    bgcolor: currentUser?.status === 'ready' ? '#45a049' : 'rgba(76, 175, 80, 0.04)',
                  },
                }}
              >
                {currentUser?.status === 'ready' ? '已准备' : '准备就绪'}
              </Button>
            )}
          </Box>

          {isHost && (
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrow />}
              onClick={onStartGame}
              disabled={!canStartGame} // 所有在线成员都必须准备好
              sx={{
                background: canStartGame 
                  ? 'linear-gradient(45deg, #ff5a5e, #ff7a7e)' 
                  : '#ccc',
                '&:hover': {
                  background: canStartGame 
                    ? 'linear-gradient(45deg, #ff4a4e, #ff6a6e)' 
                    : '#ccc',
                },
                '&:disabled': {
                  background: '#ccc',
                  color: '#666',
                },
                px: { xs: 2, sm: 4 },
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.9rem', sm: '1.1rem' },
                fontWeight: 600,
                transition: 'all 0.3s ease',
              }}
            >
              {canStartGame ? '🎮 开始游戏' : `等待准备 (${readyCount}/${onlineCount})`}
            </Button>
          )}
        </Box>
      </Paper>


      {/* 邀请对话框 */}
      <Dialog
        open={showInviteDialog}
        onClose={() => setShowInviteDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            m: { xs: 1, sm: 2 },
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            邀请好友
            <IconButton
              onClick={() => setShowInviteDialog(false)}
              sx={{ 
                color: '#666',
                '&:hover': { bgcolor: 'rgba(255, 90, 94, 0.1)', color: '#ff5a5e' },
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0, height: 400 }}>
          <Box sx={{ display: 'flex', height: '100%' }}>
            {/* 左侧 - 链接分享 */}
            <Box sx={{ 
              width: '50%', 
              p: 3, 
              borderRight: '1px solid #e0e0e0',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#ff5a5e' }}>
                分享链接
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                房间链接:
              </Typography>
              <TextField
                fullWidth
                value={roomLink}
                variant="outlined"
                size="small"
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <IconButton onClick={handleCopyLink} size="small">
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  ),
                }}
                sx={{ mb: 3 }}
              />
              
              <Typography variant="subtitle2" gutterBottom>
                快速分享:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Chat />}
                  onClick={() => handleShareLink('chat')}
                  size="small"
                  fullWidth
                  sx={{ borderColor: '#ff5a5e', color: '#ff5a5e' }}
                >
                  聊天软件
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<WhatsApp />}
                  onClick={() => handleShareLink('whatsapp')}
                  size="small"
                  fullWidth
                  sx={{ borderColor: '#ff5a5e', color: '#ff5a5e' }}
                >
                  WhatsApp
                </Button>
              </Box>
            </Box>

            {/* 右侧 - 邀请好友 */}
            <Box sx={{ 
              width: '50%', 
              p: 3,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#ff5a5e' }}>
                邀请好友
              </Typography>
              
              <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
                {friends.filter(friend => 
                  // 排除已加入的成员和正在邀请的成员
                  !members.some(member => member.name === friend.name) &&
                  !Object.values(pendingInvitations).includes(friend.name)
                ).map((friend) => (
                  <ListItem key={friend.id} sx={{ px: 0, py: 1 }}>
                    <ListItemAvatar>
                      <Avatar src={friend.avatar} sx={{ width: 32, height: 32 }} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {friend.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {friend.status === 'online' ? '在线' : '离线'}
                        </Typography>
                      }
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleInviteFriend(friend.id)}
                      sx={{ 
                        borderColor: '#ff5a5e', 
                        color: '#ff5a5e',
                        minWidth: 50,
                        fontSize: '0.75rem'
                      }}
                    >
                      邀请
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* 复制成功提示 */}
      <Snackbar
        open={showCopySuccess}
        autoHideDuration={2000}
        onClose={() => setShowCopySuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowCopySuccess(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          链接已复制到剪贴板！
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConsensusRoom;