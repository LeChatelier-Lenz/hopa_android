// AI驱动的装备选项生成系统
import { kimiApi } from '../utils/kimiApi';

export interface AIEquipmentOptions {
  budget: {
    min: number;
    max: number;
    description: string;
  };
  timePreference: 'half-day' | 'full-day' | 'overnight';
  attractions: string[]; // 具体的地点名称
  cuisines: string[]; // 具体的美食名称
  transportations: string[]; // 交通方式选项
  atmospheres: string[]; // 氛围偏好选项
  reasoning: string; // AI的推理说明
}

export class EquipmentAI {
  /**
   * 根据主题生成共享的装备选项（所有玩家使用相同选项）
   */
  static async generateEquipmentOptions(theme: {
    title: string;
    description: string;
  }): Promise<AIEquipmentOptions> {
    try {
      console.log('🤖 开始AI装备选项生成，主题:', theme); 

      const prompt = `
根据用户的出行主题，生成共享的装备选项配置（所有参与者都可以从这些选项中选择）。

主题：${theme.title}
描述：${theme.description}

请分析这个主题，生成具体的地点名称、美食名称、交通方式和氛围偏好（不要用"当地特色"这样的抽象词汇）。
注意：这些选项将供所有参与者选择，应该涵盖不同偏好和预算层次。

CRITICAL: 必须严格按照以下JSON格式返回，不要包含任何其他文字、说明、markdown标记或代码块：

{"budget":{"min":300,"max":1000,"description":"根据主题推荐的预算说明"},"timePreference":"full-day","attractions":["具体地点1","具体地点2","具体地点3","具体地点4","具体地点5","具体地点6"],"cuisines":["具体美食1","具体美食2","具体美食3","具体美食4","具体美食5","具体美食6"],"transportations":["地铁出行","公交出行","出租车","自驾车","共享单车","步行"],"atmospheres":["轻松休闲","文艺浪漫","热闹欢快","宁静安详","探索冒险","怀旧复古"],"reasoning":"为什么推荐这些选项的简短说明"}

注意：直接返回纯JSON对象，不要用\`\`\`json包装，不要添加任何解释文字。
`;

      const systemPrompt = `你是专业的旅行规划师，擅长为共识决策生成装备选项。
重要说明：你生成的选项将供所有参与者选择，不同参与者可能有不同偏好，所以要包含多样化的选择。

要求：
1. 地点必须是具体的景点、建筑、街区名称，不能是"历史古迹"这样的抽象分类
2. 美食必须是具体的菜品、小吃、餐厅类型名称，不能是"当地特色"这样的抽象分类
3. 交通方式要结合目的地特点和距离，包含多种选择（地铁、公交、出租车、自驾、单车、步行等）
4. 氛围偏好要根据活动性质设计，营造不同的体验感受（轻松、浪漫、热闹、宁静、冒险、怀旧等）
5. 预算要根据目的地消费水平和活动类型合理设定
6. 时间偏好要根据主题内容判断（一日游=full-day，短时间=half-day，过夜=overnight）
7. 每个类别推荐6个选项涵盖不同价位和风格，供不同偏好的参与者选择
8. 生成的选项应该是这个主题下最具代表性和吸引力的选择`;

      const response = await kimiApi.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ], {
        temperature: 0.7,
        max_tokens: 1000
      });

      console.log('🔍 AI装备选项原始响应:', response);

      // 解析AI返回的JSON
      let jsonString = response.trim();
      jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      if (!jsonString.startsWith('{')) {
        const startIndex = jsonString.indexOf('{');
        const endIndex = jsonString.lastIndexOf('}');
        if (startIndex !== -1 && endIndex !== -1) {
          jsonString = jsonString.substring(startIndex, endIndex + 1);
        } else {
          console.error('❌ 无法在AI响应中找到JSON对象:', response);
          throw new Error('未找到JSON对象格式');
        }
      }

      console.log('🔧 准备解析的JSON字符串:', jsonString);

      let equipmentOptions: AIEquipmentOptions;
      try {
        equipmentOptions = JSON.parse(jsonString);
      } catch (parseError: any) {
        console.error('❌ JSON解析失败:', parseError);
        console.error('原始响应:', response);
        console.error('处理后的JSON字符串:', jsonString);
        throw new Error(`JSON解析失败: ${parseError?.message || String(parseError)}`);
      }

      // 验证数据完整性
      if (!equipmentOptions.budget || 
          !equipmentOptions.attractions || 
          !equipmentOptions.cuisines ||
          !equipmentOptions.transportations ||
          !equipmentOptions.atmospheres ||
          !Array.isArray(equipmentOptions.attractions) ||
          !Array.isArray(equipmentOptions.cuisines) ||
          !Array.isArray(equipmentOptions.transportations) ||
          !Array.isArray(equipmentOptions.atmospheres)) {
        throw new Error('AI返回的装备选项格式不完整');
      }

