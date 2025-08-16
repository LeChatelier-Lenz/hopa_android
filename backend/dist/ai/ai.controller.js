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
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const doubao_service_1 = require("./doubao.service");
const kimi_service_1 = require("./kimi.service");
const ai_dto_1 = require("./dto/ai.dto");
let AiController = class AiController {
    doubaoService;
    kimiService;
    constructor(doubaoService, kimiService) {
        this.doubaoService = doubaoService;
        this.kimiService = kimiService;
    }
    async generateImage(generateImageDto) {
        const imageUrl = await this.doubaoService.generateImage(generateImageDto.prompt, {
            size: generateImageDto.size,
            guidance_scale: generateImageDto.guidance_scale,
            watermark: generateImageDto.watermark,
            response_format: generateImageDto.response_format,
        });
        return {
            success: true,
            imageUrl,
            message: '图片生成成功',
        };
    }
    async generateGameBackground(dto) {
        const imageUrl = await this.doubaoService.generateGameBackground({
            title: dto.title,
            description: dto.description,
            theme: dto.theme,
        });
        return {
            success: true,
            imageUrl,
            message: '游戏背景生成成功',
        };
    }
    async chat(chatDto) {
        const response = await this.kimiService.chat(chatDto.messages, {
            temperature: chatDto.temperature,
            max_tokens: chatDto.max_tokens,
        });
        return {
            success: true,
            response,
            message: '对话成功',
        };
    }
    async generateQuestions(dto) {
        const questions = await this.kimiService.generateConsensusQuestions({
            title: dto.title,
            description: dto.description,
            scenarioType: dto.scenarioType,
            budget: dto.budget,
            duration: dto.duration,
            preferences: dto.preferences,
        });
        return {
            success: true,
            questions,
            message: '共识问题生成成功',
        };
    }
    async proxyDoubao(body) {
        const response = await fetch(this.doubaoService['apiUrl'], {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.doubaoService['apiKey']}`,
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        return data;
    }
    async proxyKimi(body) {
        const response = await fetch(this.kimiService['apiUrl'], {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.kimiService['apiKey']}`,
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        return data;
    }
};
exports.AiController = AiController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Doubao文生图' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '图片生成成功' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'API请求失败' }),
    (0, common_1.Post)('doubao/generate-image'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_dto_1.GenerateImageDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateImage", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '生成游戏背景图' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '背景图生成成功' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'API请求失败' }),
    (0, common_1.Post)('doubao/generate-background'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_dto_1.GenerateGameBackgroundDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateGameBackground", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Kimi聊天对话' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '对话成功' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'API请求失败' }),
    (0, common_1.Post)('kimi/chat'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_dto_1.ChatDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "chat", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '生成共识问题' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '问题生成成功' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'API请求失败' }),
    (0, common_1.Post)('kimi/generate-questions'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_dto_1.GenerateQuestionsDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateQuestions", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '前端AI代理 - Doubao' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'API代理成功' }),
    (0, common_1.Post)('proxy/doubao'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "proxyDoubao", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '前端AI代理 - Kimi' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'API代理成功' }),
    (0, common_1.Post)('proxy/kimi'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "proxyKimi", null);
exports.AiController = AiController = __decorate([
    (0, swagger_1.ApiTags)('AI服务'),
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [doubao_service_1.DoubaoService,
        kimi_service_1.KimiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map