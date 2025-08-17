import { Controller, Post, Body, Get, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Response } from 'express';
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

  @ApiOperation({ summary: '代理图片请求 - 解决CORS问题' })
  @ApiResponse({ status: 200, description: '图片代理成功' })
  @Get('proxy/image')
  async proxyImage(@Query('url') imageUrl: string, @Res() res: Response) {
    try {
      if (!imageUrl) {
        return res.status(400).json({ error: '缺少图片URL参数' });
      }

      // 请求原始图片
      const response = await fetch(imageUrl);
      
      if (!response.ok) {
        return res.status(response.status).json({ error: '图片请求失败' });
      }

      // 获取图片数据和类型
      const imageBuffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/jpeg';

      // 设置适当的响应头
      res.setHeader('Content-Type', contentType);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 缓存1天

      // 返回图片数据
      return res.send(Buffer.from(imageBuffer));
    } catch (error) {
      console.error('图片代理错误:', error);
      return res.status(500).json({ error: '图片代理失败' });
    }
  }

  @ApiOperation({ summary: '生成装备内容' })
  @ApiResponse({ status: 200, description: '装备内容生成成功' })
  @ApiResponse({ status: 400, description: 'API请求失败' })
  @Post('kimi/generate-equipment')
  async generateEquipmentContent(@Body() dto: any) {
    try {
      const equipment = await this.kimiService.generateEquipmentContent({
        title: dto.title,
        description: dto.description,
        scenarioType: dto.scenarioType,
        budget: dto.budget,
        duration: dto.duration,
        preferences: dto.preferences,
      });

      return {
        success: true,
        equipment,
        message: '装备内容生成成功',
      };
    } catch (error) {
      console.error('装备内容生成失败:', error);
      
      // 返回默认装备内容
      const defaultEquipment = {
        cuisineGem: {
          types: ['当地特色菜', '小吃', '饮品'],
          name: '美食宝珠',
          description: '探索当地美食文化'
        },
        attractionShield: {
          preferences: ['热门景点', '文化古迹', '自然风光'],
          name: '景点盾牌',
          description: '发现精彩目的地'
        }
      };

      return {
        success: true,
        equipment: defaultEquipment,
        message: '使用默认装备内容',
      };
    }
  }

  @ApiOperation({ summary: '生成冲突预测题目' })
  @ApiResponse({ status: 200, description: '冲突题目生成成功' })
  @ApiResponse({ status: 400, description: 'API请求失败' })
  @Post('kimi/generate-conflict-questions')
  async generateConflictQuestions(@Body() dto: any) {
    try {
      // 使用 Kimi 服务生成冲突预测题目
      const questions = await this.kimiService.generateConflictQuestions({
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
        message: '冲突预测题目生成成功',
      };
    } catch (error) {
      console.error('冲突题目生成失败:', error);
      
      // 返回默认题目作为后备
      const defaultQuestions = [
        {
          id: 'conflict_1',
          type: 'choice',
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
          type: 'choice',
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
        }
      ];

      return {
        success: true,
        questions: defaultQuestions,
        message: '使用默认冲突题目',
      };
    }
  }
}