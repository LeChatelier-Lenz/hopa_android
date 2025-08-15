# Hopa - Ionic React Android App

> 基于 Ionic React 框架的移动应用，使用 Capacitor 实现跨平台 Android 开发

## 项目概述

**合拍 Hopa** – 让计划一拍即合的游戏化 AI 共识工具

### 产品定位
Hopa 是一款游戏化的 AI 关系共识工具，将冲突解决转变为合作式 RPG 冒险。用户创建虚拟角色，装备偏好道具，并协作击败"分歧怪兽"来达成双方满意的解决方案。

### 典型场景
👫 情侣准备假期出游，却因为目的地、预算、时间安排等意见不合而争执。在 Hopa 中，每人创建一个游戏角色并选择装备（如"预算护符"设定消费上限，"冒险指南针"选择偏好活动）。AI 分析冲突生成怪物：「预算兽」和「时间安排龙」。通过合作战斗——回答 AI 关于偏好和妥协的问题——他们共同击败怪物。胜利后获得宝箱奖励，内含精美的共识卡片和可直接使用的旅行计划。

### 核心功能
- 🎮 **角色创建与装备系统**: 创建个性化游戏头像，选择偏好装备（预算护符、时间指南针、优先盾牌等）
- 👾 **AI 怪物生成**: 系统分析冲突并生成主题化"分歧怪兽"（预算兽、时间龙、优先级蜘蛛、口味哥布林）
- ⚔️ **合作战斗系统**: 互动问答式战斗，双方通过回答问题共同攻击怪物
- 🎁 **共识宝箱奖励**: 击败怪物后掉落宝箱，包含可分享的共识卡片和可添加到日历的计划

### 应用结构
- 🏠 **首页 (Home)** - 主入口，发起新的共识征程（输入核心目的）
- 🎯 **共识圈子 (Group)** - 角色创建、装备选择、房间管理、邀请链接生成
- 💬 **消息 (Message)** - 战斗历史、共识卡片记录、征程回顾  
- 👤 **个人主页 (Mine)** - 用户档案、角色管理、宝箱收藏

**游戏流程**:
1. **前置偏好**: 创建虚拟角色 + 选择偏好装备（预算护符、时间指南针等）
2. **关卡加载**: AI 生成分歧怪兽（预算兽、时间龙、优先级蜘蛛、口味哥布林）
3. **合作战斗**: 静态打怪界面，通过回答 AI 问题进行攻击，实时计算一致率
4. **宝箱奖励**: 击败怪物后开启共识宝箱，生成纪念卡片和计划表

**当前状态**: 项目已完成基础导航结构、页面骨架和发起共识功能，正在规划 Phaser.js 战斗场景实现。


## 最新功能更新

### 发起共识功能 (`/launch`)
- **共识目标设置**: 用户可输入共识标题和描述，支持文本和语音输入
- **文件上传**: 支持上传相关文件（图片、PDF、文档）作为共识背景资料
- **邀请系统**: 
  - 生成分享链接，支持微信、QQ、WhatsApp等平台分享
  - 邀请应用内好友，显示在线状态和邀请按钮
- **等待匹配**: 有趣的等待动画，模拟多人联机游戏的匹配过程
- **游戏入口**: 完成后显示"进入游戏"按钮，跳转到核心游戏功能

### 错误处理页面 (`/error`)
- 统一的错误页面处理，提供返回首页和刷新功能
- 美观的错误界面设计，符合应用整体风格
- 技术支持联系方式

### 游戏页面占位符 (`/game`)
- 为后续游戏功能开发预留的页面结构
- 包含返回功能和游戏说明

## 工具前提
- Android Studio

  - 包含必要的Sdk，比如自带的emulator

- ionic CLI

  > [如何安装 Ionic Framework CLI 来构建移动应用 | Ionic 中文网](https://ionic.nodejs.cn/intro/cli)

  - `npm install -g @ionic/cli`
  - 主要是capacitor


## 使用流程
### 浏览器运行

- 利用ionic构建app框架

  ```shell
  $ ionic start myApp blank --type=react --c
  $ cd myApp
  ```

- 运行`ionic serve` 或 `npm run dev` 进行浏览器开发调试



### 初次构建android app

- 构建Web应用

  ```bash
  $ npm run build  # 推荐：包含TypeScript检查
  # 或
  $ ionic build
  ```

  

- 然后创建android项目

  ```bash
  $ ionic cap add android
  ```

  - 每次执行更新你的 Web 目录的构建（例如 `ionic build`）时（默认：`build`)，你需要将这些更改复制到你的原生项目中：

    ```bash
    ionic cap copy
    ```

  - 注意：更新代码的原生部分（例如添加新插件）后，使用 `sync` 命令

    ```bash
    ionic cap sync
    ```



