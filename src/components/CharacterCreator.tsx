import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Chip,
  Avatar,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  NavigateBefore,
  NavigateNext,
  Save,
  Refresh,
  AttachMoney,
  Schedule,
  LocationOn,
  Restaurant,
  Person,
} from '@mui/icons-material';

// 角色数据类型
interface Character {
  id: string;
  name: string;
  avatar: string;
  style: 'casual' | 'elegant' | 'sporty' | 'artistic';
}

// 装备数据类型
interface Equipment {
  budgetAmulet: {
    enabled: boolean;
    range: [number, number]; // [min, max] 预算范围
  };
  timeCompass: {
    enabled: boolean;
    duration: 'half-day' | 'full-day' | 'overnight';
  };
  attractionShield: {
    enabled: boolean;
    preferences: string[]; // 景点优先级排序
  };
  cuisineGem: {
    enabled: boolean;
    types: string[]; // 餐饮偏好
  };
}

// 角色配置数据类型
interface CharacterConfig {
  character: Character;
  equipment: Equipment;
}

// 预定义的角色选项
const characterOptions: Character[] = [
  {
    id: 'char1',
    name: '小雅',
    avatar: '/api/placeholder/80/80',
    style: 'elegant',
  },
  {
    id: 'char2', 
    name: '小明',
    avatar: '/api/placeholder/80/80',
    style: 'casual',
  },
  {
    id: 'char3',
    name: '小芸',
    avatar: '/api/placeholder/80/80',
    style: 'artistic',
  },
  {
    id: 'char4',
    name: '小强',
    avatar: '/api/placeholder/80/80',
    style: 'sporty',
  },
];

// 西湖景点选项
const attractionOptions = [
  '雷峰塔',
  '苏堤',
  '断桥残雪',
  '西湖音乐喷泉',
  '三潭印月',
  '平湖秋月',
  '柳浪闻莺',
  '花港观鱼',
];

// 餐饮类型选项
const cuisineOptions = [
  '杭帮菜',
  '网红店',
  '特色小吃',
  '西湖醋鱼',
  '东坡肉',
  '龙井虾仁',
  '咖啡厅',
  '茶餐厅',
];

interface CharacterCreatorProps {
  onCharacterCreated: (config: CharacterConfig) => void;
  onBack?: () => void;
  initialConfig?: CharacterConfig;
}

