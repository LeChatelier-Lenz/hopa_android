import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局验证管道
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // CORS配置
  app.enableCors({
    origin: [
      'http://localhost:5173', // Vite开发服务器
      'http://localhost:3000', // 其他本地开发端口
      'https://your-frontend-domain.com', // 生产环境域名
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Swagger API文档配置
  const config = new DocumentBuilder()
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

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  console.log(`🚀 后端服务启动成功！`);
  console.log(`📖 API文档地址: http://localhost:${port}/api-docs`);
  console.log(`🔗 服务地址: http://localhost:${port}`);
}
bootstrap();
