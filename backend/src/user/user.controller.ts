import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Request,
  Query,
  ParseIntPipe
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiQuery 
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('用户管理')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '创建用户' })
  @ApiResponse({ 
    status: 201, 
    description: '用户创建成功', 
    type: UserResponseDto 
  })
  @ApiResponse({ status: 409, description: '用户名或邮箱已存在' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: '获取用户列表' })
  @ApiQuery({ name: 'page', required: false, description: '页码', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: '每页数量', example: 10 })
  @ApiQuery({ name: 'search', required: false, description: '搜索关键词' })
  @ApiResponse({ 
    status: 200, 
    description: '用户列表获取成功',
    schema: {
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: { $ref: '#/components/schemas/UserResponseDto' }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            totalPages: { type: 'number' },
            hasNext: { type: 'boolean' },
            hasPrev: { type: 'boolean' }
          }
        }
      }
    }
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.userService.findAll(page, limit, search);
  }

  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiResponse({ 
    status: 200, 
    description: '用户信息获取成功', 
    type: UserResponseDto 
  })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return this.userService.findOne(req.user.sub);
  }

  @ApiOperation({ summary: '获取当前用户的好友列表' })
  @ApiResponse({ 
    status: 200, 
    description: '好友列表获取成功',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          friendshipId: { type: 'string' },
          friend: { $ref: '#/components/schemas/UserResponseDto' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me/friends')
  getMyFriends(@Request() req) {
    return this.userService.getFriends(req.user.sub);
  }

  @ApiOperation({ summary: '根据ID获取用户信息' })
  @ApiResponse({ 
    status: 200, 
    description: '用户信息获取成功', 
    type: UserResponseDto 
  })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: '获取指定用户的好友列表' })
  @ApiResponse({ 
    status: 200, 
    description: '好友列表获取成功',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          friendshipId: { type: 'string' },
          friend: { $ref: '#/components/schemas/UserResponseDto' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id/friends')
  getUserFriends(@Param('id') id: string) {
    return this.userService.getFriends(id);
  }

  @ApiOperation({ summary: '更新当前用户信息' })
  @ApiResponse({ 
    status: 200, 
    description: '用户信息更新成功', 
    type: UserResponseDto 
  })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.sub, updateUserDto);
  }

  @ApiOperation({ summary: '根据ID更新用户信息' })
  @ApiResponse({ 
    status: 200, 
    description: '用户信息更新成功', 
    type: UserResponseDto 
  })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: '删除用户' })
  @ApiResponse({ status: 200, description: '用户删除成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}