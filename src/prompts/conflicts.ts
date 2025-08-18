// 冲突预测和题目生成的Prompt模板

export interface ConflictScenario {
  id: string;
  title: string;
  description: string;
  category: 'budget' | 'time' | 'attraction' | 'cuisine' | 'preference';
  difficulty: 1 | 2 | 3 | 4 | 5; // 1=最容易达成共识，5=最难达成共识
  conflictReasons: string[];
  tags: string[];
}

export interface GeneratedQuestion {
  id: string;
  scenarioId: string;
  text: string;
  options: string[];
  category: 'budget' | 'time' | 'attraction' | 'cuisine' | 'preference';
  difficulty: number;
  conflictPotential: number; // 0-1，预测产生分歧的可能性
  consensusKeywords: string[]; // 关键词，用于后续共识分析
}

export interface ConflictAnalysis {
  conflictType: string;
  severity: number; // 1-5
  commonGround: string[];
  differences: string[];
  recommendations: string[];
}

export interface PlayerEquipmentData {
  playerId: string;
  budgetAmulet: {
    enabled: boolean;
    range: [number, number];
    name: string;
    description: string;
  };
  timeCompass: {
    enabled: boolean;
    duration: string;
    name: string;
    description: string;
  };
  attractionShield: {
    enabled: boolean;
    preferences: string[];
    name: string;
    description: string;
  };
  cuisineGem: {
    enabled: boolean;
    types: string[];
    name: string;
    description: string;
  };
}

export interface EquipmentConflictAnalysis {
  budgetConflicts: {
    detected: boolean;
    severity: number; // 1-5
    description: string;
    playerRanges: Array<{ playerId: string; range: [number, number] }>;
  };
  timeConflicts: {
    detected: boolean;
    severity: number;
    description: string;
    playerPreferences: Array<{ playerId: string; duration: string }>;
  };
  attractionConflicts: {
    detected: boolean;
    severity: number;
    description: string;
    conflictingPreferences: Array<{ playerId: string; preferences: string[] }>;
  };
  cuisineConflicts: {
    detected: boolean;
    severity: number;
    description: string;
    conflictingTypes: Array<{ playerId: string; types: string[] }>;
  };
}

export class ConflictPrompts {
  // 基础冲突分析prompt
  static analyzeConflictPotential(scenario: ConflictScenario, userProfiles?: any[]): string {
    return `
分析以下场景中可能出现的共识冲突，并预测冲突强度：

场景信息：
- 标题：${scenario.title}
- 描述：${scenario.description}
- 分类：${scenario.category}
- 预设难度：${scenario.difficulty}/5
- 已知冲突点：${scenario.conflictReasons.join(', ')}

${userProfiles ? `
参与者信息：
${userProfiles.map((profile, i) => `
用户${i + 1}：
- 偏好：${profile.preferences || '未知'}
- 性格：${profile.personality || '未知'}
- 预算范围：${profile.budgetRange || '未知'}
`).join('')}
` : ''}

请分析并返回JSON格式的冲突预测：
{
  "conflictProbability": 0.8, // 0-1，发生冲突的概率
  "mainConflictTypes": ["预算分歧", "时间安排冲突"],
  "severityScore": 4, // 1-5，冲突严重程度
  "keyDecisionPoints": ["餐厅选择", "预算分配"],
  "recommendedQuestions": [
    {
      "focus": "预算协调",
      "urgency": "high",
      "questionType": "multiple_choice"
    }
  ],
  "consensusStrategy": {
    "approach": "分步决策",
    "priorityOrder": ["预算", "地点", "时间"],
    "compromiseAreas": ["用餐标准", "附加活动"]
  }
}`.trim();
  }

