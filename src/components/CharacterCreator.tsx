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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
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
  DirectionsCar,
  Mood,
  Person,
  AutoAwesome,
} from '@mui/icons-material';
import EquipmentAI, { type AIEquipmentOptions } from '../prompts/equipmentAI';

// 角色数据类型
interface Character {
  id: string;
  name: string;
  avatar: string;
  image: string; // 添加游戏中使用的图片字段
  style: 'casual' | 'elegant' | 'sporty' | 'artistic';
}

// 装备数据类型
interface Equipment {
  budgetAmulet: {
    enabled: boolean;
    range: [number, number]; // [min, max] 预算范围
    required: boolean;
  };
  timeCompass: {
    enabled: boolean;
    duration: 'half-day' | 'full-day' | 'overnight';
    required: boolean;
  };
  attractionShield: {
    enabled: boolean;
    preferences: string[]; // 景点优先级排序
    required: boolean;
  };
  cuisineGem: {
    enabled: boolean;
    types: string[]; // 餐饮偏好
    required: boolean;
  };
  transportationKey: {
    enabled: boolean;
    preferences: string[]; // 交通方式偏好
    required: boolean;
  };
  atmosphereRing: {
    enabled: boolean;
    preferences: string[]; // 氛围偏好
    required: boolean;
  };
}

// 装备图片映射
const EQUIPMENT_IMAGES = {
  budgetAmulet: '/src/assets/game/equipment/Four-leaf-clover.jpg', // 四叶草护符 -> 预算护符
  timeCompass: '/src/assets/game/equipment/magic_bar.jpg', // 魔法棒 -> 时间指南针
  attractionShield: '/src/assets/game/equipment/Gemstone.jpg', // 宝石 -> 景点护盾
  cuisineGem: '/src/assets/game/equipment/ring.jpg', // 戒指 -> 美食宝石
  transportationKey: '/src/assets/game/equipment/Key.jpg', // 钥匙 -> 交通钥匙
  atmosphereRing: '/src/assets/game/equipment/Coin.jpg', // 金币 -> 氛围戒指
};

// 装备选项配置（已移除，现使用AI生成的选项）

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
    avatar: '/src/assets/game/characters/cha1.jpg',
    image: 'character1', // 游戏中使用的key
    style: 'elegant',
  },
  {
    id: 'char2', 
    name: '小明',
    avatar: '/src/assets/game/characters/cha2.jpg',
    image: 'character2',
    style: 'casual',
  },
  {
    id: 'char3',
    name: '小芸',
    avatar: '/src/assets/game/characters/cha3.jpg',
    image: 'character3',
    style: 'artistic',
  },
  {
    id: 'char4',
    name: '小强',
    avatar: '/src/assets/game/characters/cha4.jpg',
    image: 'character4',
    style: 'sporty',
  },
];

// 备用选项（仅在AI生成失败时使用）
const fallbackAttractionOptions = [
  '热门景点',
  '文化场所',
  '休闲娱乐',
  '自然风光',
];

const fallbackCuisineOptions = [
  '当地美食',
  '特色小吃',
  '传统料理',
  '现代餐厅',
];

// 备用交通选项
const fallbackTransportationOptions = [
  '地铁出行',
  '公交出行',
  '出租车',
  '自驾车',
  '共享单车',
  '步行',
];

// 备用氛围选项  
const fallbackAtmosphereOptions = [
  '轻松休闲',
  '文艺浪漫',
  '热闹欢快',
  '宁静安详',
  '探索冒险',
  '怀旧复古',
];

interface CharacterCreatorProps {
  onCharacterCreated: (config: CharacterConfig) => void;
  onBack?: () => void;
  initialConfig?: CharacterConfig;
  consensusTheme?: { title: string; description: string }; // 从主题界面传入
}

// 装备槽位组件
interface EquipmentSlotProps {
  icon?: React.ReactNode;
  image?: string;
  name: string;
  enabled: boolean;
  required?: boolean;
  onClick: () => void;
  onCustomize?: () => void; // 定制功能回调
  color: string;
}

