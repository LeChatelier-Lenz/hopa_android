import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            email: string;
            username: string;
            id: string;
            avatar: string | null;
            createdAt: Date;
        };
        accessToken: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            email: string;
            username: string;
            id: string;
            avatar: string | null;
            isActive: boolean;
        };
        accessToken: string;
    }>;
    validateUser(userId: string): Promise<{
        email: string;
        username: string;
        id: string;
        avatar: string | null;
        isActive: boolean;
    }>;
}
