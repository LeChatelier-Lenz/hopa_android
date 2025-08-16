#!/usr/bin/env node

// 测试Doubao文生图API连接的脚本
import { config } from 'dotenv';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 加载环境变量
config({ path: join(__dirname, '../.env') });

const DOUBAO_API_KEY = process.env.VITE_DOUBAO_API_KEY;
const DOUBAO_API_URL = process.env.VITE_DOUBAO_API_URL || 'https://ark.cn-beijing.volces.com/api/v3/images/generations';

console.log('🔍 检查Doubao环境变量...');
console.log('API Key:', DOUBAO_API_KEY ? `${DOUBAO_API_KEY.slice(0, 8)}...` : '❌ 未设置');
console.log('API URL:', DOUBAO_API_URL);

if (!DOUBAO_API_KEY) {
  console.error('❌ 环境变量 VITE_DOUBAO_API_KEY 未设置');
  process.exit(1);
}

// 测试生成游戏背景的功能
async function testGameBackground() {
  console.log('\n🎮 测试生成游戏背景功能...');
  
  const requestBody = {
    model: 'doubao-seedream-3-0-t2i-250415',
    prompt: `
创建一个温馨浪漫的约会场景背景图，垂直构图(9:16比例)，适合手机游戏界面。

共识主题: 周末看电影约会
场景描述: 我们想要一起看一部浪漫电影，然后在附近的咖啡厅聊天
主题风格: 现代都市

要求:
- 温暖的色调，营造亲密感
- 适合情侣约会的氛围
- 画面层次丰富，上部分留白适合放置UI元素
- 风格偏向插画或水彩画
- 不要出现具体的人物
- 画面构图适合竖屏显示

风格: 插画风格，温馨浪漫，色彩柔和
`.trim(),
    response_format: 'url',
    size: '1080x1920',
    guidance_scale: 4,
    watermark: false
  };

  const startTime = Date.now();

  try {
    const response = await fetch(DOUBAO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DOUBAO_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 游戏背景生成失败:', errorText);
      return;
    }

    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      const imageUrl = data.data[0].url;
      console.log('✅ 游戏背景生成成功！');
      console.log('🖼️  背景图URL:', imageUrl);
      console.log(`⏱️  生成时间: ${duration}ms`);
      console.log('💡 这张图片可用作游戏背景，尺寸: 1080x1920 (适合竖屏手机)');
    }

  } catch (error) {
    console.error('❌ 游戏背景生成失败:', error.message);
  }
}

// 运行测试
console.log('🚀 开始Doubao API全面测试...\n');

testGameBackground()