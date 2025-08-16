// Doubao 文生图模型 API 接口

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
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_DOUBAO_API_KEY;
    // 使用Vite代理路径
    this.apiUrl = '/api/doubao';
    
    if (!this.apiKey) {
      throw new Error('VITE_DOUBAO_API_KEY environment variable is not set');
    }
  }

  async generateImage(prompt: string, options?: {
    size?: '1024x1024' | '512x512' | '1080x1920' | '768x1344' | '1344x768';
    guidance_scale?: number;
    watermark?: boolean;
    response_format?: 'url' | 'b64_json';
  }): Promise<string> {
    const requestBody: DoubaoRequest = {
      model: 'doubao-seedream-3-0-t2i-250415',
      prompt,
      response_format: options?.response_format || 'url',
      size: options?.size || '1080x1920',
      guidance_scale: options?.guidance_scale || 3,
      watermark: options?.watermark || true,
      n: 1,
    };

    try {
      const startTime = Date.now();
      console.log('🎨 发送Doubao文生图请求:', requestBody);

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
        throw new Error(`Doubao API error: ${response.status} ${response.statusText}\n${errorText}`);
      }

      const data: DoubaoResponse = await response.json();
      console.log(`✅ Doubao API响应成功 (用时: ${duration}ms):`, data);

      if (!data.data || data.data.length === 0) {
        throw new Error('Doubao API返回空响应');
      }

      const imageUrl = data.data[0].url;
      if (!imageUrl) {
        throw new Error('Doubao API未返回图片URL');
      }

      return imageUrl;
    } catch (error) {
      console.error('❌ Doubao API请求失败:', error);
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

  // 生成游戏背景图
  async generateGameBackground(scenario: {
    title: string;
    description: string;
    theme?: string;
  }): Promise<string> {
    // 使用prompt管理系统
    const { BackgroundPrompts } = await import('../prompts');
    
    // 智能匹配场景参数
    const promptParams = BackgroundPrompts.smartMatch(scenario);
    
    // 生成优化的prompt
    const prompt = BackgroundPrompts.generateBackground(promptParams);
    
    console.log('🎨 生成背景图 prompt:', prompt);
    
    return await this.generateImage(prompt, {
      size: '1080x1920', // 竖屏比例
      guidance_scale: 4,
      watermark: false, // 游戏背景不需要水印
    });
  }
}

// 导出单例实例
export const doubaoApi = new DoubaoAPI();