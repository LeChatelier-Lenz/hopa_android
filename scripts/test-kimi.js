#!/usr/bin/env node

// 测试Kimi API连接的脚本
import { config } from 'dotenv';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 加载环境变量
config({ path: join(__dirname, '../.env') });

const KIMI_API_KEY = process.env.VITE_KIMI_API_KEY;
const KIMI_API_URL = process.env.VITE_KIMI_API_URL || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

console.log('🔍 检查环境变量...');
console.log('API Key:', KIMI_API_KEY ? `${KIMI_API_KEY.slice(0, 8)}...` : '❌ 未设置');
console.log('API URL:', KIMI_API_URL);

if (!KIMI_API_KEY) {
  console.error('❌ 环境变量 VITE_KIMI_API_KEY 未设置');
  process.exit(1);
}

async function testKimiAPI() {
  const requestBody = {
    model: 'kimi-k2-250711',
    messages: [
      { role: 'system', content: '你是人工智能助手.' },
      { role: 'user', content: '你好，请简单回复确认连接成功' }
    ]
  };

  console.log('\n🚀 开始测试Kimi API连接...');
  console.log('请求体:', JSON.stringify(requestBody, null, 2));
  
  const startTime = Date.now();

  try {
    const response = await fetch(KIMI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIMI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`\n📊 响应状态: ${response.status} ${response.statusText}`);
    console.log(`⏱️  响应时间: ${duration}ms`);

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('❌ API请求失败:');
      console.error('响应内容:', responseText);
      return;
    }

    try {
      const data = JSON.parse(responseText);
      console.log('\n✅ API连接成功！');
      console.log('📝 AI回复:', data.choices[0]?.message?.content);
      console.log('📈 Token使用情况:', data.usage);
      console.log(`🎯 总响应时间: ${duration}ms`);
    } catch (parseError) {
      console.error('❌ 解析响应JSON失败:', parseError);
      console.error('原始响应:', responseText);
    }

  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.error('❌ 网络请求失败:');
    console.error('错误:', error.message);
    console.error(`⏱️  失败用时: ${duration}ms`);
  }
}

// 运行测试
testKimiAPI().catch(console.error);