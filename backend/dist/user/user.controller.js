"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_service_1 = require("./user.service");
const user_dto_1 = require("./dto/user.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    create(createUserDto) {
        return this.userService.create(createUserDto);
    }
    findAll(page = 1, limit = 10, search) {
        return this.userService.findAll(page, limit, search);
    }
    getProfile(req) {
        return this.userService.findOne(req.user.sub);
    }
    getMyFriends(req) {
        return this.userService.getFriends(req.user.sub);
    }
    findOne(id) {
        return this.userService.findOne(id);
    }
    getUserFriends(id) {
        return this.userService.getFriends(id);
    }
    updateProfile(req, updateUserDto) {
        return this.userService.update(req.user.sub, updateUserDto);
    }
    update(id, updateUserDto) {
        return this.userService.update(id, updateUserDto);
    }
    remove(id) {
        return this.userService.remove(id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '创建用户' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: '用户创建成功',
        type: user_dto_1.UserResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 409, description: '用户名或邮箱已存在' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '获取用户列表' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: '页码', example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: '每页数量', example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: '搜索关键词' }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '获取当前用户信息' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '用户信息获取成功',
        type: user_dto_1.UserResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '用户不存在' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getProfile", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '获取当前用户的好友列表' }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me/friends'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getMyFriends", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '根据ID获取用户信息' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '用户信息获取成功',
        type: user_dto_1.UserResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '用户不存在' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '获取指定用户的好友列表' }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id/friends'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUserFriends", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '更新当前用户信息' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '用户信息更新成功',
        type: user_dto_1.UserResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '用户不存在' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('me'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "updateProfile", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '根据ID更新用户信息' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '用户信息更新成功',
        type: user_dto_1.UserResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '用户不存在' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '删除用户' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '用户删除成功' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '用户不存在' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "remove", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('用户管理'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map