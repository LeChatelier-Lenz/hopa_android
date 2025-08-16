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
exports.DoubaoService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let DoubaoService = class DoubaoService {
    configService;
    apiKey;
    apiUrl;
    constructor(configService) {
        this.configService = configService;
        this.apiKey = configService.get('DOUBAO_API_KEY') || '';
        this.apiUrl = configService.get('DOUBAO_API_URL') || '';
        if (!this.apiKey || !this.apiUrl) {
            throw new Error('Doubao API配置缺失');
        }
    }
    async generateImage(prompt, options) {
        const requestBody = {
            model: 'doubao-seedream-3-0-t2i-250415',
            prompt,
            response_format: options?.response_format || 'url',
            size: options?.size || '1080x1920',
            guidance_scale: options?.guidance_scale || 3,
            watermark: options?.watermark || true,
            n: 1,
        };
        try {
            const startTime = Date.now();
            console.log('🎨 发送Doubao文生图请求:', requestBody);
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify(requestBody),
            });
            const endTime = Date.now();
            const duration = endTime - startTime;
            if (!response.ok) {
                const errorText = await response.text();
                throw new common_1.HttpException(`Doubao API错误: ${response.status} ${response.statusText}\n${errorText}`, common_1.HttpStatus.BAD_REQUEST);
            }
            const data = await response.json();
            console.log(`✅ Doubao API响应成功 (用时: ${duration}ms):`, data);
            if (!data.data || data.data.length === 0) {
                throw new common_1.HttpException('Doubao API返回空响应', common_1.HttpStatus.BAD_REQUEST);
            }
            const imageUrl = data.data[0].url;
            if (!imageUrl) {
                throw new common_1.HttpException('Doubao API未返回图片URL', common_1.HttpStatus.BAD_REQUEST);
            }
            return imageUrl;
        }
        catch (error) {
            console.error('❌ Doubao API请求失败:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Doubao API请求失败', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async generateGameBackground(scenario) {
        const basePrompt = `
创建一个适合共识游戏的背景图，垂直构图(9:16比例)，适合手机游戏界面。

共识主题: ${scenario.title}
场景描述: ${scenario.description}
${scenario.theme ? `主题风格: ${scenario.theme}` : ''}

视觉要求:
- 温馨友好，色彩柔和
- 自然光照
- 适合活动的场景
- 画面构图适合竖屏显示，上部留白区域用于放置游戏UI
- 中部和下部为主要视觉内容
- 不要出现具体的人物或文字

技术规格:
- 尺寸: 1080x1920像素 (9:16比例)
- 风格: 插画风格或水彩画风格
- 分辨率: 高清
- 色彩: 色彩丰富但不过于饱和
- 构图: 层次分明，适合游戏界面叠加

艺术风格: 现代插画，温馨治愈系，适合移动端游戏
`.trim();
        return await this.generateImage(basePrompt, {
            size: '1080x1920',
            guidance_scale: 4,
            watermark: false,
        });
    }
};
exports.DoubaoService = DoubaoService;
exports.DoubaoService = DoubaoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DoubaoService);
//# sourceMappingURL=doubao.service.js.map