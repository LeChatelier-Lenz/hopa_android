import Phaser from 'phaser';
import { Monster } from '../entities/Monster';
import type { MonsterConfig } from '../entities/Monster';
import { Character } from '../entities/Character';
import { apiConfig } from '../../../config/api';

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
  maxParticipants?: number;
}

interface Question {
  id: string;
  text: string;
  options: string[];
  category: 'budget' | 'time' | 'attraction' | 'cuisine' | 'preference' | 'communication' | 'principle' | 'general';
}

export class BattleScene extends Phaser.Scene {
  private characters: Character[] = [];
  private monsters: Monster[] = [];
  private currentQuestion: Question | ConflictQuestion | null = null;
  private aiQuestions: ConflictQuestion[] = [];
  private currentQuestionIndex: number = 0;
  private consensusResults: any[] = [];
  private sortedOrder: string[] = []; // 用于排序题的当前排序状态
  private questionType: 'choice' | 'fill' | 'sort' = 'choice';
  private selectedSortIndex: number = -1; // 当前选中的排序选项
  private player1Answer: string | null = null;
  private player2Answer: string | null = null;
  private battlePhase: 'waiting' | 'question' | 'answering' | 'result' | 'victory' = 'waiting';
  private eventCallback?: (event: string, data?: any) => void;
  private gameData?: GameData;
  private loadingElements: Phaser.GameObjects.GameObject[] = [];
  
  // UI元素
  private questionText?: Phaser.GameObjects.Text;
  private optionButtons: Phaser.GameObjects.Rectangle[] = [];
  private optionTexts: Phaser.GameObjects.Text[] = [];
  private healthBars: { [key: string]: Phaser.GameObjects.Graphics } = {};
  private backgroundMusic?: Phaser.Sound.BaseSound;
  private characterSprites: Phaser.GameObjects.Image[] = []; // 存储角色图片引用

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
        // 使用动态后端代理URL
        const proxyUrl = apiConfig.buildImageProxyUrl(this.gameData.backgroundUrl);
        console.log('🔧 使用代理URL:', proxyUrl);
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
    
    // 加载"共识怪兽登场"图片
    this.load.image('monster_entry', '/src/assets/game/monsters/Monster-is-Making-its-Appearance.png');
    
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
    
    // 加载新的UI界面图片
    this.load.image('question_box', '/src/assets/game/ui/Battle-Interface- Question-Box.png');
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

