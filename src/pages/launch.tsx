import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Divider,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Mic,
  MicOff,
  Send,
  Share,
  PersonAdd,
  Group,
  PlayArrow,
  Upload,
  Close,
  WhatsApp,
  Link,
  Chat,
  ArrowBack,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import './launch.css';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
}

interface ConsensusGoal {
  title: string;
  description: string;
  attachments: File[];
}

const LaunchPage: React.FC = () => {
  const history = useHistory();
  const [activeStep, setActiveStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [consensusGoal, setConsensusGoal] = useState<ConsensusGoal>({
    title: '',
    description: '',
    attachments: [],
  });
  const [inviteType, setInviteType] = useState<'link' | 'friends'>('link');
  const [showInvitePanel, setShowInvitePanel] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [waitingProgress, setWaitingProgress] = useState(0);
  const [showGameButton, setShowGameButton] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // 模拟好友列表
  const friends: Friend[] = [
    { id: '1', name: '张三', avatar: '/api/placeholder/40/40', status: 'online' },
    { id: '2', name: '李四', avatar: '/api/placeholder/40/40', status: 'offline' },
    { id: '3', name: '王五', avatar: '/api/placeholder/40/40', status: 'online' },
    { id: '4', name: '赵六', avatar: '/api/placeholder/40/40', status: 'online' },
  ];

  const steps = [
    '确定共识目标',
    '上传相关文件',
    '邀请共识搭档',
    '等待确认',
    '开始游戏',
  ];

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  // 处理语音录制
  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // 这里可以添加实际的语音录制逻辑
  };

  // 处理邀请类型切换
  const handleInviteTypeChange = (type: 'link' | 'friends') => {
    setInviteType(type);
    setShowInvitePanel(true);
  };

  // 处理邀请好友
  const handleInviteFriend = (friendId: string) => {
    console.log('邀请好友:', friendId);
    // 这里可以添加实际的邀请逻辑
  };

  // 处理分享链接
  const handleShareLink = (platform: string) => {
    console.log('分享到:', platform);
    // 这里可以添加实际的分享逻辑
  };

  // 处理返回首页
  const handleGoBack = () => {
    history.push('/home');
  };

  // 处理进入游戏
  const handleStartGame = () => {
    console.log('开始游戏');
    // 这里可以添加跳转到游戏页面的逻辑
    history.push('/game');
  };

  // 等待动画效果
  useEffect(() => {
    if (isWaiting) {
      const interval = setInterval(() => {
        setWaitingProgress(prev => {
          if (prev >= 100) {
            setIsWaiting(false);
            setShowGameButton(true);
            return 100;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isWaiting]);

  // 处理下一步
  const handleNext = () => {
    if (activeStep === 0 && (!consensusGoal.title || !consensusGoal.description)) {
      return; // 验证必填字段
    }
    
    if (activeStep === 1) {
      // 进入邀请阶段
      setActiveStep(2);
    } else if (activeStep === 2) {
      // 开始等待
      setIsWaiting(true);
      setActiveStep(3);
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  // 处理上一步
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              确定需要达成的共识目标
            </Typography>
            
            <TextField
              fullWidth
              label="共识标题"
              value={consensusGoal.title}
              onChange={(e) => setConsensusGoal(prev => ({ ...prev, title: e.target.value }))}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="共识描述"
              value={consensusGoal.description}
              onChange={(e) => setConsensusGoal(prev => ({ ...prev, description: e.target.value }))}
              margin="normal"
              multiline
              rows={4}
              required
            />
            
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Upload />}
                component="label"
              >
                上传文件
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx"
                />
              </Button>
              
              <IconButton
                onClick={handleVoiceRecord}
                color={isRecording ? 'error' : 'primary'}
                sx={{ border: 1, borderColor: 'divider' }}
              >
                {isRecording ? <MicOff /> : <Mic />}
              </IconButton>
            </Box>
            
            {selectedFiles.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  已选择的文件:
                </Typography>
                {selectedFiles.map((file, index) => (
                  <Chip
                    key={index}
                    label={file.name}
                    onDelete={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            )}
          </Box>
        );

      case 1:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              上传相关文件
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              上传与共识相关的文件或图片，帮助大家更好地理解共识内容
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<Upload />}
                component="label"
                sx={{ minWidth: 120 }}
              >
                选择文件
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx"
                />
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Upload />}
                component="label"
                sx={{ minWidth: 120 }}
              >
                选择图片
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleFileUpload}
                  accept="image/*"
                />
              </Button>
            </Box>
            
            {selectedFiles.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  已上传的文件 ({selectedFiles.length}):
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedFiles.map((file, index) => (
                    <Card key={index} sx={{ width: 120, height: 120, position: 'relative' }}>
                      <CardContent sx={{ p: 1, textAlign: 'center' }}>
                        <Typography variant="caption" noWrap>
                          {file.name}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                          sx={{ position: 'absolute', top: 0, right: 0 }}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              邀请共识搭档
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant={inviteType === 'link' ? 'contained' : 'outlined'}
                startIcon={<Share />}
                onClick={() => handleInviteTypeChange('link')}
                fullWidth
              >
                生成分享链接
              </Button>
              
              <Button
                variant={inviteType === 'friends' ? 'contained' : 'outlined'}
                startIcon={<PersonAdd />}
                onClick={() => handleInviteTypeChange('friends')}
                fullWidth
              >
                邀请好友
              </Button>
            </Box>
            
            {showInvitePanel && (
              <Paper
                sx={{
                  position: 'fixed',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  maxHeight: '60vh',
                  zIndex: 1000,
                  animation: 'slideUp 0.3s ease-out',
                  '@keyframes slideUp': {
                    from: { transform: 'translateY(100%)' },
                    to: { transform: 'translateY(0)' },
                  },
                }}
              >
                {inviteType === 'link' ? (
                  <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">分享链接</Typography>
                      <IconButton onClick={() => setShowInvitePanel(false)}>
                        <Close />
                      </IconButton>
                    </Box>
                    
                    <TextField
                      fullWidth
                      value="https://hopa.app/consensus/abc123"
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <IconButton>
                            <Link />
                          </IconButton>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                    
                    <Typography variant="subtitle2" gutterBottom>
                      分享到:
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {/* <Button
                        variant="outlined"
                        startIcon={<Wechat />}
                        onClick={() => handleShareLink('wechat')}
                      >
                        微信
                      </Button> */}
                      <Button
                        variant="outlined"
                        startIcon={<Chat />}
                        onClick={() => handleShareLink('chat')}
                      >
                        Chat
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<WhatsApp />}
                        onClick={() => handleShareLink('whatsapp')}
                      >
                        WhatsApp
                      </Button>
                      {/* <Button
                        variant="outlined"
                        startIcon={<Qq />}
                        onClick={() => handleShareLink('qq')}
                      >
                        QQ
                      </Button> */}
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">选择好友</Typography>
                      <IconButton onClick={() => setShowInvitePanel(false)}>
                        <Close />
                      </IconButton>
                    </Box>
                    
                    <List>
                      {friends.map((friend) => (
                        <ListItem key={friend.id}>
                          <ListItemAvatar>
                            <Avatar src={friend.avatar} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={friend.name}
                            secondary={friend.status === 'online' ? '在线' : '离线'}
                          />
                          <ListItemSecondaryAction>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleInviteFriend(friend.id)}
                            >
                              邀请
                            </Button>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Paper>
            )}
          </Box>
        );

      case 3:
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              等待共识搭档确认
            </Typography>
            
            {isWaiting ? (
              <Box sx={{ mt: 4 }}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #ff5a5e, #ff7a7e)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.1)' },
                    },
                  }}
                >
                  <Group sx={{ fontSize: 48, color: 'white' }} />
                </Box>
                
                <Typography variant="body1" sx={{ mt: 2 }}>
                  正在等待共识搭档加入...
                </Typography>
                
                <Box sx={{ mt: 2, width: '100%', maxWidth: 300, mx: 'auto' }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: 8,
                      backgroundColor: 'grey.200',
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${waitingProgress}%`,
                        height: '100%',
                        backgroundColor: '#ff5a5e',
                        transition: 'width 0.1s ease',
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {waitingProgress}% 完成
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ mt: 4 }}>
                <Typography variant="body1" color="success.main">
                  所有共识搭档已确认！
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 4:
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              准备开始游戏
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 4 }}>
              共识目标已确定，搭档已就位，准备开始有趣的共识达成游戏！
            </Typography>
            
            <Fab
              variant="extended"
              color="primary"
              size="large"
              onClick={handleStartGame}
              sx={{
                background: 'linear-gradient(45deg, #ff5a5e, #ff7a7e)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #ff4a4e, #ff6a6e)',
                },
              }}
            >
              <PlayArrow sx={{ mr: 1 }} />
              进入游戏
            </Fab>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 头部 */}
      <Box 
        className="launch-header"
        sx={{ p: 2, borderBottom: 1, borderColor: 'divider', position: 'relative' }}
      >
        <IconButton
          className="back-button"
          onClick={handleGoBack}
          sx={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#666',
            '&:hover': {
              backgroundColor: 'rgba(255, 90, 94, 0.1)',
              color: '#ff5a5e',
            },
          }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" align="center">
          发起共识
        </Typography>
      </Box>

      {/* 步骤指示器 */}
      <Box sx={{ p: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* 内容区域 */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {renderStepContent()}
      </Box>

      {/* 底部操作按钮 */}
      {activeStep < 4 && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0}
              fullWidth
            >
              上一步
            </Button>
            
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={activeStep === 0 && (!consensusGoal.title || !consensusGoal.description)}
              fullWidth
              sx={{
                background: 'linear-gradient(45deg, #ff5a5e, #ff7a7e)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #ff4a4e, #ff6a6e)',
                },
              }}
            >
              {activeStep === steps.length - 2 ? '完成' : '下一步'}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default LaunchPage;
