// AI题目生成服务
import ConflictPrompts, { ConflictScenario, GeneratedQuestion, ConflictAnalysis } from '../prompts/conflicts';
import { kimiApi } from './kimiApi';

export interface QuestionGenerationRequest {
  consensusGoal: string;
  description: string;
  participants: number;
  scenario: {
    type: 'friends' | 'family' | 'couples' | 'team' | 'general';
    category?: 'budget' | 'time' | 'attraction' | 'cuisine' | 'preference';
    difficulty?: number;
  };
  previousQuestions?: GeneratedQuestion[];
  conflictHistory?: Array<{
    question: GeneratedQuestion;
    answers: any;
    conflict: any;
  }>;
}

export interface QuestionGenerationResponse {
  scenario: ConflictScenario;
  questions: GeneratedQuestion[];
  adaptiveStrategy: {
    nextDifficultyLevel: number;
    recommendedApproach: string;
    conflictPrediction: {
      probability: number;
      mainTypes: string[];
      severity: number;
    };
  };
}

export interface RealTimeConflictAnalysis {
  conflictDetected: boolean;
  conflictIntensity: number; // 0-1
  conflictType: string;
  consensusOpportunity: number; // 0-1
  nextStepRecommendation: {
    action: 'continue_probing' | 'seek_compromise' | 'explore_middle_ground' | 'escalate_conflict' | 'declare_consensus';
    reasoning: string;
    suggestedApproach: string;
  };
  conflictInsights: {
    rootCause: string;
    emotionalTone: 'rational' | 'emotional' | 'habitual' | 'value_based';
    resolutionDifficulty: 'easy' | 'medium' | 'hard' | 'very_hard';
  };
  recommendedDamage: number; // 1-50
}

export class QuestionGeneratorService {
  private static instance: QuestionGeneratorService;
  private currentScenario: ConflictScenario | null = null;
  private questionHistory: Array<{question: GeneratedQuestion, answers: any, conflict: any}> = [];

  public static getInstance(): QuestionGeneratorService {
    if (!QuestionGeneratorService.instance) {
      QuestionGeneratorService.instance = new QuestionGeneratorService();
    }
    return QuestionGeneratorService.instance;
  }

  // 生成问题序列
  async generateQuestions(request: QuestionGenerationRequest): Promise<QuestionGenerationResponse> {
    try {
      // 1. 选择合适的冲突场景
      const scenario = this.selectOptimalScenario(request);
      this.currentScenario = scenario;

      // 2. 分析冲突潜力
      const conflictAnalysisPrompt = ConflictPrompts.analyzeConflictPotential(scenario);
      const conflictAnalysis = await this.callAIForAnalysis(conflictAnalysisPrompt);

      // 3. 生成问题序列
      const questionGenerationPrompt = ConflictPrompts.generateConflictQuestions(
        conflictAnalysis, 
        scenario
      );
      const generatedQuestions = await this.callAIForQuestions(questionGenerationPrompt);

      // 4. 构建响应
      const response: QuestionGenerationResponse = {
        scenario,
        questions: generatedQuestions,
        adaptiveStrategy: {
          nextDifficultyLevel: this.calculateNextDifficulty(request, conflictAnalysis),
          recommendedApproach: conflictAnalysis.conflictType,
          conflictPrediction: {
            probability: conflictAnalysis.severity / 5,
            mainTypes: [conflictAnalysis.conflictType],
            severity: conflictAnalysis.severity
          }
        }
      };

      return response;
    } catch (error) {
      console.error('Question generation failed:', error);
      
      // 返回后备问题
      return this.generateFallbackQuestions(request);
    }
  }

  // 实时冲突分析
  async analyzeRealTimeConflict(
    question: GeneratedQuestion, 
    answers: { player1: string, player2: string }
  ): Promise<RealTimeConflictAnalysis> {
    try {
      const conflictPrompt = ConflictPrompts.detectRealTimeConflict(question, answers);
      const analysisResultText = await kimiApi.chat([{ role: 'user', content: conflictPrompt }]);
      let analysisResult;
      try {
        analysisResult = JSON.parse(analysisResultText);
      } catch (parseError) {
        console.warn('Failed to parse conflict analysis response:', parseError);
        analysisResult = {};
      }
      
      // 记录到历史
      this.questionHistory.push({
        question,
        answers,
        conflict: analysisResult
      });

      return this.parseConflictAnalysis(analysisResult);
    } catch (error) {
      console.error('Real-time conflict analysis failed:', error);
      
      // 返回默认分析
      return this.generateDefaultConflictAnalysis(question, answers);
    }
  }

