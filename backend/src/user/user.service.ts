import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // 检查用户名是否已存在
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: createUserDto.username },
          { email: createUserDto.email }
        ]
      }
    });

    if (existingUser) {
      throw new ConflictException('用户名或邮箱已存在');
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        nickname: createUserDto.nickname || createUserDto.username,
        avatar: createUserDto.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + createUserDto.username,
      },
      select: {
        id: true,
        username: true,
        email: true,
        nickname: true,
        avatar: true,
        birthday: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return user;
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    
    const where = search ? {
      OR: [
        { username: { contains: search, mode: 'insensitive' as const } },
        { nickname: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          username: true,
          email: true,
          nickname: true,
          avatar: true,
          birthday: true,
          gender: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.user.count({ where })
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        nickname: true,
        avatar: true,
        birthday: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
        // 包含关联数据
        characters: {
          select: {
            id: true,
            name: true,
            level: true,
            experience: true,
            avatar: true,
          }
        },
        roomMembers: {
          where: {
            room: {
              status: { in: ['WAITING', 'PLAYING'] }
            }
          },
          select: {
            id: true,
            role: true,
            joinedAt: true,
            room: {
              select: {
                id: true,
                title: true,
                description: true,
                status: true,
                createdAt: true,
              }
            }
          }
        },
        sentFriendships: {
          where: {
            status: 'PENDING'
          },
          select: {
            id: true,
            status: true,
            createdAt: true,
            receiver: {
              select: {
                id: true,
                username: true,
                nickname: true,
                avatar: true,
              }
            }
          }
        },
        receivedFriendships: {
          where: {
            status: 'PENDING'
          },
          select: {
            id: true,
            status: true,
            createdAt: true,
            sender: {
              select: {
                id: true,
                username: true,
                nickname: true,
                avatar: true,
              }
            }
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        username: true,
        email: true,
        nickname: true,
        avatar: true,
        birthday: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    await this.prisma.user.delete({
      where: { id }
    });

    return { message: '用户删除成功' };
  }

  async findByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: { username }
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email }
    });
  }

  // 获取用户的好友列表
  async getFriends(id: string) {
    const friendships = await this.prisma.friendship.findMany({
      where: {
        OR: [
          { senderId: id, status: 'ACCEPTED' },
          { receiverId: id, status: 'ACCEPTED' }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true,
          }
        },
        receiver: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true,
          }
        }
      }
    });

    return friendships.map(friendship => {
      const friend = friendship.senderId === id ? friendship.receiver : friendship.sender;
      return {
        friendshipId: friendship.id,
        friend,
        createdAt: friendship.createdAt
      };
    });
  }
}