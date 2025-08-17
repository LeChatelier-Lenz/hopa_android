import Phaser from 'phaser';
import { Monster } from '../entities/Monster';
import type { MonsterConfig } from '../entities/Monster';
import { Character } from '../entities/Character';

interface ConflictQuestion {
  id: string;
  type: 'choice' | 'fill' | 'sort';
  question: string;
  options?: string[];
  correctAnswer?: number | string | string[];
  explanation: string;
  category: string;
}

interface GameData {
  player1Config: any;
  player2Config: any;
  monsters: any[];
  backgroundUrl?: string | null;
  consensusTheme?: {
    title: string;
    description: string;
  };
  conflictQuestions?: ConflictQuestion[];
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
  private currentQuestion: Question | ConflictQuestion | null = null;
  private aiQuestions: ConflictQuestion[] = [];
  private currentQuestionIndex: number = 0;
  private consensusResults: any[] = [];
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
    // 创建简单的角色和怪物占位符
    this.createPlaceholderAssets();
    
    // 加载AI生成的背景图（如果有）- 通过后端代理解决CORS问题
    if (this.gameData?.backgroundUrl) {
      console.log('🖼️ 加载AI生成的背景图:', this.gameData.backgroundUrl);
      try {
        // 使用后端代理URL
        const proxyUrl = `http://localhost:3001/ai/proxy/image?url=${encodeURIComponent(this.gameData.backgroundUrl)}`;
        this.load.image('ai_background', proxyUrl);
        
        // 添加加载完成监听
        this.load.on('filecomplete-image-ai_background', () => {
          console.log('✅ AI背景图加载完成（通过后端代理）');
        });
        
        // 添加加载错误监听  
        this.load.on('loaderror', (file: any) => {
          if (file.key === 'ai_background') {
            console.error('❌ AI背景图加载失败:', file.src);
          }
        });
      } catch (error) {
        console.error('❌ AI背景图URL无效:', error);
      }
    }
    
    // 随机加载一个怪兽图片
    const monsterIndex = Math.floor(Math.random() * 5) + 1;
    const monsterExtension = monsterIndex === 1 ? 'png' : 'jpg';
    this.load.image('monster_sprite', `/src/assets/game/monsters/monster${monsterIndex}.${monsterExtension}`);
    
    // 加载角色图片
    this.load.image('character1', '/src/assets/game/characters/cha1.jpg');
    this.load.image('character2', '/src/assets/game/characters/cha2.jpg');
    this.load.image('character3', '/src/assets/game/characters/cha3.jpg');
    this.load.image('character4', '/src/assets/game/characters/cha4.jpg');
    
    // 加载装备图片
    this.load.image('equipment_coin', '/src/assets/game/equipment/Coin.jpg');
    this.load.image('equipment_clover', '/src/assets/game/equipment/Four-leaf-clover.jpg');
    this.load.image('equipment_gemstone', '/src/assets/game/equipment/Gemstone.jpg');
    this.load.image('equipment_key', '/src/assets/game/equipment/Key.jpg');
    this.load.image('equipment_magic_bar', '/src/assets/game/equipment/magic_bar.jpg');
    this.load.image('equipment_ring', '/src/assets/game/equipment/ring.jpg');
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
    // 获取设备像素比例
    const pixelRatio = window.devicePixelRatio || 1;
    