  // 分析整体共识进度
  async analyzeOverallConsensus(): Promise<{
    consensusScore: number;
    finalRecommendations: string[];
    monsterDefeated: boolean;
    consensusCard?: {
      title: string;
      description: string;
      achievement: string;
    };
  }> {
    try {
      const consensusPrompt = ConflictPrompts.analyzeConsensusProgress(this.questionHistory);
      const resultText = await kimiApi.chat([{ role: 'user', content: consensusPrompt }]);
      let result;
      try {
        result = JSON.parse(resultText);
      } catch (parseError) {
        console.warn('Failed to parse consensus analysis response:', parseError);
        result = {};
      }
      
      return {
        consensusScore: result.overallConsensusScore || 0.5,
        finalRecommendations: result.finalRecommendations || [],
        monsterDefeated: result.monsterDefeatJustification?.defeated || false,
        consensusCard: result.monsterDefeatJustification?.consensusCard
      };
    } catch (error) {
      console.error('Consensus analysis failed:', error);
      
      // 根据历史记录计算基础共识分数
      const avgConflict = this.questionHistory.length > 0 
        ? this.questionHistory.reduce((sum, h) => sum + (h.conflict.conflictIntensity || 0.5), 0) / this.questionHistory.length
        : 0.5;
      
      return {
        consensusScore: Math.max(0, 1 - avgConflict),
        finalRecommendations: ['通过更多沟通寻找共同点', '保持开放态度，尊重不同观点'],
        monsterDefeated: avgConflict < 0.4,
        consensusCard: avgConflict < 0.4 ? {
          title: '沟通能手',
          description: '成功化解分歧，达成基本共识',
          achievement: '完成所有问题并保持低冲突水平'
        } : undefined
      };
    }
  }

  // 重置服务状态
  reset(): void {
    this.currentScenario = null;
    this.questionHistory = [];
  }

  // 私有方法：选择最优场景
  private selectOptimalScenario(request: QuestionGenerationRequest): ConflictScenario {
    const availableScenarios = ConflictPrompts.getRelevantScenarios(request.scenario.type);
    
    // 根据指定分类过滤
    let filteredScenarios = availableScenarios;
    if (request.scenario.category) {
      filteredScenarios = availableScenarios.filter(s => s.category === request.scenario.category);
    }
    
    // 根据难度选择
    if (request.scenario.difficulty) {
      const targetDifficulty = request.scenario.difficulty;
      const closestScenario = filteredScenarios.reduce((closest, scenario) => {
        const currentDiff = Math.abs(scenario.difficulty - targetDifficulty);
        const closestDiff = Math.abs(closest.difficulty - targetDifficulty);
        return currentDiff < closestDiff ? scenario : closest;
      });
      return closestScenario;
    }
    
    // 使用智能选择
    const previousScenarios = request.previousQuestions?.map(q => 
      ConflictPrompts.CONFLICT_SCENARIOS[q.scenarioId]
    ).filter(Boolean) || [];
    
    return ConflictPrompts.selectNextScenario(
      previousScenarios, 
      request.conflictHistory || []
    );
  }

  // 私有方法：计算下一轮难度
  private calculateNextDifficulty(
    request: QuestionGenerationRequest, 
    analysis: ConflictAnalysis
  ): number {
    const currentDifficulty = request.scenario.difficulty || 2;
    const conflictLevel = analysis.severity / 5;
    
    if (conflictLevel < 0.3) {
      return Math.min(5, currentDifficulty + 1);
    } else if (conflictLevel > 0.7) {
      return Math.max(1, currentDifficulty - 1);
    }
    
    return currentDifficulty;
  }

  // 私有方法：调用AI进行分析
  private async callAIForAnalysis(prompt: string): Promise<ConflictAnalysis> {
    try {
      const responseText = await kimiApi.chat([{ role: 'user', content: prompt }]);
      let response;
      try {
        response = JSON.parse(responseText);
      } catch (parseError) {
        // 如果JSON解析失败，返回默认分析
        console.warn('Failed to parse AI response as JSON:', parseError);
        return {
          conflictType: 'general_disagreement',
          severity: 3,
          commonGround: [],
          differences: [],
          recommendations: []
        };
      }
      
      // 解析AI响应
      return {
        conflictType: response.mainConflictTypes?.[0] || 'general_disagreement',
        severity: response.severityScore || 3,
        commonGround: response.consensusStrategy?.compromiseAreas || [],
        differences: response.keyDecisionPoints || [],
        recommendations: response.consensusStrategy?.priorityOrder || []
      };
    } catch (error) {
      console.error('AI analysis failed:', error);
      throw error;
    }
  }

  // 私有方法：调用AI生成问题
  private async callAIForQuestions(prompt: string): Promise<GeneratedQuestion[]> {
    try {
      const responseText = await kimiApi.chat([{ role: 'user', content: prompt }]);
      let response;
      try {
        response = JSON.parse(responseText);
      } catch (parseError) {
        // 如果JSON解析失败，返回空数组
        console.warn('Failed to parse AI response as JSON:', parseError);
        return [];
      }
      
      // 解析AI响应，转换为标准格式
      const questions: GeneratedQuestion[] = response.questionSequence?.map((q: any, index: number) => ({
        id: q.id || `generated_${Date.now()}_${index}`,
        scenarioId: this.currentScenario?.id || 'unknown',
        text: q.text,
        options: q.options || [],
        category: q.category || 'preference',
        difficulty: q.conflictLevel || 1,
        conflictPotential: (q.conflictLevel || 1) / 5,
        consensusKeywords: this.extractKeywords(q.text, q.options)
      })) || [];
      
      return questions;
    } catch (error) {
      console.error('AI question generation failed:', error);
      throw error;
    }
  }

