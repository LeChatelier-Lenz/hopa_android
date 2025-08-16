import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DoubaoService } from './doubao.service';
import { KimiService } from './kimi.service';
import { 
  GenerateImageDto, 
  GenerateGameBackgroundDto, 
  ChatDto, 
  GenerateQuestionsDto 
} from './dto/ai.dto';

@ApiTags('AI服务')
@Controller('ai')
export class AiController {
  constructor(
    private doubaoService: DoubaoService,
    private kimiService: KimiService,
  ) {}

  @ApiOperation({ summary: 'Doubao文生图' })
  @ApiResponse({ status: 200, description: '图片生成成功' })
  @ApiResponse({ status: 400, description: 'API请求失败' })
  @Post('doubao/generate-image')
  async generateImage(@Body() generateImageDto: GenerateImageDto) {
    const imageUrl = await this.doubaoService.generateImage(
      generateImageDto.prompt,
      {
        size: generateImageDto.size,
        guidance_scale: generateImageDto.guidance_scale,
        watermark: generateImageDto.watermark,
        response_format: generateImageDto.response_format,
      }
    );

    return {
      success: true,
      imageUrl,
      message: '图片生成成功',
    };
  }

  @ApiOperation({ summary: '生成游戏背景图' })
  @ApiResponse({ status: 200, description: '背景图生成成功' })
  @ApiResponse({ status: 400, description: 'API请求失败' })
  @Post('doubao/generate-background')
  async generateGameBackground(@Body() dto: GenerateGameBackgroundDto) {
    const imageUrl = await this.doubaoService.generateGameBackground({
      title: dto.title,
      description: dto.description,
      theme: dto.theme,
    });

    return {
      success: true,
      imageUrl,
      message: '游戏背景生成成功',
    };
  }

  @ApiOperation({ summary: 'Kimi聊天对话' })
  @ApiResponse({ status: 200, description: '对话成功' })
  @ApiResponse({ status: 400, description: 'API请求失败' })
  @Post('kimi/chat')
  async chat(@Body() chatDto: ChatDto) {
    const response = await this.kimiService.chat(
      chatDto.messages,
      {
        temperature: chatDto.temperature,
        max_tokens: chatDto.max_tokens,
      }
    );

    return {
      success: true,
      response,
      message: '对话成功',
    };
  }

  @ApiOperation({ summary: '生成共识问题' })
  @ApiResponse({ status: 200, description: '问题生成成功' })
  @ApiResponse({ status: 400, description: 'API请求失败' })
  @Post('kimi/generate-questions')
  async generateQuestions(@Body() dto: GenerateQuestionsDto) {
    const questions = await this.kimiService.generateConsensusQuestions({
      title: dto.title,
      description: dto.description,
      scenarioType: dto.scenarioType,
      budget: dto.budget,
      duration: dto.duration,
      preferences: dto.preferences,
    });

    return {
      success: true,
      questions,
      message: '共识问题生成成功',
    };
  }

  // 公开接口（不需要认证）- 用于前端替换Vite代理
  @ApiOperation({ summary: '前端AI代理 - Doubao' })
  @ApiResponse({ status: 200, description: 'API代理成功' })
  @Post('proxy/doubao')
  async proxyDoubao(@Body() body: any) {
    // 直接转发请求到Doubao API
    const response = await fetch(this.doubaoService['apiUrl'], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.doubaoService['apiKey']}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return data;
  }

  @ApiOperation({ summary: '前端AI代理 - Kimi' })
  @ApiResponse({ status: 200, description: 'API代理成功' })
  @Post('proxy/kimi')
  async proxyKimi(@Body() body: any) {
    // 直接转发请求到Kimi API
    const response = await fetch(this.kimiService['apiUrl'], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.kimiService['apiKey']}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return data;
  }
}