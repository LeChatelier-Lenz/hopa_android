# 开发说明
> 本项目为Android App项目，通过Ionic Capacitor实现对React App的 webview迁移


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

- 运行`ionic serve`则可以进行常规的浏览器运行



### 初次构建android app

- 先关闭掉serve，随后在项目目录下

  ````bash
  $ ionic build
  ````

  

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

### 项目结构

```
hopa/
├── src/                    # 源代码目录
│   ├── pages/             # 页面组件
│   │   ├── home.tsx       # 首页
│   │   ├── group.tsx      # 共识圈子
│   │   ├── message.tsx    # 消息页面
│   │   └── mine.tsx       # 个人主页
│   ├── components/        # 可复用组件
│   ├── theme/            # 主题样式
│   └── App.tsx           # 应用入口
├── android/              # Android原生项目
├── public/               # 静态资源
├── dist/                 # 构建输出目录
└── capacitor.config.ts   # Capacitor配置
```

### 技术栈

#### 前端框架层
- **React 19.0.0**: 核心UI框架，采用函数式组件和Hooks
- **TypeScript 5.1.6**: 提供类型安全和更好的开发体验
- **Vite 5.2.0**: 现代化的构建工具，提供快速的开发服务器和构建优化

#### UI组件库
- **Ionic React 8.5.0**: 移动端UI组件库，提供原生级别的用户体验
- **Material-UI 7.3.1**: 辅助UI组件库，用于图标和高级组件【主要】
- **Ionicons 7.4.0**: Ionic官方图标库

#### 路由管理
- **React Router 5.3.4**: 客户端路由管理
- **Ionic React Router**: Ionic集成的路由解决方案






