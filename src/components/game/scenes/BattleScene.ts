import Phaser from 'phaser';
import { Monster } from '../entities/Monster';
import { Character } from '../entities/Character';

interface GameData {
  player1Config: any;
  player2Config: any;
  monsters: any[];
  backgroundUrl?: string | null;
  consensusTheme?: {
    title: string;
    description: string;
  };
}

interface Question {
  id: string;
  text: string;
  options: string[];
  category: 'budget' | 'time' | 'attraction' | 'cuisine';
}

export class BattleScene extends Phaser.Scene {
  private characters: Character[] = [];
  private monsters: Monster[] = [];
  private currentQuestion: Question | null = null;
  private player1Answer: string | null = null;
  private player2Answer: string | null = null;
  private battlePhase: 'waiting' | 'question' | 'answering' | 'result' | 'victory' = 'waiting';
  private eventCallback?: (event: string, data?: any) => void;
  private gameData?: GameData;
  
  // UI元素
  private questionText?: Phaser.GameObjects.Text;
  private optionButtons: Phaser.GameObjects.Rectangle[] = [];
  private optionTexts: Phaser.GameObjects.Text[] = [];
  private healthBars: { [key: string]: Phaser.GameObjects.Graphics } = {};
  private backgroundMusic?: Phaser.Sound.BaseSound;

  constructor() {
    super({ key: 'BattleScene' });
  }

  init(data?: any) {
    console.log('BattleScene init 接收到数据:', data);
    
    // 如果从MapScene传来数据，使用传来的数据
    if (data && data.gameData) {
      this.gameData = data.gameData;
      console.log('使用MapScene传递的游戏数据:', this.gameData);
    }
  }

  preload() {
    // 由于我们使用placeholder图片，这里创建简单的几何形状作为占位符
    this.load.image('background', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    
    // 加载AI生成的背景图（如果有）
    if (this.gameData?.backgroundUrl) {
      console.log('🖼️ 加载AI生成的背景图:', this.gameData.backgroundUrl);
      this.load.image('ai_background', this.gameData.backgroundUrl);
    }
    
    // 创建简单的角色和怪物占位符
    this.createPlaceholderAssets();
  }

  create() {
    // 创建西湖背景
    this.createBackground();
    
    // 初始化角色和怪物
    this.setupCharacters();
    this.setupMonsters();
    
    // 创建UI界面
    this.createUI();
    
    // 开始第一轮战斗
    this.startNextRound();
  }

  private createPlaceholderAssets() {
    // 创建角色占位符 (蓝色圆形)
    this.add.graphics()
      .fillStyle(0x4CAF50)
      .fillCircle(25, 25, 25)
      .generateTexture('character', 50, 50);

    // 创建怪物占位符 (红色方形)
    this.add.graphics()
      .fillStyle(0xFF5722)
      .fillRect(0, 0, 80, 80)
      .generateTexture('monster', 80, 80);

    // 创建西湖背景占位符 (渐变蓝色)
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xB0E0E6, 0xB0E0E6, 1);
    graphics.fillRect(0, 0, 375, 667);
    graphics.generateTexture('westlake_bg', 375, 667);
    graphics.destroy();
  }

  private createBackground() {
    // 优先使用AI生成的背景图
    if (this.gameData?.backgroundUrl && this.textures.exists('ai_background')) {
      console.log('✅ 使用AI生成的背景图');
      const bg = this.add.image(187.5, 333.5, 'ai_background');
      bg.setDisplaySize(375, 667);
      
      // 添加半透明遮罩以提高UI可读性
      const overlay = this.add.graphics();
      overlay.fillStyle(0x000000, 0.2);
      overlay.fillRect(0, 0, 375, 667);
    } else {
      console.log('📋 使用默认西湖背景');
      // 添加默认西湖风景背景
      const bg = this.add.image(187.5, 333.5, 'westlake_bg');
      bg.setDisplaySize(375, 667);
    }

    // 添加西湖标志性建筑轮廓（保持原有装饰元素）
    const graphics = this.add.graphics();
    
    // 雷峰塔轮廓 (左侧)
    graphics.lineStyle(3, 0x8B4513);
    graphics.beginPath();
    graphics.moveTo(50, 300);
    graphics.lineTo(70, 150);
    graphics.lineTo(90, 150);
    graphics.lineTo(110, 300);
    graphics.closePath();
    graphics.strokePath();
    
    // 断桥轮廓 (右侧)
    graphics.lineStyle(3, 0x696969);
    graphics.beginPath();
    graphics.moveTo(265, 320);
    graphics.arc(300, 320, 35, Math.PI, 0, false);
    graphics.lineTo(335, 320);
    graphics.strokePath();

    // 添加文字标识
    this.add.text(187.5, 80, '🏞️ 共识征程大作战', {
      fontSize: '24px',
      color: '#ff5a5e',
      fontStyle: 'bold',
    }).setOrigin(0.5);
  }

