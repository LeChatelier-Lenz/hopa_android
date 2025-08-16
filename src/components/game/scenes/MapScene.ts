import Phaser from 'phaser';

interface MonsterData {
  id: string;
  name: string;
  type: 'budget' | 'time' | 'attraction' | 'cuisine';
  x: number;
  y: number;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  defeated: boolean;
}

interface MapData {
  characters: any[];
  monsters: MonsterData[];
}

export class MapScene extends Phaser.Scene {
  private mapData?: MapData;
  private eventCallback?: (event: string, data?: any) => void;
  private monsters: MonsterData[] = [];
  private selectedMonster?: MonsterData;

  constructor() {
    super({ key: 'MapScene' });
  }

  init(data: MapData) {
    this.mapData = data;
    this.setupDefaultMonsters();
  }

  preload() {
    // 创建地图背景占位符
    this.createMapBackground();
    // 创建怪物占位符
    this.createMonsterPlaceholder();
  }

  create() {
    // 创建西湖地图背景
    this.createBackground();
    
    // 创建怪物位置点
    this.createMonsterPoints();
    
    // 创建UI界面
    this.createUI();
  }

  private setupDefaultMonsters() {
    // 设置4个怪物的默认位置和信息
    this.monsters = [
      {
        id: 'budget_lion',
        name: '预算狮王',
        type: 'budget',
        x: 100,
        y: 200,
        description: '掌管活动预算的强大守护者，擅长制造花费焦虑',
        difficulty: 'medium',
        defeated: false,
      },
      {
        id: 'time_dragon',
        name: '时间安排龙',
        type: 'time',
        x: 275,
        y: 150,
        description: '时间的主宰，总是让大家为行程安排争执不休',
        difficulty: 'hard',
        defeated: false,
      },
      {
        id: 'attraction_spider',
        name: '景点选择蛛',
        type: 'attraction',
        x: 150,
        y: 350,
        description: '编织景点选择的迷网，让人在众多选择中迷失',
        difficulty: 'easy',
        defeated: false,
      },
      {
        id: 'cuisine_ghost',
        name: '美食口味鬼',
        type: 'cuisine',
        x: 250,
        y: 300,
        description: '游荡在美食街的幽灵，专门制造口味分歧',
        difficulty: 'medium',
        defeated: false,
      },
    ];
  }

  private createMapBackground() {
    // 创建西湖地图背景
    const graphics = this.add.graphics();
    
    // 渐变背景 - 模拟西湖
    graphics.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xB0E0E6, 0xB0E0E6, 1);
    graphics.fillRect(0, 0, 375, 667);
    
    // 添加湖泊区域
    graphics.fillStyle(0x4169E1, 0.6);
    graphics.fillEllipse(187.5, 300, 250, 150);
    
    // 添加小岛和路径
    graphics.fillStyle(0x228B22, 0.4);
    graphics.fillCircle(120, 280, 30);  // 小瀛洲
    graphics.fillCircle(255, 320, 25);  // 湖心亭
    
