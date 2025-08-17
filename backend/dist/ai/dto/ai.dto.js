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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateQuestionsDto = exports.ChatDto = exports.GenerateGameBackgroundDto = exports.GenerateImageDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class GenerateImageDto {
    prompt;
    size;
    guidance_scale;
    watermark;
    response_format;
}
exports.GenerateImageDto = GenerateImageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '图片生成提示词', example: '美丽的风景画' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateImageDto.prototype, "prompt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '图片尺寸',
        enum: ['1024x1024', '512x512', '1080x1920', '768x1344', '1344x768'],
        example: '1080x1920'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['1024x1024', '512x512', '1080x1920', '768x1344', '1344x768']),
    __metadata("design:type", String)
], GenerateImageDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '引导强度', example: 3, minimum: 1, maximum: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GenerateImageDto.prototype, "guidance_scale", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '是否添加水印', example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GenerateImageDto.prototype, "watermark", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '响应格式',
        enum: ['url', 'b64_json'],
        example: 'url'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['url', 'b64_json']),
    __metadata("design:type", String)
], GenerateImageDto.prototype, "response_format", void 0);
class GenerateGameBackgroundDto {
    title;
    description;
    theme;
    peopleCount;
}
exports.GenerateGameBackgroundDto = GenerateGameBackgroundDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '共识主题', example: '和朋友一起去北京玩' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateGameBackgroundDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '场景描述', example: '一共5个人，准备玩3天' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateGameBackgroundDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '主题风格', example: '现代都市' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateGameBackgroundDto.prototype, "theme", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '参与人数', example: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GenerateGameBackgroundDto.prototype, "peopleCount", void 0);
class ChatDto {
    messages;
    temperature;
    max_tokens;
}
exports.ChatDto = ChatDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '消息列表',
        example: [
            { role: 'user', content: '你好' }
        ]
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ChatDto.prototype, "messages", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '随机性', example: 0.7, minimum: 0, maximum: 2 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ChatDto.prototype, "temperature", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '最大token数', example: 1000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ChatDto.prototype, "max_tokens", void 0);
class GenerateQuestionsDto {
    title;
    description;
    scenarioType;
    budget;
    duration;
    preferences;
}
exports.GenerateQuestionsDto = GenerateQuestionsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '活动主题', example: '和朋友一起去北京玩' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateQuestionsDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '活动描述', example: '一共5个人，准备玩3天' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateQuestionsDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '场景类型',
        enum: ['friends', 'family', 'couples', 'team'],
        example: 'friends'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['friends', 'family', 'couples', 'team']),
    __metadata("design:type", String)
], GenerateQuestionsDto.prototype, "scenarioType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '预算范围', example: [1000, 3000] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GenerateQuestionsDto.prototype, "budget", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '活动时长', example: '3天' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateQuestionsDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '偏好选择', example: ['旅游', '美食'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GenerateQuestionsDto.prototype, "preferences", void 0);
//# sourceMappingURL=ai.dto.js.map