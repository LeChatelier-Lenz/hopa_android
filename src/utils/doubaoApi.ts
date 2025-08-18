// Doubao 文生图模型 API 接口
import { apiConfig } from '../config/api';
import { BackgroundPrompts, type BackgroundPromptParams } from '../prompts/backgrounds';

interface DoubaoRequest {
  model: string;
  prompt: string;
  response_format?: 'url' | 'b64_json';
  size?: '1024x1024' | '512x512' | '1080x1920' | '768x1344' | '1344x768';
  guidance_scale?: number;
  watermark?: boolean;
  n?: number;
}

interface DoubaoResponse {
  data: {
    url?: string;
    b64_json?: string;
    revised_prompt?: string;
  }[];
  created: number;
}

export class DoubaoAPI {
  private backendUrl: string;

  constructor() {
    // 调用后端API，不再需要API密钥
    this.backendUrl = apiConfig.getBackendUrl();
    console.log('🔧 DoubaoAPI初始化，后端URL:', this.backendUrl);
  }

  async generateImage(prompt: string, options?: {
    size?: '1024x1024' | '512x512' | '1080x1920' | '768x1344' | '1344x768';
    guidance_scale?: number;
    watermark?: boolean;
    response_format?: 'url' | 'b64_json';
  }): Promise<string> {
    const requestBody = {
      prompt,
      size: options?.size || '1080x1920',
      guidance_scale: options?.guidance_scale || 3,
      watermark: options?.watermark || true,
      response_format: options?.response_format || 'url',
    };

    try {
      const startTime = Date.now();
      console.log('🎨 发送Doubao后端API请求:', requestBody);

      const response = await fetch(`${this.backendUrl}/doubao/generate-image`, {
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

      if (!data.success || !data.imageUrl) {
        throw new Error(data.message || '后端API返回错误');
      }

      return data.imageUrl;
    } catch (error) {
      console.error('❌ 后端API请求失败:', error);
      throw error;
    }
  }

  // 测试连接
  async testConnection(): Promise<{ success: boolean; duration: number; imageUrl?: string; message: string }> {
    try {
      const startTime = Date.now();
      
      const imageUrl = await this.generateImage(
        '鱼眼镜头，一只猫咪的头部，画面呈现出猫咪的五官因为拍摄方式扭曲的效果。',
        { size: '1024x1024' }
      );

      const duration = Date.now() - startTime;
      
      return {
        success: true,
        duration,
        imageUrl,
        message: '文生图API连接成功',
      };
    } catch (error) {
      return {
        success: false,
        duration: 0,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // 生成游戏背景图 - 使用前端prompt生成
  async generateGameBackground(scenario: {
    title: string;
    description: string;
    theme?: string;
    peopleCount?: number;
  }): Promise<string> {
    try {
      const startTime = Date.now();
      console.log('🎨 开始生成背景图，场景数据:', scenario);

      // 1. 使用前端prompt系统智能匹配场景参数
      const promptParams: BackgroundPromptParams = BackgroundPrompts.smartMatch({
        title: scenario.title,
        description: scenario.description
      });

      // 2. 如果有额外参数，覆盖智能匹配结果
      if (scenario.peopleCount) {
        promptParams.peopleCount = scenario.peopleCount;
      }
      
      console.log('🧠 智能匹配的prompt参数:', promptParams);

      // 3. 生成优化的背景prompt
      const backgroundPrompt = BackgroundPrompts.generateBackground(promptParams);
      console.log('📝 生成的背景prompt:', backgroundPrompt);

      // 4. 调用后端API，传递生成的prompt
      const response = await fetch(`${this.backendUrl}/doubao/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: backgroundPrompt,
          size: '1080x1920',
          guidance_scale: 4,
          watermark: false,
        }),
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`后端API错误: ${response.status} ${response.statusText}\n${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ 背景图生成成功 (用时: ${duration}ms):`, data);

      if (!data.success || !data.imageUrl) {
        throw new Error(data.message || '背景图生成失败');
      }

      return data.imageUrl;
    } catch (error) {
      console.error('❌ 背景图生成失败:', error);
      throw error;
    }
  }
}

// 导出单例实例
export const doubaoApi = new DoubaoAPI();