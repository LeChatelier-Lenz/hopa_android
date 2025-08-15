import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { usePreferences } from '../context/PreferencesContext';
import {
  Box,
  Typography,
  LinearProgress,
  Button,
  TextField,
  Chip,
  IconButton,
  Paper,
  Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import MobileContainer from '../components/MobileContainer';
import './preferences.css';

interface PreferenceQuestion {
  id: string;
  question: string;
  options: string[];
  type: 'choice' | 'input' | 'mixed';
  category: string;
}

const PreferenceSettings: React.FC = () => {
  const history = useHistory();
  const { setPreferences } = usePreferences();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  // 模拟偏好问题数据
  const preferenceQuestions: PreferenceQuestion[] = [
    {
      id: '1',
      question: '在团队决策中，你更倾向于哪种沟通方式？',
      options: ['直接表达', '委婉建议', '投票表决', '小组讨论', '一对一沟通', '书面提案'],
      type: 'mixed',
      category: '沟通偏好',
    },
    {
      id: '2',
      question: '当遇到分歧时，你通常会采取什么策略？',
      options: ['寻求共识', '坚持己见', '妥协让步', '延期讨论', '寻求第三方意见', '数据论证'],
      type: 'mixed',
      category: '冲突处理',
    },
    {
      id: '3',
      question: '你希望在共识达成过程中获得什么样的反馈？',
      options: ['实时反馈', '定期总结', '详细分析', '简洁要点', '可视化展示', '个性化建议'],
      type: 'mixed',
      category: '反馈偏好',
    },
    {
      id: '4',
      question: '在参与共识活动时，你更看重哪些因素？',
      options: ['效率', '公平性', '参与度', '创新性', '可行性', '可持续性'],
      type: 'mixed',
      category: '价值取向',
    },
    {
      id: '5',
      question: '你希望AI在共识过程中扮演什么角色？',
      options: ['问题引导者', '信息整理者', '决策辅助者', '进度监督者', '创意激发者', '中立调解者'],
      type: 'mixed',
      category: 'AI角色',
    },
    {
      id: '6',
      question: '请描述一下你理想中的共识达成体验？',
      options: ['高效快速', '深度思考', '轻松愉快', '严谨专业', '创意无限', '和谐共赢'],
      type: 'mixed',
      category: '体验偏好',
    },
  ];

  const currentQuestion = preferenceQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / preferenceQuestions.length) * 100;

  const handleOptionSelect = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(item => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleCustomInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInput(event.target.value);
  };

  const handleSendCustomInput = () => {
    if (customInput.trim()) {
      setSelectedOptions([...selectedOptions, customInput.trim()]);
      setCustomInput('');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      // 保存当前答案
      if (selectedOptions.length > 0) {
        setAnswers({
          ...answers,
          [currentQuestion.id]: [...selectedOptions],
        });
      }
      
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const prevQuestion = preferenceQuestions[currentQuestionIndex - 1];
      setSelectedOptions(answers[prevQuestion.id] || []);
      setCustomInput('');
    }
  };

  const handleNext = () => {
    if (selectedOptions.length === 0) {
      // 可以添加提示：请至少选择一个选项
      return;
    }

    // 保存当前答案
    setAnswers({
      ...answers,
      [currentQuestion.id]: [...selectedOptions],
    });

    if (currentQuestionIndex < preferenceQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      const nextQuestion = preferenceQuestions[currentQuestionIndex + 1];
      setSelectedOptions(answers[nextQuestion.id] || []);
      setCustomInput('');
    } else {
      // 完成设置，跳转到完成页面
      const finalAnswers = {
        ...answers,
        [currentQuestion.id]: [...selectedOptions],
      };
      console.log('偏好设置完成:', finalAnswers);
      // 保存偏好设置到Context和本地存储
      setPreferences(finalAnswers);
      history.push('/preferences-complete');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSendCustomInput();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#ff5a5e', '--color': '#ffffff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
            <IconButton 
              sx={{ color: '#ffffff', mr: 2 }}
              onClick={() => window.location.href = '/mine'}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
              深度个性化设置
            </Typography>
          </Box>
        </IonToolbar>
      </IonHeader>
      
             <IonContent fullscreen>
         <MobileContainer sx={{ p: 2, paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {/* 进度条 */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#666' }}>
                问题 {currentQuestionIndex + 1} / {preferenceQuestions.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#ff5a5e', fontWeight: 500 }}>
                {Math.round(progress)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress}
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

          {/* 当前问题 */}
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 3,
              bgcolor: '#fff',
              border: '1px solid #f0f0f0',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
              {currentQuestion.question}
            </Typography>
            <Chip 
              label={currentQuestion.category}
              size="small"
              sx={{
                bgcolor: '#ff5a5e',
                color: '#ffffff',
                fontSize: '0.75rem',
              }}
            />
          </Paper>

                                {/* 选项词云 */}
           <Box sx={{ flex: 1, mb: 3, overflow: 'auto', minHeight: 0 }}>
             <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
               选择你认同的选项：
             </Typography>
             <Box sx={{ 
               display: 'flex', 
               flexWrap: 'wrap', 
               gap: 1.5,
               justifyContent: 'center',
               maxHeight: '40vh',
               overflowY: 'auto',
             }}>
              {currentQuestion.options.map((option, index) => (
                <Chip
                  key={index}
                  label={option}
                  onClick={() => handleOptionSelect(option)}
                  sx={{
                    bgcolor: selectedOptions.includes(option) ? '#ff5a5e' : '#f0f0f0',
                    color: selectedOptions.includes(option) ? '#ffffff' : '#666',
                    fontSize: '0.9rem',
                    height: 36,
                    px: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: selectedOptions.includes(option) ? '#e64549' : '#e0e0e0',
                      transform: 'scale(1.05)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* 自定义输入 */}
          {(currentQuestion.type === 'input' || currentQuestion.type === 'mixed') && (
            <Box sx={{ mb: 3  }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
                或者添加你的想法：
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="输入你的想法..."
                  value={customInput}
                  onChange={handleCustomInputChange}
                  onKeyPress={handleKeyPress}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#ff5a5e',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ff5a5e',
                      },
                    },
                  }}
                />
                <IconButton
                  sx={{
                    bgcolor: '#ff5a5e',
                    color: '#ffffff',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    '&:hover': {
                      bgcolor: '#e64549',
                    },
                  }}
                  onClick={handleSendCustomInput}
                >
                  <MicIcon
                    // 自适应填充
                    
                  />
                </IconButton>
                <IconButton
                  sx={{
                    bgcolor: '#ff5a5e',
                    color: '#ffffff',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    '&:hover': {
                      bgcolor: '#e64549',
                    },
                  }}
                  onClick={handleSendCustomInput}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          )}

          {/* 已选择的选项 */}
          {selectedOptions.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
                已选择：
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedOptions.map((option, index) => (
                  <Chip
                    key={index}
                    label={option}
                    onDelete={() => handleOptionSelect(option)}
                    sx={{
                      bgcolor: '#ff5a5e',
                      color: '#ffffff',
                      fontSize: '0.8rem',
                      '& .MuiChip-deleteIcon': {
                        color: '#ffffff',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

                     {/* 导航按钮 */}
           <Box sx={{ 
             display: 'flex', 
             gap: 2, 
             mt: 'auto',
             pt: 2,
             pb: 1,
             flexShrink: 0,
           }}>
            <Button
              variant="outlined"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              sx={{
                flex: 1,
                borderColor: '#ff5a5e',
                color: '#ff5a5e',
                '&:hover': {
                  borderColor: '#e64549',
                  bgcolor: 'rgba(255, 90, 94, 0.04)',
                },
                '&:disabled': {
                  borderColor: '#ccc',
                  color: '#ccc',
                },
              }}
            >
              上一个问题
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={selectedOptions.length === 0}
              sx={{
                flex: 1,
                bgcolor: '#ff5a5e',
                '&:hover': {
                  bgcolor: '#e64549',
                },
                '&:disabled': {
                  bgcolor: '#ccc',
                },
              }}
            >
              {currentQuestionIndex === preferenceQuestions.length - 1 ? '完成设置' : '下一个问题'}
            </Button>
                     </Box>
         </MobileContainer>
       </IonContent>
    </IonPage>
  );
};

export default PreferenceSettings;