    graphics.generateTexture('westlake_map', 375, 667);
    graphics.destroy();
  }

  private createMonsterPlaceholder() {
    // 创建怪物图标占位符
    const graphics = this.add.graphics();
    graphics.fillStyle(0xFF4444);
    graphics.fillCircle(20, 20, 20);
    graphics.fillStyle(0xFFFFFF);
    graphics.fillCircle(20, 20, 15);
    graphics.generateTexture('monster_icon', 40, 40);
    graphics.destroy();
  }

  private createBackground() {
    // 添加地图背景
    const bg = this.add.image(187.5, 333.5, 'westlake_map');
    bg.setDisplaySize(375, 667);

    // 添加地图标题
    this.add.text(187.5, 80, '🗺️ 共识征程地图', {
      fontSize: '24px',
      color: '#ff5a5e',
      fontStyle: 'bold',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: { x: 15, y: 8 },
    }).setOrigin(0.5);

    // 添加西湖标志性建筑
    this.createLandmarks();
  }

  private createLandmarks() {
    const graphics = this.add.graphics();
    
    // 雷峰塔
    graphics.lineStyle(3, 0x8B4513);
    graphics.beginPath();
    graphics.moveTo(50, 250);
    graphics.lineTo(70, 180);
    graphics.lineTo(90, 180);
    graphics.lineTo(110, 250);
    graphics.closePath();
    graphics.strokePath();
    
    this.add.text(80, 260, '雷峰塔', {
      fontSize: '12px',
      color: '#333',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: { x: 4, y: 2 },
    }).setOrigin(0.5);

    // 断桥
    graphics.lineStyle(3, 0x696969);
    graphics.beginPath();
    graphics.moveTo(280, 270);
    graphics.arc(300, 270, 20, Math.PI, 0, false);
    graphics.lineTo(320, 270);
    graphics.strokePath();
    
    this.add.text(300, 285, '断桥', {
      fontSize: '12px',
      color: '#333',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: { x: 4, y: 2 },
    }).setOrigin(0.5);

    // 苏堤
    graphics.lineStyle(4, 0x90EE90);
    graphics.beginPath();
    graphics.moveTo(120, 400);
    graphics.lineTo(140, 380);
    graphics.lineTo(160, 385);
    graphics.lineTo(180, 375);
    graphics.lineTo(200, 380);
    graphics.strokePath();
    
    this.add.text(160, 395, '苏堤', {
      fontSize: '12px',
      color: '#333',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: { x: 4, y: 2 },
    }).setOrigin(0.5);
  }

  private createMonsterPoints() {
    this.monsters.forEach((monster, index) => {
      // 创建怪物位置标记
      const monsterIcon = this.add.image(monster.x, monster.y, 'monster_icon');
      monsterIcon.setScale(1.2);
      monsterIcon.setInteractive();
      
      // 根据怪物类型设置颜色
      const typeColors = {
        budget: 0xFFD700,    // 金色
        time: 0x1E88E5,      // 蓝色
        attraction: 0x8E24AA, // 紫色
        cuisine: 0xFF8F00,   // 橙色
      };
      monsterIcon.setTint(typeColors[monster.type]);

      // 怪物名称标签
      const nameLabel = this.add.text(monster.x, monster.y - 30, monster.name, {
        fontSize: '14px',
        color: '#333',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: { x: 6, y: 3 },
      }).setOrigin(0.5);

      // 难度标识
      const difficultyColors = {
        easy: '#4CAF50',
        medium: '#FF9800',
        hard: '#F44336',
      };
      
      const difficultyLabel = this.add.text(monster.x + 25, monster.y - 25, 
        monster.difficulty === 'easy' ? '简单' : 
        monster.difficulty === 'medium' ? '中等' : '困难', {
        fontSize: '10px',
        color: '#fff',
        backgroundColor: difficultyColors[monster.difficulty],
        padding: { x: 4, y: 2 },
      }).setOrigin(0.5);

      // 添加脉冲动画
      this.tweens.add({
        targets: monsterIcon,
        scaleX: 1.4,
        scaleY: 1.4,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      // 点击事件
      monsterIcon.on('pointerdown', () => {
        this.selectMonster(monster);
      });

      monsterIcon.on('pointerover', () => {
        monsterIcon.setScale(1.5);
        nameLabel.setStyle({ backgroundColor: 'rgba(255, 90, 94, 0.9)', color: '#fff' });
      });

      monsterIcon.on('pointerout', () => {
        monsterIcon.setScale(1.2);
        nameLabel.setStyle({ backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#333' });
      });
    });
  }

  private createUI() {
    // 创建底部操作区域
    const uiBackground = this.add.graphics();
    uiBackground.fillStyle(0x000000, 0.7);
    uiBackground.fillRect(0, 520, 375, 147);

    // 提示文字
    this.add.text(187.5, 540, '点击怪物查看详情，选择挑战！', {
      fontSize: '16px',
      color: '#fff',
    }).setOrigin(0.5);

    // 返回按钮
    const backButton = this.add.text(60, 600, '⬅️ 返回', {
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#666',
      padding: { x: 15, y: 8 },
    }).setOrigin(0.5);

    backButton.setInteractive();
    backButton.on('pointerdown', () => {
      if (this.eventCallback) {
        this.eventCallback('backToCharacter');
      }
    });

    backButton.on('pointerover', () => {
      backButton.setStyle({ backgroundColor: '#888' });
    });

    backButton.on('pointerout', () => {
      backButton.setStyle({ backgroundColor: '#666' });
    });
  }

  private selectMonster(monster: MonsterData) {
    this.selectedMonster = monster;
    this.showMonsterDetail(monster);
  }

  private showMonsterDetail(monster: MonsterData) {
    // 创建详情弹窗
    const modalBg = this.add.graphics();
    modalBg.fillStyle(0x000000, 0.8);
    modalBg.fillRect(0, 0, 375, 667);

    // 详情面板
    const panel = this.add.graphics();
    panel.fillStyle(0xffffff);
    panel.fillRoundedRect(25, 200, 325, 300, 20);
    panel.lineStyle(4, 0xff5a5e);
    panel.strokeRoundedRect(25, 200, 325, 300, 20);

    // 怪物名称
    this.add.text(187.5, 240, monster.name, {
      fontSize: '24px',
      color: '#ff5a5e',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // 类型标识
    const typeEmojis = {
      budget: '💰',
      time: '⏰',
      attraction: '🗺️',
      cuisine: '🍽️',
    };
    
    this.add.text(187.5, 280, `${typeEmojis[monster.type]} ${monster.description}`, {
      fontSize: '14px',
      color: '#333',
      wordWrap: { width: 280 },
    }).setOrigin(0.5);

    // 难度显示
    this.add.text(187.5, 340, `难度: ${monster.difficulty === 'easy' ? '简单' : 
      monster.difficulty === 'medium' ? '中等' : '困难'}`, {
      fontSize: '16px',
      color: monster.difficulty === 'easy' ? '#4CAF50' : 
        monster.difficulty === 'medium' ? '#FF9800' : '#F44336',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // 挑战按钮
    const challengeButton = this.add.text(187.5, 420, '🗡️ 开始挑战', {
      fontSize: '18px',
      color: '#fff',
      backgroundColor: '#ff5a5e',
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5);

    challengeButton.setInteractive();
    challengeButton.on('pointerdown', () => {
      this.startBattle(monster);
    });

    challengeButton.on('pointerover', () => {
      challengeButton.setStyle({ backgroundColor: '#ff4a4e' });
    });

    challengeButton.on('pointerout', () => {
      challengeButton.setStyle({ backgroundColor: '#ff5a5e' });
    });

    // 关闭按钮
    const closeButton = this.add.text(320, 220, '✖️', {
      fontSize: '20px',
      color: '#666',
    }).setOrigin(0.5);

    closeButton.setInteractive();
    closeButton.on('pointerdown', () => {
      modalBg.destroy();
      panel.destroy();
      challengeButton.destroy();
      closeButton.destroy();
    });
  }

  private startBattle(monster: MonsterData) {
    // 触发战斗事件，同时启动战斗场景
    console.log('MapScene: 开始战斗', { monster, characters: this.mapData?.characters });
    
    // 直接启动战斗场景并传递数据
    this.scene.start('BattleScene', {
      selectedMonster: monster,
      characters: this.mapData?.characters || [],
      gameData: {
        player1Config: this.mapData?.characters[0] || { name: '玩家1', style: 'casual' },
        player2Config: this.mapData?.characters[1] || { name: '玩家2', style: 'elegant' },
        monsters: [monster]
      }
    });
  }

  // 设置事件回调
  setEventCallback(callback: (event: string, data?: any) => void) {
    this.eventCallback = callback;
  }

  // 设置地图数据
  setMapData(data: MapData) {
    this.mapData = data;
  }
}