  // 私有方法：解析冲突分析结果
  private parseConflictAnalysis(result: any): RealTimeConflictAnalysis {
    return {
      conflictDetected: result.conflictDetected || false,
      conflictIntensity: result.conflictIntensity || 0,
      conflictType: result.conflictType || 'unknown',
      consensusOpportunity: result.consensusOpportunity || 0.5,
      nextStepRecommendation: result.nextStepRecommendation || {
        action: 'continue_probing',
        reasoning: '需要更多信息',
        suggestedApproach: '继续探讨'
      },
      conflictInsights: result.conflictInsights || {
        rootCause: '未知原因',
        emotionalTone: 'rational',
        resolutionDifficulty: 'medium'
      },
      recommendedDamage: result.recommendedDamage || 10
    };
  }

  // 私有方法：生成默认冲突分析
  private generateDefaultConflictAnalysis(
    question: GeneratedQuestion, 
    answers: { player1: string, player2: string }
  ): RealTimeConflictAnalysis {
    const sameAnswer = answers.player1 === answers.player2;
    const conflictIntensity = sameAnswer ? 0.1 : 0.6;
    
    return {
      conflictDetected: !sameAnswer,
      conflictIntensity,
      conflictType: sameAnswer ? 'consensus' : 'preference_difference',
      consensusOpportunity: sameAnswer ? 0.9 : 0.4,
      nextStepRecommendation: {
        action: sameAnswer ? 'continue_probing' : 'seek_compromise',
        reasoning: sameAnswer ? '双方意见一致，可以继续' : '出现分歧，需要寻找妥协',
        suggestedApproach: sameAnswer ? '探讨下一个问题' : '讨论两个选择的优缺点'
      },
      conflictInsights: {
        rootCause: sameAnswer ? '价值观一致' : '偏好差异',
        emotionalTone: 'rational',
        resolutionDifficulty: sameAnswer ? 'easy' : 'medium'
      },
      recommendedDamage: sameAnswer ? 30 : 15
    };
  }

  // 私有方法：生成后备问题
  private generateFallbackQuestions(request: QuestionGenerationRequest): QuestionGenerationResponse {
    const scenario = ConflictPrompts.CONFLICT_SCENARIOS.preference_planning;
    
    const defaultQuestions: GeneratedQuestion[] = [
      {
        id: 'fallback_1',
        scenarioId: scenario.id,
        text: `关于这次${request.consensusGoal}，你们希望计划得多详细？`,
        options: [
          '大概规划就行，保留灵活性',
          '详细计划，按步骤执行',
          '计划重点部分，其他随意',
          '完全不做计划，随心而为'
        ],
        category: 'preference',
        difficulty: 2,
        conflictPotential: 0.4,
        consensusKeywords: ['计划', '灵活', '详细', '随意']
      },
      {
        id: 'fallback_2',
        scenarioId: scenario.id,
        text: '如果遇到意外情况或需要改变计划时，你们的态度是？',
        options: [
          '坚持原计划，不轻易改变',
          '根据情况灵活调整',
          '问问大家意见再决定',
          '谁提出改变谁负责'
        ],
        category: 'preference',
        difficulty: 3,
        conflictPotential: 0.6,
        consensusKeywords: ['坚持', '灵活', '意见', '负责']
      }
    ];

    return {
      scenario,
      questions: defaultQuestions,
      adaptiveStrategy: {
        nextDifficultyLevel: 2,
        recommendedApproach: 'explore_preferences',
        conflictPrediction: {
          probability: 0.5,
          mainTypes: ['planning_style'],
          severity: 2
        }
      }
    };
  }

  // 私有方法：提取关键词
  private extractKeywords(questionText: string, options: string[]): string[] {
    const allText = [questionText, ...options].join(' ');
    const keywords = new Set<string>();
    
    // 简单的关键词提取（可以后续优化）
    const commonKeywords = [
      '预算', '时间', '地点', '方式', '偏好', '计划', '灵活', '详细',
      '安全', '舒适', '新鲜', '传统', '高档', '经济', '快速', '慢节奏',
      '室内', '户外', '热闹', '安静', '社交', '私密', '探索', '放松'
    ];
    
    commonKeywords.forEach(keyword => {
      if (allText.includes(keyword)) {
        keywords.add(keyword);
      }
    });
    
    return Array.from(keywords);
  }
}

// 导出单例实例
export const questionGenerator = QuestionGeneratorService.getInstance();
export default questionGenerator;