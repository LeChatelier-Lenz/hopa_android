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
import CharacterCreator from '../components/CharacterCreator';
import PhaserGame from '../components/game/PhaserGame';
import { doubaoApi } from '../utils/doubaoApi';
import backgroundImage from '../assets/images/background.png';
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
  const [gamePhase, setGamePhase] = useState<'room' | 'character' | 'battle'>('room');
  const [playerCharacters, setPlayerCharacters] = useState<any[]>([]);
  const [gameBackground, setGameBackground] = useState<string | null>(null);
  const [isGeneratingBackground, setIsGeneratingBackground] = useState(false);

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
    setGamePhase('character');
  };

  // 处理角色创建完成
  const handleCharacterCreated = (characterConfig: any) => {
    setPlayerCharacters(prev => [...prev, characterConfig]);
    // 如果角色已创建完成，进入战斗阶段
    if (playerCharacters.length >= 1) { // 简化为1个角色即可开始
      setGamePhase('battle');
    }
  };

  // 处理返回房间
  const handleBackToRoom = () => {
    setGamePhase('room');
  };

  // 生成游戏背景图
  const generateGameBackground = async () => {
    if (!consensusGoal.title || !consensusGoal.description) {
      return;
    }

    setIsGeneratingBackground(true);
    
    try {
      console.log('🎨 开始生成游戏背景...');
      const backgroundUrl = await doubaoApi.generateGameBackground({
        title: consensusGoal.title,
        description: consensusGoal.description,
        peopleCount: consensusGoal.maxParticipants, // 直接使用用户填写的人数
      });
      
      setGameBackground(backgroundUrl);
      console.log('✅ 背景图生成成功:', backgroundUrl);
    } catch (error) {
      console.error('❌ 背景图生成失败:', error);
      // 失败时使用默认背景
      setGameBackground(null);
    } finally {
      setIsGeneratingBackground(false);
    }
  };

  // 处理下一步
  const handleNext = async () => {
    if (activeStep === 0 && (!consensusGoal.title || !consensusGoal.description)) {
      return; // 验证必填字段
    }
    
    // 从步骤0到步骤1时，生成背景图
    if (activeStep === 0) {
      // 先跳转到下一步
      setActiveStep(prev => prev + 1);
      // 然后异步生成背景图
      generateGameBackground();
    } else if (activeStep === 1) {
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
             <Card className="gradient-card" sx={{ p: 3, mb: 3 }}>
               <Typography variant="h6" gutterBottom sx={{ color: '#ff5a5e', fontWeight: 600 }}>
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
             </Card>
           </Box>
         );

             case 1:
         return (
           <Box sx={{ p: 3 }}>
             <Card className="gradient-card" sx={{ p: 3, mb: 3 }}>
               <Typography variant="h6" gutterBottom sx={{ color: '#ff5a5e', fontWeight: 600 }}>
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
             </Card>
           </Box>
         );

      case 2:
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Card className="gradient-card" sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#ff5a5e', fontWeight: 600 }}>
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
             </Card>
           </Box>
         );

      case 3:
        if (gamePhase === 'character') {
          return (
            <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
              {/* 角色创建阶段的头部 */}
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: '#ff5a5e', color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    🎮 角色创建与装备选择
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleBackToRoom}
                    sx={{ 
                      color: 'white', 
                      borderColor: 'white',
                      '&:hover': { 
                        bgcolor: 'rgba(255,255,255,0.1)',
                        borderColor: 'white'
                      }
                    }}
                  >
                    返回房间
                  </Button>
                </Box>
              </Box>
              
              {/* 角色创建组件 */}
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                <CharacterCreator
                  onCharacterCreated={handleCharacterCreated}
                  onBack={handleBackToRoom}
                  consensusTheme={{
                    title: consensusGoal.title,
                    description: consensusGoal.description
                  }}
                />
              </Box>
            </Box>
          );
        } else if (gamePhase === 'battle') {
          return (
            <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
              {/* 战斗阶段的头部 */}
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: '#ff5a5e', color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    ⚔️ 共识征程大作战
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setGamePhase('character')}
                    sx={{ 
                      color: 'white', 
                      borderColor: 'white',
                      '&:hover': { 
                        bgcolor: 'rgba(255,255,255,0.1)',
                        borderColor: 'white'
                      }
                    }}
                  >
                    返回角色选择
                  </Button>
                </Box>
              </Box>
              
              {/* 游戏组件 */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                <PhaserGame
                  gameData={{
                    player1Config: playerCharacters[0] || { name: '玩家1', style: 'casual' },
                    player2Config: playerCharacters[1] || { name: '玩家2', style: 'elegant' },
                    monsters: [],
                    backgroundUrl: gameBackground,
                    consensusTheme: {
                      title: consensusGoal.title,
                      description: consensusGoal.description
                    },
                    maxParticipants: consensusGoal.maxParticipants
                  }}
                  onGameEvent={(event, data) => {
                    console.log('游戏事件:', event, data);
                    if (event === 'victory') {
                      // 可以处理胜利后的逻辑
                    } else if (event === 'returnHome') {
                      // 返回主页
                      history.push('/home');
                    } else if (event === 'backToCharacter') {
                      // 返回角色创建界面
                      setGamePhase('character');
                    } else if (event === 'startBattle') {
                      // 开始战斗，但保持在battle阶段
                      console.log('开始与怪物战斗:', data);
                    }
                  }}
                />
              </Box>
            </Box>
          );
        } else {
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
        }

      default:
        return null;
    }
  };


  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 背景图片顶部区域 - 仅在前3步显示 */}
      {activeStep < 3 && (
        <>
          <Box
            sx={{
              position: 'relative',
              height: '250px',
              overflow: 'hidden',
              background: '#ffffff',
            }}
          >
            {/* 背景图片 */}
            <Box
              component="img"
              src={backgroundImage}
              alt="共识发起背景"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'fill',
                objectPosition: 'center',
              }}
            />
            
            {/* 头部内容 */}
            <Box 
              className="launch-header"
              sx={{ 
                position: 'relative',
                zIndex: 2,
                p: 2, 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <IconButton
                className="back-button"
                onClick={handleGoBack}
                sx={{
                  position: 'absolute',
                  left: 16,
                  top: '30%',
                  transform: 'translateY(-50%)',
                  color: '#ff5a5e',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 90, 94, 0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    color: '#ff5a5e',
                    transform: 'translateY(-50%) scale(1.05)',
                  },
                }}
              >
                <ArrowBack />
              </IconButton>
            </Box>
          </Box>

          {/* 步骤指示器 */}
          <Box sx={{ 
            p: 2, 
            background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)',
            borderBottom: '1px solid rgba(255, 90, 94, 0.1)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </>
      )}

      {/* 内容区域 */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
      }}>
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
        <Box sx={{ 
          p: 2, 
          borderTop: '1px solid rgba(255, 90, 94, 0.1)',
          background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)',
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
        }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0}
              fullWidth
              sx={{
                borderColor: '#ff5a5e',
                color: '#ff5a5e',
                '&:hover': {
                  backgroundColor: 'rgba(255, 90, 94, 0.08)',
                  borderColor: '#ff4a4e',
                },
              }}
            >
              上一步
            </Button>
            
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={activeStep === 0 && (!consensusGoal.title || !consensusGoal.description)}
              fullWidth
              className="gradient-button-primary"
              sx={{
                '&:hover': {
                  transform: 'translateY(-1px)',
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
