"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const hostIP = process.env.HOST_IP || '10.162.149.24';
    app.enableCors({
        origin: [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:8100',
            'http://localhost:3000',
            `http://${hostIP}:5173`,
            `http://${hostIP}:5174`,
            `http://${hostIP}:8100`,
            'capacitor://localhost',
            'ionic://localhost',
            'https://your-frontend-domain.com',
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Hopa 后端API')
        .setDescription('Hopa共识游戏后端服务API文档')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('认证', '用户认证相关接口')
        .addTag('AI服务', 'AI代理和生成服务')
        .addTag('用户管理', '用户信息管理')
        .addTag('房间管理', '游戏房间管理')
        .addTag('文件上传', '文件存储服务')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`🚀 后端服务启动成功！`);
    console.log(`📖 API文档地址: http://localhost:${port}/api-docs`);
    console.log(`🔗 服务地址: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map