  private setupCharacters() {
    if (!this.gameData) return;

    // 创建两个角色，站在战斗场景下方
    const char1 = new Character(this, 150, 500, this.gameData.player1Config);
    const char2 = new Character(this, 225, 500, this.gameData.player2Config);
    
    this.characters.push(char1, char2);
    
    // 添加角色名称
    this.add.text(150, 470, char1.getName(), {
      fontSize: '14px',
      color: '#333',
      backgroundColor: '#fff',
      padding: { x: 6, y: 3 },
    }).setOrigin(0.5);
    
    this.add.text(225, 470, char2.getName(), {
      fontSize: '14px',
      color: '#333',
      backgroundColor: '#fff',
      padding: { x: 6, y: 3 },
    }).setOrigin(0.5);
  }

  private setupMonsters() {
    if (!this.gameData || !this.gameData.monsters.length) {
      // 创建默认怪物用于演示
      this.createDefaultMonsters();
      return;
    }

    // 根据游戏数据创建怪物
    this.gameData.monsters.forEach((monsterData, index) => {
      const x = 187.5;
      const y = 250;
      const monster = new Monster(this, x, y, monsterData);
      this.monsters.push(monster);
      
      // 创建怪物血条
      this.createHealthBar(monster.getId(), x, y - 60);
    });
  }

  private createDefaultMonsters() {
    // 创建预算狮王
    const budgetLion = new Monster(this, 187.5, 250, {
      id: 'budget_lion',
      name: '预算狮王',
      type: 'budget',
      health: 100,
      maxHealth: 100,
      attacks: ['金币雨', '预算压制'],
    });
    
    this.monsters.push(budgetLion);
    this.createHealthBar('budget_lion', 187.5, 190);
    
    // 添加怪物名称
    this.add.text(187.5, 160, '🦁 预算狮王', {
      fontSize: '16px',
      color: '#ff5a5e',
      fontStyle: 'bold',
    }).setOrigin(0.5);
  }

  private createHealthBar(monsterId: string, x: number, y: number) {
    const healthBar = this.add.graphics();
    healthBar.setPosition(x - 40, y);
    
    // 背景条
    healthBar.fillStyle(0x333333);
    healthBar.fillRect(0, 0, 80, 8);
    
    // 血量条
    healthBar.fillStyle(0xff0000);
    healthBar.fillRect(0, 0, 80, 8);
    
    this.healthBars[monsterId] = healthBar;
  }

  private updateHealthBar(monsterId: string, currentHealth: number, maxHealth: number) {
    const healthBar = this.healthBars[monsterId];
    if (!healthBar) return;
    
    healthBar.clear();
    
    // 背景条
    healthBar.fillStyle(0x333333);
    healthBar.fillRect(0, 0, 80, 8);
    
    // 血量条
    const healthPercent = currentHealth / maxHealth;
    const color = healthPercent > 0.5 ? 0x00ff00 : healthPercent > 0.2 ? 0xffff00 : 0xff0000;
    healthBar.fillStyle(color);
    healthBar.fillRect(0, 0, 80 * healthPercent, 8);
  }