  // 生成冲突导向的问题
  static generateConflictQuestions(analysis: ConflictAnalysis, scenario: ConflictScenario): string {
    return `
基于冲突分析结果，为以下场景生成4-6个渐进式问题，从低冲突到高冲突：

场景：${scenario.title} - ${scenario.description}
冲突类型：${analysis.conflictType}
冲突强度：${analysis.severity}/5

问题生成要求：
1. 从简单的偏好选择开始，逐步深入到核心冲突点
2. 每个问题都有4个选项，选项间存在明显差异
3. 后面的问题基于前面的回答，增加决策复杂度
4. 最后1-2个问题直击核心冲突，测试真正的妥协能力

请生成以下格式的JSON：
{
  "questionSequence": [
    {
      "id": "q1_warmup",
      "text": "你们希望这次${scenario.title}的整体氛围是？",
      "options": [
        "轻松随意，怎样都好",
        "精心计划，按流程进行", 
        "新鲜体验，尝试不同的",
        "舒适熟悉，选择熟悉的地方"
      ],
      "conflictLevel": 1,
      "category": "preference",
      "purpose": "了解基础偏好差异"
    },
    {
      "id": "q2_surface",
      "text": "关于${scenario.category}方面，你们的态度是？",
      "options": ["...", "...", "...", "..."],
      "conflictLevel": 2,
      "category": "${scenario.category}",
      "purpose": "探测表面分歧"
    },
    {
      "id": "q3_deeper",
      "text": "如果在${scenario.category}上出现分歧，你倾向于？",
      "options": ["...", "...", "...", "..."],
      "conflictLevel": 4,
      "category": "${scenario.category}",
      "purpose": "测试妥协意愿"
    },
    {
      "id": "q4_core_conflict",
      "text": "最终决策时刻：[核心冲突问题]",
      "options": ["...", "...", "...", "..."],
      "conflictLevel": 5,
      "category": "${scenario.category}",
      "purpose": "直面核心冲突"
    }
  ],
  "adaptiveLogic": {
    "if_consensus_early": "跳过部分中等难度问题，直接进入核心测试",
    "if_conflict_early": "增加缓冲问题，寻找共同点",
    "if_deadlock": "引入第三方视角或妥协方案"
  }
}`.trim();
  }

  // 实时冲突检测prompt
  static detectRealTimeConflict(question: GeneratedQuestion, answers: { player1: string, player2: string }): string {
    return `
分析以下问答中的冲突程度和类型：

问题：${question.text}
选项：${question.options.join(' | ')}

回答：
- 玩家1选择：${answers.player1}
- 玩家2选择：${answers.player2}

请分析并返回JSON格式结果：
{
  "conflictDetected": true/false,
  "conflictIntensity": 0.7, // 0-1
  "conflictType": "价值观分歧", // 预算分歧、时间冲突、偏好差异、价值观分歧、方式冲突
  "consensusOpportunity": 0.3, // 0-1，达成共识的机会
  "nextStepRecommendation": {
    "action": "explore_middle_ground", // continue_probing, seek_compromise, explore_middle_ground, escalate_conflict, declare_consensus
    "reasoning": "两人选择差异较大，但可能存在折中方案",
    "suggestedApproach": "寻找两个选择的共同点，提供折中选项"
  },
  "conflictInsights": {
    "rootCause": "对舒适度vs体验新鲜感的权衡不同",
    "emotionalTone": "理性分歧", // 理性分歧、情感冲突、习惯差异、价值观冲突
    "resolutionDifficulty": "medium" // easy, medium, hard, very_hard
  },
  "recommendedDamage": 25 // 1-50，建议对怪兽造成的伤害值
}`.trim();
  }

  // 共识达成度分析
  static analyzeConsensusProgress(questionHistory: Array<{question: GeneratedQuestion, answers: any, conflict: any}>): string {
    const historyText = questionHistory.map((item, index) => `
第${index + 1}题：${item.question.text}
- 玩家1：${item.answers.player1}
- 玩家2：${item.answers.player2}
- 冲突强度：${item.conflict.conflictIntensity || 'N/A'}
- 冲突类型：${item.conflict.conflictType || 'N/A'}
    `).join('\n');

    return `
分析整个游戏过程中的共识达成模式：

问题历史：
${historyText}

请分析并返回：
{
  "overallConsensusScore": 0.75, // 0-1，整体共识度
  "consensusPattern": "先分歧后统一", // 持续冲突、先分歧后统一、基本一致、波动型
  "strongestAgreementAreas": ["时间安排", "基本预算"],
  "persistentConflictAreas": ["具体地点选择", "活动方式"],
  "personalityInsights": {
    "player1Profile": "偏好稳定，注重实用性",
    "player2Profile": "喜欢探索，追求新体验",
    "compatibilityScore": 0.6
  },
  "finalRecommendations": [
    "建议在地点选择上各退一步",
    "可以安排分阶段的活动满足双方需求",
    "建立预算范围，在范围内选择有特色的地方"
  ],
  "monsterDefeatJustification": {
    "defeated": true,
    "reason": "通过持续沟通和妥协，成功化解主要分歧",
    "consensusCard": {
      "title": "沟通达人",
      "description": "虽然初期有分歧，但通过理性讨论找到了平衡点",
      "achievement": "化解3次以上冲突并达成最终共识"
    }
  }
}`.trim();
  }

