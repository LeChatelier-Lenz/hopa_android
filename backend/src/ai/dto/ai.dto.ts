import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateImageDto {
  @ApiProperty({ description: '图片生成提示词', example: '美丽的风景画' })
  @IsString()
  prompt: string;

  @ApiPropertyOptional({ 
    description: '图片尺寸', 
    enum: ['1024x1024', '512x512', '1080x1920', '768x1344', '1344x768'],
    example: '1080x1920'
  })
  @IsOptional()
  @IsEnum(['1024x1024', '512x512', '1080x1920', '768x1344', '1344x768'])
  size?: '1024x1024' | '512x512' | '1080x1920' | '768x1344' | '1344x768';

  @ApiPropertyOptional({ description: '引导强度', example: 3, minimum: 1, maximum: 10 })
  @IsOptional()
  @IsNumber()
  guidance_scale?: number;

  @ApiPropertyOptional({ description: '是否添加水印', example: true })
  @IsOptional()
  @IsBoolean()
  watermark?: boolean;

  @ApiPropertyOptional({ 
    description: '响应格式', 
    enum: ['url', 'b64_json'],
    example: 'url'
  })
  @IsOptional()
  @IsEnum(['url', 'b64_json'])
  response_format?: 'url' | 'b64_json';
}

export class GenerateGameBackgroundDto {
  @ApiProperty({ description: '共识主题', example: '和朋友一起去北京玩' })
  @IsString()
  title: string;

  @ApiProperty({ description: '场景描述', example: '一共5个人，准备玩3天' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ description: '主题风格', example: '现代都市' })
  @IsOptional()
  @IsString()
  theme?: string;
}

export class ChatDto {
  @ApiProperty({ 
    description: '消息列表',
    example: [
      { role: 'user', content: '你好' }
    ]
  })
  @IsArray()
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;

  @ApiPropertyOptional({ description: '随机性', example: 0.7, minimum: 0, maximum: 2 })
  @IsOptional()
  @IsNumber()
  temperature?: number;

  @ApiPropertyOptional({ description: '最大token数', example: 1000 })
  @IsOptional()
  @IsNumber()
  max_tokens?: number;
}

export class GenerateQuestionsDto {
  @ApiProperty({ description: '活动主题', example: '和朋友一起去北京玩' })
  @IsString()
  title: string;

  @ApiProperty({ description: '活动描述', example: '一共5个人，准备玩3天' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ 
    description: '场景类型', 
    enum: ['friends', 'family', 'couples', 'team'],
    example: 'friends'
  })
  @IsOptional()
  @IsEnum(['friends', 'family', 'couples', 'team'])
  scenarioType?: string;

  @ApiPropertyOptional({ description: '预算范围', example: [1000, 3000] })
  @IsOptional()
  @IsArray()
  budget?: [number, number];

  @ApiPropertyOptional({ description: '活动时长', example: '3天' })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({ description: '偏好选择', example: ['旅游', '美食'] })
  @IsOptional()
  @IsArray()
  preferences?: string[];
}