const EquipmentSlot: React.FC<EquipmentSlotProps> = ({ icon, image, name, enabled, required = false, onClick, onCustomize, color }) => {

  return (
    <Box
      sx={{
        width: 70,
        height: enabled && onCustomize ? 90 : 70, // 已启用装备高度增加以容纳定制按钮
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        gap: 0.5,
      }}
    >
      {/* 装备槽位主体 */}
      <Box
        onClick={required ? undefined : onClick}
        sx={{
          width: 70,
          height: 70,
          border: `2px solid ${enabled ? color : '#ccc'}`,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: enabled ? `${color}15` : 'rgba(0,0,0,0.02)',
          cursor: required ? 'default' : 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative',
          opacity: required && !enabled ? 0.7 : 1,
          '&:hover': {
            transform: required ? 'none' : 'scale(1.05)',
            boxShadow: required ? 'none' : `0 4px 12px ${color}40`,
            bgcolor: required ? (enabled ? `${color}15` : 'rgba(0,0,0,0.02)') : (enabled ? `${color}25` : 'rgba(0,0,0,0.05)'),
          },
        }}
      >
      {/* 装备图片或图标 */}
      {image ? (
        <img
          src={image}
          alt={name}
          style={{
            width: '50px',
            height: '50px',
            objectFit: 'cover',
            borderRadius: '6px',
            filter: enabled ? 'none' : 'grayscale(100%)',
            marginBottom: '2px'
          }}
        />
      ) : (
        <Box sx={{ 
          color: enabled ? color : '#999',
          fontSize: '1.5rem',
          mb: 0.3
        }}>
          {icon}
        </Box>
      )}
      
      {/* 装备名称 */}
      <Typography variant="caption" sx={{ 
        color: enabled ? color : '#999',
        fontWeight: enabled ? 600 : 400,
        textAlign: 'center',
        fontSize: '0.6rem',
        lineHeight: 1
      }}>
        {name}
      </Typography>
      
      {/* 必带装备标识 */}
      {required && (
        <Box sx={{
          position: 'absolute',
          top: -3,
          left: -3,
          width: 16,
          height: 16,
          borderRadius: '50%',
          bgcolor: '#FF5722',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '8px',
          fontWeight: 'bold',
          border: '1px solid white'
        }}>
          必
        </Box>
      )}
      
      {/* 启用状态指示器 */}
      {enabled && !required && (
        <Box sx={{
          position: 'absolute',
          top: -5,
          right: -5,
          width: 20,
          height: 20,
          borderRadius: '50%',
          bgcolor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '0.7rem',
          fontWeight: 'bold'
        }}>
          ✓
        </Box>
      )}
      </Box>

      {/* 定制按钮 - 仅对已启用且支持定制的装备显示 */}
      {enabled && onCustomize && (
        <Button
          variant="outlined"
          size="small"
          onClick={(e) => {
            e.stopPropagation(); // 防止触发父级点击事件
            onCustomize();
          }}
          sx={{
            minWidth: 'auto',
            width: 50,
            height: 18,
            fontSize: '0.5rem',
            padding: '2px 4px',
            borderColor: color,
            color: color,
            borderRadius: 1,
            '&:hover': {
              borderColor: color,
              bgcolor: `${color}10`,
            },
          }}
        >
          定制
        </Button>
      )}
    </Box>
  );
};

