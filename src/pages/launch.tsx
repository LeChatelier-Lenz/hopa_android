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
  People,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import ConsensusRoom from '../components/ConsensusRoom';
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
  maxParticipants: number;
}

const LaunchPage: React.FC = () => {
  const history = useHistory();
  const [activeStep, setActiveStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [consensusGoal, setConsensusGoal] = useState<ConsensusGoal>({
    title: '',
    description: '',
    attachments: [],
    maxParticipants: 5,
  });
  const [participantsInput, setParticipantsInput] = useState('5');
  const [showGameButton, setShowGameButton] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [roomId] = useState(() => Math.random().toString(36).substring(2, 8).toUpperCase());

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
    '创建房间',
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


  // 处理返回首页
  const handleGoBack = () => {
    history.push('/home');
  };

  // 处理离开房间
  const handleLeaveRoom = () => {
    setActiveStep(2); // 回到创建房间阶段
  };

  // 处理进入游戏
  const handleStartGame = () => {
    console.log('开始游戏');
    // 这里可以添加跳转到游戏页面的逻辑
    history.push('/game');
  };


  // 处理下一步
  const handleNext = () => {
    if (activeStep === 0 && (!consensusGoal.title || !consensusGoal.description)) {
      return; // 验证必填字段
    }
    
    if (activeStep === 1) {
      // 进入创建房间阶段
      setActiveStep(2);
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
            
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <People sx={{ color: '#666' }} />
              <Typography variant="body2" sx={{ color: '#666', minWidth: 80 }}>
                参与人数:
              </Typography>
              <TextField
                type="number"
                value={participantsInput}
                onChange={(e) => setParticipantsInput(e.target.value)}
                onBlur={(e) => {
                  const value = parseInt(e.target.value);
                  const validValue = isNaN(value) ? 2 : Math.min(10, Math.max(2, value));
                  setParticipantsInput(validValue.toString());
                  setConsensusGoal(prev => ({ ...prev, maxParticipants: validValue }));
                }}
                inputProps={{ min: 2, max: 10 }}
                size="small"
                sx={{ width: 80 }}
              />
              <Typography variant="body2" sx={{ color: '#666' }}>
                人 (上限10人)
              </Typography>
            </Box>
            
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
                sx={{ 
                  minWidth: 120,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  },
                }}
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
                sx={{ 
                  minWidth: 120,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  },
                }}
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
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {selectedFiles.map((file, index) => (
                    <Card 
                      key={index} 
                      sx={{ 
                        width: 140, 
                        height: 100, 
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {/* 文件图标或预览 */}
                        <Box sx={{ textAlign: 'center', mb: 1 }}>
                          {file.type.startsWith('image/') ? (
                            <Box 
                              sx={{ 
                                width: 40, 
                                height: 40, 
                                mx: 'auto', 
                                borderRadius: 1,
                                bgcolor: '#f5f5f5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
                                IMG
                              </Typography>
                            </Box>
                          ) : (
                            <Box 
                              sx={{ 
                                width: 40, 
                                height: 40, 
                                mx: 'auto', 
                                borderRadius: 1,
                                bgcolor: '#e3f2fd',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
                                {file.name.split('.').pop()?.toUpperCase()}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            textAlign: 'center',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {file.name}
                        </Typography>
                        
                        <IconButton
                          size="small"
                          onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                          sx={{ 
                            position: 'absolute', 
                            top: 4, 
                            right: 4,
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': {
                              bgcolor: 'rgba(255, 90, 94, 0.1)',
                              color: '#ff5a5e',
                            },
                          }}
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
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              创建房间
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
              准备创建共识房间，开始你们的共识征程！
            </Typography>
            
            <Box sx={{ 
              p: 3, 
              border: '2px dashed #ff5a5e', 
              borderRadius: 2, 
              bgcolor: 'rgba(255, 90, 94, 0.05)',
              mb: 3 
            }}>
              <Typography variant="body2" sx={{ color: '#ff5a5e', fontWeight: 500 }}>
                房间信息预览
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                标题: {consensusGoal.title}
              </Typography>
              <Typography variant="body2">
                参与人数: {consensusGoal.maxParticipants}人
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              点击"创建房间"后，你将成为房主，可以邀请其他人加入
            </Typography>
          </Box>
        );

      case 3:
        return (
          <ConsensusRoom
            roomId={roomId}
            consensusTitle={consensusGoal.title}
            maxParticipants={consensusGoal.maxParticipants}
            currentUserId="user1" // 假设当前用户是user1
            onStartGame={handleStartGame}
            onLeaveRoom={handleLeaveRoom}
          />
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
        <Box
          sx={{
            animation: 'fadeInSlide 0.5s ease-out',
            '@keyframes fadeInSlide': {
              from: {
                opacity: 0,
                transform: 'translateY(20px)',
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          {renderStepContent()}
        </Box>
      </Box>

      {/* 底部操作按钮 */}
      {activeStep < 3 && (
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
              {activeStep === 2 ? '创建房间' : '下一步'}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default LaunchPage;