  // 预设的冲突场景模板
  static readonly CONFLICT_SCENARIOS: Record<string, ConflictScenario> = {
    // 预算相关冲突
    budget_restaurant: {
      id: 'budget_restaurant',
      title: '餐厅用餐预算',
      description: '选择餐厅时在预算上的分歧',
      category: 'budget',
      difficulty: 3,
      conflictReasons: ['经济条件不同', '对性价比的理解不同', '消费习惯差异'],
      tags: ['日常', '实用', '价值观']
    },

    budget_travel: {
      id: 'budget_travel',
      title: '旅行花费分配',
      description: '旅行中住宿、交通、购物的预算分配',
      category: 'budget',
      difficulty: 4,
      conflictReasons: ['风险承受能力不同', '对舒适度要求不同', '储蓄观念差异'],
      tags: ['旅行', '长期', '重要决策']
    },

    // 时间安排冲突
    time_schedule: {
      id: 'time_schedule',
      title: '行程时间安排',
      description: '活动的时间规划和节奏安排',
      category: 'time',
      difficulty: 2,
      conflictReasons: ['作息习惯不同', '效率观念差异', '休闲vs充实的平衡'],
      tags: ['日程', '习惯', '效率']
    },

    time_duration: {
      id: 'time_duration',
      title: '活动时长控制',
      description: '每个活动花费的时间长短',
      category: 'time',
      difficulty: 3,
      conflictReasons: ['专注力不同', '兴趣点差异', '耐心程度不同'],
      tags: ['专注', '兴趣', '耐心']
    },

    // 景点选择冲突
    attraction_type: {
      id: 'attraction_type',
      title: '景点类型偏好',
      description: '选择自然风光还是人文景观',
      category: 'attraction',
      difficulty: 3,
      conflictReasons: ['审美偏好不同', '知识背景差异', '体验方式偏好'],
      tags: ['审美', '文化', '体验']
    },

    attraction_crowds: {
      id: 'attraction_crowds',
      title: '人群密度接受度',
      description: '对热门景点人多的接受程度',
      category: 'attraction',
      difficulty: 2,
      conflictReasons: ['社交舒适圈不同', '拍照需求不同', '安静vs热闹偏好'],
      tags: ['社交', '环境', '拍照']
    },

    // 美食偏好冲突
    cuisine_style: {
      id: 'cuisine_style',
      title: '菜系口味选择',
      description: '中餐、西餐、日料等不同菜系的选择',
      category: 'cuisine',
      difficulty: 3,
      conflictReasons: ['口味习惯不同', '文化背景差异', '营养观念不同'],
      tags: ['口味', '文化', '营养']
    },

    cuisine_spice: {
      id: 'cuisine_spice',
      title: '辣度承受能力',
      description: '对食物辣度的不同承受能力',
      category: 'cuisine',
      difficulty: 2,
      conflictReasons: ['生理差异', '地域饮食习惯', '对刺激的偏好不同'],
      tags: ['生理', '地域', '刺激']
    },

    // 方式偏好冲突
    preference_planning: {
      id: 'preference_planning',
      title: '计划详细程度',
      description: '详细规划 vs 随性而为',
      category: 'preference',
      difficulty: 4,
      conflictReasons: ['控制欲不同', '不确定性容忍度', '责任感差异'],
      tags: ['控制', '不确定性', '责任']
    },

    preference_social: {
      id: 'preference_social',
      title: '社交活跃程度',
      description: '主动社交 vs 安静独处',
      category: 'preference',
      difficulty: 3,
      conflictReasons: ['性格内外向', '社交能量消耗', '隐私需求不同'],
      tags: ['性格', '社交', '隐私']
    }
  };

  // 根据场景类型获取相关冲突模板
  static getRelevantScenarios(type: 'friends' | 'family' | 'couples' | 'team' | 'general'): ConflictScenario[] {
    const allScenarios = Object.values(this.CONFLICT_SCENARIOS);
    
    // 根据不同类型过滤和排序场景
    switch (type) {
      case 'friends':
        return allScenarios.filter(s => 
          s.tags.includes('日常') || s.tags.includes('社交') || s.category === 'budget'
        ).sort((a, b) => a.difficulty - b.difficulty);
      
      case 'family':
        return allScenarios.filter(s => 
          s.tags.includes('安全') || s.tags.includes('传统') || s.difficulty <= 3
        ).sort((a, b) => a.difficulty - b.difficulty);
      
      case 'couples':
        return allScenarios.filter(s => 
          s.tags.includes('情感') || s.tags.includes('价值观') || s.category === 'preference'
        ).sort((a, b) => a.difficulty - b.difficulty);
      
      case 'team':
        return allScenarios.filter(s => 
          s.tags.includes('效率') || s.tags.includes('责任') || s.category === 'time'
        ).sort((a, b) => a.difficulty - b.difficulty);
      
      default:
        return allScenarios.sort((a, b) => a.difficulty - b.difficulty);
    }
  }

