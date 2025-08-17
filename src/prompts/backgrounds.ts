// 游戏背景图生成的Prompt模板

export interface BackgroundPromptParams {
  title: string;
  description: string;
  theme?: string;
  scenarioType?: 'friends' | 'family' | 'couples' | 'team' | 'solo' | 'general';
  mood?: 'romantic' | 'adventure' | 'peaceful' | 'exciting' | 'cozy' | 'energetic' | 'relaxed';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  location?: 'indoor' | 'outdoor' | 'urban' | 'nature' | 'travel';
}

export class BackgroundPrompts {
  // 基础背景模板
  static generateBackground(params: BackgroundPromptParams): string {
    const scenarioTypeMap = {
      friends: '朋友聚会共识游戏',
      family: '家庭活动共识游戏',
      couples: '情侣约会共识游戏',
      team: '团队协作共识游戏',
      solo: '个人规划共识工具',
      general: '通用共识达成游戏'
    };

    const moodMap = {
      romantic: '温馨浪漫，粉色和金色色调',
      adventure: '充满活力，明亮饱和的色彩',
      peaceful: '宁静祥和，蓝色和绿色色调',
      exciting: '充满活力，动感的色彩搭配',
      cozy: '温暖舒适，暖色调为主',
      energetic: '活力四射，鲜艳明快的色彩',
      relaxed: '轻松惬意，柔和自然的色调'
    };

    const timeMap = {
      morning: '清晨的柔和阳光，温暖的光线',
      afternoon: '午后的明媚阳光，充足的光照',
      evening: '黄昏的金色余晖，温馨的氛围',
      night: '夜晚的温柔灯光，星空点点'
    };

    const locationMap = {
      indoor: '室内场景，舒适的环境氛围',
      outdoor: '户外场景，自然景观',
      urban: '都市场景，现代建筑背景',
      nature: '自然场景，山川湖泊或森林',
      travel: '旅行场景，异地风光'
    };

    const scenarioType = params.scenarioType ? scenarioTypeMap[params.scenarioType] : '通用共识达成游戏';
    const mood = params.mood ? moodMap[params.mood] : '温馨友好，色彩柔和';
    const time = params.timeOfDay ? timeMap[params.timeOfDay] : '自然光照';
    const location = params.location ? locationMap[params.location] : '适合活动的场景';

    return `
创建一个完整的游戏背景画面，垂直构图(9:16比例)，纯风景图。

主题: ${params.title}
场景: ${params.description}
${params.theme ? `风格: ${params.theme}` : ''}

视觉风格:
- ${mood}
- ${time}
- ${location}
- 纯自然风景或室内场景背景
- 完整填满整个画布，无空白边界
- 无任何电子设备痕迹

严格禁止包含:
- 手机外框、手机边框、设备边框
- 任何UI界面元素、按钮、图标
- 应用程序界面、屏幕界面
- 电子设备、手机、平板、电脑
- 文字、字母、数字、标志
- 人物角色、卡通形象
- 游戏界面元素

画面要求:
- 尺寸: 1080x1920像素 (竖屏比例)
- 风格: 现代插画风格或清新水彩画风格  
- 分辨率: 高清画质
- 色彩: 色彩和谐，不过于饱和
- 构图: 层次丰富的完整背景画面
- 内容: 仅包含风景、建筑、自然元素等环境背景

关键要求: 这是游戏背景图，必须是完整的风景画面，绝对不能包含任何手机框架、设备边框或UI元素！
`.trim();
  }

