import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
}