  private createUI() {
    // 创建问题显示区域 - 竖屏布局
    this.questionText = this.add.text(187.5, 370, '', {
      fontSize: '16px',
      color: '#333',
      backgroundColor: '#fff',
      padding: { x: 15, y: 8 },
      wordWrap: { width: 320 },
    }).setOrigin(0.5);

    // 创建答案选项按钮 - 垂直排列
    for (let i = 0; i < 4; i++) {
      const x = 187.5;
      const y = 420 + (i * 50);
      
      const button = this.add.rectangle(x, y, 320, 35, 0x4CAF50);
      button.setInteractive();
      button.setStrokeStyle(2, 0x2E7D32);
      
      const text = this.add.text(x, y, '', {
        fontSize: '12px',
        color: '#fff',
        wordWrap: { width: 300 },
      }).setOrigin(0.5);
      
      // 按钮点击事件
      button.on('pointerdown', () => this.handleAnswerClick(i));
      button.on('pointerover', () => button.setFillStyle(0x66BB6A));
      button.on('pointerout', () => button.setFillStyle(0x4CAF50));
      
      this.optionButtons.push(button);
      this.optionTexts.push(text);
    }
  }

  private startNextRound() {
    if (this.monsters.every(monster => monster.isDeadStatus())) {
      // 所有怪物都被击败，进入胜利场景
      this.scene.start('VictoryScene', { 
        victory: true,
        characters: this.characters.map(char => char.getConfig())
      });
      return;
    }

    // 生成新问题
    this.generateQuestion();
    this.battlePhase = 'question';
    
    // 重置答案状态
    this.player1Answer = null;
    this.player2Answer = null;
    
    // 显示问题
    this.displayQuestion();
  }

  private generateQuestion() {
    // Mock问题数据 - 基于共识达成场景
    const questions: Question[] = [
      {
        id: 'budget_1',
        text: '你们计划在西湖边的餐厅用餐，预算应该如何安排？',
        options: [
          '人均100元以内的快餐',
          '人均200元的特色杭帮菜',
          '人均400元的湖景餐厅',
          '自带便当湖边野餐'
        ],
        category: 'budget'
      },
      {
        id: 'time_1',
        text: '雷峰塔和苏堤都想去，但时间有限，应该如何安排？',
        options: [
          '上午雷峰塔，下午苏堤',
          '重点游览雷峰塔',
          '重点游览苏堤',
          '都去但时间缩短'
        ],
        category: 'time'
      },
      {
        id: 'attraction_1',
        text: '西湖十景中，你们最想一起体验的是？',
        options: [
          '断桥残雪看雪景',
          '雷峰夕照赏夕阳',
          '苏堤春晓散步',
          '三潭印月泛舟'
        ],
        category: 'attraction'
      },
      {
        id: 'cuisine_1',
        text: '在西湖游玩时，你们更偏向哪种美食体验？',
        options: [
          '正宗杭帮菜馆',
          '网红咖啡厅',
          '特色小笼包',
          '湖边茶楼品茶'
        ],
        category: 'cuisine'
      }
    ];

    // 随机选择一个问题
    this.currentQuestion = questions[Math.floor(Math.random() * questions.length)];
  }

  private displayQuestion() {
    if (!this.currentQuestion) return;
    
    // 显示问题文本
    this.questionText?.setText(this.currentQuestion.text);
    
    // 显示选项
    this.currentQuestion.options.forEach((option, index) => {
      if (this.optionTexts[index]) {
        this.optionTexts[index].setText(option);
      }
      if (this.optionButtons[index]) {
        this.optionButtons[index].setVisible(true);
      }
    });
    
    // 隐藏多余的按钮
    for (let i = this.currentQuestion.options.length; i < this.optionButtons.length; i++) {
      this.optionButtons[i].setVisible(false);
      this.optionTexts[i].setText('');
    }
  }