      console.log('✅ AI装备选项生成成功:', {
        budget: `¥${equipmentOptions.budget.min}-${equipmentOptions.budget.max}`,
        time: equipmentOptions.timePreference,
        attractions: equipmentOptions.attractions.length + '个地点',
        cuisines: equipmentOptions.cuisines.length + '个美食',
        transportations: equipmentOptions.transportations.length + '个交通方式',
        atmospheres: equipmentOptions.atmospheres.length + '个氛围选项',
        reasoning: equipmentOptions.reasoning
      });

      return equipmentOptions;

    } catch (error) {
      console.error('❌ AI装备选项生成失败:', error);
      
      // 返回默认的通用选项
      return this.getDefaultEquipmentOptions(theme);
    }
  }

  /**
   * 默认装备选项（当AI生成失败时使用）
   */
  private static getDefaultEquipmentOptions(theme: {
    title: string;
    description: string;
  }): AIEquipmentOptions {
    console.log('🔄 使用默认装备选项');

    const themeText = (theme.title + ' ' + theme.description).toLowerCase();

    // 基于主题的简单分类
    let attractions: string[];
    let cuisines: string[];
    let transportations: string[];
    let atmospheres: string[];
    let budget = { min: 300, max: 1000, description: '中等消费水平的建议预算' };

    if (themeText.includes('上海')) {
      attractions = ['外滩', '豫园', '田子坊', '新天地', '东方明珠', '南京路'];
      cuisines = ['小笼包', '生煎包', '本帮菜', '上海菜', '糖醋排骨', '红烧肉'];
      transportations = ['地铁出行', '出租车', '公交出行', '步行', '共享单车', '网约车'];
      atmospheres = ['都市繁华', '文艺浪漫', '历史怀旧', '轻松休闲', '热闹欢快', '时尚现代'];
    } else if (themeText.includes('北京')) {
      attractions = ['故宫', '天坛', '颐和园', '南锣鼓巷', '什刹海', '王府井'];
      cuisines = ['北京烤鸭', '炸酱面', '豆汁', '涮羊肉', '驴打滚', '艾窝窝'];
      transportations = ['地铁出行', '公交出行', '出租车', '步行', '自驾车', '网约车'];
      atmospheres = ['历史厚重', '皇家典雅', '胡同文化', '传统怀旧', '文化探索', '宁静安详'];
    } else if (themeText.includes('杭州')) {
      attractions = ['西湖', '雷峰塔', '苏堤', '断桥', '灵隐寺', '宋城'];
      cuisines = ['西湖醋鱼', '东坡肉', '龙井虾仁', '叫化鸡', '片儿川', '定胜糕'];
      transportations = ['步行', '公交出行', '出租车', '自驾车', '共享单车', '游船'];
      atmospheres = ['诗意浪漫', '宁静安详', '江南文雅', '自然惬意', '古典优美', '禅意空灵'];
    } else {
      // 通用选项
      attractions = ['历史古迹', '自然风光', '现代建筑', '文化博物馆', '购物中心', '特色街区'];
      cuisines = ['当地特色菜', '中式料理', '西式料理', '日韩料理', '小吃美食', '咖啡甜品'];
      transportations = ['地铁出行', '公交出行', '出租车', '自驾车', '共享单车', '步行'];
      atmospheres = ['轻松休闲', '文艺浪漫', '热闹欢快', '宁静安详', '探索冒险', '怀旧复古'];
    }

    // 根据主题调整预算
    if (themeText.includes('高端') || themeText.includes('奢华')) {
      budget = { min: 1000, max: 3000, description: '高端消费的建议预算' };
    } else if (themeText.includes('经济') || themeText.includes('省钱')) {
      budget = { min: 100, max: 500, description: '经济实惠的建议预算' };
    }

    // 根据主题确定时间偏好
    let timePreference: 'half-day' | 'full-day' | 'overnight' = 'full-day';
    if (themeText.includes('半天') || themeText.includes('短时间')) {
      timePreference = 'half-day';
    } else if (themeText.includes('过夜') || themeText.includes('两天')) {
      timePreference = 'overnight';
    }

    return {
      budget,
      timePreference,
      attractions,
      cuisines,
      transportations,
      atmospheres,
      reasoning: '基于主题关键词的默认推荐，建议重新生成获得更精准的选项'
    };
  }

  /**
   * 测试AI装备生成功能
   */
  static async testGeneration(): Promise<void> {
    const testThemes = [
      { title: '上海一日游', description: '和老婆孩子一起' },
      { title: '北京文化之旅', description: '探索历史古迹' },
      { title: '杭州西湖游', description: '浪漫情侣之旅' }
    ];

    for (const theme of testThemes) {
      console.log(`\n🧪 测试主题: ${theme.title}`);
      try {
        const options = await this.generateEquipmentOptions(theme);
        console.log('生成结果:', options);
      } catch (error) {
        console.error('测试失败:', error);
      }
    }
  }
}

export default EquipmentAI;