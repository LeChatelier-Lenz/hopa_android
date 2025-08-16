import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        email: string;
        username: string;
        id: string;
        nickname: string | null;
        avatar: string | null;
        birthday: Date | null;
        gender: import("@prisma/client").$Enums.Gender | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        users: {
            email: string;
            username: string;
            id: string;
            nickname: string | null;
            avatar: string | null;
            birthday: Date | null;
            gender: import("@prisma/client").$Enums.Gender | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    findOne(id: string): Promise<{
        email: string;
        username: string;
        id: string;
        nickname: string | null;
        avatar: string | null;
        birthday: Date | null;
        gender: import("@prisma/client").$Enums.Gender | null;
        createdAt: Date;
        updatedAt: Date;
        characters: {
            id: string;
            avatar: string | null;
            name: string;
            level: number;
            experience: number;
        }[];
        roomMembers: {
            room: {
                description: string;
                title: string;
                id: string;
                createdAt: Date;
                status: import("@prisma/client").$Enums.RoomStatus;
            };
            id: string;
            role: string;
            joinedAt: Date;
        }[];
        sentFriendships: {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.FriendshipStatus;
            receiver: {
                username: string;
                id: string;
                nickname: string | null;
                avatar: string | null;
            };
        }[];
        receivedFriendships: {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.FriendshipStatus;
            sender: {
                username: string;
                id: string;
                nickname: string | null;
                avatar: string | null;
            };
        }[];
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        email: string;
        username: string;
        id: string;
        nickname: string | null;
        avatar: string | null;
        birthday: Date | null;
        gender: import("@prisma/client").$Enums.Gender | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    findByUsername(username: string): Promise<{
        email: string;
        username: string;
        password: string;
        id: string;
        nickname: string | null;
        avatar: string | null;
        birthday: Date | null;
        gender: import("@prisma/client").$Enums.Gender | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findByEmail(email: string): Promise<{
        email: string;
        username: string;
        password: string;
        id: string;
        nickname: string | null;
        avatar: string | null;
        birthday: Date | null;
        gender: import("@prisma/client").$Enums.Gender | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    getFriends(id: string): Promise<{
        friendshipId: string;
        friend: {
            username: string;
            id: string;
            nickname: string | null;
            avatar: string | null;
        };
        createdAt: Date;
    }[]>;
}
