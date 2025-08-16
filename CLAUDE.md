# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**合拍 Hopa** – 让计划一拍即合的游戏化 AI 共识工具

### Product Description
Hopa is a gamified AI-powered relationship consensus tool that transforms conflict resolution into a collaborative RPG-style adventure. Users create virtual characters, equip preference items, and cooperatively battle "disagreement monsters" to reach mutually satisfactory solutions.

### Core Features
- **Character Creation & Customization**: Users create personalized game avatars and select preference equipment (Budget Amulet, Time Compass, Priority Shield, etc.)
- **AI Monster Generation**: System analyzes conflicts and generates themed "disagreement monsters" (Budget Beast, Time Dragon, Priority Spider, Taste Goblin)
- **Cooperative Battle System**: Interactive Q&A combat where both parties answer questions to attack monsters together
- **Consensus Treasure Chest**: Defeated monsters drop treasure chests containing shareable consensus cards and calendar-ready plans
- **Gamified Conflict Resolution**: Transform potentially emotional negotiations into fun cooperative gameplay

### Typical Use Case
A couple planning a vacation disagrees on destination, budget, and schedule. Each person creates a game character and selects equipment like "Budget Amulet" (sets spending limit) and "Adventure Compass" (preferred activities). AI generates monsters representing their conflicts: "Budget Beast" and "Schedule Dragon". Through cooperative combat - answering AI questions about preferences and compromises - they defeat the monsters together. Victory rewards them with a treasure chest containing a beautiful consensus card and a ready-to-use travel itinerary.

### Technical Foundation
Ionic React application targeting Android via Capacitor, built with React 19, TypeScript, and Vite. Features gamified RPG-style interface with collaborative battle mechanics, designed for warm and ritualistic intimate relationship experiences. Core game mechanics powered by Phaser.js for battle scenes and interactive elements.

## Common Development Commands

### Web Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the web app (TypeScript compilation + Vite build)
- `npm run preview` - Preview the built app locally

### Testing
- `npm run test.unit` - Run unit tests with Vitest
- `npm run test.e2e` - Run end-to-end tests with Cypress
- `npm run lint` - Run ESLint for code quality

### Ionic/Capacitor Commands (requires @ionic/cli globally installed)
- `ionic serve` - Alternative development server
- `ionic build` - Build for production
- `ionic cap add android` - Add Android platform (first time setup)
- `ionic cap copy` - Copy web assets to native project after build
- `ionic cap sync` - Sync native project with web changes and plugin updates
- `ionic cap open android` - Open Android project in Android Studio
- `ionic cap run android --open -l --external` - Live reload on Android device/emulator

### Android Development Prerequisites
- Android Studio with necessary SDKs and emulator
- Add Android SDK emulator path to system PATH environment variable

## Architecture

### Current Tech Stack
- **Frontend**: React 19 + TypeScript 5.1.6
- **Build Tool**: Vite 5.2.0
- **Mobile Framework**: Ionic React 8.5.0 + Capacitor 7.4.2
- **UI Libraries**: Material-UI 7.3.1 (current), Ionicons 7.4.0
- **Game Engine**: Phaser.js 3.70+ (for battle scenes and interactive gameplay)
- **Routing**: React Router 5.3.4 with Ionic React Router
- **Data Storage**: localStorage (character persistence, game progress)
- **Testing**: Vitest (unit), Cypress (e2e)
- **Linting**: ESLint 9 with TypeScript ESLint

### Recommended UI Stack for "Warm & Ritualistic" Design