    // 创建西湖背景占位符 (渐变蓝色) - 高清版本
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xB0E0E6, 0xB0E0E6, 1);
    graphics.fillRect(0, 0, this.scale.width, this.scale.height);
    graphics.generateTexture('westlake_bg', this.scale.width, this.scale.height);
    graphics.destroy();
    
    // 优化文字渲染将在创建文字时单独设置
  }

  private createBackground() {
    // 优先使用AI生成的背景图
    if (this.gameData?.backgroundUrl && this.textures.exists('ai_background')) {
      console.log('✅ 使用AI生成的背景图');
      const bg = this.add.image(0, 0, 'ai_background');
      bg.setOrigin(0, 0);
      bg.setDisplaySize(this.scale.width, this.scale.height);
      
      // 添加半透明遮罩以提高UI可读性
      const overlay = this.add.graphics();
      overlay.fillStyle(0x000000, 0.3);
      overlay.fillRect(0, 0, this.scale.width, this.scale.height);
    } else {
      console.log('📋 使用默认西湖背景');
      // 添加默认西湖风景背景
      const bg = this.add.image(0, 0, 'westlake_bg');
      bg.setOrigin(0, 0);
      bg.setDisplaySize(this.scale.width, this.scale.height);
    }

    // 添加游戏标题
    const titleText = this.add.text(this.scale.width / 2, this.scale.height * 0.06, '🏞️ 共识征程大作战', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.05}px`,
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);
    titleText.setResolution(window.devicePixelRatio || 1);
  }

  private setupCharacters() {
    if (!this.gameData) return;

    // 角色位置调整到中部，增大尺寸
    const char1X = this.scale.width * 0.25;
    const char2X = this.scale.width * 0.75;
    const charY = this.scale.height * 0.42; // 进一步上移
    const charSize = Math.min(this.scale.width, this.scale.height) * 0.15; // 增大角色尺寸

    // 创建两个角色 - 高清渲染
    const char1Sprite = this.add.image(char1X, charY, 'character1');
    char1Sprite.setDisplaySize(charSize, charSize);
    
    const char2Sprite = this.add.image(char2X, charY, 'character2');
    char2Sprite.setDisplaySize(charSize, charSize);
    
    // 使用真实角色而不是Character类
    const char1 = new Character(this, char1X, charY, this.gameData.player1Config);
    const char2 = new Character(this, char2X, charY, this.gameData.player2Config);
    
    // 隐藏原来的sprite，使用我们的图片
    char1.getSprite().setVisible(false);
    char2.getSprite().setVisible(false);
    
    this.characters.push(char1, char2);
    
    // 添加角色名称
    const player1Text = this.add.text(char1X, charY + charSize/2 + 20, '玩家1', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.025}px`,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);
    player1Text.setResolution(window.devicePixelRatio || 1);
    
    const player2Text = this.add.text(char2X, charY + charSize/2 + 20, '玩家2', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.025}px`,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);
    player2Text.setResolution(window.devicePixelRatio || 1);
  }

  private setupMonsters() {
    // 创建怪物 - 位置在屏幕中上部，与角色保持适当距离
    const monsterX = this.scale.width / 2;
    const monsterY = this.scale.height * 0.22; // 进一步上移
    const monsterSize = Math.min(this.scale.width, this.scale.height) * 0.25; // 增大怪物尺寸
    
    // 使用真实怪物图片 - 高清渲染
    const monsterSprite = this.add.image(monsterX, monsterY, 'monster_sprite');
    monsterSprite.setDisplaySize(monsterSize, monsterSize);
    
    // 根据AI题目数量动态设置怪物血量
    const questionCount = this.gameData?.conflictQuestions?.length || 5;
    const baseHealth = questionCount * 60; // 每个题目60血量
    const totalHealth = Math.max(baseHealth, 300); // 最少300血量
    
    console.log(`🎯 根据${questionCount}个AI题目设置怪物血量: ${totalHealth}`);
    
    // 创建怪物对象（用于逻辑）
    const monsterData: MonsterConfig = {
      id: 'consensus_monster',
      name: '共识守护兽',
      type: 'budget',
      health: totalHealth,
      maxHealth: totalHealth,
      attacks: ['冲突制造', '分歧强化'],
    };
    
    const monster = new Monster(this, monsterX, monsterY, monsterData);
    // 隐藏Monster类的默认sprite，使用我们的图片
    monster.getSprite().setVisible(false);
    
    this.monsters.push(monster);
    
    // 创建怪物血条
    this.createHealthBar('consensus_monster', monsterX, monsterY - monsterSize/2 - 30);
    
    // 添加怪物名称
    const monsterNameText = this.add.text(monsterX, monsterY - monsterSize/2 - 70, '🦁 共识守护兽', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.035}px`,
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#ff5a5e',
      strokeThickness: 3,
    }).setOrigin(0.5);
    monsterNameText.setResolution(window.devicePixelRatio || 1);
  }


  private createHealthBar(monsterId: string, x: number, y: number) {
    const barWidth = this.scale.width * 0.4;
    const barHeight = this.scale.height * 0.015;
    
    const healthBar = this.add.graphics();
    healthBar.setPosition(x - barWidth/2, y);
    
    // 背景条
    healthBar.fillStyle(0x333333, 0.8);
    healthBar.fillRoundedRect(0, 0, barWidth, barHeight, barHeight/2);
    
    // 血量条
    healthBar.fillStyle(0xff0000);
    healthBar.fillRoundedRect(0, 0, barWidth, barHeight, barHeight/2);
    
    // 边框
    healthBar.lineStyle(2, 0xffffff, 0.8);
    healthBar.strokeRoundedRect(0, 0, barWidth, barHeight, barHeight/2);
    
    this.healthBars[monsterId] = healthBar;
  }

  private updateHealthBar(monsterId: string, currentHealth: number, maxHealth: number) {
    const healthBar = this.healthBars[monsterId];
    if (!healthBar) return;
    
    const barWidth = this.scale.width * 0.4;
    const barHeight = this.scale.height * 0.015;
    
    healthBar.clear();
    
    // 背景条
    healthBar.fillStyle(0x333333, 0.8);
    healthBar.fillRoundedRect(0, 0, barWidth, barHeight, barHeight/2);
    
    // 血量条
    const healthPercent = currentHealth / maxHealth;
    const color = healthPercent > 0.5 ? 0x00ff00 : healthPercent > 0.2 ? 0xffff00 : 0xff0000;
    healthBar.fillStyle(color);
    healthBar.fillRoundedRect(0, 0, barWidth * healthPercent, barHeight, barHeight/2);
    
    // 边框
    healthBar.lineStyle(2, 0xffffff, 0.8);
    healthBar.strokeRoundedRect(0, 0, barWidth, barHeight, barHeight/2);
  }

  private createUI() {
    // 创建底部题目显示框 - 缩小高度，上移位置
    const bottomFrameHeight = this.scale.height * 0.32; // 占屏幕高度的32%
    const bottomFrameY = this.scale.height - bottomFrameHeight;
    
    // 底部框背景
    const bottomFrame = this.add.graphics();
    bottomFrame.fillStyle(0x2E3F4F, 0.95); // 深蓝灰色，半透明
    bottomFrame.fillRoundedRect(
      this.scale.width * 0.05, 
      bottomFrameY + this.scale.height * 0.02, 
      this.scale.width * 0.9, 
      bottomFrameHeight - this.scale.height * 0.04, 
      20
    );
    
    // 底部框边框
    bottomFrame.lineStyle(3, 0xFFD700, 1); // 金色边框
    bottomFrame.strokeRoundedRect(
      this.scale.width * 0.05, 
      bottomFrameY + this.scale.height * 0.02, 
      this.scale.width * 0.9, 
      bottomFrameHeight - this.scale.height * 0.04, 
      20
    );

    // 创建问题显示区域 - 位于底部框内
    const questionY = bottomFrameY + this.scale.height * 0.06;
    this.questionText = this.add.text(this.scale.width / 2, questionY, '', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.028}px`,
      color: '#ffffff',
      fontStyle: 'bold',
      padding: { x: 15, y: 8 },
      wordWrap: { width: this.scale.width * 0.85 },
      align: 'center',
    }).setOrigin(0.5);
    this.questionText.setResolution(window.devicePixelRatio || 1);

    // 创建答案选项按钮 - 垂直排列，位于底部框内
    const buttonStartY = bottomFrameY + this.scale.height * 0.12;
    const buttonSpacing = this.scale.height * 0.042;
    const buttonWidth = this.scale.width * 0.82;
    const buttonHeight = this.scale.height * 0.038;
    
    for (let i = 0; i < 4; i++) {
      const x = this.scale.width / 2;
      const y = buttonStartY + (i * buttonSpacing);
      
      // 按钮背景
      const button = this.add.rectangle(x, y, buttonWidth, buttonHeight, 0x4CAF50, 0.9);
      button.setInteractive();
      button.setStrokeStyle(2, 0x2E7D32);
      
      // 按钮文本
      const text = this.add.text(x, y, '', {
        fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.022}px`,
        color: '#ffffff',
        fontStyle: 'bold',
        wordWrap: { width: buttonWidth * 0.9 },
        align: 'center',
      }).setOrigin(0.5);
      text.setResolution(window.devicePixelRatio || 1);
      
      // 按钮点击事件
      button.on('pointerdown', () => this.handleAnswerClick(i));
      button.on('pointerover', () => {
        button.setFillStyle(0x66BB6A);
        button.setScale(1.02);
      });
      button.on('pointerout', () => {
        button.setFillStyle(0x4CAF50);
        button.setScale(1.0);
      });
      
      this.optionButtons.push(button);
      this.optionTexts.push(text);
    }

  }

  private startNextRound() {
    if (this.monsters.every(monster => monster.isDeadStatus())) {
      // 所有怪物都被击败，进入胜利场景
      this.scene.start('VictoryScene', { 
        victory: true,
        characters: this.characters.map(char => char.getConfig()),
        consensusResults: this.consensusResults,
        consensusTheme: this.gameData?.consensusTheme
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
    // 优先使用AI生成的冲突问题
    if (this.gameData?.conflictQuestions && this.gameData.conflictQuestions.length > 0) {
      // 如果还有AI题目，使用下一个AI题目
      if (this.currentQuestionIndex < this.gameData.conflictQuestions.length) {
        this.currentQuestion = this.gameData.conflictQuestions[this.currentQuestionIndex];
        this.currentQuestionIndex++;
        console.log(`🤖 使用AI题目 ${this.currentQuestionIndex}/${this.gameData.conflictQuestions.length}:`, this.currentQuestion?.question);
        return;
      }
    }
    
    // 如果没有AI题目或已用完，使用备用题目
    const fallbackQuestions: Question[] = [
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

    // 随机选择一个备用问题
    this.currentQuestion = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
    console.log('📋 使用备用题目:', this.currentQuestion?.text);
  }

  private displayQuestion() {
    if (!this.currentQuestion) return;
    
    // 显示问题文本 - 兼容新旧格式
    const questionText = ('question' in this.currentQuestion) ? this.currentQuestion.question : this.currentQuestion.text || '';
    this.questionText?.setText(questionText);
    
    // 显示选项 - 兼容新旧格式  
    const options = this.currentQuestion.options || [];
    options.forEach((option, index) => {
      if (this.optionTexts[index]) {
        this.optionTexts[index].setText(option);
      }
      if (this.optionButtons[index]) {
        this.optionButtons[index].setVisible(true);
      }
    });
    
    // 隐藏多余的按钮
    for (let i = options.length; i < this.optionButtons.length; i++) {
      this.optionButtons[i].setVisible(false);
      this.optionTexts[i].setText('');
    }
  }

  private handleAnswerClick(optionIndex: number) {
    if (!this.currentQuestion || this.battlePhase !== 'question') return;
    
    const options = this.currentQuestion.options || [];
    const selectedOption = options[optionIndex];
    
    // 模拟双人答案 (实际应该来自外部输入)
    if (!this.player1Answer) {
      this.player1Answer = selectedOption;
      this.showFeedback(`玩家1选择: ${selectedOption}`);
      
      // 模拟玩家2自动选择 (2秒后)
      setTimeout(() => {
        if (!this.player2Answer && this.currentQuestion) {
          const options = this.currentQuestion.options || [];
          const randomIndex = Math.floor(Math.random() * options.length);
          this.player2Answer = options[randomIndex];
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
    
    // 记录共识结果
    const questionText = ('question' in this.currentQuestion) ? this.currentQuestion.question : this.currentQuestion.text || '';
    const category = this.currentQuestion.category || 'general';
    this.consensusResults.push({
      question: questionText,
      selectedAnswer: this.player1Answer,
      consistency: consistency,
      category: category
    });
    
    console.log('📊 共识结果记录:', {
      question: questionText.substring(0, 20) + '...',
      answer: this.player1Answer,
      consistency: consistency
    });
    
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