### 安卓配置

- 首先，运行 Capacitor `open` 命令，这会在 Android Studio 中打开原生 Android 项目

```bash
ionic cap open android
```

- 随后在Android Studio中，先选择右侧的Running Devices，这里我们一般启动自带的Medium Phone 36 API，在右侧会看到一个手机模拟器启动
- 然后点击运行按钮，编译运行成功后便可以在右侧模拟器中看到先前的web app的适应版



实际上，到这里为止，已经可以进行基于react的安卓app开发了


### 实时重载

> [通过实时重新加载进行快速应用开发 | Ionic 中文网](https://ionic.nodejs.cn/react/your-first-app/live-reload)
>
> [离子电容器运行 | Ionic 框架 --- ionic capacitor run | Ionic Framework](https://ionicframework.com/docs/cli/commands/capacitor-run)
>
> **完美解决方案参考**：[Capacitor项目Android/iOS实时重载功能的使用技巧 - GitCode博客](https://blog.gitcode.com/f0663aae3ad8fb25b9f08fc4d95ad101.html)



- 在原工作目录执行

  ```shell
  ionic cap run android --open -l --external  
  ```

  Live Reload 服务器将启动，并且选择的原生 IDE（如果尚未打开）将打开。在 IDE 中，单击“播放”按钮将应用启动到你的设备上

- **小问题1：No device or emulator【找不到设备或模拟器】**

  - 关键：emulator执行程序并没有自动写在系统变量当中，请你找到你存放Android Sdk中的emulator.exe的文件夹`XX/Android/Sdk/emulator`,并添加到系统Path变量当中。这样上面的指令才能自动找到已有的模拟器

- 小问题2：实时运行起来的模拟器无法访问重载服务器上的内容~~【待解决】~~【已解决】

  > 直接运行上面的指令，会启动最简化版本的emulator，存在各种配置问题，包括ADB、网络配置等等问题，但是按照以下的方式进行先open再livereload的操作，就可以依赖于Android Studio本身的内部配置，避免这些细碎的问题
  
  > 如果还是连不上，可能是VPN导致的连接问题



## 架构说明

### 详细项目结构

```
Hopa-android/
├── 📁 src/                           # React源代码
│   ├── 📄 App.tsx                   # 应用主入口，配置Tab导航
│   ├── 📄 main.tsx                  # React应用启动文件
│   ├── 📁 pages/                    # 四个主要页面
│   │   ├── 📄 home.tsx/.css        # 首页 (当前为空白模板)
│   │   ├── 📄 group.tsx/.css       # 共识圈子页面 (当前为空白模板)
│   │   ├── 📄 message.tsx/.css     # 消息页面 (当前为空白模板)
│   │   └── 📄 mine.tsx/.css        # 个人主页 (当前为空白模板)
│   ├── 📁 components/               # 可复用组件
│   │   └── 📄 ExploreContainer.tsx  # 占位组件 (开发阶段使用)
│   └── 📁 theme/                    # 主题样式配置
│       └── 📄 variables.css         # Ionic主题变量
│
├── 📁 android/                       # Android原生项目 (Capacitor生成)
│   ├── 📁 app/src/main/             # Android应用源码
│   │   ├── 📁 assets/               # Web构建产物 (自动同步)
│   │   ├── 📄 AndroidManifest.xml   # Android应用配置
│   │   └── 📁 java/io/ionic/starter/ # MainActivity入口
│   ├── 📄 build.gradle              # Android构建配置
│   └── 📄 gradlew                   # Gradle包装器
│
├── 📁 public/                        # 静态资源
│   ├── 📄 favicon.png               # 应用图标
│   └── 📄 manifest.json             # PWA配置
│
├── 📁 dist/                          # Vite构建输出 (Capacitor webDir)
├── 📁 cypress/                       # E2E测试
│   └── 📁 e2e/test.cy.ts           # 测试用例
│
├── 📄 capacitor.config.ts           # Capacitor配置 (appId: io.ionic.starter)
├── 📄 ionic.config.json             # Ionic项目配置
├── 📄 vite.config.ts                # Vite构建工具配置
├── 📄 package.json                  # 项目依赖和脚本
└── 📄 tsconfig.json                 # TypeScript配置
```

### 技术栈

#### 前端框架层
- **React 19.0.0**: 核心UI框架，采用函数式组件和Hooks
- **TypeScript 5.1.6**: 提供类型安全和更好的开发体验
- **Vite 5.2.0**: 现代化的构建工具，提供快速的开发服务器和构建优化

#### UI组件库
**现有技术栈**:
- **Ionic React 8.5.0**: 移动端UI组件库，提供原生级别的用户体验
- **Material-UI 7.3.1**: 辅助UI组件库，用于图标和高级组件
- **Ionicons 7.4.0**: Ionic官方图标库

#### 游戏引擎
- **Phaser.js** (推荐): HTML5 游戏框架，用于战斗场景和交互式游戏元素
  - 内置物理系统、动画系统和音频支持
  - 适合静态打怪界面、角色动画、击中特效

**推荐"温柔仪式感 + RPG"UI技术栈**:
- 📱 **Ionic UI**: 移动端基础架构 (导航、按钮、表单)
- 🎨 **Chakra UI**: 温柔设计、语义化组件 (角色定制、多步对话)
- 🎮 **Phaser.js**: 战斗场景 (角色战斗、怪物交互、血条系统)
- ✨ **Framer Motion**: 丝滑过渡动画 (页面切换、装备动画)
- 🎆 **Lottie**: 现成插画动效 (宝箱开启、胜利庆祝)
- 🎨 **Tailwind CSS**: 快速样式定制 (细节打磨)

#### 路由与导航
- **React Router 5.3.4**: 客户端路由管理
- **Ionic React Router**: Ionic集成的路由解决方案
- **底部Tab导航**: 使用Material-UI图标的四Tab设计

#### 测试框架
- **Vitest**: 单元测试 (`npm run test.unit`)
- **Cypress**: E2E测试 (`npm run test.e2e`)
- **ESLint**: 代码质量检查 (`npm run lint`)

#### 开发工具
- **Android Studio**: Android开发IDE
- **Capacitor 7.4.2**: 原生平台桥接
- **Live Reload**: 实时重载支持Android调试

## 常用开发命令

```bash
# 开发调试
npm run dev                              # 浏览器开发服务器
npm run build                            # 构建生产版本
npm run lint                             # 代码检查

# 测试
npm run test.unit                        # 单元测试
npm run test.e2e                         # E2E测试

# Android开发
npm run build                            # 1. 构建Web应用
ionic cap sync                           # 2. 同步到Android项目
ionic cap run android --open -l --external  # 3. Android实时重载
ionic cap open android                  # 打开Android Studio
```

## 当前开发状态

✅ **已完成**:
- 基础项目结构搭建
- 四个主要页面框架 (home/group/message/mine)
- 底部Tab导航配置 (使用Material-UI图标)
- Android平台集成
- 开发环境配置 (Vite + TypeScript + ESLint)
- 测试框架配置 (Vitest + Cypress)
- 游戏化产品架构设计

🚧 **开发中**:
- **角色创建系统**: 虚拟头像定制和偏好装备选择界面
- **战斗场景架构**: Phaser.js 游戏引擎集成规划
- **UI 游戏化改造**: RPG 风格的界面元素设计

📋 **待开发**:
- **Phaser.js 战斗场景**: 静态打怪界面实现（角色站位、怪物显示、攻击动画）
- **AI 怪物生成系统**: 后端 API 分析冲突并生成主题化怪兽
- **互动问答战斗**: Q&A 式攻击机制，实时一致率计算和合作buff系统
- **宝箱奖励系统**: 胜利后的开箱动画、共识卡片生成、日历集成
- **房间管理**: 多人会话、邀请链接、实时同步
- **庆祝动画**: Lottie 胜利特效、角色升级、成就解锁
- **情感化 RPG 体验**: 温柔的战斗美学、仪式感的界面过渡