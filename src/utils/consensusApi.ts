import { 
  ConsensusAIOptions, 
  ConsensusResult, 
  generateConsensusSystemPrompt, 
  generateConsensusUserPrompt, 
  validateConsensusResult 
} from '../prompts/consensusAI';

/**
 * 调用AI生成共识方案
 */
export const generateConsensusResult = async (options: ConsensusAIOptions): Promise<ConsensusResult | null> => {
  try {
    console.log('🚀 开始生成AI共识方案...');
    console.log('📝 输入参数:', options);

    const systemPrompt = generateConsensusSystemPrompt();
    const userPrompt = generateConsensusUserPrompt(options);

    // 检查是否在开发环境
    const isDev = import.meta.env.DEV;
    const baseUrl = isDev ? 'http://localhost:3001' : window.location.origin;

    console.log('🌍 API调用地址:', `${baseUrl}/api/ai/consensus`);

    const response = await fetch(`${baseUrl}/api/ai/consensus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemPrompt,
        userPrompt,
        options // 传递原始选项供后端参考
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🚫 API调用失败:', response.status, errorText);
      throw new Error(`API调用失败: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ AI响应数据:', data);

    // 验证返回的数据格式
    const validatedResult = validateConsensusResult(data);
    if (!validatedResult) {
      console.error('🚫 AI返回的数据格式不正确');
      return null;
    }

    console.log('🎉 共识方案生成成功!');
    return validatedResult;

  } catch (error) {
    console.error('❌ 生成共识方案时发生错误:', error);
    
    // 返回一个示例方案作为回退
    return getFallbackConsensusResult(options);
  }
};

/**
 * 回退方案 - 当AI调用失败时使用
 */
const getFallbackConsensusResult = (options: ConsensusAIOptions): ConsensusResult => {
  console.log('🔄 使用回退方案生成共识结果');
  
  const { theme, budget, duration, attractions, atmosphere } = options;
  
  // 根据时长确定活动安排
  const isOvernight = duration.includes('overnight') || duration.includes('过夜') || duration.includes('天');
  const isFullDay = duration.includes('full-day') || duration.includes('全日');
  
  // 根据氛围偏好调整活动
  const hasAdventure = atmosphere.some(a => a.includes('冒险') || a.includes('刺激'));
  const hasRelaxation = atmosphere.some(a => a.includes('休闲') || a.includes('放松'));
  const hasRomantic = atmosphere.some(a => a.includes('浪漫') || a.includes('温馨'));
  
  const activities = [];
  
  if (isOvernight) {
    // 过夜游安排
    if (hasAdventure) {
      activities.push(
        { time: "第一天上午", activity: "集合出发", description: "准备开始精彩的冒险之旅" },
        { time: "第一天下午", activity: "主要景点探索", description: `游览${attractions[0] || '核心景区'}，体验刺激项目` },
        { time: "第一天晚上", activity: "特色晚餐", description: "品尝当地美食，分享今日趣事" },
        { time: "第二天上午", activity: "日出观赏", description: "早起观赏美丽日出，感受自然魅力" },
        { time: "第二天下午", activity: "休闲活动", description: "轻松活动，为回程做准备" }
      );
    } else if (hasRelaxation) {
      activities.push(
        { time: "第一天上午", activity: "悠闲出发", description: "不急不躁，享受路程风光" },
        { time: "第一天下午", activity: "景点漫游", description: "慢节奏游览，随性拍照" },
        { time: "第一天晚上", activity: "庭院晚餐", description: "在舒适环境中品尝美食" },
        { time: "第二天上午", activity: "自然醒", description: "自然醒来，享受慢生活" },
        { time: "第二天下午", activity: "休闲返程", description: "带着美好回忆返回" }
      );
    } else {
      activities.push(
        { time: "第一天上午", activity: "出发游览", description: "前往目的地，开始愉快旅程" },
        { time: "第一天下午", activity: "主要活动", description: `参与${attractions.length > 0 ? attractions[0] : '特色体验'}` },
        { time: "第一天晚上", activity: "晚餐休息", description: "享用当地特色美食" },
        { time: "第二天上午", activity: "继续游览", description: "体验更多精彩活动" },
        { time: "第二天下午", activity: "整理返程", description: "收拾行囊，准备返回" }
      );
    }
  } else {
    // 一日游安排
    activities.push(
      { time: "上午9:00", activity: "集合出发", description: "准备开始今日行程" },
      { time: "上午10:00", activity: "抵达目的地", description: `前往${attractions[0] || '主要景点'}` },
      { time: "中午12:00", activity: "午餐时间", description: "品尝当地特色美食" },
      { time: "下午14:00", activity: "主要活动", description: "参与核心体验项目" },
      { time: "下午16:00", activity: "自由活动", description: "自由探索，购买纪念品" },
      { time: "下午17:30", activity: "集合返程", description: "结束愉快行程，安全返回" }
    );
  }
  
  return {
    title: `${theme}「${hasRelaxation ? '轻松休闲' : hasAdventure ? '冒险探索' : hasRomantic ? '浪漫温馨' : '精彩体验'}」计划`,
    timeSchedule: isOvernight ? "两天一夜深度体验" : "一日精华游览",
    transportation: "推荐公共交通+当地交通相结合",
    accommodation: isOvernight ? `选择${budget.level === '豪华型' ? '高端度假酒店' : budget.level === '舒适型' ? '精品民宿' : '经济型酒店'}` : "当日往返，无需住宿",
    coreObjective: hasRelaxation ? "放松身心，享受慢时光" : hasAdventure ? "体验刺激，挑战自我" : hasRomantic ? "增进感情，创造美好回忆" : "丰富体验，团队协作",
    activities,
    rhythmConsensus: hasRelaxation ? "以休闲为主，不追求紧凑安排" : hasAdventure ? "适度冒险，平衡刺激与安全" : "张弛有度，既有亮点也有休息",
    weatherContingency: "如遇恶劣天气，转为室内活动或调整行程安排",
    remarks: `预算控制在¥${budget.range[0]}-${budget.range[1]}范围内，建议提前预订以获得更好价格。${attractions.length > 0 ? `重点游览${attractions.join('、')}。` : ''}`,
    reasoning: "基于团队偏好和预算考虑，制定了平衡各方需求的方案。重点考虑了时间安排、预算控制和体验质量的平衡。"
  };
};

/**
 * 格式化共识结果用于显示
 */
export const formatConsensusForDisplay = (result: ConsensusResult): string => {
  return `主题：${result.title}

时间：${result.timeSchedule}

交通：${result.transportation}

住宿：${result.accommodation}

核心目的：${result.coreObjective}

活动安排：
${result.activities.map(activity => `- ${activity.time}：${activity.activity}（${activity.description}）`).join('\n')}

节奏共识：${result.rhythmConsensus}

天气应对：${result.weatherContingency}

备注：${result.remarks}`;
};