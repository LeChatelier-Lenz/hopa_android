import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Chip,
  Avatar,
} from '@mui/material';
// 移除@mui/lab的Timeline组件导入
import {
  ArrowBack,
  Schedule,
  DirectionsCar,
  Hotel,
  EmojiEvents,
  Cloud,
  Info,
  Share,
  GetApp,
} from '@mui/icons-material';
import { ConsensusAIOptions, ConsensusResult } from '../prompts/consensusAI';
import { generateConsensusResult, formatConsensusForDisplay } from '../utils/consensusApi';

interface ConsensusResultProps {
  data: {
    consensusTheme?: {
      title: string;
      description: string;
    };
    characters: any[];
    consensusResults?: Array<{
      question: string;
      selectedAnswer: string;
      consistency: number;
      category: string;
    }>;
    equipment?: any; // 装备配置数据
  };
  onBack: () => void;
}

const ConsensusResultComponent: React.FC<ConsensusResultProps> = ({ data, onBack }) => {
  const [consensusResult, setConsensusResult] = useState<ConsensusResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateAIConsensusResult();
  }, [data]);

  const generateAIConsensusResult = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 构建AI输入参数
      const aiOptions: ConsensusAIOptions = {
        theme: data.consensusTheme?.title || '团队共识活动',
        description: data.consensusTheme?.description || '团队协作决策',
        participants: data.characters?.length || 2,
        duration: extractDuration(data.equipment),
        budget: extractBudget(data.equipment),
        attractions: extractPreferences(data.equipment, 'attractions'),
        cuisines: extractPreferences(data.equipment, 'cuisines'),
        transportation: extractPreferences(data.equipment, 'transportation'),
        atmosphere: extractPreferences(data.equipment, 'atmosphere'),
        consensusResults: data.consensusResults || []
      };

      console.log('🚀 开始生成AI共识方案，参数:', aiOptions);
      
      const result = await generateConsensusResult(aiOptions);
      
      if (result) {
        setConsensusResult(result);
        console.log('✅ 共识结果生成成功:', result.title);
      } else {
        setError('AI共识方案生成失败，请重试');
      }
    } catch (err) {
      console.error('❌ 生成共识结果时发生错误:', err);
      setError('生成共识方案时发生错误');
    } finally {
      setIsLoading(false);
    }
  };

  // 提取装备中的时间配置
  const extractDuration = (equipment: any): string => {
    return equipment?.timeCompass?.duration || 'full-day';
  };

  // 提取装备中的预算配置
  const extractBudget = (equipment: any): { range: [number, number]; level: string } => {
    const budgetAmulet = equipment?.budgetAmulet;
    return {
      range: budgetAmulet?.range || [200, 500],
      level: budgetAmulet?.level || '舒适型'
    };
  };

  // 提取装备中的偏好配置
  const extractPreferences = (equipment: any, type: string): string[] => {
    switch (type) {
      case 'attractions':
        return equipment?.attractionShield?.preferences || [];
      case 'cuisines':
        return equipment?.cuisineGem?.types || [];
      case 'transportation':
        return equipment?.transportationKey?.preferences || [];
      case 'atmosphere':
        return equipment?.atmosphereRing?.preferences || [];
      default:
        return [];
    }
  };

  const handleShare = () => {
    if (consensusResult && navigator.share) {
      navigator.share({
        title: consensusResult.title,
        text: formatConsensusForDisplay(consensusResult),
      }).catch(console.error);
    } else if (consensusResult) {
      // 复制到剪贴板
      const textContent = formatConsensusForDisplay(consensusResult);
      navigator.clipboard.writeText(textContent).then(() => {
        alert('共识方案已复制到剪贴板');
      });
    }
  };

  const handleExport = () => {
    if (consensusResult) {
      const content = formatConsensusForDisplay(consensusResult);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${consensusResult.title.replace(/[<>:"/\\|?*]/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const renderLoadingState = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '60vh',
      px: 2
    }}>
      <CircularProgress size={60} sx={{ color: '#ff5a5e', mb: 3 }} />
      <Typography variant="h6" color="text.secondary" align="center">
        🤖 AI正在分析团队共识...
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
        基于装备配置和答题结果生成个性化方案
      </Typography>
    </Box>
  );

  const renderErrorState = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '60vh',
      px: 2
    }}>
      <Typography variant="h6" color="error" align="center" gutterBottom>
        ❌ {error}
      </Typography>
      <Button 
        variant="contained" 
        onClick={generateAIConsensusResult}
        sx={{ 
          mt: 2,
          backgroundColor: '#ff5a5e',
          '&:hover': { backgroundColor: '#ff4a4e' }
        }}
      >
        🔄 重新生成
      </Button>
    </Box>
  );

  const getActivityIcon = (time: string) => {
    if (time.includes('上午') || time.includes('morning')) return '🌅';
    if (time.includes('下午') || time.includes('afternoon')) return '☀️';
    if (time.includes('晚上') || time.includes('evening')) return '🌙';
    return '📍';
  };

  if (isLoading) return renderLoadingState();
  if (error) return renderErrorState();
  if (!consensusResult) return renderErrorState();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa', pb: 4 }}>
      {/* 头部导航 */}
      <Paper elevation={1} sx={{ p: 2, backgroundColor: 'white', borderRadius: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={onBack} sx={{ mr: 1 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" sx={{ color: '#2c3e50' }}>
              共识结果详情
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={handleShare} sx={{ mr: 1 }}>
              <Share />
            </IconButton>
            <IconButton onClick={handleExport}>
              <GetApp />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* 主要内容 */}
      <Box sx={{ px: 2, pt: 2 }}>
        {/* 标题卡片 */}
        <Card sx={{ mb: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <EmojiEvents sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              {consensusResult.title}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {consensusResult.coreObjective}
            </Typography>
          </CardContent>
        </Card>

        {/* 基本信息网格 */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
          gap: 2, 
          mb: 2 
        }}>
          <Card>
            <CardHeader
              avatar={<Avatar sx={{ bgcolor: '#4CAF50' }}><Schedule /></Avatar>}
              title="时间安排"
              titleTypographyProps={{ variant: 'h6', fontSize: '1.1rem' }}
            />
            <CardContent sx={{ pt: 0 }}>
              <Typography variant="body2" color="text.secondary">
                {consensusResult.timeSchedule}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              avatar={<Avatar sx={{ bgcolor: '#2196F3' }}><DirectionsCar /></Avatar>}
              title="交通方式"
              titleTypographyProps={{ variant: 'h6', fontSize: '1.1rem' }}
            />
            <CardContent sx={{ pt: 0 }}>
              <Typography variant="body2" color="text.secondary">
                {consensusResult.transportation}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ gridColumn: { sm: '1 / -1' } }}>
            <CardHeader
              avatar={<Avatar sx={{ bgcolor: '#FF9800' }}><Hotel /></Avatar>}
              title="住宿安排"
              titleTypographyProps={{ variant: 'h6', fontSize: '1.1rem' }}
            />
            <CardContent sx={{ pt: 0 }}>
              <Typography variant="body2" color="text.secondary">
                {consensusResult.accommodation}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* 活动时间轴 */}
        <Card sx={{ mb: 2 }}>
          <CardHeader
            title="📅 活动安排"
            titleTypographyProps={{ variant: 'h6' }}
          />
          <CardContent sx={{ pt: 0 }}>
            {/* 自定义时间轴实现 */}
            <Box sx={{ position: 'relative', pl: 2 }}>
              {consensusResult.activities.map((activity, index) => (
                <Box key={index} sx={{ display: 'flex', mb: 3, position: 'relative' }}>
                  {/* 时间线 */}
                  <Box sx={{ 
                    position: 'absolute', 
                    left: -16, 
                    top: 4,
                    width: 2, 
                    height: index < consensusResult.activities.length - 1 ? 'calc(100% + 12px)' : 24,
                    backgroundColor: '#e0e0e0'
                  }} />
                  
                  {/* 时间点 */}
                  <Box sx={{ 
                    position: 'absolute',
                    left: -24,
                    top: 0,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: '#ff5a5e',
                    border: '2px solid white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '8px'
                  }}>
                    {getActivityIcon(activity.time)}
                  </Box>
                  
                  {/* 内容 */}
                  <Box sx={{ ml: 1 }}>
                    <Typography variant="h6" component="h3" sx={{ 
                      fontSize: '1rem', 
                      color: '#2c3e50',
                      mb: 0.5
                    }}>
                      {activity.time} · {activity.activity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {activity.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* 共识要点 */}
        <Card sx={{ mb: 2 }}>
          <CardHeader
            title="🎯 节奏共识"
            titleTypographyProps={{ variant: 'h6' }}
          />
          <CardContent sx={{ pt: 0 }}>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              {consensusResult.rhythmConsensus}
            </Typography>
          </CardContent>
        </Card>

        {/* 应对策略 */}
        <Card sx={{ mb: 2 }}>
          <CardHeader
            avatar={<Cloud />}
            title="天气应对"
            titleTypographyProps={{ variant: 'h6', fontSize: '1.1rem' }}
          />
          <CardContent sx={{ pt: 0 }}>
            <Typography variant="body2" color="text.secondary">
              {consensusResult.weatherContingency}
            </Typography>
          </CardContent>
        </Card>

        {/* 重要提示 */}
        <Card sx={{ mb: 2, backgroundColor: '#fff3cd', borderLeft: '4px solid #ffeb3b' }}>
          <CardHeader
            avatar={<Info sx={{ color: '#ff9800' }} />}
            title="重要提示"
            titleTypographyProps={{ variant: 'h6', fontSize: '1.1rem' }}
          />
          <CardContent sx={{ pt: 0 }}>
            <Typography variant="body2" sx={{ color: '#856404' }}>
              {consensusResult.remarks}
            </Typography>
          </CardContent>
        </Card>

        {/* AI推理说明 */}
        <Card sx={{ mb: 2, backgroundColor: '#f8f9fa' }}>
          <CardHeader
            title="🤖 AI推理过程"
            titleTypographyProps={{ variant: 'h6', fontSize: '1rem' }}
          />
          <CardContent sx={{ pt: 0 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              {consensusResult.reasoning}
            </Typography>
          </CardContent>
        </Card>

        {/* 底部操作按钮 */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          justifyContent: 'center',
          flexWrap: 'wrap',
          mt: 3
        }}>
          <Button
            variant="contained"
            startIcon={<Share />}
            onClick={handleShare}
            sx={{ 
              backgroundColor: '#4CAF50',
              '&:hover': { backgroundColor: '#45a049' },
              minWidth: '120px'
            }}
          >
            分享方案
          </Button>
          <Button
            variant="contained"
            startIcon={<GetApp />}
            onClick={handleExport}
            sx={{ 
              backgroundColor: '#2196F3',
              '&:hover': { backgroundColor: '#1976d2' },
              minWidth: '120px'
            }}
          >
            导出文件
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ConsensusResultComponent;