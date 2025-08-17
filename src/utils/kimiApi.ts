// Kimi K2 大模型 API 接口
import { apiConfig } from '../config/api';

interface KimiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface KimiRequest {
  model: string;
  messages: KimiMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface KimiResponse {
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class KimiAPI {
  private backendUrl: string;

  constructor() {
    // 调用后端API，不再需要API密钥
    this.backendUrl = apiConfig.getBackendUrl();
    console.log('🔧 KimiAPI初始化，后端URL:', this.backendUrl);
  }

  async chat(messages: KimiMessage[], options?: {
    temperature?: number;
    max_tokens?: number;
  }): Promise<string> {
    const requestBody = {
      messages,
      temperature: options?.temperature || 0.7,
      max_tokens: options?.max_tokens || 1000,
    };

    try {
      const startTime = Date.now();
      console.log('🚀 发送Kimi后端API请求:', requestBody);

      const response = await fetch(`${this.backendUrl}/kimi/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`后端API错误: ${response.status} ${response.statusText}\n${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ 后端API响应成功 (用时: ${duration}ms):`, data);

      if (!data.success || !data.response) {
        throw new Error(data.message || '后端API返回错误');
      }

      return data.response;
    } catch (error) {
      console.error('❌ 后端API请求失败:', error);
      throw error;
    }
  }

  // 测试连接
  async testConnection(): Promise<{ success: boolean; duration: number; message: string }> {
    try {
      const startTime = Date.now();
      
      const response = await this.chat([
        { role: 'system', content: '你是人工智能助手.' },
        { role: 'user', content: '你好，请简单回复确认连接成功' }
      ]);

      const duration = Date.now() - startTime;
      
      return {
        success: true,
        duration,
        message: response,
      };
    } catch (error) {
      return {
        success: false,
        duration: 0,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // 生成冲突预测和解决题目
  async generateConflictQuestions(scenario: {
    title: string;
    description: string;
    scenarioType?: string;
    budget?: [number, number];
    duration?: string;
    preferences?: string[];
  }): Promise<Array<{
    id: string;
    type: 'choice' | 'fill' | 'sort';
    question: string;
    options?: string[];
    correctAnswer?: number | string | string[];
    explanation: string;
    category: string;
  }>> {
    const requestBody = {
      title: scenario.title,
      description: scenario.description,
      scenarioType: scenario.scenarioType,
      budget: scenario.budget,
      duration: scenario.duration,
      preferences: scenario.preferences,
      requestType: 'conflict_prediction', // 新的请求类型
    };

    try {
      const startTime = Date.now();
      console.log('🚀 发送冲突预测题目生成请求:', requestBody);

      const response = await fetch(`${this.backendUrl}/kimi/generate-conflict-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`后端API错误: ${response.status} ${response.statusText}\n${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ 冲突题目生成成功 (用时: ${duration}ms):`, data);

      if (!data.success || !data.questions) {
        throw new Error(data.message || '冲突题目生成失败');
      }

      return data.questions;
    } catch (error) {
      console.error('❌ 冲突题目生成失败:', error);
      // 返回默认题目
      return this.getDefaultConflictQuestions();
    }
  }

  private getDefaultConflictQuestions() {
    return [
      {
        id: 'conflict_1',
        type: 'choice' as const,
        question: '在预算分歧时，你们通常如何协调？',
        options: [
          '优先考虑性价比最高的选项',
          '平均分配预算到各个环节',
          '重点投入到最重要的体验',
          '寻找免费或低成本替代方案'
        ],
        correctAnswer: 2,
        explanation: '重点投入能创造最佳共同体验',
        category: 'budget'
      },
      {
        id: 'conflict_2',
        type: 'choice' as const,
        question: '时间安排产生冲突时，最好的解决方案是？',
        options: [
          '严格按照计划执行',
          '灵活调整，优先重要活动',
          '民主投票决定',
          '轮流决定优先级'
        ],
        correctAnswer: 1,
        explanation: '灵活性有助于应对突发情况',
        category: 'time'
      },
      {
        id: 'conflict_3',
        type: 'sort' as const,
        question: '请按重要性排序这些冲突解决原则：',
        options: [
          '开放沟通',
          '互相妥协',
          '尊重差异',
          '寻找共赢'
        ],
        correctAnswer: ['开放沟通', '尊重差异', '寻找共赢', '互相妥协'],
        explanation: '沟通是基础，尊重是前提，共赢是目标',
        category: 'principle'
      },
      {
        id: 'conflict_4',
        type: 'fill' as const,
        question: '当遇到意见分歧时，最重要的是保持_____，通过_____来解决问题。',
        options: ['耐心', '理解', '沟通', '冷静'],
        correctAnswer: ['冷静', '沟通'],
        explanation: '冷静思考和开放沟通是解决冲突的关键',
        category: 'communication'
      },
      {
        id: 'conflict_5',
        type: 'choice' as const,
        question: '团队决策时最容易产生冲突的环节是？',
        options: [
          '目标设定阶段',
          '资源分配阶段',
          '执行方案确定',
          '结果评估阶段'
        ],
        correctAnswer: 1,
        explanation: '资源有限时最容易产生分歧',
        category: 'decision'
      }
    ];
  }

  // 保持原有的生成共识问题方法
  async generateConsensusQuestions(scenario: {
    title: string;
    description: string;
    scenarioType?: string;
    budget?: [number, number];
    duration?: string;
    preferences?: string[];
  }): Promise<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }> {
    const requestBody = {
      title: scenario.title,
      description: scenario.description,
      scenarioType: scenario.scenarioType,
      budget: scenario.budget,
      duration: scenario.duration,
      preferences: scenario.preferences,
    };

    try {
      const startTime = Date.now();
      console.log('🚀 发送问题生成请求:', requestBody);

      const response = await fetch(`${this.backendUrl}/kimi/generate-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`后端API错误: ${response.status} ${response.statusText}\n${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ 问题生成成功 (用时: ${duration}ms):`, data);

      if (!data.success || !data.questions) {
        throw new Error(data.message || '问题生成失败');
      }

      return data.questions;
    } catch (error) {
      console.error('❌ 问题生成失败:', error);
      // 返回默认问题
      return {
        question: '在预算和时间有限的情况下，你们会如何安排这次活动？',
        options: [
          '选择免费或低成本的活动',
          '精选2-3个核心体验深度享受',
          '快速体验所有计划项目',
          '放慢节奏，重点交流沟通'
        ],
        correctAnswer: 1,
        explanation: '精选核心体验既能获得最佳效果，又不会过于疲惫，是最佳平衡。'
      };
    }
  }
}

// 导出单例实例
export const kimiApi = new KimiAPI();