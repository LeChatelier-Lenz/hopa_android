# Hopa - AI驱动的共识征程游戏

## 🎯 产品定位

Hopa是一款创新的AI驱动共识达成工具，通过游戏化的方式帮助不同群体（朋友、家庭、团队、情侣等）在决策过程中达成共识。产品结合了移动端游戏体验和人工智能技术，将传统的讨论和决策过程转化为有趣的RPG冒险。

## 🚀 核心特性

### 1. 多场景适配
- **朋友聚会**: 旅行规划、聚会安排、娱乐选择
- **家庭活动**: 度假决策、聚餐安排、教育选择
- **情侣约会**: 约会规划、关系决策、未来规划
- **团队协作**: 项目决策、团建活动、工作安排
- **个人规划**: 生活决策、目标设定、习惯养成

### 2. AI智能系统
- **智能场景识别**: 自动识别用户输入的场景类型并生成对应策略
- **动态背景生成**: 基于用户共识目标使用Doubao AI生成个性化游戏背景
- **智能问题生成**: 使用Kimi K2大模型生成针对性的共识问题
- **个性化推荐**: 结合用户历史和偏好提供决策建议

### 3. 游戏化体验
- **RPG战斗系统**: 将分歧转化为可战胜的"怪物"
- **动态战斗机制**: 根据AI题目数量自动调整怪物血量
- **角色创建系统**: 个性化角色定制和装备选择
- **智能装备映射**: 预算护符、时间罗盘、景点护盾、美食宝石等
- **共识卡片系统**: 实时展示达成的共识结果
- **移动端优化**: 高DPI渲染、全屏游戏体验、直接选择交互

## 🎮 技术架构

### 前端技术栈
- **React 19** + TypeScript
- **Ionic Framework** - 移动端UI组件
- **Phaser.js 3.90.0** - 游戏引擎
- **Material-UI** - 界面组件库
- **Vite** - 构建工具

### 后端技术栈
- **NestJS** + TypeScript
- **Prisma ORM** + PostgreSQL (Supabase)
- **JWT认证** + bcrypt加密
- **Swagger API文档**

### AI集成
- **Doubao API**: 文生图模型，通过后端代理调用
- **Kimi K2 API**: 大语言模型，支持冲突预测和问题生成
- **智能Prompt管理**: 针对不同场景优化的提示词系统

### 项目结构
```
├── src/                 # 前端源码
│   ├── components/      # React组件
│   │   └── game/       # Phaser游戏组件
│   │       ├── scenes/ # 游戏场景
│   │       │   ├── LoadingScene.ts   # 加载场景
│   │       │   ├── BattleScene.ts    # 战斗场景
│   │       │   └── VictoryScene.ts   # 胜利场景
│   │       └── entities/             # 游戏实体
│   ├── assets/game/     # 游戏资源
│   │   ├── monsters/    # 怪物图片(monster1-5)
│   │   └── characters/  # 角色图片(cha1-4)
│   ├── utils/           # 工具函数
│   │   ├── doubaoApi.ts # AI图片生成
│   │   └── kimiApi.ts   # AI文本生成
│   └── prompts/         # AI提示词管理
└── backend/             # 后端源码
    ├── src/
    │   ├── ai/          # AI代理服务
    │   ├── auth/        # 认证系统
    │   ├── user/        # 用户管理
    │   └── prisma/      # 数据库
    └── prisma/          # 数据库模型
```

## 🎨 AI提示词系统

### 智能场景匹配
系统能够根据用户输入的关键词智能识别场景类型：

```typescript
// 场景类型识别
- friends: 朋友、兄弟、哥们、同学
- family: 家庭、家人、父母、孩子
- couples: 情侣、男朋友、女朋友、约会
- team: 团队、同事、工作、公司
```

### 动态背景生成
基于场景类型和用户输入生成个性化游戏背景：

```typescript
// 背景参数
- scenarioType: 场景类型
- mood: 氛围（浪漫、冒险、宁静等）
- timeOfDay: 时间（morning、afternoon、evening、night）
- location: 地点（indoor、outdoor、urban、nature、travel）
```

## 🛠 开发指南

### 环境配置

#### 后端环境变量 (backend/.env)
```bash
# 数据库配置
DATABASE_URL=postgresql://postgres:password@host:5432/database

# AI API配置 (后端管理，前端无需配置)
DOUBAO_API_KEY=your_doubao_api_key
DOUBAO_API_URL=https://ark.cn-beijing.volces.com/api/v3/images/generations
KIMI_API_KEY=your_kimi_api_key
KIMI_API_URL=https://api.moonshot.cn/v1/chat/completions

# JWT认证
JWT_SECRET=your_jwt_secret

# Supabase配置
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 开发命令
```bash
# 前端开发
npm install
npm run dev

# 后端开发
cd backend
npm install
npm run start:dev

# 数据库迁移
cd backend
npx prisma migrate dev
npx prisma generate

