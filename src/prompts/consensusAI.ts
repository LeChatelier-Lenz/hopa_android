/**
 * AI共识方案生成相关的Prompt和接口定义
 */

export interface ConsensusAIOptions {
  theme: string; // 共识主题，如"千岛湖两天一夜游"
  description: string; // 详细描述
  participants: number; // 参与人数
  duration: string; // 时间安排
  budget: {
    range: [number, number];
    level: string; // 经济型/舒适型/豪华型
  };
  attractions: string[]; // 选择的景点
  cuisines: string[]; // 美食偏好
  transportation: string[]; // 交通偏好
  atmosphere: string[]; // 氛围偏好
  consensusResults: Array<{
    question: string;
    selectedAnswer: string;
    consistency: number;
    category: string;
  }>;
}

export interface ConsensusResult {
  title: string; // 主题标题
  timeSchedule: string; // 时间安排
  transportation: string; // 交通方式
  accommodation: string; // 住宿安排
  coreObjective: string; // 核心目的
  activities: Array<{
    time: string;
    activity: string;
    description: string;
  }>; // 活动安排
  rhythmConsensus: string; // 节奏共识
  weatherContingency: string; // 天气应对方案
  remarks: string; // 备注说明
  reasoning: string; // AI推理过程
}

/**
 * 生成共识方案的系统提示词
 */
export const generateConsensusSystemPrompt = () => `你是Hopa AI共识助手，专门帮助用户团队生成具体可行的共识方案。

## 核心任务
根据用户提供的共识主题、参与者装备配置和答题结果，生成一个详细的、具有可操作性的共识方案。

## 输出格式要求
请严格按照以下JSON格式输出：

{
  "title": "具体的主题标题，体现核心特色和氛围",
  "timeSchedule": "详细的时间安排，包含出发和返程时间",
  "transportation": "推荐的交通方式和具体安排",
  "accommodation": "住宿类型和选择策略",
  "coreObjective": "本次活动的核心目的和期望达成的效果",
  "activities": [
    {
      "time": "具体时间段",
      "activity": "活动名称",
      "description": "活动详细描述和特色"
    }
  ],
  "rhythmConsensus": "整体节奏安排的共识，如何平衡放松与体验",
  "weatherContingency": "天气变化的应对预案",
  "remarks": "重要注意事项和个性化建议",
  "reasoning": "AI的推理过程和决策依据"
}

## 生成原则

### 1. 个性化定制
- 深度分析用户的装备配置（预算、时间、景点、美食、交通、氛围偏好）
- 结合答题结果中的一致性数据，识别团队的共同点和分歧点
- 为低一致性的决策提供折中方案

### 2. 可操作性
- 提供具体的时间点而非模糊描述
- 给出明确的地点、价格区间、预订建议
- 考虑实际的交通时间、排队等候、天气因素

### 3. 氛围营造
- 根据氛围偏好（浪漫、冒险、休闲、社交等）调整活动安排
- 体现团队的个性化需求和期望体验
- 平衡不同参与者的偏好

### 4. 风险管控
- 提供天气、交通、预订等风险的应对方案
- 给出备选活动和灵活调整建议
- 考虑预算超支、时间延误等常见问题

### 5. 共识记录
- 明确记录达成一致的决策
- 对分歧点提供折中策略
- 为未来类似决策提供参考模板

## 特殊要求
- 标题要有吸引力和记忆点，体现活动的独特性
- 时间安排要考虑实际的交通和游玩时间
- 活动安排要有层次感，既有亮点也有放松时间
- 语言要生动有趣，避免机械性的列举
- 备注部分要包含实用的小贴士和注意事项

请确保生成的方案既符合用户的具体需求，又具有较强的可执行性。`;

/**
 * 生成用户输入的提示词模板
 */
