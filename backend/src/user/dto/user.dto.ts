import { IsString, IsEmail, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '用户名', example: 'john_doe' })
  @IsString()
  username: string;

  @ApiProperty({ description: '邮箱', example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsString()
  password: string;

  @ApiPropertyOptional({ description: '昵称', example: 'John' })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({ description: '头像URL', example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ description: '生日', example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  birthday?: string;

  @ApiPropertyOptional({ 
    description: '性别', 
    enum: ['MALE', 'FEMALE', 'OTHER'],
    example: 'MALE'
  })
  @IsOptional()
  @IsEnum(['MALE', 'FEMALE', 'OTHER'])
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
}

export class UpdateUserDto {
  @ApiPropertyOptional({ description: '昵称', example: 'John Updated' })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({ description: '头像URL', example: 'https://example.com/new-avatar.jpg' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ description: '生日', example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  birthday?: string;

  @ApiPropertyOptional({ 
    description: '性别', 
    enum: ['MALE', 'FEMALE', 'OTHER'],
    example: 'FEMALE'
  })
  @IsOptional()
  @IsEnum(['MALE', 'FEMALE', 'OTHER'])
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
}

export class UserResponseDto {
  @ApiProperty({ description: '用户ID', example: 'clxxxxx' })
  id: string;

  @ApiProperty({ description: '用户名', example: 'john_doe' })
  username: string;

  @ApiProperty({ description: '邮箱', example: 'john@example.com' })
  email: string;

  @ApiProperty({ description: '昵称', example: 'John' })
  nickname: string;

  @ApiProperty({ description: '头像URL', example: 'https://example.com/avatar.jpg' })
  avatar: string;

  @ApiPropertyOptional({ description: '生日', example: '1990-01-01T00:00:00Z' })
  birthday?: Date;

  @ApiPropertyOptional({ 
    description: '性别', 
    enum: ['MALE', 'FEMALE', 'OTHER'],
    example: 'MALE'
  })
  gender?: 'MALE' | 'FEMALE' | 'OTHER';

  @ApiProperty({ description: '创建时间', example: '2024-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间', example: '2024-01-01T00:00:00Z' })
  updatedAt: Date;
}