  // 预设场景模板
  static readonly PRESET_SCENARIOS = {
    // 朋友聚会
    friends_movie: {
      title: '朋友看电影',
      description: '和好朋友一起看电影，分享欢乐时光',
      scenarioType: 'friends' as const,
      mood: 'cozy' as const,
      timeOfDay: 'evening' as const,
      location: 'urban' as const,
    },
    
    friends_travel: {
      title: '朋友旅行',
      description: '和朋友一起旅行，探索新的地方',
      scenarioType: 'friends' as const,
      mood: 'adventure' as const,
      timeOfDay: 'afternoon' as const,
      location: 'travel' as const,
    },

    friends_party: {
      title: '朋友聚会',
      description: '朋友聚会庆祝，享受热闹时光',
      scenarioType: 'friends' as const,
      mood: 'energetic' as const,
      timeOfDay: 'evening' as const,
      location: 'indoor' as const,
    },

    // 家庭活动
    family_vacation: {
      title: '家庭度假',
      description: '全家一起度假，创造美好回忆',
      scenarioType: 'family' as const,
      mood: 'peaceful' as const,
      timeOfDay: 'afternoon' as const,
      location: 'travel' as const,
    },

    family_dinner: {
      title: '家庭聚餐',
      description: '家人聚在一起享用晚餐',
      scenarioType: 'family' as const,
      mood: 'cozy' as const,
      timeOfDay: 'evening' as const,
      location: 'indoor' as const,
    },

    // 情侣约会
    couples_date: {
      title: '情侣约会',
      description: '浪漫的二人世界约会时光',
      scenarioType: 'couples' as const,
      mood: 'romantic' as const,
      timeOfDay: 'evening' as const,
      location: 'urban' as const,
    },

    // 团队协作
    team_building: {
      title: '团队建设',
      description: '团队成员一起参加建设活动',
      scenarioType: 'team' as const,
      mood: 'energetic' as const,
      timeOfDay: 'afternoon' as const,
      location: 'outdoor' as const,
    },

    // 通用场景
    cafe_meeting: {
      title: '咖啡厅聚会',
      description: '在温馨的咖啡厅里聊天交流',
      scenarioType: 'general' as const,
      mood: 'relaxed' as const,
      timeOfDay: 'afternoon' as const,
      location: 'indoor' as const,
    },

    outdoor_activity: {
      title: '户外活动',
      description: '在大自然中进行户外活动',
      scenarioType: 'general' as const,
      mood: 'adventure' as const,
      timeOfDay: 'morning' as const,
      location: 'nature' as const,
    },

    city_exploration: {
      title: '城市探索',
      description: '在城市中发现新的有趣地方',
      scenarioType: 'general' as const,
      mood: 'exciting' as const,
      timeOfDay: 'afternoon' as const,
      location: 'urban' as const,
    }
  };

  // 根据用户输入智能匹配场景
  static smartMatch(userInput: { title: string; description: string }): BackgroundPromptParams {
    const input = (userInput.title + ' ' + userInput.description).toLowerCase();
    
    // 朋友关键词
    if (input.includes('朋友') || input.includes('兄弟') || input.includes('哥们') || 
        input.includes('同学') || input.includes('buddies') || input.includes('friends')) {
      
      if (input.includes('电影') || input.includes('看电影')) {
        return this.PRESET_SCENARIOS.friends_movie;
      }
      if (input.includes('旅行') || input.includes('旅游') || input.includes('玩') || input.includes('出去')) {
        return this.PRESET_SCENARIOS.friends_travel;
      }
      if (input.includes('聚会') || input.includes('party') || input.includes('庆祝')) {
        return this.PRESET_SCENARIOS.friends_party;
      }
      // 默认朋友场景
      return {
        title: userInput.title,
        description: userInput.description,
        scenarioType: 'friends',
        mood: 'energetic',
        timeOfDay: 'afternoon',
        location: 'outdoor'
      };
    }
    
    // 家庭关键词
    if (input.includes('家庭') || input.includes('家人') || input.includes('父母') || 
        input.includes('孩子') || input.includes('family') || input.includes('亲人')) {
      
      if (input.includes('度假') || input.includes('旅行') || input.includes('vacation')) {
        return this.PRESET_SCENARIOS.family_vacation;
      }
      if (input.includes('吃饭') || input.includes('聚餐') || input.includes('dinner')) {
        return this.PRESET_SCENARIOS.family_dinner;
      }
      // 默认家庭场景
      return {
        title: userInput.title,
        description: userInput.description,
        scenarioType: 'family',
        mood: 'cozy',
        timeOfDay: 'afternoon',
        location: 'indoor'
      };
    }
    
    // 情侣关键词
    if (input.includes('情侣') || input.includes('男朋友') || input.includes('女朋友') || 
        input.includes('约会') || input.includes('恋人') || input.includes('couples')) {
      return this.PRESET_SCENARIOS.couples_date;
    }
    
    // 团队关键词
    if (input.includes('团队') || input.includes('同事') || input.includes('工作') || 
        input.includes('team') || input.includes('公司') || input.includes('集体')) {
      return this.PRESET_SCENARIOS.team_building;
    }
    
    // 通用活动匹配
    if (input.includes('咖啡') || input.includes('茶') || input.includes('喝') || input.includes('聊天')) {
      return this.PRESET_SCENARIOS.cafe_meeting;
    }
    
    if (input.includes('户外') || input.includes('运动') || input.includes('outdoor') || input.includes('活动')) {
      return this.PRESET_SCENARIOS.outdoor_activity;
    }
    
    if (input.includes('城市') || input.includes('逛街') || input.includes('购物') || input.includes('city')) {
      return this.PRESET_SCENARIOS.city_exploration;
    }
    
    // 默认返回通用参数
    return {
      title: userInput.title,
      description: userInput.description,
      scenarioType: 'general',
      mood: 'relaxed',
      timeOfDay: 'afternoon',
      location: 'outdoor'
    };
  }
}

export default BackgroundPrompts;