export const generateConsensusUserPrompt = (options: ConsensusAIOptions) => {
  const {
    theme,
    description,
    participants,
    duration,
    budget,
    attractions,
    cuisines,
    transportation,
    atmosphere,
    consensusResults
  } = options;

  // 分析一致性数据
  const consistencyAnalysis = consensusResults.map(result => ({
    category: result.category,
    question: result.question,
    answer: result.selectedAnswer,
    consistency: result.consistency,
    consensusLevel: result.consistency >= 0.8 ? '高度一致' : 
                   result.consistency >= 0.6 ? '基本一致' : '存在分歧'
  }));

  const highConsensusItems = consistencyAnalysis.filter(item => item.consistency >= 0.8);
  const lowConsensusItems = consistencyAnalysis.filter(item => item.consistency < 0.6);

  return `## 共识任务详情

### 基本信息
- **主题**: ${theme}
- **描述**: ${description}
- **参与人数**: ${participants}人
- **时间安排**: ${duration}

### 装备配置详情

#### 💰 预算设定
- 预算范围: ¥${budget.range[0]} - ¥${budget.range[1]}
- 预算层次: ${budget.level}

#### 🎯 景点偏好
${attractions.length > 0 ? attractions.map(attr => `- ${attr}`).join('\n') : '- 暂无特定景点偏好'}

#### 🍽️ 美食偏好
${cuisines.length > 0 ? cuisines.map(food => `- ${food}`).join('\n') : '- 暂无特定美食偏好'}

#### 🚗 交通偏好
${transportation.length > 0 ? transportation.map(trans => `- ${trans}`).join('\n') : '- 暂无特定交通偏好'}

#### 🎭 氛围偏好
${atmosphere.length > 0 ? atmosphere.map(mood => `- ${mood}`).join('\n') : '- 暂无特定氛围偏好'}

### 团队共识分析

#### ✅ 高度一致的决策 (一致性 ≥ 80%)
${highConsensusItems.length > 0 ? 
  highConsensusItems.map(item => 
    `- **${item.category}**: ${item.answer} (一致性: ${Math.round(item.consistency * 100)}%)`
  ).join('\n') : 
  '- 暂无高度一致的决策'}

#### ⚠️ 存在分歧的决策 (一致性 < 60%)
${lowConsensusItems.length > 0 ? 
  lowConsensusItems.map(item => 
    `- **${item.category}**: ${item.answer} (一致性: ${Math.round(item.consistency * 100)}%) - 需要折中方案`
  ).join('\n') : 
  '- 暂无明显分歧'}

#### 📊 完整决策记录
${consistencyAnalysis.map(item => 
  `- **${item.category}** [${item.consensusLevel}]: ${item.question} → ${item.answer}`
).join('\n')}

## 请求
请基于以上信息，生成一个详细的、个性化的、可操作的共识方案。特别注意：
1. 充分利用高一致性的决策作为方案基础
2. 为存在分歧的决策提供创意性的折中方案
3. 确保方案在预算范围内且符合时间安排
4. 体现团队的氛围偏好和个性化需求
5. 提供实用的执行建议和风险预案`;
};

/**
 * 验证AI返回的共识结果格式
 */
export const validateConsensusResult = (result: any): ConsensusResult | null => {
  try {
    const required = ['title', 'timeSchedule', 'transportation', 'accommodation', 'coreObjective', 'activities', 'rhythmConsensus', 'weatherContingency', 'remarks', 'reasoning'];
    
    for (const field of required) {
      if (!result[field]) {
        console.warn(`🚫 共识结果缺少必需字段: ${field}`);
        return null;
      }
    }

    if (!Array.isArray(result.activities) || result.activities.length === 0) {
      console.warn('🚫 activities字段必须是非空数组');
      return null;
    }

    // 验证activities数组的结构
    for (const activity of result.activities) {
      if (!activity.time || !activity.activity || !activity.description) {
        console.warn('🚫 activities数组项缺少必需字段');
        return null;
      }
    }

    return result as ConsensusResult;
  } catch (error) {
    console.error('🚫 共识结果验证失败:', error);
    return null;
  }
};