const CharacterCreator: React.FC<CharacterCreatorProps> = ({ 
  onCharacterCreated, 
  onBack,
  initialConfig 
}) => {
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState(0);
  const [config, setConfig] = useState<CharacterConfig>(() => {
    // 优先使用传入的配置，其次是localStorage，最后是默认配置
    if (initialConfig) return initialConfig;
    
    const savedConfig = localStorage.getItem('hopaCharacterConfig');
    if (savedConfig) {
      try {
        return JSON.parse(savedConfig);
      } catch (error) {
        console.error('Failed to parse saved character config:', error);
      }
    }
    
    // 默认配置
    return {
      character: characterOptions[0],
      equipment: {
        budgetAmulet: {
          enabled: true,
          range: [100, 300],
        },
        timeCompass: {
          enabled: true,
          duration: 'full-day',
        },
        attractionShield: {
          enabled: true,
          preferences: [attractionOptions[0], attractionOptions[1]],
        },
        cuisineGem: {
          enabled: true,
          types: [cuisineOptions[0]],
        },
      },
    };
  });

  // 同步选中的角色索引
  useEffect(() => {
    const index = characterOptions.findIndex(char => char.id === config.character.id);
    if (index !== -1) {
      setSelectedCharacterIndex(index);
    }
  }, [config.character.id]);

  // 角色选择处理
  const handleCharacterSelect = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next'
      ? (selectedCharacterIndex + 1) % characterOptions.length
      : (selectedCharacterIndex - 1 + characterOptions.length) % characterOptions.length;
    
    setSelectedCharacterIndex(newIndex);
    setConfig(prev => ({
      ...prev,
      character: characterOptions[newIndex],
    }));
  };

  // 装备配置更新
  const updateEquipment = (equipmentType: keyof Equipment, updates: any) => {
    setConfig(prev => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [equipmentType]: {
          ...prev.equipment[equipmentType],
          ...updates,
        },
      },
    }));
  };

  // 保存配置
  const handleSave = () => {
    // 保存到localStorage
    localStorage.setItem('hopaCharacterConfig', JSON.stringify(config));
    // 调用回调函数
    onCharacterCreated(config);
  };

  // 重置配置
  const handleReset = () => {
    localStorage.removeItem('hopaCharacterConfig');
    setSelectedCharacterIndex(0);
    setConfig({
      character: characterOptions[0],
      equipment: {
        budgetAmulet: { enabled: true, range: [100, 300] },
        timeCompass: { enabled: true, duration: 'full-day' },
        attractionShield: { enabled: true, preferences: [attractionOptions[0]] },
        cuisineGem: { enabled: true, types: [cuisineOptions[0]] },
      },
    });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      {/* 标题 */}
      <Typography variant="h4" align="center" gutterBottom sx={{ 
        fontWeight: 700, 
        color: '#ff5a5e',
        mb: 4 
      }}>
        🎮 角色创建 & 装备选择
      </Typography>

      {/* 角色选择区域 */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: '#333'
        }}>
          <Person sx={{ color: '#ff5a5e' }} />
          选择你的角色
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 3,
          py: 3
        }}>
          <IconButton 
            onClick={() => handleCharacterSelect('prev')}
            sx={{ 
              bgcolor: 'rgba(255, 90, 94, 0.1)',
              '&:hover': { bgcolor: 'rgba(255, 90, 94, 0.2)' }
            }}
          >
            <NavigateBefore sx={{ color: '#ff5a5e' }} />
          </IconButton>

          <Card sx={{ 
            minWidth: 200, 
            textAlign: 'center',
            border: '3px solid #ff5a5e',
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(255, 90, 94, 0.3)',
            transform: 'scale(1.05)',
          }}>
            <CardContent>
              <Avatar
                src={config.character.avatar}
                sx={{ 
                  width: 80, 
                  height: 80, 
                  mx: 'auto', 
                  mb: 2,
                  border: '3px solid #ff5a5e'
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#ff5a5e' }}>
                {config.character.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {config.character.style === 'elegant' && '优雅风格'}
                {config.character.style === 'casual' && '休闲风格'}
                {config.character.style === 'artistic' && '文艺风格'}
                {config.character.style === 'sporty' && '运动风格'}
              </Typography>
            </CardContent>
          </Card>

          <IconButton 
            onClick={() => handleCharacterSelect('next')}
            sx={{ 
              bgcolor: 'rgba(255, 90, 94, 0.1)',
              '&:hover': { bgcolor: 'rgba(255, 90, 94, 0.2)' }
            }}
          >
            <NavigateNext sx={{ color: '#ff5a5e' }} />
          </IconButton>
        </Box>
      </Paper>

      {/* 装备选择区域 */}
      <Typography variant="h5" gutterBottom sx={{ 
        fontWeight: 600, 
        color: '#333',
        mb: 3,
        textAlign: 'center'
      }}>
        🎒 西湖约会装备
      </Typography>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 3 
      }}>
        {/* 预算护符 */}
        <Box>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AttachMoney sx={{ color: '#ff5a5e' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  预算护符
                </Typography>
                <Switch
                  checked={config.equipment.budgetAmulet.enabled}
                  onChange={(e) => updateEquipment('budgetAmulet', { enabled: e.target.checked })}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#ff5a5e',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#ff5a5e',
                    },
                  }}
                />
              </Box>
              
              {config.equipment.budgetAmulet.enabled && (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    设定你的消费预算范围
                  </Typography>
                  <Box sx={{ px: 2, py: 3 }}>
                    <Slider
                      value={config.equipment.budgetAmulet.range}
                      onChange={(_, newValue) => 
                        updateEquipment('budgetAmulet', { range: newValue })
                      }
                      valueLabelDisplay="on"
                      min={50}
                      max={1000}
                      step={50}
                      marks={[
                        { value: 50, label: '¥50' },
                        { value: 500, label: '¥500' },
                        { value: 1000, label: '¥1000' },
                      ]}
                      sx={{
                        '& .MuiSlider-thumb': {
                          backgroundColor: '#ff5a5e',
                        },
                        '& .MuiSlider-track': {
                          backgroundColor: '#ff5a5e',
                        },
                        '& .MuiSlider-rail': {
                          backgroundColor: '#ffcdd2',
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="body2" align="center" sx={{ 
                    color: '#ff5a5e', 
                    fontWeight: 500 
                  }}>
                    预算范围：¥{config.equipment.budgetAmulet.range[0]} - ¥{config.equipment.budgetAmulet.range[1]}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* 时间指南针 */}
        <Box>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Schedule sx={{ color: '#ff5a5e' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  时间指南针
                </Typography>
                <Switch
                  checked={config.equipment.timeCompass.enabled}
                  onChange={(e) => updateEquipment('timeCompass', { enabled: e.target.checked })}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#ff5a5e',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#ff5a5e',
                    },
                  }}
                />
              </Box>
              
              {config.equipment.timeCompass.enabled && (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    选择游玩时长偏好
                  </Typography>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>时长偏好</InputLabel>
                    <Select
                      value={config.equipment.timeCompass.duration}
                      label="时长偏好"
                      onChange={(e) => 
                        updateEquipment('timeCompass', { duration: e.target.value })
                      }
                    >
                      <MenuItem value="half-day">半日游 (4-6小时)</MenuItem>
                      <MenuItem value="full-day">全日游 (8-10小时)</MenuItem>
                      <MenuItem value="overnight">过夜游 (1-2天)</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* 景点盾牌 */}
        <Box>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocationOn sx={{ color: '#ff5a5e' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  景点盾牌
                </Typography>
                <Switch
                  checked={config.equipment.attractionShield.enabled}
                  onChange={(e) => updateEquipment('attractionShield', { enabled: e.target.checked })}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#ff5a5e',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#ff5a5e',
                    },
                  }}
                />
              </Box>
              
              {config.equipment.attractionShield.enabled && (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    选择想去的景点（可多选）
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                    {attractionOptions.map((attraction) => (
                      <Chip
                        key={attraction}
                        label={attraction}
                        clickable
                        variant={config.equipment.attractionShield.preferences.includes(attraction) ? 'filled' : 'outlined'}
                        onClick={() => {
                          const current = config.equipment.attractionShield.preferences;
                          const newPreferences = current.includes(attraction)
                            ? current.filter(p => p !== attraction)
                            : [...current, attraction];
                          updateEquipment('attractionShield', { preferences: newPreferences });
                        }}
                        sx={{
                          backgroundColor: config.equipment.attractionShield.preferences.includes(attraction) ? '#ff5a5e' : 'transparent',
                          color: config.equipment.attractionShield.preferences.includes(attraction) ? 'white' : '#ff5a5e',
                          borderColor: '#ff5a5e',
                          '&:hover': {
                            backgroundColor: config.equipment.attractionShield.preferences.includes(attraction) 
                              ? '#ff4a4e' 
                              : 'rgba(255, 90, 94, 0.04)',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* 美食宝珠 */}
        <Box>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Restaurant sx={{ color: '#ff5a5e' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  美食宝珠
                </Typography>
                <Switch
                  checked={config.equipment.cuisineGem.enabled}
                  onChange={(e) => updateEquipment('cuisineGem', { enabled: e.target.checked })}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#ff5a5e',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#ff5a5e',
                    },
                  }}
                />
              </Box>
              
              {config.equipment.cuisineGem.enabled && (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    选择餐饮偏好（可多选）
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                    {cuisineOptions.map((cuisine) => (
                      <Chip
                        key={cuisine}
                        label={cuisine}
                        clickable
                        variant={config.equipment.cuisineGem.types.includes(cuisine) ? 'filled' : 'outlined'}
                        onClick={() => {
                          const current = config.equipment.cuisineGem.types;
                          const newTypes = current.includes(cuisine)
                            ? current.filter(t => t !== cuisine)
                            : [...current, cuisine];
                          updateEquipment('cuisineGem', { types: newTypes });
                        }}
                        sx={{
                          backgroundColor: config.equipment.cuisineGem.types.includes(cuisine) ? '#ff5a5e' : 'transparent',
                          color: config.equipment.cuisineGem.types.includes(cuisine) ? 'white' : '#ff5a5e',
                          borderColor: '#ff5a5e',
                          '&:hover': {
                            backgroundColor: config.equipment.cuisineGem.types.includes(cuisine) 
                              ? '#ff4a4e' 
                              : 'rgba(255, 90, 94, 0.04)',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* 操作按钮 */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        justifyContent: 'center', 
        mt: 4 
      }}>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleReset}
          sx={{
            borderColor: '#ff5a5e',
            color: '#ff5a5e',
            '&:hover': {
              borderColor: '#ff4a4e',
              backgroundColor: 'rgba(255, 90, 94, 0.04)',
            },
          }}
        >
          重置配置
        </Button>
        
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
          sx={{
            background: 'linear-gradient(45deg, #ff5a5e, #ff7a7e)',
            '&:hover': {
              background: 'linear-gradient(45deg, #ff4a4e, #ff6a6e)',
            },
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
          }}
        >
          保存并进入战斗
        </Button>
      </Box>

      {/* 装备预览 */}
      <Paper elevation={2} sx={{ 
        mt: 4, 
        p: 3, 
        bgcolor: 'rgba(255, 90, 94, 0.02)',
        border: '1px solid rgba(255, 90, 94, 0.2)',
        borderRadius: 3 
      }}>
        <Typography variant="h6" gutterBottom sx={{ 
          color: '#ff5a5e', 
          fontWeight: 600,
          textAlign: 'center'
        }}>
          🎯 当前装备配置预览
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 2,
          mt: 1 
        }}>
          {config.equipment.budgetAmulet.enabled && (
            <Box>
              <Box sx={{ textAlign: 'center' }}>
                <AttachMoney sx={{ color: '#ff5a5e', fontSize: 30, mb: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  预算: ¥{config.equipment.budgetAmulet.range[0]}-{config.equipment.budgetAmulet.range[1]}
                </Typography>
              </Box>
            </Box>
          )}
          
          {config.equipment.timeCompass.enabled && (
            <Box>
              <Box sx={{ textAlign: 'center' }}>
                <Schedule sx={{ color: '#ff5a5e', fontSize: 30, mb: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  时长: {config.equipment.timeCompass.duration === 'half-day' ? '半日' : 
                         config.equipment.timeCompass.duration === 'full-day' ? '全日' : '过夜'}
                </Typography>
              </Box>
            </Box>
          )}
          
          {config.equipment.attractionShield.enabled && (
            <Box>
              <Box sx={{ textAlign: 'center' }}>
                <LocationOn sx={{ color: '#ff5a5e', fontSize: 30, mb: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  景点: {config.equipment.attractionShield.preferences.length}个
                </Typography>
              </Box>
            </Box>
          )}
          
          {config.equipment.cuisineGem.enabled && (
            <Box>
              <Box sx={{ textAlign: 'center' }}>
                <Restaurant sx={{ color: '#ff5a5e', fontSize: 30, mb: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  美食: {config.equipment.cuisineGem.types.length}类
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default CharacterCreator;