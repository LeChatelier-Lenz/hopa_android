import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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

@Injectable()
export class KimiService {
  private apiKey: string;
  private apiUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = configService.get<string>('KIMI_API_KEY') || '';
    this.apiUrl = configService.get<string>('KIMI_API_URL') || '';

    if (!this.apiKey || !this.apiUrl) {
      throw new Error('Kimi API配置缺失');
    }
  }

  async chat(messages: KimiMessage[], options?: {
    temperature?: number;
    max_tokens?: number;
  }): Promise<string> {
    const requestBody: KimiRequest = {
      model: 'kimi-k2-250711',
      messages,
      temperature: options?.temperature || 0.7,
      max_tokens: options?.max_tokens || 1000,
    };

    try {
      const startTime = Date.now();
      console.log('🚀 发送Kimi API请求:', requestBody);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        throw new HttpException(
          `Kimi API错误: ${response.status} ${response.statusText}\n${errorText}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const data: KimiResponse = await response.json();
      console.log(`✅ Kimi API响应成功 (用时: ${duration}ms):`, data);

      if (!data.choices || data.choices.length === 0) {
        throw new HttpException('Kimi API返回空响应', HttpStatus.BAD_REQUEST);
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('❌ Kimi API请求失败:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Kimi API请求失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

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
    const scenarioTypeText = scenario.scenarioType === 'friends' ? '朋友聚会' :
                            scenario.scenarioType === 'family' ? '家庭活动' :
                            scenario.scenarioType === 'team' ? '团队协作' :
                            scenario.scenarioType === 'couples' ? '情侣约会' : '共识活动';
    
    const prompt = `
基于以下${scenarioTypeText}场景，生成一个关于决策的共识问题：
- 活动主题：${scenario.title}
- 活动描述：${scenario.description}
${scenario.budget ? `- 预算范围：${scenario.budget[0]}-${scenario.budget[1]}元` : ''}
${scenario.duration ? `- 活动时长：${scenario.duration}` : ''}
${scenario.preferences ? `- 偏好选择：${scenario.preferences.join('、')}` : ''}

请生成一个具体的决策问题，包含4个选项，并指出最合理的选择。
返回JSON格式：
{
  "question": "问题描述",
  "options": ["选项A", "选项B", "选项C", "选项D"],
  "correctAnswer": 0,
  "explanation": "为什么这是最佳选择的解释"
}
`;

    try {
      const response = await this.chat([
        { role: 'system', content: `你是${scenarioTypeText}规划专家，擅长为不同群体设计合适的活动方案。` },
        { role: 'user', content: prompt }
      ]);

      // 尝试解析JSON响应
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new HttpException('AI响应格式不正确', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      console.error('生成问题失败:', error);
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