    // 添加游戏标题 - 移到更高位置避免被遮挡
    const titleText = this.add.text(this.scale.width / 2, this.scale.height * 0.03, '共识征程大作战', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.045}px`,
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);
    titleText.setResolution(window.devicePixelRatio || 1);
  }


  private setupCharacters() {
    if (!this.gameData) return;

    // 根据maxParticipants确定角色数量
    const maxParticipants = this.gameData.maxParticipants || 2;
    const actualCharacterCount = Math.min(maxParticipants, 4); // 最多显示4个角色
    
    console.log(`🎮 根据房间设置显示${actualCharacterCount}个角色 (房间最大人数: ${maxParticipants})`);

    const charY = this.scale.height * 0.42; 
    const charSize = Math.min(this.scale.width, this.scale.height) * 0.18; // 适当调整尺寸以适应更多角色

    // 计算角色位置
    const characterImages = ['character1', 'character2', 'character3', 'character4'];
    const characterNames = ['玩家1', '玩家2', '玩家3', '玩家4'];
    
    for (let i = 0; i < actualCharacterCount; i++) {
      // 根据角色数量计算水平位置
      let charX: number;
      if (actualCharacterCount === 1) {
        charX = this.scale.width * 0.5; // 单个角色居中
      } else if (actualCharacterCount === 2) {
        charX = this.scale.width * (i === 0 ? 0.3 : 0.7); // 两个角色
      } else if (actualCharacterCount === 3) {
        charX = this.scale.width * (0.2 + i * 0.3); // 三个角色
      } else {
        charX = this.scale.width * (0.15 + i * 0.23); // 四个角色
      }

      // 创建角色图片
      const charSprite = this.add.image(charX, charY, characterImages[i]);
      charSprite.setDisplaySize(charSize, charSize);
      charSprite.setInteractive();
      charSprite.on('pointerdown', () => this.showEquipmentDetails(i));
      charSprite.on('pointerover', () => charSprite.setScale(1.05));
      charSprite.on('pointerout', () => charSprite.setScale(1.0));
      
      // 存储角色图片引用
      this.characterSprites.push(charSprite);
      
      // 创建角色对象
      const characterConfig = i === 0 ? this.gameData.player1Config : this.gameData.player2Config;
      const character = new Character(this, charX, charY, characterConfig);
      character.getSprite().setVisible(false); // 隐藏默认sprite
      
      this.characters.push(character);
      
      // 添加角色名称
      const playerText = this.add.text(charX, charY + charSize/2 + 25, characterNames[i], {
        fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.028}px`,
        color: '#ffffff',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2,
      }).setOrigin(0.5);
      playerText.setResolution(window.devicePixelRatio || 1);
    }

    // 添加点击提示
    const clickHint = this.add.text(this.scale.width / 2, this.scale.height * 0.52,
      `💡 点击角色查看装备详情 (${actualCharacterCount}/${maxParticipants}人准备就绪)`, {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.020}px`,
      color: '#FFD700',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 1,
      align: 'center',
    }).setOrigin(0.5);
    clickHint.setResolution(window.devicePixelRatio || 1);

    // 3秒后隐藏提示
    setTimeout(() => {
      if (clickHint && clickHint.scene) {
        clickHint.destroy();
      }
    }, 3000);
  }

  private setupMonsters() {
    // 创建怪物 - 位置在屏幕中上部，与角色保持适当距离  
    const monsterX = this.scale.width / 2;
    const monsterY = this.scale.height * 0.22;
    const monsterSize = Math.min(this.scale.width, this.scale.height) * 0.32; // 显著增大怪物尺寸
    
    // 显示怪物登场图片
    this.showMonsterEntryImage(monsterX, monsterY);
    
    // 使用真实怪物图片 - 高清渲染
    const monsterSprite = this.add.image(monsterX, monsterY, 'monster_sprite');
    monsterSprite.setDisplaySize(monsterSize, monsterSize);
    
    // 怪物初始时透明，等待登场动画结束后显示
    monsterSprite.setAlpha(0);
    
    // 延迟2秒后显示怪物
    setTimeout(() => {
      this.tweens.add({
        targets: monsterSprite,
        alpha: 1,
        duration: 1000,
        ease: 'Power2.easeIn'
      });
    }, 2000);
    
    // 根据AI生成的题目总数设置怪物血量
    const aiQuestionCount = this.gameData?.conflictQuestions?.length || 7; // 实际AI题目数量
    const totalQuestionCount = aiQuestionCount; // 只使用AI题目
    const totalHealth = totalQuestionCount * 60; // 每题60血量
    
    console.log(`🎯 设置怪物血量: AI题目${aiQuestionCount}个，总血量${totalHealth}`);
    
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
    
    
    // 添加怪物名称 - 调整位置避免与标题重叠，初始透明
    const monsterNameText = this.add.text(monsterX, monsterY - monsterSize/2 - 50, '共识守护兽', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.032}px`,
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#ff5a5e',
      strokeThickness: 2,
    }).setOrigin(0.5);
    monsterNameText.setResolution(window.devicePixelRatio || 1);
    monsterNameText.setAlpha(0);
    
    // 延迟3秒后显示怪物名称
    setTimeout(() => {
      this.tweens.add({
        targets: monsterNameText,
        alpha: 1,
        duration: 800,
        ease: 'Power2.easeIn'
      });
    }, 3000);
  }

  // 显示怪物登场图片
  private showMonsterEntryImage(monsterX: number, monsterY: number) {
    console.log('👾 显示共识怪物登场图片');
    
    // 创建怪物登场图片
    const entryImage = this.add.image(monsterX, monsterY - 100, 'monster_entry');
    entryImage.setDisplaySize(300, 80); // 调整大小适应界面
    entryImage.setAlpha(0);
    
    // 登场动画效果
    this.tweens.add({
      targets: entryImage,
      alpha: 1,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 800,
      yoyo: true,
      repeat: 1,
      ease: 'Bounce.easeOut',
      onComplete: () => {
        // 动画结束后淡出
        this.tweens.add({
          targets: entryImage,
          alpha: 0,
          duration: 1000,
          delay: 500,
          onComplete: () => {
            entryImage.destroy();
          }
        });
      }
    });
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
    // 创建底部题目显示框 - 使用新的问题框图片
    const bottomFrameHeight = this.scale.height * 0.35; // 稍微增加高度适应新图片
    const bottomFrameY = this.scale.height - bottomFrameHeight;
    
    // 使用新的问题框背景图片
    const questionBoxBg = this.add.image(this.scale.width / 2, bottomFrameY + bottomFrameHeight / 2, 'question_box');
    questionBoxBg.setDisplaySize(this.scale.width * 0.9, bottomFrameHeight - this.scale.height * 0.04);
    questionBoxBg.setAlpha(0.95); // 稍微透明以提高可读性

    // 创建问题显示区域 - 位于底部框内，增大字体并确保换行
    const questionY = bottomFrameY + this.scale.height * 0.06;
    this.questionText = this.add.text(this.scale.width / 2, questionY, '', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.035}px`,
      color: '#ffffff',
      fontStyle: 'bold',
      padding: { x: 15, y: 10 },
      wordWrap: { width: this.scale.width * 0.82, useAdvancedWrap: true },
      align: 'center',
      lineSpacing: 4,
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
      
      // 按钮文本 - 增大字体并优化换行
      const text = this.add.text(x, y, '', {
        fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.027}px`,
        color: '#ffffff',
        fontStyle: 'bold',
        wordWrap: { width: buttonWidth * 0.88, useAdvancedWrap: true },
        align: 'center',
        lineSpacing: 2,
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
        monsters: this.monsters.map(monster => monster.getConfig()),
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
    // 完全使用AI生成的冲突问题
    if (this.gameData?.conflictQuestions && this.gameData.conflictQuestions.length > 0) {
      // 如果还有AI题目，继续使用
      if (this.currentQuestionIndex < this.gameData.conflictQuestions.length) {
        this.currentQuestion = this.gameData.conflictQuestions[this.currentQuestionIndex];
        this.currentQuestionIndex++;
        console.log(`🤖 使用AI题目 ${this.currentQuestionIndex}/${this.gameData.conflictQuestions.length}:`, this.currentQuestion?.question);
        return;
      }
    }
    
    // 如果AI题目用完，战斗应该结束
    console.log('✅ 所有AI题目已完成，战斗即将结束');
    // 设置一个特殊状态表示题目已用完
    this.currentQuestion = null;
  }

  private displayQuestion() {
    if (!this.currentQuestion) return;
    
    // 检测题目类型
    this.questionType = ('type' in this.currentQuestion) ? this.currentQuestion.type : 'choice';
    console.log('📝 题目类型:', this.questionType);
    
    // 显示问题文本 - 兼容新旧格式
    const questionText = ('question' in this.currentQuestion) ? this.currentQuestion.question : this.currentQuestion.text || '';
    this.questionText?.setText(questionText);
    
    // 根据题目类型显示不同的UI
    const options = this.currentQuestion.options || [];
    
    if (this.questionType === 'sort') {
      this.displaySortQuestion(options);
    } else if (this.questionType === 'fill') {
      this.displayFillQuestion();
    } else {
      this.displayChoiceQuestion(options);
    }
  }

  private displayChoiceQuestion(options: string[]) {
    // 传统选择题显示
    options.forEach((option, index) => {
      if (this.optionTexts[index]) {
        this.optionTexts[index].setText(option);
        this.optionTexts[index].setStyle({ color: '#ffffff' }); // 重置颜色
      }
      if (this.optionButtons[index]) {
        this.optionButtons[index].setVisible(true);
        this.optionButtons[index].setFillStyle(0x4CAF50); // 重置颜色
      }
    });
    
    // 隐藏多余的按钮
    for (let i = options.length; i < this.optionButtons.length; i++) {
      this.optionButtons[i].setVisible(false);
      this.optionTexts[i].setText('');
    }
  }

  private displayFillQuestion() {
    // 填空题显示
    console.log('📝 显示填空题');
    
    // 隐藏所有选项按钮
    this.optionButtons.forEach((button, index) => {
      button.setVisible(false);
      if (this.optionTexts[index]) {
        this.optionTexts[index].setText('');
      }
    });
    
    // 创建填空题输入区域
    const inputY = this.scale.height * 0.6;
    const inputWidth = this.scale.width * 0.7;
    const inputHeight = this.scale.height * 0.08;
    
    // 输入框背景
    const inputBg = this.add.rectangle(
      this.scale.width / 2, 
      inputY, 
      inputWidth, 
      inputHeight, 
      0xffffff, 
      0.9
    );
    inputBg.setStrokeStyle(2, 0x2196F3);
    
    // 创建DOM输入框
    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.placeholder = '请输入您的答案...';
    inputElement.style.cssText = `
      position: absolute;
      left: ${(this.scale.width - inputWidth) / 2}px;
      top: ${inputY - inputHeight / 2}px;
      width: ${inputWidth - 20}px;
      height: ${inputHeight - 10}px;
      border: none;
      border-radius: 8px;
      padding: 0 10px;
      font-size: 16px;
      background: transparent;
      color: #333;
      outline: none;
      z-index: 1000;
    `;
    
    // 添加输入框到游戏容器
    const gameContainer = this.game.canvas.parentElement;
    if (gameContainer) {
      gameContainer.appendChild(inputElement);
    } else {
      // 备用方案：添加到body
      document.body.appendChild(inputElement);
    }
    
    // 添加回车键提交功能
    inputElement.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        const answer = inputElement.value.trim();
        if (answer) {
          this.handleFillAnswer(answer);
          // 清理DOM元素
          const gameContainer = this.game.canvas.parentElement;
          if (gameContainer && gameContainer.contains(inputElement)) {
            gameContainer.removeChild(inputElement);
          } else if (document.body.contains(inputElement)) {
            document.body.removeChild(inputElement);
          }
          inputBg.destroy();
          submitButton.destroy();
          submitText.destroy();
        } else {
          // 显示错误提示
          this.showFeedback('请输入答案后再提交');
        }
      }
    });
    
    // 自动聚焦输入框
    setTimeout(() => {
      inputElement.focus();
    }, 100);
    
    // 提交按钮
    const submitButton = this.add.rectangle(
      this.scale.width / 2,
      inputY + inputHeight + 20,
      inputWidth * 0.3,
      inputHeight * 0.8,
      0x4CAF50,
      0.9
    );
    submitButton.setStrokeStyle(2, 0x2E7D32);
    submitButton.setInteractive();
    
    const submitText = this.add.text(
      this.scale.width / 2,
      inputY + inputHeight + 20,
      '提交答案',
      {
        fontSize: '16px',
        color: '#ffffff',
        fontStyle: 'bold',
      }
    ).setOrigin(0.5);
    
    // 提交按钮事件
    submitButton.on('pointerdown', () => {
      const answer = inputElement.value.trim();
      if (answer) {
        this.handleFillAnswer(answer);
        // 清理DOM元素
        const gameContainer = this.game.canvas.parentElement;
        if (gameContainer && gameContainer.contains(inputElement)) {
          gameContainer.removeChild(inputElement);
        } else if (document.body.contains(inputElement)) {
          document.body.removeChild(inputElement);
        }
        inputBg.destroy();
        submitButton.destroy();
        submitText.destroy();
      } else {
        // 显示错误提示
        this.showFeedback('请输入答案后再提交');
      }
    });
    
    submitButton.on('pointerover', () => {
      submitButton.setFillStyle(0x66BB6A);
      submitButton.setScale(1.02);
    });
    
    submitButton.on('pointerout', () => {
      submitButton.setFillStyle(0x4CAF50);
      submitButton.setScale(1.0);
    });
    
    // 添加填空题说明
    this.questionText?.setText(this.questionText.text + '\n\n💡 填空题：请在下方输入框中输入您的答案');
  }

  private displaySortQuestion(options: string[]) {
    // 排序题显示
    console.log('🔄 显示排序题，选项:', options);
    
    // 初始化排序状态
    this.sortedOrder = [...options];
    
    // 显示排序选项
    options.forEach((option, index) => {
      if (this.optionTexts[index]) {
        this.optionTexts[index].setText(`${index + 1}. ${option}`);
        this.optionTexts[index].setStyle({ color: '#ffffff' });
      }
      if (this.optionButtons[index]) {
        this.optionButtons[index].setVisible(true);
        this.optionButtons[index].setFillStyle(0x2196F3); // 蓝色表示可排序
        
        // 移除旧的事件监听器
        this.optionButtons[index].removeAllListeners();
        
        // 确保按钮可交互
        this.optionButtons[index].setInteractive();
        
        // 添加排序专用的点击事件
        this.optionButtons[index].on('pointerdown', () => this.handleSortClick(index));
        this.optionButtons[index].on('pointerover', () => {
          this.optionButtons[index].setFillStyle(0x42A5F5);
          this.optionButtons[index].setScale(1.02);
        });
        this.optionButtons[index].on('pointerout', () => {
          const currentColor = this.selectedSortIndex === index ? 0xFF9800 : 0x2196F3;
          this.optionButtons[index].setFillStyle(currentColor);
          this.optionButtons[index].setScale(1.0);
        });
      }
    });
    
    // 隐藏多余的按钮
    for (let i = options.length; i < this.optionButtons.length; i++) {
      this.optionButtons[i].setVisible(false);
      this.optionTexts[i].setText('');
    }
    
    // 显示排序说明
    this.questionText?.setText(this.questionText.text + '\n\n💡 排序题：点击两个选项来交换位置');
    
    // 添加额外的提示文字
    const hintText = this.add.text(this.scale.width / 2, this.scale.height * 0.72, 
      '蓝色按钮可点击排序 | 橙色表示已选中', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.022}px`,
      color: '#FFD700',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 1,
      align: 'center',
    }).setOrigin(0.5);
    hintText.setResolution(window.devicePixelRatio || 1);
    
    // 3秒后隐藏提示
    setTimeout(() => {
      if (hintText && hintText.scene) {
        hintText.destroy();
      }
    }, 3000);
  }

  private handleSortClick(optionIndex: number) {
    if (this.questionType !== 'sort') return;
    
    console.log('🔄 排序点击:', optionIndex, '当前选中:', this.selectedSortIndex);
    
    if (this.selectedSortIndex === -1) {
      // 第一次点击，选中这个选项
      this.selectedSortIndex = optionIndex;
      this.optionButtons[optionIndex].setFillStyle(0xFF9800); // 橙色表示选中
      this.optionTexts[optionIndex].setStyle({ color: '#FFE0B2' }); // 浅橙色文字
      console.log('✅ 选中选项:', optionIndex);
    } else if (this.selectedSortIndex === optionIndex) {
      // 点击已选中的选项，取消选择
      this.selectedSortIndex = -1;
      this.optionButtons[optionIndex].setFillStyle(0x2196F3); // 恢复蓝色
      this.optionTexts[optionIndex].setStyle({ color: '#ffffff' }); // 恢复白色文字
      console.log('❌ 取消选择');
    } else {
      // 第二次点击不同选项，交换位置
      const selectedIndex = this.selectedSortIndex;
      const targetIndex = optionIndex;
      
      // 交换排序数组中的位置
      [this.sortedOrder[selectedIndex], this.sortedOrder[targetIndex]] = 
      [this.sortedOrder[targetIndex], this.sortedOrder[selectedIndex]];
      
      console.log('🔄 交换位置:', selectedIndex, '<->', targetIndex);
      console.log('📋 新排序:', this.sortedOrder);
      
      // 更新显示
      this.updateSortDisplay();
      
      // 重置选中状态
      this.selectedSortIndex = -1;
      
      // 检查是否完成排序（自动提交）
      setTimeout(() => {
        this.submitSortAnswer();
      }, 500);
    }
  }

  private updateSortDisplay() {
    this.sortedOrder.forEach((option, index) => {
      if (this.optionTexts[index]) {
        this.optionTexts[index].setText(`${index + 1}. ${option}`);
        this.optionTexts[index].setStyle({ color: '#ffffff' });
      }
      if (this.optionButtons[index]) {
        this.optionButtons[index].setFillStyle(0x2196F3); // 重置为蓝色
      }
    });
  }

  private submitSortAnswer() {
    if (this.questionType !== 'sort') return;
    
    // 将排序结果作为答案
    const sortAnswer = this.sortedOrder.join(' > ');
    console.log('📋 排序题答案:', sortAnswer);
    
    if (!this.player1Answer) {
      this.player1Answer = sortAnswer;
      this.showFeedback(`排序完成: ${sortAnswer}`);
      
      // 模拟玩家2的答案（简化处理）
      setTimeout(() => {
        if (!this.player2Answer && this.currentQuestion) {
          // 随机打乱顺序作为玩家2的答案
          const shuffled = [...this.sortedOrder].sort(() => Math.random() - 0.5);
          this.player2Answer = shuffled.join(' > ');
          this.showFeedback(`玩家2排序: ${this.player2Answer}`);
          this.processAnswers();
        }
      }, 2000);
    }
  }

  private calculateSortSimilarity(answer1: string, answer2: string): number {
    // 解析排序答案
    const order1 = answer1.split(' > ');
    const order2 = answer2.split(' > ');
    
    if (order1.length !== order2.length) return 0.3; // 基本分
    
    // 计算位置匹配度
    let matches = 0;
    for (let i = 0; i < order1.length; i++) {
      if (order1[i] === order2[i]) {
        matches++;
      }
    }
    
    // 计算相对顺序保持度
    let pairMatches = 0;
    let totalPairs = 0;
    
    for (let i = 0; i < order1.length; i++) {
      for (let j = i + 1; j < order1.length; j++) {
        totalPairs++;
        const item1_1 = order1[i];
        const item1_2 = order1[j];
        const pos2_1 = order2.indexOf(item1_1);
        const pos2_2 = order2.indexOf(item1_2);
        
        // 如果相对顺序保持一致
        if (pos2_1 !== -1 && pos2_2 !== -1 && pos2_1 < pos2_2) {
          pairMatches++;
        }
      }
    }
    
    // 综合计算相似度
    const positionScore = matches / order1.length; // 位置匹配度 (0-1)
    const orderScore = totalPairs > 0 ? pairMatches / totalPairs : 1; // 相对顺序保持度 (0-1)
    
    // 加权平均
    const similarity = (positionScore * 0.6 + orderScore * 0.4);
    
    console.log('🔄 排序相似度计算:', {
      order1, order2,
      positionMatches: matches,
      positionScore,
      orderScore,
      similarity
    });
    
    return Math.max(0.3, similarity); // 最低0.3分
  }

  private calculateFillSimilarity(answer1: string, answer2: string): number {
    // 填空题相似度计算
    const text1 = answer1.toLowerCase().trim();
    const text2 = answer2.toLowerCase().trim();
    
    // 完全一致
    if (text1 === text2) return 1.0;
    
    // 包含关系
    if (text1.includes(text2) || text2.includes(text1)) return 0.8;
    
    // 计算公共字符
    const chars1 = text1.split('');
    const chars2 = text2.split('');
    const commonChars = chars1.filter(char => chars2.includes(char));
    
    if (commonChars.length === 0) return 0.2; // 最低分
    
    // 计算字符相似度
    const charSimilarity = commonChars.length / Math.max(chars1.length, chars2.length);
    
    // 计算长度相似度
    const lengthSimilarity = 1 - Math.abs(chars1.length - chars2.length) / Math.max(chars1.length, chars2.length);
    
    // 综合评分
    const similarity = Math.min(0.9, charSimilarity * 0.6 + lengthSimilarity * 0.4);
    
    console.log('📝 填空题相似度计算:', {
      text1, text2,
      charSimilarity,
      lengthSimilarity,
      similarity
    });
    
    return similarity;
  }

  private handleAnswerClick(optionIndex: number) {
    if (!this.currentQuestion || this.battlePhase !== 'question') return;
    
    // 排序题和填空题已经有专门的处理方法
    if (this.questionType === 'sort' || this.questionType === 'fill') return;
    
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

  private handleFillAnswer(answer: string) {
    if (!this.currentQuestion || this.battlePhase !== 'question') return;
    
    console.log('📝 填空题答案:', answer);
    
    // 模拟双人答案 (实际应该来自外部输入)
    if (!this.player1Answer) {
      this.player1Answer = answer;
      this.showFeedback(`玩家1回答: ${answer}`);
      
      // 模拟玩家2自动回答 (2秒后)
      setTimeout(() => {
        if (!this.player2Answer && this.currentQuestion) {
          // 生成一个相似的答案
          const similarAnswers = [
            answer + '（类似）',
            answer + '吧',
            '我觉得' + answer,
            answer + '比较合适',
            answer + '应该可以'
          ];
          const randomAnswer = similarAnswers[Math.floor(Math.random() * similarAnswers.length)];
          this.player2Answer = randomAnswer;
          this.showFeedback(`玩家2回答: ${this.player2Answer}`);
          this.processAnswers();
        }
      }, 2000);
    }
  }

  private processAnswers() {
    if (!this.player1Answer || !this.player2Answer || !this.currentQuestion) return;
    
    // 计算一致性得分 - 根据题目类型使用不同算法
    let consistency: number;
    
    if (this.questionType === 'sort') {
      // 排序题：计算排序相似度
      consistency = this.calculateSortSimilarity(this.player1Answer, this.player2Answer);
    } else if (this.questionType === 'fill') {
      // 填空题：计算文本相似度
      consistency = this.calculateFillSimilarity(this.player1Answer, this.player2Answer);
    } else {
      // 选择题：完全一致或部分一致
      consistency = this.player1Answer === this.player2Answer ? 1.0 : 0.5;
    }
    
    // 固定伤害机制：每题造成60点固定伤害，确保所有题目完成后boss被击败
    const damage = 60;
    
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

  // 显示装备详情 - 直接显示已选择的装备，无需AI生成
  private showEquipmentDetails(characterIndex: number) {
    console.log('🎒 显示角色装备详情:', characterIndex);
    
    // 重置当前角色的缩放，防止悬停状态的放大效果保持
    if (this.characterSprites[characterIndex] && this.characterSprites[characterIndex].scene) {
      this.characterSprites[characterIndex].setScale(1.0);
    }
    
    // 获取角色配置
    const characterConfig = characterIndex === 0 ? this.gameData?.player1Config : this.gameData?.player2Config;
    
    if (!characterConfig) {
      console.warn('⚠️ 未找到角色配置');
      return;
    }
    
    // 直接使用角色的已选择装备配置
    const equipment = {
      budgetAmulet: {
        enabled: characterConfig.equipment?.budgetAmulet?.enabled || false,
        range: characterConfig.equipment?.budgetAmulet?.selectedRange || [500, 1000],
        name: '预算护符',
        description: '控制消费范围'
      },
      timeCompass: {
        enabled: characterConfig.equipment?.timeCompass?.enabled || false,
        duration: characterConfig.equipment?.timeCompass?.selectedDuration || 'half-day',
        name: '时间指南针',  
        description: '规划活动时长'
      },
      attractionShield: {
        enabled: characterConfig.equipment?.attractionShield?.enabled || false,
        preferences: characterConfig.equipment?.attractionShield?.selectedAttractions || ['未选择'],
        name: '景点护盾',
        description: '探索目的地偏好'
      },
      cuisineGem: {
        enabled: characterConfig.equipment?.cuisineGem?.enabled || false,
        types: characterConfig.equipment?.cuisineGem?.selectedCuisines || ['未选择'],
        name: '美食宝石',
        description: '品尝美食偏好'
      }
    };

    // 直接显示装备详情
    this.createEquipmentModal(characterIndex, equipment);
  }


  private createEquipmentModal(characterIndex: number, equipment: any) {
    // 创建遮罩背景
    const modalBg = this.add.graphics();
    modalBg.fillStyle(0x000000, 0.7);
    modalBg.fillRect(0, 0, this.scale.width, this.scale.height);
    modalBg.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.scale.width, this.scale.height), Phaser.Geom.Rectangle.Contains);
    
    // 创建装备详情面板
    const modal = this.add.graphics();
    const modalWidth = this.scale.width * 0.85;
    const modalHeight = this.scale.height * 0.7;
    const modalX = (this.scale.width - modalWidth) / 2;
    const modalY = (this.scale.height - modalHeight) / 2;

    // 模态框背景
    modal.fillStyle(0x2E3F4F, 0.95);
    modal.fillRoundedRect(modalX, modalY, modalWidth, modalHeight, 15);
    
    // 模态框边框
    modal.lineStyle(3, 0xFFD700, 1);
    modal.strokeRoundedRect(modalX, modalY, modalWidth, modalHeight, 15);

    // 标题
    const titleText = this.add.text(this.scale.width / 2, modalY + 30, 
      `玩家${characterIndex + 1} 装备详情`, {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.045}px`,
      color: '#FFD700',
      fontStyle: 'bold',
      align: 'center',
    }).setOrigin(0.5);

    // 装备列表
    const equipmentTexts: Phaser.GameObjects.Text[] = [];
    let yOffset = modalY + 80;
    
    Object.entries(equipment).forEach(([key, item]: [string, any], index) => {
      if (item.enabled) {
        // 装备名称
        const nameText = this.add.text(modalX + 20, yOffset, 
          `🎒 ${item.name}`, {
          fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.038}px`,
          color: '#ffffff',
          fontStyle: 'bold',
        });
        equipmentTexts.push(nameText);

        // 装备描述
        const descText = this.add.text(modalX + 20, yOffset + 25, 
          item.description, {
          fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.032}px`,
          color: '#CCCCCC',
        });
        equipmentTexts.push(descText);

        // 装备数值
        let valueText = '';
        if (item.range) {
          valueText = `预算范围: ¥${item.range[0]} - ¥${item.range[1]}`;
        } else if (item.duration) {
          valueText = `时长设置: ${item.duration}`;
        } else if (item.preferences) {
          valueText = `偏好: ${item.preferences.join(', ')}`;
        } else if (item.types) {
          valueText = `类型: ${item.types.join(', ')}`;
        }

        const valueTextObj = this.add.text(modalX + 20, yOffset + 45, 
          valueText, {
          fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.030}px`,
          color: '#90EE90',
          wordWrap: { width: modalWidth - 60, useAdvancedWrap: true }
        });
        equipmentTexts.push(valueTextObj);

        yOffset += 90;
      }
    });

    // 关闭按钮
    const closeButton = this.add.text(this.scale.width / 2, modalY + modalHeight - 40,
      '点击任意处关闭', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.035}px`,
      color: '#FFD700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // 收集所有需要销毁的元素
    const allModalElements = [modalBg, modal, titleText, closeButton, ...equipmentTexts];
    
    // 设置点击关闭事件
    modalBg.on('pointerdown', () => this.closeEquipmentModal(allModalElements));
  }

  private closeEquipmentModal(elements: Phaser.GameObjects.GameObject[]) {
    elements.forEach(element => {
      if (element && element.scene) {
        element.destroy();
      }
    });
    
    // 角色PNG保持正常尺寸，无需放大
    this.characterSprites.forEach(sprite => {
      if (sprite && sprite.scene) {
        sprite.setScale(1.0);
      }
    });
  }
}