#### Core UI Framework
- **Ionic UI** (https://ionicframework.com/docs/components)
  - Seamlessly integrates with Capacitor
  - Excellent mobile performance with built-in animations
  - Use for: buttons, forms, navigation, cards

#### Advanced UI Components
- **Chakra UI** (https://chakra-ui.com)
  - Gentle design philosophy, strong semantic components
  - Excellent dark mode and responsive support
  - Use for: forms, multi-step dialogues, layout alignment, theming

#### Animation & Motion
- **Framer Motion** (https://www.framer.com/motion/)
  - Smooth transitions, simple API calls
  - Perfect for gamified page interactions
  - Use for: page transitions, card flips, character equipment animations

#### Game Engine & Interactive Animations
- **Phaser.js** (https://phaser.io)
  - HTML5 game framework perfect for battle scenes and interactive elements
  - Built-in physics, animation systems, and audio support
  - Use for: battle scenes, character combat animations, monster AI, hit effects

#### Rich Animations
- **Lottie + LottieFiles** (https://lottiefiles.com)
  - Ready-made illustrations and animations for React
  - Use for: treasure chest opening, victory celebrations, character creation effects

#### Style Customization
- **Tailwind CSS** (https://tailwindcss.com)
  - Controllable styling, quick color/border-radius/spacing adjustments
  - Use for: fine-tuning details with Chakra or Ionic

#### Recommended Architecture
- **Ionic UI**: Mobile foundation (navigation, basic components)
- **Chakra UI**: Advanced components (forms, dialogs, character customization)
- **Phaser.js**: Game scenes (battle interface, character interactions, monster combat)
- **Tailwind CSS**: Detail polishing
- **Framer Motion + Lottie**: Animations and micro-interactions
- Result: Fast development combining warm relationship feel with engaging RPG gameplay

### Project Structure
```
src/
├── pages/              # Main application pages
│   ├── home.tsx        # 首页 (Home) - Main entry point, consensus initiation
│   ├── group.tsx       # 共识圈子 (Consensus Creation) - Character creation, room management
│   ├── message.tsx     # 消息 (Messages) - Communication & consensus history
│   └── mine.tsx        # 个人主页 (Profile) - User settings & consensus card collection
├── components/         # Reusable components
│   ├── game/          # Phaser.js game components (planned)
│   │   ├── BattleScene.tsx    # Main battle interface
│   │   ├── Character.tsx      # Character creation & customization
│   │   ├── Equipment.tsx      # Preference equipment system
│   │   └── Monster.tsx        # AI-generated conflict monsters
│   ├── consensus/      # Consensus flow components (planned)
│   │   ├── QuestionCard.tsx   # Interactive Q&A combat
│   │   ├── TreasureChest.tsx  # Victory rewards system
│   │   └── ProgressBar.tsx    # Battle progress & cooperation meter
│   ├── cards/         # Consensus card components (planned)
│   └── animations/    # Lottie/Framer Motion components (planned)
├── theme/             # Ionic theme customization
├── hooks/             # Custom React hooks (planned)
├── services/          # AI API integration (planned)
│   ├── aiService.ts   # AI monster generation & battle logic
│   └── gameService.ts # Game state management
└── App.tsx            # Main app with tab-based navigation

android/               # Native Android project
dist/                  # Build output (webDir in Capacitor config)
```

### Key Architecture Patterns
- **Tab-based Navigation**: Uses Ionic's IonTabs with bottom tab bar
- **Page Structure**: Each page follows Ionic's IonPage > IonHeader/IonContent pattern
- **Icon Strategy**: Material-UI icons preferred over Ionicons for tab navigation
- **Styling**: Mix of Ionic CSS utilities and custom CSS files
- **Dark Mode**: System-based dark mode support enabled

### Development Workflow
1. Make web changes in `src/`
2. Test with `npm run dev` or `ionic serve`
3. Build with `npm run build` when ready
4. Copy changes to native project with `ionic cap copy`
5. Test on Android with `ionic cap run android --open -l --external`

### Important Files
- `capacitor.config.ts` - Capacitor configuration (appId: io.ionic.starter, webDir: dist)
- `ionic.config.json` - Ionic project configuration
- `vite.config.ts` - Vite build configuration with Vitest setup
- `eslint.config.js` - ESLint configuration with React and TypeScript rules

### Code Conventions
- Use functional React components with TypeScript
- Follow Ionic page structure patterns
- **UI Component Priority**: Ionic UI (foundation) → Chakra UI (advanced) → Phaser.js (game) → Tailwind (details)
- **Animation Approach**: Phaser.js for battle animations, Framer Motion for transitions, Lottie for celebrations
- **Design Principles**: Warm, gentle, ritualistic feel with engaging RPG gameplay elements
- CSS files co-located with components
- Chinese text for user-facing labels
- Semantic component naming for game flow (e.g., BattleScene, TreasureChest, CharacterEquipment, ConflictMonster)

### Development Priorities
1. ✅ **Room Management**: Multi-user session handling, invitation system, real-time chat, resizable interface
   - ✅ Real-time chat with auto-scroll and system notifications
   - ✅ Member grid layout with status indicators (online/offline/ready/invited)
   - ✅ Dual-mode invitation (link sharing + friend invitation)
   - ✅ Resizable chat area with drag handle
   - ✅ Ready state logic: all online members must be ready to start
2. 🚧 **Character Creation System**: Avatar customization and preference equipment selection (next)
3. 🚧 **Battle Scene Implementation**: Phaser.js-powered cooperative combat interface (next)
4. **AI Monster Generation**: Backend system for creating conflict-themed creatures
5. **Interactive Combat Q&A**: Question-based battle mechanics with real-time cooperation scoring
6. **Treasure Chest & Rewards**: Victory celebration system with consensus cards and calendar integration

### UI/UX Guidelines
- **Emotional Safety Through Gamification**: Transform conflicts into collaborative adventures to reduce confrontation
- **Cooperative RPG Aesthetics**: Use warm colors, gentle transitions, and RPG-style visual elements (health bars, equipment icons, treasure chests)
- **Celebration-Focused Interactions**: Emphasize victory animations, treasure discoveries, and achievement unlocks
- **Social Gaming Design**: Optimize for multiple users interacting with the same device or sharing screens
- **Accessibility Across Relationship Types**: Ensure game mechanics work equally well for couples, friends, family members, and colleagues

## 🎮 西湖约会主题游戏设计

### 角色装备系统
- 🧿 **预算护符**: 设定消费上限 (50-500元档位)
- 🧭 **时间指南针**: 游玩时长偏好 (半天/全天/过夜)
- 🛡️ **景点盾牌**: 景点偏好排序 (雷峰塔、苏堤、断桥残雪)
- 🍜 **美食宝珠**: 餐饮偏好 (杭帮菜、网红店、特色小吃)

### 分歧怪物设计
**怪物生成逻辑**: 根据情侣装备差异自动生成对应主题怪物

- 🦁 **预算狮王**: 触发于预算护符设置差异过大，金色狮子+金币雨攻击
- 🐉 **时间安排龙**: 触发于时间指南针冲突，蓝色时间龙+时间漩涡攻击
- 🕷️ **景点选择蛛**: 触发于景点盾牌优先级差异，彩色蜘蛛+网络陷阱
- 👹 **美食口味鬼**: 触发于美食宝珠选择不同，可爱食物造型+食物投掷

### 战斗场景设计
- **背景**: 西湖美景 (雷峰塔、断桥、苏堤等地标)
- **角色站位**: 情侣角色站在右侧，面向左侧怪物
- **攻击机制**: 问答式合作战斗，一致性越高伤害越大
- **胜利奖励**: 西湖约会计划卡 + 个性化推荐路线

### 游戏流程设计
1. **角色创建+装备**: 统一页面完成角色设定和装备选择
2. **冲突分析**: 根据装备差异生成对应怪物
3. **合作战斗**: Phaser.js渲染战斗场景，问答式攻击机制
4. **胜利奖励**: 宝箱开启动画+共识卡片生成+实用计划输出