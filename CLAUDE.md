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
│   │   ├── CharacterCreator.tsx     # 角色创建组件
│   │   ├── ConsensusResult.tsx      # 共识结果展示
│   │   └── game/                    # Phaser游戏组件
│   │       ├── PhaserGame.tsx       # 游戏主容器
│   │       ├── scenes/              # 游戏场景
│   │       │   ├── LoadingScene.ts  # 加载场景
│   │       │   ├── BattleScene.ts   # 战斗场景
│   │       │   └── VictoryScene.ts  # 胜利场景
│   │       └── entities/            # 游戏实体
│   │           ├── Character.ts     # 角色实体
│   │           └── Monster.ts       # 怪物实体
│   ├── pages/           # 页面组件
│   │   ├── launch.tsx               # 启动页面
│   │   ├── consensus-result.tsx     # 共识结果页面
│   │   └── game.tsx                 # 游戏页面
│   ├── assets/game/     # 游戏资源
│   │   ├── monsters/    # 怪物图片(monster1-5)
│   │   ├── characters/  # 角色图片(cha1-4)
│   │   ├── equipment/   # 装备图片
│   │   └── ui/          # UI素材
│   ├── utils/           # 工具函数
│   │   ├── doubaoApi.ts # AI图片生成
│   │   ├── kimiApi.ts   # AI文本生成
│   │   └── consensusApi.ts # 共识API
│   └── prompts/         # AI提示词管理
│       ├── backgrounds.ts  # 背景生成prompt
│       ├── conflicts.ts    # 冲突分析prompt
│       ├── consensusAI.ts  # 共识AI prompt
│       └── equipmentAI.ts  # 装备AI prompt
└── backend/             # 后端源码
    ├── src/
    │   ├── ai/          # AI代理服务
    │   │   ├── ai.controller.ts # AI API控制器
    │   │   ├── doubao.service.ts # Doubao AI服务
    │   │   └── kimi.service.ts   # Kimi AI服务
    │   ├── auth/        # JWT认证系统
    │   ├── user/        # 用户管理
    │   └── prisma/      # 数据库ORM
    └── prisma/          # 数据库模型定义
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

# ⚠️ 重要：每次修改前端代码后都要运行编译检查
npm run build
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

### 图片显示优化系统
解决了Phaser.js中图片缩放和显示的关键问题：

```typescript
// 正确使用setDisplaySize而非setScale
sprite.setDisplaySize(targetWidth, targetHeight); // ✅ 正确
sprite.setScale(1.0); // ❌ 会覆盖setDisplaySize效果

// VictoryScene.ts - 共识结果页面
avatar.setDisplaySize(40, 40);  // 角色图片40x40px
monsterSprite.setDisplaySize(30, 30); // 怪物图片30x30px

// BattleScene.ts - 战斗场景
charSprite.setDisplaySize(charSize, charSize); // 动态计算角色尺寸
```

### 智能提示词管理
- **场景类型自动识别**: 朋友、家庭、情侣、团队场景智能匹配
- **装备感知冲突检测**: 基于用户装备配置分析潜在分歧点
- **动态问题生成**: 根据冲突严重度(1-5级)调整问题难度
- **多模式切换**: 装备感知模式 vs 标准通用模式
- **预设模板库**: 覆盖旅行、聚餐、娱乐等主要决策场景

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

## 🆕 最新更新 (2025-08-18) - 增强AI系统与修复关键Bug

### 🧠 智能Prompt管理系统
- **✅ 前端Prompt迁移**: 将AI背景和问题生成的prompt从后端迁移到前端src/prompts目录
- **✅ 模块化Prompt结构**: 
  - `backgrounds.ts`: 智能背景生成，支持场景类型自动匹配
  - `conflicts.ts`: 复杂冲突检测和问题生成系统
  - `consensusAI.ts`: 共识达成AI助手
  - `equipmentAI.ts`: 装备冲突分析专家
  - `index.ts`: 统一prompt管理和优化工具
- **✅ 智能场景匹配**: 根据用户输入自动识别朋友、家庭、情侣、团队等场景类型

### ⚡ 装备感知AI系统
- **✅ 装备冲突检测**: 智能分析玩家装备配置中的潜在冲突点
  - 预算冲突检测: 自动计算预算范围交集，识别严重的预算分歧
  - 时间冲突分析: 检测half-day vs full-day等时间安排差异
  - 景点偏好冲突: 分析自然风光 vs 购物中心等偏好分歧
  - 美食偏好冲突: 识别街边小吃 vs 高档餐厅等消费习惯差异
- **✅ 动态装备构造**: 根据共识主题智能调整玩家装备配置
- **✅ 冲突严重度评分**: 1-5级冲突严重度，自动调整问题难度

### 🎯 精准问题生成
- **✅ 装备驱动问题**: 基于实际装备配置冲突生成针对性问题
- **✅ 上下文感知**: 问题内容直接关联玩家的预算、时间、偏好数据
- **✅ 智能模式切换**: 
  - 装备感知模式: 有装备数据时生成精准的冲突解决问题
  - 标准模式: 无装备数据时使用通用场景模板
- **✅ 增强提示词**: 专业的冲突解决专家角色设定，提供实用可操作的解决方案

### 🔧 关键Bug修复 - 图片缩放问题
- **✅ 战斗场景修复**: 解决点击角色装备详情后背景角色变大的问题
  - 问题根源: `setScale(1.0)`覆盖`setDisplaySize()`效果
  - 解决方案: 统一使用`setDisplaySize()`进行尺寸控制
  - 影响范围: `showEquipmentDetails()`、`closeEquipmentModal()`、鼠标悬停事件
- **✅ 胜利场景修复**: 解决共识结果页面图片显示异常问题
  - 移除冲突的卡片级别和精灵级别缩放动画
  - 角色图片固定40x40px，怪物图片固定30x30px
  - 字体大小优化，提升可读性(字体尺寸增加50%)
- **✅ 显示尺寸标准化**: 建立统一的图片尺寸管理机制
  - 角色图片: 战斗场景动态计算，胜利场景40px
  - 怪物图片: 战斗场景动态调整，胜利场景30px
  - 避免`setScale()`与`setDisplaySize()`混用

### 🗂️ 代码结构优化
- **✅ 移除弃用文件**: 清理不再使用的MapScene.ts相关代码
- **✅ TypeScript类型安全**: 完整的装备数据和冲突分析类型定义
- **✅ 错误容错机制**: 多层级fallback确保AI服务稳定性
- **✅ 智能日志系统**: 详细的装备分析、冲突检测和图片加载日志
- **✅ 测试用例验证**: 创建完整的测试场景验证冲突检测算法

## 🔮 未来功能规划

### 游戏体验增强
- [ ] 角色动画系统：添加角色战斗动画和技能特效
- [ ] 怪物AI升级：基于用户历史数据生成个性化怪物
- [ ] 成就系统：解锁徽章、称号和特殊装备
- [ ] 多人实时对战：支持4人以上团队决策模式

### AI智能化提升
- [ ] 情感分析集成：识别用户语气和情绪倾向
- [ ] 预测性建议：基于历史数据预测最佳决策路径
- [ ] 自然语言优化：支持语音输入和对话式交互
- [ ] 文化适配：针对不同地区用户的文化背景优化

### 数据分析与洞察
- [ ] 决策模式分析：生成用户群体决策习惯报告
- [ ] 共识效果追踪：长期跟踪决策执行情况
- [ ] 团队协作分析：识别团队动态和协作模式
- [ ] 个性化仪表盘：可视化展示个人决策数据


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