  // 智能选择下一个冲突场景
  static selectNextScenario(
    previousScenarios: ConflictScenario[], 
    conflictHistory: any[], 
    targetDifficulty?: number
  ): ConflictScenario {
    const usedIds = previousScenarios.map(s => s.id);
    const availableScenarios = Object.values(this.CONFLICT_SCENARIOS)
      .filter(s => !usedIds.includes(s.id));
    
    if (availableScenarios.length === 0) {
      // 如果所有场景都用过了，重新使用，但调整难度
      return this.CONFLICT_SCENARIOS.preference_planning;
    }
    
    // 根据历史表现调整难度
    const avgConflictLevel = conflictHistory.length > 0 
      ? conflictHistory.reduce((sum, h) => sum + (h.conflictIntensity || 0), 0) / conflictHistory.length
      : 0.5;
    
    let targetDiff = targetDifficulty;
    if (!targetDiff) {
      if (avgConflictLevel < 0.3) {
        targetDiff = Math.min(5, (previousScenarios[previousScenarios.length - 1]?.difficulty || 1) + 1);
      } else if (avgConflictLevel > 0.7) {
        targetDiff = Math.max(1, (previousScenarios[previousScenarios.length - 1]?.difficulty || 3) - 1);
      } else {
        targetDiff = previousScenarios[previousScenarios.length - 1]?.difficulty || 2;
      }
    }
    
    // 找到最接近目标难度的场景
    const closestScenario = availableScenarios.reduce((closest, scenario) => {
      const currentDiff = Math.abs(scenario.difficulty - targetDiff);
      const closestDiff = Math.abs(closest.difficulty - targetDiff);
      return currentDiff < closestDiff ? scenario : closest;
    });
    
    return closestScenario;
  }

  // 装备冲突检测核心算法
  static analyzeEquipmentConflicts(playersEquipment: PlayerEquipmentData[]): EquipmentConflictAnalysis {
    const analysis: EquipmentConflictAnalysis = {
      budgetConflicts: { detected: false, severity: 1, description: '', playerRanges: [] },
      timeConflicts: { detected: false, severity: 1, description: '', playerPreferences: [] },
      attractionConflicts: { detected: false, severity: 1, description: '', conflictingPreferences: [] },
      cuisineConflicts: { detected: false, severity: 1, description: '', conflictingTypes: [] }
    };

    // 1. 预算冲突分析
    const budgetRanges = playersEquipment
      .filter(p => p.budgetAmulet.enabled)
      .map(p => ({ playerId: p.playerId, range: p.budgetAmulet.range }));
    
    if (budgetRanges.length >= 2) {
      const minBudgets = budgetRanges.map(r => r.range[0]);
      const maxBudgets = budgetRanges.map(r => r.range[1]);
      const overallMin = Math.max(...minBudgets);
      const overallMax = Math.min(...maxBudgets);
      
      if (overallMin > overallMax) {
        analysis.budgetConflicts.detected = true;
        analysis.budgetConflicts.severity = 4;
        analysis.budgetConflicts.description = `预算范围无交集：最低需求¥${overallMin}，最高限制¥${overallMax}`;
        analysis.budgetConflicts.playerRanges = budgetRanges;
      } else {
        const budgetSpread = Math.max(...maxBudgets) - Math.min(...minBudgets);
        if (budgetSpread > 1000) {
          analysis.budgetConflicts.detected = true;
          analysis.budgetConflicts.severity = Math.min(5, Math.floor(budgetSpread / 500));
          analysis.budgetConflicts.description = `预算差异较大：¥${budgetSpread}的差距可能导致选择分歧`;
          analysis.budgetConflicts.playerRanges = budgetRanges;
        }
      }
    }

    // 2. 时间冲突分析
    const timePreferences = playersEquipment
      .filter(p => p.timeCompass.enabled)
      .map(p => ({ playerId: p.playerId, duration: p.timeCompass.duration }));
    
    if (timePreferences.length >= 2) {
      const uniqueDurations = [...new Set(timePreferences.map(t => t.duration))];
      if (uniqueDurations.length > 1) {
        analysis.timeConflicts.detected = true;
        analysis.timeConflicts.severity = uniqueDurations.includes('full-day') && uniqueDurations.includes('half-day') ? 3 : 2;
        analysis.timeConflicts.description = `时间安排偏好不同：${uniqueDurations.join(' vs ')}`;
        analysis.timeConflicts.playerPreferences = timePreferences;
      }
    }

    // 3. 景点偏好冲突分析
    const attractionPrefs = playersEquipment
      .filter(p => p.attractionShield.enabled)
      .map(p => ({ playerId: p.playerId, preferences: p.attractionShield.preferences }));
    
    if (attractionPrefs.length >= 2) {
      const commonPrefs = attractionPrefs[0].preferences.filter(pref => 
        attractionPrefs.every(a => a.preferences.includes(pref))
      );
      
      if (commonPrefs.length === 0) {
        analysis.attractionConflicts.detected = true;
        analysis.attractionConflicts.severity = 3;
        analysis.attractionConflicts.description = '景点偏好完全不同，需要协调和妥协';
        analysis.attractionConflicts.conflictingPreferences = attractionPrefs;
      } else if (commonPrefs.length < 2) {
        analysis.attractionConflicts.detected = true;
        analysis.attractionConflicts.severity = 2;
        analysis.attractionConflicts.description = `景点偏好交集较小，共同兴趣：${commonPrefs.join(', ')}`;
        analysis.attractionConflicts.conflictingPreferences = attractionPrefs;
      }
    }

    // 4. 美食偏好冲突分析
    const cuisinePrefs = playersEquipment
      .filter(p => p.cuisineGem.enabled)
      .map(p => ({ playerId: p.playerId, types: p.cuisineGem.types }));
    
    if (cuisinePrefs.length >= 2) {
      const commonTypes = cuisinePrefs[0].types.filter(type => 
        cuisinePrefs.every(c => c.types.includes(type))
      );
      
      if (commonTypes.length === 0) {
        analysis.cuisineConflicts.detected = true;
        analysis.cuisineConflicts.severity = 2;
        analysis.cuisineConflicts.description = '美食偏好差异明显，需要寻找折中方案';
        analysis.cuisineConflicts.conflictingTypes = cuisinePrefs;
      }
    }

    return analysis;
  }

