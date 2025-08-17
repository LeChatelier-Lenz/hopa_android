import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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

@Injectable()
export class DoubaoService {
  private apiKey: string;
  private apiUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = configService.get<string>('DOUBAO_API_KEY') || '';
    this.apiUrl = configService.get<string>('DOUBAO_API_URL') || '';

    if (!this.apiKey || !this.apiUrl) {
      throw new Error('Doubao API配置缺失');
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
        throw new HttpException(
          `Doubao API错误: ${response.status} ${response.statusText}\n${errorText}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const data: DoubaoResponse = await response.json();
      console.log(`✅ Doubao API响应成功 (用时: ${duration}ms):`, data);

      if (!data.data || data.data.length === 0) {
        throw new HttpException('Doubao API返回空响应', HttpStatus.BAD_REQUEST);
      }

      const imageUrl = data.data[0].url;
      if (!imageUrl) {
        throw new HttpException('Doubao API未返回图片URL', HttpStatus.BAD_REQUEST);
      }

      return imageUrl;
    } catch (error) {
      console.error('❌ Doubao API请求失败:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Doubao API请求失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async generateGameBackground(scenario: {
    title: string;
    description: string;
    theme?: string;
    peopleCount?: number;
  }): Promise<string> {
    // 根据人数生成人数描述
    const getPeopleDescription = (count?: number): string => {
      if (!count) return '';
      if (count === 1) return '1人独自进行';
      if (count === 2) return '2人配合';
      if (count <= 4) return `${count}人小团体`;
      if (count <= 8) return `${count}人团队`;
      return `${count}人大团队`;
    };

    const peopleDescription = getPeopleDescription(scenario.peopleCount);
    
    const basePrompt = `
主题: ${scenario.title}
场景: ${scenario.description}
${peopleDescription ? `人数特色: ${peopleDescription}` : ''}
${scenario.theme ? `风格: ${scenario.theme}` : ''}

请生成一个包含该主题特色的场景插画，垂直构图(9:16比例)，现代插画风格。
`.trim();

    return await this.generateImage(basePrompt, {
      size: '1080x1920',
      guidance_scale: 4,
      watermark: false,
    });
  }
}