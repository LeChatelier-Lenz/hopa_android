# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Hopa", an Ionic React application that targets Android using Capacitor for native mobile app development. The project uses React 19 with TypeScript, Vite for building, and Material-UI alongside Ionic components for the user interface.

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

### Tech Stack
- **Frontend**: React 19 + TypeScript 5.1.6
- **Build Tool**: Vite 5.2.0
- **Mobile Framework**: Ionic React 8.5.0 + Capacitor 7.4.2
- **UI Libraries**: Material-UI 7.3.1 (primary), Ionicons 7.4.0
- **Routing**: React Router 5.3.4 with Ionic React Router
- **Testing**: Vitest (unit), Cypress (e2e)
- **Linting**: ESLint 9 with TypeScript ESLint

### Project Structure
```
src/
├── pages/              # Main application pages
│   ├── home.tsx        # 首页 (Home)
│   ├── group.tsx       # 共识圈子 (Consensus Groups)
│   ├── message.tsx     # 消息 (Messages)
│   └── mine.tsx        # 个人主页 (Profile)
├── components/         # Reusable components
├── theme/             # Ionic theme customization
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
- Use Material-UI icons for consistency
- CSS files co-located with components
- Chinese text for user-facing labels in tab navigation