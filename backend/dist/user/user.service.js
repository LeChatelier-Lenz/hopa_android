"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { username: createUserDto.username },
                    { email: createUserDto.email }
                ]
            }
        });
        if (existingUser) {
            throw new common_1.ConflictException('用户名或邮箱已存在');
        }
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
    async findAll(page = 1, limit = 10, search) {
        const skip = (page - 1) * limit;
        const where = search ? {
            OR: [
                { username: { contains: search, mode: 'insensitive' } },
                { nickname: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('用户不存在');
        }
        return user;
    }
    async update(id, updateUserDto) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            throw new common_1.NotFoundException('用户不存在');
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
    async remove(id) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            throw new common_1.NotFoundException('用户不存在');
        }
        await this.prisma.user.delete({
            where: { id }
        });
        return { message: '用户删除成功' };
    }
    async findByUsername(username) {
        return await this.prisma.user.findUnique({
            where: { username }
        });
    }
    async findByEmail(email) {
        return await this.prisma.user.findUnique({
            where: { email }
        });
    }
    async getFriends(id) {
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
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map