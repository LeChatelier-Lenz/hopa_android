export declare class CreateUserDto {
    username: string;
    email: string;
    password: string;
    nickname?: string;
    avatar?: string;
    birthday?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
}
export declare class UpdateUserDto {
    nickname?: string;
    avatar?: string;
    birthday?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
}
export declare class UserResponseDto {
    id: string;
    username: string;
    email: string;
    nickname: string;
    avatar: string;
    birthday?: Date;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    createdAt: Date;
    updatedAt: Date;
}