  // 简化的装备感知问题生成prompt
  static generateEquipmentAwareConflictQuestions(
    scenario: ConflictScenario,
    playersEquipment: PlayerEquipmentData[]
  ): string {
    const equipmentSummary = playersEquipment.map(player => `
玩家${player.playerId}：
- 预算：¥${player.budgetAmulet.range[0]}-${player.budgetAmulet.range[1]}
- 时间：${player.timeCompass.duration}
- 景点偏好：${player.attractionShield.preferences.join(', ')}
- 美食偏好：${player.cuisineGem.types.join(', ')}
    `).join('\n');

    return `
场景：${scenario.title} - ${scenario.description}

玩家装备配置：
${equipmentSummary}

请根据玩家的装备配置差异，生成5个选择题来帮助他们协调冲突、达成共识。

IMPORTANT: 必须严格按照以下JSON格式返回，不要包含任何其他文字、解释或markdown标记：

[{"id":"conflict_1","type":"choice","question":"具体的协调问题","options":["选项A","选项B","选项C","选项D"],"correctAnswer":0,"explanation":"简短解释","category":"budget"},{"id":"conflict_2","type":"choice","question":"另一个协调问题","options":["选项A","选项B","选项C","选项D"],"correctAnswer":1,"explanation":"简短解释","category":"time"},{"id":"conflict_3","type":"choice","question":"第三个协调问题","options":["选项A","选项B","选项C","选项D"],"correctAnswer":2,"explanation":"简短解释","category":"attraction"},{"id":"conflict_4","type":"choice","question":"第四个协调问题","options":["选项A","选项B","选项C","选项D"],"correctAnswer":1,"explanation":"简短解释","category":"cuisine"},{"id":"conflict_5","type":"choice","question":"第五个协调问题","options":["选项A","选项B","选项C","选项D"],"correctAnswer":3,"explanation":"简短解释","category":"general"}]
`.trim();
  }

  // 简化的综合分析方法：直接使用装备数据生成问题
  static generateComprehensiveConflictAnalysis(
    scenario: ConflictScenario,
    playersEquipment: PlayerEquipmentData[]
  ): string {
    return this.generateEquipmentAwareConflictQuestions(scenario, playersEquipment);
  }
}

export default ConflictPrompts;