# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**合拍 Hopa** – 让计划一拍即合的 AI 共识工具

### Product Description
Hopa is an AI-powered relationship consensus tool that helps couples, friends, or family members quickly find mutually satisfactory solutions when facing disagreements about plans and decisions.

### Core Features
- **Emotion-Safe Consensus Dialogue**: Guide users to express needs structurally without direct confrontation
- **AI Draft Generation**: Intelligently analyze both parties' inputs to quickly generate plans that accommodate both needs
- **Gamified Conflict Resolution**: Use lightweight interactive mechanisms (spin wheels, cards, mini-games) to reduce emotional cost of compromise
- **Consensus Card Memory**: Record reached agreements as shareable visual cards with ceremonial feel

### Typical Use Case
A couple planning a vacation disagrees on destination, budget, and schedule. Hopa guides each person to fill in their desires ("want to take photos", "want to eat hotpot"). AI generates a draft plan considering both needs, then uses gamified interactions to resolve conflicts, finally creating a shareable "consensus card" to celebrate the agreement.

### Technical Foundation
Ionic React application targeting Android via Capacitor, built with React 19, TypeScript, and Vite, designed for warm and ritualistic intimate relationship experiences.

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
- **Routing**: React Router 5.3.4 with Ionic React Router
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
  - Use for: page transitions, card flips, spin wheel animations

#### Rich Animations
- **Lottie + LottieFiles** (https://lottiefiles.com)
  - Ready-made illustrations and animations for React
  - Use for: celebration animations when generating consensus cards, ritual feel

#### Style Customization
- **Tailwind CSS** (https://tailwindcss.com)
  - Controllable styling, quick color/border-radius/spacing adjustments
  - Use for: fine-tuning details with Chakra or Ionic

#### Recommended Architecture
- **Ionic UI**: Mobile foundation (navigation, basic components)
- **Chakra UI**: Advanced components (forms, dialogs)
- **Tailwind CSS**: Detail polishing
- **Framer Motion + Lottie**: Animations and micro-interactions
- Result: Fast development with warm, ceremonial, intimate relationship feel

### Project Structure
```
src/
├── pages/              # Main application pages
│   ├── home.tsx        # 首页 (Home) - Main entry point
│   ├── group.tsx       # 共识圈子 (Consensus Creation) - AI consensus process
│   ├── message.tsx     # 消息 (Messages) - Communication & history
│   └── mine.tsx        # 个人主页 (Profile) - User settings & consensus cards
├── components/         # Reusable components
│   ├── consensus/      # Consensus-related components (planned)
│   ├── cards/         # Consensus card components (planned)
│   ├── games/         # Gamification components (planned)
│   └── animations/    # Lottie/Framer Motion components (planned)
├── theme/             # Ionic theme customization
├── hooks/             # Custom React hooks (planned)
├── services/          # AI API integration (planned)
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
- **UI Component Priority**: Ionic UI (foundation) → Chakra UI (advanced) → Tailwind (details)
- **Animation Approach**: Framer Motion for interactions, Lottie for celebrations
- **Design Principles**: Warm, gentle, ritualistic feel for intimate relationships
- CSS files co-located with components
- Chinese text for user-facing labels
- Semantic component naming for consensus flow (e.g., ConsensusCard, AgreementWheel)

### Development Priorities
1. **Consensus Flow**: Multi-step guided process for conflict resolution
2. **AI Integration**: Backend API for generating compromise solutions
3. **Gamification**: Interactive elements to reduce negotiation friction
4. **Consensus Cards**: Visual celebration of reached agreements
5. **Smooth Animations**: Enhance emotional experience during sensitive conversations

### UI/UX Guidelines
- Prioritize emotional safety in conflict resolution flows
- Use warm colors and gentle transitions
- Implement micro-interactions to celebrate small wins
- Design for couples/friends using the app together
- Ensure accessibility for different relationship dynamics