const CharacterCreator: React.FC<CharacterCreatorProps> = ({ 
  onCharacterCreated, 
  onBack,
  initialConfig,
  consensusTheme
}) => {
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState(0);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [aiEquipmentOptions, setAiEquipmentOptions] = useState<AIEquipmentOptions | null>(null);
  const [isGeneratingEquipment, setIsGeneratingEquipment] = useState(false);
  const [attractionOptions, setAttractionOptions] = useState(fallbackAttractionOptions);
  const [cuisineOptions, setCuisineOptions] = useState(fallbackCuisineOptions);
  const [transportationOptions, setTransportationOptions] = useState(fallbackTransportationOptions);
  const [atmosphereOptions, setAtmosphereOptions] = useState(fallbackAtmosphereOptions);
  const [budgetOptions, setBudgetOptions] = useState<Array<{range: [number, number], description: string, level: string}>>([]);
  const [timeOptions, setTimeOptions] = useState<Array<{duration: string, description: string, suitable: string}>>([]);
  const [config, setConfig] = useState<CharacterConfig>(() => {
    // 优先使用传入的配置，其次是localStorage，最后是默认配置
    if (initialConfig) {
      // 迁移传入配置：确保新装备类型存在
      if (!initialConfig.equipment.transportationKey) {
        initialConfig.equipment.transportationKey = {
          enabled: false,
          preferences: [],
          required: false,
        };
      }
      if (!initialConfig.equipment.atmosphereRing) {
        initialConfig.equipment.atmosphereRing = {
          enabled: false,
          preferences: [],
          required: false,
        };
      }
      return initialConfig;
    }
    
    const savedConfig = localStorage.getItem('hopaCharacterConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        // 迁移旧配置：确保新装备类型存在
        if (!parsedConfig.equipment.transportationKey) {
          parsedConfig.equipment.transportationKey = {
            enabled: false,
            preferences: [],
            required: false,
          };
        }
        if (!parsedConfig.equipment.atmosphereRing) {
          parsedConfig.equipment.atmosphereRing = {
            enabled: false,
            preferences: [],
            required: false,
          };
        }
        return parsedConfig;
      } catch (error) {
        console.error('Failed to parse saved character config:', error);
      }
    }
    
    // 默认配置：前2个必带，3-4默认带，5-6不带
    return {
      character: characterOptions[0],
      equipment: {
        budgetAmulet: {
          enabled: true,
          range: [100, 300],
          required: true, // 必带
        },
        timeCompass: {
          enabled: true,
          duration: 'full-day',
          required: true, // 必带
        },
        attractionShield: {
          enabled: true,
          preferences: [fallbackAttractionOptions[0]],
          required: false,
        },
        cuisineGem: {
          enabled: true,
          types: [fallbackCuisineOptions[0]],
          required: false,
        },
        transportationKey: {
          enabled: false,
          preferences: [],
          required: false,
        },
        atmosphereRing: {
          enabled: false,
          preferences: [],
          required: false,
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

  // 当有共识主题时，自动生成AI装备选项
  useEffect(() => {
    if (consensusTheme && !aiEquipmentOptions && !isGeneratingEquipment) {
      generateAIEquipmentOptions();
    }
  }, [consensusTheme]);

  // AI装备选项生成
  const generateAIEquipmentOptions = async () => {
    if (!consensusTheme) {
      console.warn('⚠️ 没有共识主题，跳过AI装备生成');
      return;
    }

    setIsGeneratingEquipment(true);
    try {
      console.log('🤖 开始为主题生成AI装备选项:', consensusTheme);
      
      const options = await EquipmentAI.generateEquipmentOptions(consensusTheme);
      console.log('✅ AI装备选项生成成功:', options);
      
      setAiEquipmentOptions(options);
      
      // 更新装备选项
      console.log('🔄 更新界面选项，预算:', options.budgetOptions, '时间:', options.timeOptions, '景点:', options.attractions, '美食:', options.cuisines, '交通:', options.transportations, '氛围:', options.atmospheres);
      setBudgetOptions(options.budgetOptions);
      setTimeOptions(options.timeOptions);
      setAttractionOptions(options.attractions);
      setCuisineOptions(options.cuisines);
      setTransportationOptions(options.transportations);
      setAtmosphereOptions(options.atmospheres);
      
      // 自动更新角色配置的预算和时间 - 使用第一个推荐选项作为默认
      setConfig(prev => ({
        ...prev,
        equipment: {
          ...prev.equipment,
          budgetAmulet: {
            ...prev.equipment.budgetAmulet,
            range: options.budgetOptions[0]?.range || [300, 1000],
          },
          timeCompass: {
            ...prev.equipment.timeCompass,
            duration: (options.timeOptions[0]?.duration as 'half-day' | 'full-day' | 'overnight') || 'full-day',
          },
          // 默认选择前几个AI推荐的选项
          attractionShield: {
            ...prev.equipment.attractionShield,
            preferences: options.attractions.slice(0, 2),
          },
          cuisineGem: {
            ...prev.equipment.cuisineGem,
            types: options.cuisines.slice(0, 1),
          },
          // 默认选择前几个AI推荐的交通和氛围选项
          transportationKey: {
            ...prev.equipment.transportationKey,
            preferences: options.transportations.slice(0, 2),
          },
          atmosphereRing: {
            ...prev.equipment.atmosphereRing,
            preferences: options.atmospheres.slice(0, 2),
          },
        },
      }));

      console.log('✅ AI装备选项生成完成:', options);
      
    } catch (error) {
      console.error('❌ AI装备选项生成失败:', error);
      // 失败时使用默认选项
    } finally {
      setIsGeneratingEquipment(false);
    }
  };

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

  // 装备选择逻辑：前2个必带，后4个可选择2个
  const handleEquipmentToggle = (equipmentType: keyof Equipment) => {
    const equipment = config.equipment[equipmentType];
    if (!equipment || equipment.required) return; // 必带装备不能切换
    
    // 计算当前启用的可选装备数量
    const optionalEquipmentCount = Object.entries(config.equipment).filter(
      ([_, equip]) => equip && !equip.required && equip.enabled
    ).length;
    
    if (equipment.enabled) {
      // 禁用装备
      updateEquipment(equipmentType, { enabled: false });
    } else {
      // 启用装备，检查是否超过限制
      if (optionalEquipmentCount >= 2) {
        // 已达到上限，需要先禁用其他装备
        alert('最多只能选择2个可选装备！请先取消其他装备选择。');
        return;
      }
      updateEquipment(equipmentType, { enabled: true });
    }
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
    setAiEquipmentOptions(null);
    setAttractionOptions(fallbackAttractionOptions);
    setCuisineOptions(fallbackCuisineOptions);
    setTransportationOptions(fallbackTransportationOptions);
    setAtmosphereOptions(fallbackAtmosphereOptions);
    setBudgetOptions([]);
    setTimeOptions([]);
    setConfig({
      character: characterOptions[0],
      equipment: {
        budgetAmulet: { enabled: true, range: [100, 300], required: true },
        timeCompass: { enabled: true, duration: 'full-day', required: true },
        attractionShield: { enabled: true, preferences: [fallbackAttractionOptions[0]], required: false },
        cuisineGem: { enabled: true, types: [fallbackCuisineOptions[0]], required: false },
        transportationKey: { enabled: false, preferences: [], required: false },
        atmosphereRing: { enabled: false, preferences: [], required: false },
      },
    });
    
    // 如果有主题，重新生成AI装备
    if (consensusTheme) {
      generateAIEquipmentOptions();
    }
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
            minWidth: 220, 
            textAlign: 'center',
            border: '3px solid #ff5a5e',
            borderRadius: 4,
            boxShadow: '0 12px 32px rgba(255, 90, 94, 0.4)',
            transform: 'scale(1.05)',
            background: 'linear-gradient(145deg, #ffffff 0%, #fef7f7 100%)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.08)',
              boxShadow: '0 16px 40px rgba(255, 90, 94, 0.5)',
            }
          }}>
            <CardContent sx={{ pb: 3 }}>
              <Box sx={{ 
                position: 'relative',
                display: 'inline-block',
                mb: 2
              }}>
                <Avatar
                  src={config.character.avatar}
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    mx: 'auto',
                    border: '4px solid #ff5a5e',
                    boxShadow: '0 8px 24px rgba(255, 90, 94, 0.4)',
                    transition: 'all 0.3s ease',
                    '& img': {
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%'
                    },
                    '&:hover': {
                      boxShadow: '0 12px 32px rgba(255, 90, 94, 0.6)',
                    }
                  }}
                />
                {/* 角色状态指示器 */}
                <Box sx={{
                  position: 'absolute',
                  bottom: 5,
                  right: 5,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: '#4CAF50',
                  border: '2px solid white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }} />
              </Box>
              
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                color: '#ff5a5e',
                mb: 0.5,
                fontSize: '1.1rem'
              }}>
                {config.character.name}
              </Typography>
              
              <Chip 
                label={
                  config.character.style === 'elegant' ? '✨ 优雅风格' :
                  config.character.style === 'casual' ? '😎 休闲风格' :
                  config.character.style === 'artistic' ? '🎨 文艺风格' :
                  '⚡ 运动风格'
                }
                size="small"
                sx={{ 
                  bgcolor: 'rgba(255, 90, 94, 0.1)',
                  color: '#ff5a5e',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />
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

      {/* 装备背包区域 */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ 
          fontWeight: 600, 
          color: '#333',
          mb: 1
        }}>
          🎒 共识征程装备背包
        </Typography>
        
        {/* AI生成状态指示 */}
        {consensusTheme && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            {isGeneratingEquipment ? (
              <>
                <CircularProgress size={20} sx={{ color: '#ff5a5e' }} />
                <Typography variant="body2" sx={{ color: '#666' }}>
                  AI正在为"{consensusTheme.title}"生成专属装备选项...
                </Typography>
              </>
            ) : aiEquipmentOptions ? (
              <>
                <AutoAwesome sx={{ color: '#ff5a5e', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#666' }}>
                  AI已为"{consensusTheme.title}"生成专属装备选项
                </Typography>
                <Button 
                  size="small" 
                  onClick={generateAIEquipmentOptions}
                  sx={{ color: '#ff5a5e', minWidth: 'auto', p: 0.5 }}
                >
                  重新生成
                </Button>
              </>
            ) : consensusTheme && (
              <>
                <AutoAwesome sx={{ color: '#999', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#666' }}>
                  将为"{consensusTheme.title}"生成专属装备选项
                </Typography>
              </>
            )}
          </Box>
        )}
        
        {/* AI推理说明 */}
        {aiEquipmentOptions?.reasoning && (
          <Typography variant="caption" sx={{ 
            color: '#666', 
            fontStyle: 'italic',
            display: 'block',
            mb: 1
          }}>
            💡 {aiEquipmentOptions.reasoning}
          </Typography>
        )}
      </Box>

      {/* 背包网格 */}
      <Paper elevation={3} sx={{ 
        p: 3, 
        mb: 4, 
        borderRadius: 3,
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        border: '2px solid #dee2e6'
      }}>
        <Typography variant="h6" gutterBottom sx={{ 
          color: '#ff5a5e', 
          fontWeight: 600,
          mb: 2,
          textAlign: 'center'
        }}>
          装备栏
        </Typography>
        
        <Box sx={{ 
           display: 'grid', 
           gridTemplateColumns: 'repeat(4, 1fr)',
           gap: 2,
           maxWidth: 400,
           mx: 'auto',
           justifyItems: 'center'
         }}>
          {/* 预算护符 - 必带装备 */}
          <EquipmentSlot
            image={EQUIPMENT_IMAGES.budgetAmulet}
            name="预算四叶草"
            enabled={config.equipment.budgetAmulet.enabled}
            required={config.equipment.budgetAmulet.required}
            onClick={() => setSelectedEquipment('budgetAmulet')}
            onCustomize={() => setSelectedEquipment('budgetAmulet')}
            color="#FFD700"
          />
          
          {/* 时间指南针 - 必带装备 */}
          <EquipmentSlot
            image={EQUIPMENT_IMAGES.timeCompass}
            name="时间魔法棒"
            enabled={config.equipment.timeCompass.enabled}
            required={config.equipment.timeCompass.required}
            onClick={() => setSelectedEquipment('timeCompass')}
            onCustomize={() => setSelectedEquipment('timeCompass')}
            color="#4CAF50"
          />
          
          {/* 景点护盾 */}
          <EquipmentSlot
            image={EQUIPMENT_IMAGES.attractionShield}
            name="景点之钻"
            enabled={config.equipment.attractionShield.enabled}
            required={config.equipment.attractionShield.required}
            onClick={() => handleEquipmentToggle('attractionShield')}
            onCustomize={() => setSelectedEquipment('attractionShield')}
            color="#2196F3"
          />
          
          {/* 美食宝石 */}
          <EquipmentSlot
            image={EQUIPMENT_IMAGES.cuisineGem}
            name="美食之戒"
            enabled={config.equipment.cuisineGem.enabled}
            required={config.equipment.cuisineGem.required}
            onClick={() => handleEquipmentToggle('cuisineGem')}
            onCustomize={() => setSelectedEquipment('cuisineGem')}
            color="#FF5722"
          />
          
          {/* 交通钥匙 */}
          {config.equipment.transportationKey && (
            <EquipmentSlot
              image={EQUIPMENT_IMAGES.transportationKey}
              name="交通之钥"
              enabled={config.equipment.transportationKey.enabled}
              required={config.equipment.transportationKey.required}
              onClick={() => handleEquipmentToggle('transportationKey')}
              onCustomize={() => setSelectedEquipment('transportationKey')}
              color="#9C27B0"
            />
          )}
          
          {/* 氛围戒指 */}
          {config.equipment.atmosphereRing && (
            <EquipmentSlot
              image={EQUIPMENT_IMAGES.atmosphereRing}
              name="氛围之币"
              enabled={config.equipment.atmosphereRing.enabled}
              required={config.equipment.atmosphereRing.required}
              onClick={() => handleEquipmentToggle('atmosphereRing')}
              onCustomize={() => setSelectedEquipment('atmosphereRing')}
              color="#FF9800"
            />
          )}
          
          {/* 空位 6 */}
          <Box
            sx={{
              width: 70,
              height: 70,
              border: '2px dashed #ccc',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,0.02)',
              color: '#999',
              fontSize: '0.7rem',
              cursor: 'not-allowed'
            }}
          >
            空位
          </Box>
          
          {/* 空位 7 */}
          <Box
            sx={{
              width: 70,
              height: 70,
              border: '2px dashed #ccc',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,0.02)',
              color: '#999',
              fontSize: '0.7rem',
              cursor: 'not-allowed'
            }}
          >
            空位
          </Box>
        </Box>
        
        <Typography variant="body2" sx={{ 
          mt: 2, 
          textAlign: 'center', 
          color: '#666',
          fontStyle: 'italic'
        }}>
          💡 点击装备查看详细设置 | 🔴必带装备 ✅可选装备(最多选2个)
        </Typography>
      </Paper>

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
          
          {config.equipment.transportationKey && config.equipment.transportationKey.enabled && (
            <Box>
              <Box sx={{ textAlign: 'center' }}>
                <DirectionsCar sx={{ color: '#ff5a5e', fontSize: 30, mb: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  交通: {config.equipment.transportationKey.preferences.length}种
                </Typography>
              </Box>
            </Box>
          )}
          
          {config.equipment.atmosphereRing && config.equipment.atmosphereRing.enabled && (
            <Box>
              <Box sx={{ textAlign: 'center' }}>
                <Mood sx={{ color: '#ff5a5e', fontSize: 30, mb: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  氛围: {config.equipment.atmosphereRing.preferences.length}种
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      {/* 装备详情对话框 */}
      <Dialog 
        open={!!selectedEquipment} 
        onClose={() => setSelectedEquipment(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: '#ff5a5e', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          {selectedEquipment === 'budgetAmulet' && <AttachMoney />}
          {selectedEquipment === 'timeCompass' && <Schedule />}
          {selectedEquipment === 'attractionShield' && <LocationOn />}
          {selectedEquipment === 'cuisineGem' && <Restaurant />}
          {selectedEquipment === 'transportationKey' && <DirectionsCar />}
          {selectedEquipment === 'atmosphereRing' && <Mood />}
          {selectedEquipment === 'budgetAmulet' && '预算四叶草'}
          {selectedEquipment === 'timeCompass' && '时间魔法棒'}
          {selectedEquipment === 'attractionShield' && '景点之钻'}
          {selectedEquipment === 'cuisineGem' && '美食之戒'}
          {selectedEquipment === 'transportationKey' && '交通之钥'}
          {selectedEquipment === 'atmosphereRing' && '氛围之币'}
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          {selectedEquipment === 'budgetAmulet' && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">预算四叶草设置</Typography>
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
                    选择你的预算层次
                  </Typography>
                  
                  {aiEquipmentOptions?.budgetOptions ? (
                    <Box sx={{ px: 1, py: 2 }}>
                      {aiEquipmentOptions.budgetOptions.map((option, index) => {
                        const isSelected = 
                          config.equipment.budgetAmulet.range[0] === option.range[0] && 
                          config.equipment.budgetAmulet.range[1] === option.range[1];
                        
                        // 颜色映射：经济型(绿色)、舒适型(蓝色)、豪华型(紫色)
                        const getColorByLevel = (level: string) => {
                          if (level.includes('经济')) return { bg: '#e8f5e8', border: '#4caf50', text: '#2e7d32' };
                          if (level.includes('舒适')) return { bg: '#e3f2fd', border: '#2196f3', text: '#1565c0' };
                          if (level.includes('豪华') || level.includes('高端')) return { bg: '#f3e5f5', border: '#9c27b0', text: '#7b1fa2' };
                          return { bg: '#f5f5f5', border: '#757575', text: '#424242' }; // 默认
                        };
                        
                        const colors = getColorByLevel(option.level);
                        
                        return (
                          <Paper
                            key={index}
                            elevation={isSelected ? 3 : 1}
                            sx={{
                              p: 2,
                              mb: 2,
                              cursor: 'pointer',
                              border: `2px solid ${isSelected ? '#ff5a5e' : colors.border}`,
                              backgroundColor: isSelected ? '#fff5f5' : colors.bg,
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                elevation: 2,
                                transform: 'translateY(-2px)',
                              },
                            }}
                            onClick={() => updateEquipment('budgetAmulet', { range: option.range })}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Chip
                                label={option.level}
                                size="small"
                                sx={{
                                  backgroundColor: colors.border,
                                  color: 'white',
                                  fontWeight: 500,
                                }}
                              />
                              <Typography variant="h6" sx={{ 
                                color: isSelected ? '#ff5a5e' : colors.text, 
                                fontWeight: 600 
                              }}>
                                ¥{option.range[0]} - ¥{option.range[1]}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {option.description}
                            </Typography>
                          </Paper>
                        );
                      })}
                    </Box>
                  ) : (
                    // 回退到简化的手动输入
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
                      <Typography variant="body2" align="center" sx={{ 
                        color: '#ff5a5e', 
                        fontWeight: 500,
                        mt: 1
                      }}>
                        预算范围：¥{config.equipment.budgetAmulet.range[0]} - ¥{config.equipment.budgetAmulet.range[1]}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          )}

          {selectedEquipment === 'timeCompass' && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">时间魔法棒设置</Typography>
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
                    选择你的时间安排
                  </Typography>
                  
                  {aiEquipmentOptions?.timeOptions ? (
                    <Box sx={{ px: 1, py: 2 }}>
                      {aiEquipmentOptions.timeOptions.map((option, index) => {
                        const isSelected = config.equipment.timeCompass.duration === option.duration;
                        
                        // 颜色映射：半日游(浅蓝)、全日游(中蓝)、过夜游(深蓝)
                        const getColorByDuration = (duration: string) => {
                          if (duration.includes('half-day') || duration.includes('半日')) return { bg: '#e3f2fd', border: '#03a9f4', text: '#0277bd' };
                          if (duration.includes('full-day') || duration.includes('全日')) return { bg: '#e1f5fe', border: '#00bcd4', text: '#0097a7' };
                          if (duration.includes('overnight') || duration.includes('过夜') || duration.includes('天')) return { bg: '#e8f4fd', border: '#2196f3', text: '#1565c0' };
                          return { bg: '#f5f5f5', border: '#757575', text: '#424242' }; // 默认
                        };
                        
                        const colors = getColorByDuration(option.duration);
                        
                        return (
                          <Paper
                            key={index}
                            elevation={isSelected ? 3 : 1}
                            sx={{
                              p: 2,
                              mb: 2,
                              cursor: 'pointer',
                              border: `2px solid ${isSelected ? '#ff5a5e' : colors.border}`,
                              backgroundColor: isSelected ? '#fff5f5' : colors.bg,
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                elevation: 2,
                                transform: 'translateY(-2px)',
                              },
                            }}
                            onClick={() => updateEquipment('timeCompass', { duration: option.duration as 'half-day' | 'full-day' | 'overnight' })}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Chip
                                label={option.suitable}
                                size="small"
                                sx={{
                                  backgroundColor: colors.border,
                                  color: 'white',
                                  fontWeight: 500,
                                }}
                              />
                              <Typography variant="h6" sx={{ 
                                color: isSelected ? '#ff5a5e' : colors.text, 
                                fontWeight: 600 
                              }}>
                                {option.duration.replace('half-day', '半日游').replace('full-day', '全日游').replace('overnight', '过夜游')}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {option.description}
                            </Typography>
                          </Paper>
                        );
                      })}
                    </Box>
                  ) : (
                    // 回退到原始选择器
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <InputLabel>时长偏好</InputLabel>
                      <Select
                        value={config.equipment.timeCompass.duration}
                        label="时长偏好"
                        onChange={(e) => 
                          updateEquipment('timeCompass', { duration: e.target.value as 'half-day' | 'full-day' | 'overnight' })
                        }
                      >
                        <MenuItem value="half-day">半日游 (4-6小时)</MenuItem>
                        <MenuItem value="full-day">全日游 (8-10小时)</MenuItem>
                        <MenuItem value="overnight">过夜游 (1-2天)</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </Box>
              )}
            </Box>
          )}

          {selectedEquipment === 'attractionShield' && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">景点之钻设置</Typography>
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
            </Box>
          )}

          {selectedEquipment === 'cuisineGem' && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">美食之戒设置</Typography>
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
            </Box>
          )}

          {selectedEquipment === 'transportationKey' && config.equipment.transportationKey && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">交通之钥设置</Typography>
                <Switch
                  checked={config.equipment.transportationKey.enabled}
                  onChange={(e) => updateEquipment('transportationKey', { enabled: e.target.checked })}
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
              
              {config.equipment.transportationKey.enabled && (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    选择偏好的交通方式
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {transportationOptions.map((transport) => (
                      <Chip
                        key={transport}
                        label={transport}
                        clickable
                        variant={config.equipment.transportationKey.preferences.includes(transport) ? 'filled' : 'outlined'}
                        onClick={() => {
                          const current = config.equipment.transportationKey.preferences;
                          const newPrefs = current.includes(transport)
                            ? current.filter(t => t !== transport)
                            : [...current, transport];
                          updateEquipment('transportationKey', { preferences: newPrefs });
                        }}
                        sx={{
                          backgroundColor: config.equipment.transportationKey.preferences.includes(transport) ? '#9C27B0' : 'transparent',
                          color: config.equipment.transportationKey.preferences.includes(transport) ? 'white' : '#9C27B0',
                          borderColor: '#9C27B0',
                          '&:hover': {
                            backgroundColor: config.equipment.transportationKey.preferences.includes(transport) 
                              ? '#7B1FA2' 
                              : 'rgba(156, 39, 176, 0.04)',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {selectedEquipment === 'atmosphereRing' && config.equipment.atmosphereRing && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">氛围之币设置</Typography>
                <Switch
                  checked={config.equipment.atmosphereRing.enabled}
                  onChange={(e) => updateEquipment('atmosphereRing', { enabled: e.target.checked })}
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
              
              {config.equipment.atmosphereRing.enabled && (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    选择喜欢的活动氛围
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {atmosphereOptions.map((atmosphere) => (
                      <Chip
                        key={atmosphere}
                        label={atmosphere}
                        clickable
                        variant={config.equipment.atmosphereRing.preferences.includes(atmosphere) ? 'filled' : 'outlined'}
                        onClick={() => {
                          const current = config.equipment.atmosphereRing.preferences;
                          const newPrefs = current.includes(atmosphere)
                            ? current.filter(t => t !== atmosphere)
                            : [...current, atmosphere];
                          updateEquipment('atmosphereRing', { preferences: newPrefs });
                        }}
                        sx={{
                          backgroundColor: config.equipment.atmosphereRing.preferences.includes(atmosphere) ? '#FF9800' : 'transparent',
                          color: config.equipment.atmosphereRing.preferences.includes(atmosphere) ? 'white' : '#FF9800',
                          borderColor: '#FF9800',
                          '&:hover': {
                            backgroundColor: config.equipment.atmosphereRing.preferences.includes(atmosphere) 
                              ? '#F57C00' 
                              : 'rgba(255, 152, 0, 0.04)',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setSelectedEquipment(null)}
            variant="contained"
            sx={{
              bgcolor: '#ff5a5e',
              '&:hover': { bgcolor: '#ff4a4e' }
            }}
          >
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CharacterCreator;