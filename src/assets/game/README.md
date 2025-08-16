# 游戏素材资源指南

## 📁 文件夹结构说明

### characters/ - 角色相关
- **portraits/** - 角色立绘图片 (300x400px, PNG格式)
  - character-01.png (休闲风格角色)
  - character-02.png (优雅风格角色) 
  - character-03.png (运动风格角色)
  - character-04.png (文艺风格角色)
- **avatars/** - 角色头像 (80x80px, PNG格式)
  - avatar-01.png, avatar-02.png...
- **animations/** - 角色动画帧（如果需要）

### monsters/ - 怪物相关
- **sprites/** - 怪物游戏图像 (200x200px, PNG格式)
  - budget-lion.png (预算狮王)
  - time-dragon.png (时间安排龙)
  - attraction-spider.png (景点选择蛛)
  - cuisine-ghost.png (美食口味鬼)
- **portraits/** - 怪物详情展示图 (300x300px, PNG格式)
  - budget-lion-portrait.png...

### equipment/ - 装备相关
- **icons/** - 装备图标 (64x64px 或 128x128px, PNG格式)
  - amulet-budget.png (预算护符)
  - compass-time.png (时间指南针)
  - shield-attraction.png (景点盾牌)
  - gem-cuisine.png (美食宝珠)
- **effects/** - 装备特效图

### backgrounds/ - 背景相关
- **maps/** - 地图背景 (适合手机竖屏, PNG格式)
  - westlake-map.png (西湖全景地图)
  - westlake-overview.png (西湖俯视图)
- **battles/** - 战斗背景
  - westlake-battle-bg.png (西湖战斗背景)
- **ui/** - UI背景元素
  - panel-character.png (角色选择面板)
  - panel-equipment.png (装备面板)

### ui/ - UI元素
- **buttons/** - 按钮素材 (PNG格式)
  - btn-start.png, btn-back.png...
- **panels/** - 面板素材
  - panel-wood.png, panel-stone.png...
- **icons/** - 通用图标 (32x32px, PNG格式)
  - icon-home.png, icon-settings.png...

### effects/ - 特效相关
- **particles/** - 粒子效果
- **animations/** - 动画效果

## 🎨 素材规格要求

### 格式要求
- **首选格式**: PNG (支持透明背景)
- **备选格式**: JPG (背景图可用)

### 尺寸建议
- **角色立绘**: 300x400px
- **怪物图像**: 200x200px  
- **装备图标**: 64x64px 或 128x128px
- **背景图片**: 适合手机竖屏比例 (9:16 或类似)
- **UI元素**: 根据使用场景调整

### 命名规范
- 使用小写字母和连字符
- 描述性命名: `budget-lion.png`
- 按类型编号: `character-01.png`
- 避免特殊字符和空格

## 🚀 优先级建议

### 高优先级 (立即需要)
1. **西湖地图背景** - maps/westlake-map.png
2. **4个主要怪物** - monsters/sprites/下的4个怪物图
3. **角色立绘** - characters/portraits/下的4个角色图

### 中优先级 (后续优化)
1. **装备图标** - equipment/icons/下的装备图标
2. **UI面板** - ui/panels/下的界面元素
3. **怪物详情图** - monsters/portraits/下的详情图

### 低优先级 (锦上添花)
1. **特效素材** - effects/下的各种特效
2. **动画帧** - characters/animations/下的动画
3. **UI装饰** - ui/下的装饰元素

## 💡 制作建议

### 风格指导
- **整体风格**: 温馨、亲密、有仪式感
- **色调**: 暖色调为主，符合情侣约会主题
- **西湖元素**: 体现杭州西湖特色（雷峰塔、断桥、苏堤等）

### 角色设计
- 4种风格：休闲、优雅、运动、文艺
- 适合情侣约会场景
- 表情友好、可爱

### 怪物设计  
- 不要太可怕，更像"困难"的拟人化
- 预算狮王：金币、钱袋元素
- 时间龙：时钟、日历元素
- 景点蛛：地图、路线元素
- 美食鬼：食物、餐具元素

提供素材时，请按照此结构放置文件，我们将逐步替换游戏中的占位符资源。