# 构建生产版本
npm run build
cd backend && npm run build
```

### 游戏开发流程
1. **场景设计**: 在 `src/components/game/scenes/` 中创建新场景
2. **AI集成**: 通过后端API调用AI服务，无需前端配置API密钥
3. **资源管理**: 
   - 怪物图片: `src/assets/game/monsters/monster1-5.(png|jpg)`
   - 角色图片: `src/assets/game/characters/cha1-4.jpg`
4. **API开发**: 在 `backend/src/` 中扩展API功能

## 🎯 产品愿景

### 短期目标 (1-3个月)
- [x] 完成基础游戏框架搭建
- [x] 集成AI背景生成功能
- [x] 实现多场景智能识别
- [x] 构建后端API系统
- [x] 重构游戏加载和战斗界面
- [ ] 完善冲突预测算法
- [ ] 优化游戏平衡性

### 中期目标 (3-6个月)
- [ ] 添加更多AI功能（怪物生成、装备推荐）
- [ ] 实现用户数据分析和个性化推荐
- [ ] 增加社交分享功能
- [ ] 支持团队协作模式

### 长期愿景 (6-12个月)
- [ ] 构建AI驱动的完整决策支持系统
- [ ] 集成更多生活场景（购房、职业选择等）
- [ ] 开发企业级团队决策工具
- [ ] 建立用户社区和经验分享平台

## 🔧 技术特性

### CORS解决方案
使用Vite代理配置解决跨域问题：
```typescript
// vite.config.ts
server: {
  proxy: {
    '/api/doubao': { target: 'https://ark.cn-beijing.volces.com' },
    '/api/kimi': { target: 'https://api.moonshot.cn' }
  }
}
```

### 智能提示词管理
- 场景类型自动识别
- 动态参数生成
- 预设模板库
- 智能匹配算法

### 游戏状态管理
- React状态管理
- Phaser场景间数据传递
- 本地存储持久化
- 实时状态同步

## 📈 性能指标

### AI响应时间
- Kimi API: ~1-3秒
- Doubao API: ~3-5秒
- 背景生成: ~5-8秒

### 游戏性能
- 启动时间: <2秒
- 场景切换: <1秒
- 内存使用: <100MB
- 支持设备: iOS/Android

## 🎪 用户体验流程

1. **目标设定**: 用户输入共识目标和描述
2. **AI分析**: 系统智能识别场景类型并生成背景
3. **角色创建**: 个性化角色定制
4. **地图探索**: 可视化决策路径
5. **战斗挑战**: 通过回答问题击败分歧怪物
6. **共识达成**: 获得最终决策结果和奖励

## 🆕 最新更新 (2025-08)

### 游戏体验优化
- **✅ CORS问题解决**: 实现后端图片代理，完全解决AI背景图加载跨域问题
- **✅ AI背景优化**: 强化背景生成prompt，避免手机框架和UI元素干扰
- **✅ 界面布局调整**: 角色和题目位置上移，增大游戏元素尺寸，提升移动端体验
- **✅ 交互流程简化**: 移除确认按钮，实现直接点击选择，提高操作效率
- **✅ 装备系统完善**: 优化装备图片映射，四叶草护符、魔法棒罗盘、宝石护盾、戒指宝石

### 战斗系统增强
- **✅ 动态血量机制**: 怪物血量根据AI生成题目数量自动调整(每题60血量，最少300)
- **✅ AI题目整合**: 优先使用Kimi生成的冲突问题，备用本地题库
- **✅ 共识追踪**: 实时记录玩家选择和一致性，生成详细共识报告

### 胜利界面升级
- **✅ 共识卡片重设计**: 响应式卡片界面，显示实际游戏共识结果
- **✅ 成果可视化**: 动态展示每个决策的一致性和类别图标
- **✅ 成就评级系统**: 根据共识质量显示不同等级成就(完美/优秀/良好)

### 技术架构改进
- **✅ 高DPI支持**: WebGL渲染优化，设备像素比例适配
- **✅ 全屏游戏体验**: 固定定位布局，消除边界空白
- **✅ 数据流优化**: LoadingScene → BattleScene → VictoryScene 完整数据传递

## 🔮 未来功能规划

### AI功能扩展
- **智能怪物生成**: 根据用户矛盾点生成个性化挑战
- **装备推荐系统**: AI推荐最适合的决策工具
- **情感分析**: 分析用户情绪状态并调整游戏策略
- **历史学习**: 从用户过往决策中学习偏好模式

### 游戏机制创新
- **多人实时对战**: 支持多人同时参与决策
- **季节性活动**: 根据真实时间推出特别挑战
- **成就系统**: 完整的游戏成就和等级系统
- **自定义模式**: 用户可创建自己的决策模板

## 📝 贡献指南

### 代码风格
- 使用TypeScript严格模式
- 遵循React Hooks最佳实践
- 保持组件单一职责
- 添加必要的注释和文档

### 提交规范
```bash
feat: 添加新功能
fix: 修复bug
docs: 更新文档
style: 代码格式调整
refactor: 代码重构
test: 添加测试
```

---

*Hopa - 让决策成为一场有趣的冒险！* 🎮✨