  private handleAnswerClick(optionIndex: number) {
    if (!this.currentQuestion || this.battlePhase !== 'question') return;
    
    const selectedOption = this.currentQuestion.options[optionIndex];
    
    // 模拟双人答案 (实际应该来自外部输入)
    if (!this.player1Answer) {
      this.player1Answer = selectedOption;
      this.showFeedback(`玩家1选择: ${selectedOption}`);
      
      // 模拟玩家2自动选择 (2秒后)
      setTimeout(() => {
        if (!this.player2Answer && this.currentQuestion) {
          const randomIndex = Math.floor(Math.random() * this.currentQuestion.options.length);
          this.player2Answer = this.currentQuestion.options[randomIndex];
          this.showFeedback(`玩家2选择: ${this.player2Answer}`);
          this.processAnswers();
        }
      }, 2000);
    }
  }

  private processAnswers() {
    if (!this.player1Answer || !this.player2Answer || !this.currentQuestion) return;
    
    // 计算一致性得分
    const consistency = this.player1Answer === this.player2Answer ? 1.0 : 0.5;
    const damage = Math.floor(consistency * 30 + Math.random() * 20); // 30-50伤害
    
    // 对怪物造成伤害
    if (this.monsters.length > 0) {
      const targetMonster = this.monsters[0]; // 攻击第一个活着的怪物
      targetMonster.takeDamage(damage);
      
      // 更新血条
      this.updateHealthBar(
        targetMonster.getId(),
        targetMonster.getHealth(),
        targetMonster.getMaxHealth()
      );
      
      // 显示伤害数字
      this.showDamageText(targetMonster.getX(), targetMonster.getY() - 40, damage);
      
      // 播放攻击动画
      this.playAttackAnimation(targetMonster);
    }
    
    // 显示结果
    const resultText = consistency === 1.0 
      ? `🎯 完美配合！造成 ${damage} 点伤害！`
      : `⚡ 还不错！造成 ${damage} 点伤害！`;
    
    this.showFeedback(resultText);
    
    // 3秒后开始下一轮
    setTimeout(() => {
      this.startNextRound();
    }, 3000);
  }

  private showDamageText(x: number, y: number, damage: number) {
    const damageText = this.add.text(x, y, `-${damage}`, {
      fontSize: '24px',
      color: '#ff0000',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    
    // 飘字动画
    this.tweens.add({
      targets: damageText,
      y: y - 50,
      alpha: 0,
      duration: 1000,
      onComplete: () => damageText.destroy()
    });
  }

  private playAttackAnimation(target: Monster) {
    // 简单的攻击动画 - 角色向前移动然后返回
    this.characters.forEach((character, index) => {
      const originalX = character.getX();
      
      this.tweens.add({
        targets: character.getSprite(),
        x: originalX - 100,
        duration: 300,
        yoyo: true,
        onComplete: () => {
          // 攻击到达时的效果
          if (index === 0) {
            this.createHitEffect(target.getX(), target.getY());
          }
        }
      });
    });
  }

  private createHitEffect(x: number, y: number) {
    // 创建击中特效
    const hitEffect = this.add.graphics();
    hitEffect.setPosition(x, y);
    
    // 画一个爆炸效果
    hitEffect.fillStyle(0xffff00);
    hitEffect.fillCircle(0, 0, 20);
    
    // 效果动画
    this.tweens.add({
      targets: hitEffect,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 500,
      onComplete: () => hitEffect.destroy()
    });
  }

  private showFeedback(message: string) {
    const feedback = this.add.text(187.5, 340, message, {
      fontSize: '16px',
      color: '#ff5a5e',
      backgroundColor: '#fff',
      padding: { x: 12, y: 6 },
    }).setOrigin(0.5);
    
    // 3秒后自动消失
    setTimeout(() => {
      if (feedback && feedback.scene) {
        feedback.destroy();
      }
    }, 3000);
  }

  // 外部接口方法
  setGameData(data: GameData) {
    this.gameData = data;
  }

  setEventCallback(callback: (event: string, data?: any) => void) {
    this.eventCallback = callback;
  }

  getCurrentBattleState() {
    return {
      phase: this.battlePhase,
      characters: this.characters.map(char => char.getConfig()),
      monsters: this.monsters.map(monster => monster.getConfig()),
      currentQuestion: this.currentQuestion,
    };
  }
}