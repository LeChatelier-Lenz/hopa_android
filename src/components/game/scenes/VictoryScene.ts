import Phaser from 'phaser';

interface ConflictQuestion {
  id: string;
  type: 'choice' | 'fill' | 'sort';
  question: string;
  options?: string[];
  correctAnswer?: number | string | string[];
  explanation: string;
  category: string;
}

interface ConsensusResult {
  question: string;
  selectedAnswer: string;
  consistency: number;
  category: string;
}

interface VictoryData {
  victory: boolean;
  characters: any[];
  consensusResults?: ConsensusResult[];
  consensusTheme?: {
    title: string;
    description: string;
  };
  maxParticipants?: number;
}

export class VictoryScene extends Phaser.Scene {
  private victoryData?: VictoryData;
  private eventCallback?: (event: string, data?: any) => void;

  constructor() {
    super({ key: 'VictoryScene' });
  }

  init(data: VictoryData) {
    this.victoryData = data;
    console.log('🏆 胜利页面数据:', data);
  }

  preload() {
    // 加载卡片背景图片
    this.load.image('card_bg1', '/src/assets/game/ui/card-background1.png');
    this.load.image('card_bg2', '/src/assets/game/ui/card-background2.png');
    
    // 加载角色图片
    this.load.image('character1', '/src/assets/game/characters/cha1.jpg');
    this.load.image('character2', '/src/assets/game/characters/cha2.jpg');
    this.load.image('character3', '/src/assets/game/characters/cha3.jpg');
    this.load.image('character4', '/src/assets/game/characters/cha4.jpg');
    
    // 加载怪物图片
    this.load.image('monster1', '/src/assets/game/monsters/monster1.png');
    this.load.image('monster2', '/src/assets/game/monsters/monster2.jpg');
    this.load.image('monster3', '/src/assets/game/monsters/monster3.jpg');
    this.load.image('monster4', '/src/assets/game/monsters/monster4.jpg');
  }

  create() {
    // 创建AI生成的背景
    this.createGameBackground();
    
    // 创建居中的共识成果卡片
    this.createConsensusCard();
    
    // 添加操作按钮
    this.createActionButtons();
  }

  private createGameBackground() {
    // 如果有AI生成的背景图，使用它
    const backgroundUrl = (this.victoryData as any)?.backgroundUrl;
    if (backgroundUrl) {
      // 加载并显示AI生成的背景
      this.load.image('ai_background', backgroundUrl);
      this.load.start();
      this.load.once('complete', () => {
        const bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'ai_background');
        bg.setDisplaySize(this.scale.width, this.scale.height);
        bg.setAlpha(0.7); // 稍微透明，避免影响卡片可读性
      });
    } else {
      // 创建默认渐变背景
      const bg = this.add.graphics();
      bg.fillGradientStyle(0x667eea, 0x764ba2, 0x667eea, 0x764ba2, 1);
      bg.fillRect(0, 0, this.scale.width, this.scale.height);
    }

    // 添加闪烁星星效果
    this.createStarEffect();
  }

  private createConsensusCard() {
    // 创建居中的共识成果卡片
    const cardWidth = Math.min(this.scale.width * 0.85, 400); // 限制最大宽度
    const cardHeight = Math.min(this.scale.height * 0.75, 600); // 限制最大高度
    const cardX = (this.scale.width - cardWidth) / 2;
    const cardY = (this.scale.height - cardHeight) / 2;

    // 添加卡片阴影效果
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.3);
    shadow.fillRoundedRect(cardX + 6, cardY + 6, cardWidth, cardHeight, 20);

    // 使用卡片背景图片 - 随机选择一个背景
    const bgKey = Math.random() > 0.5 ? 'card_bg1' : 'card_bg2';
    const cardBg = this.add.image(cardX + cardWidth/2, cardY + cardHeight/2, bgKey);
    cardBg.setDisplaySize(cardWidth, cardHeight);
    cardBg.setOrigin(0.5);

    // 添加入场动画
    cardBg.setScale(0);
    shadow.setScale(0);
    this.tweens.add({
      targets: [cardBg, shadow],
      scaleX: 1,
      scaleY: 1,
      duration: 800,
      ease: 'Back.easeOut'
    });

    // 创建卡片内容
    this.createCardContent(cardX, cardY, cardWidth, cardHeight);
  }

  private createCardContent(cardX: number, cardY: number, cardWidth: number, cardHeight: number) {
    const centerX = this.scale.width / 2;
    
    // 胜利标题
    const victoryText = this.add.text(centerX, cardY + 40, '🎉 共识达成！', {
      fontSize: `${Math.min(cardWidth, cardHeight) * 0.08}px`,
      color: '#FF6B6B',
      fontStyle: 'bold',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // 共识主题
    const title = this.victoryData?.consensusTheme?.title || '共识活动';
    const titleText = this.add.text(centerX, cardY + 90, `「${title}」`, {
      fontSize: `${Math.min(cardWidth, cardHeight) * 0.06}px`,
      color: '#2C3E50',
      fontStyle: 'bold',
      wordWrap: { width: cardWidth * 0.8, useAdvancedWrap: true },
      align: 'center'
    }).setOrigin(0.5);

    // 日期和状态
    const currentDate = new Date().toLocaleDateString('zh-CN');
    const statusText = this.add.text(centerX, cardY + 140, `${currentDate} · 共识达成`, {
      fontSize: `${Math.min(cardWidth, cardHeight) * 0.04}px`,
      color: '#7F8C8D',
      fontStyle: 'normal'
    }).setOrigin(0.5);

    // 参与者和怪兽区域
    this.createCharactersAndMonstersSection(cardX, cardY + 180, cardWidth, cardHeight - 280);

    // 共识成果摘要
    this.createConsensusResultsSection(cardX, cardY + cardHeight - 140, cardWidth);

    // Hopa 品牌标识
    const brandText = this.add.text(centerX, cardY + cardHeight - 30, 'Hopa · AI共识助手', {
      fontSize: `${Math.min(cardWidth, cardHeight) * 0.035}px`,
      color: '#FF6B6B',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // 给所有文本添加入场动画
    const allTexts = [victoryText, titleText, statusText, brandText];
    allTexts.forEach((text, index) => {
      text.setAlpha(0);
      this.tweens.add({
        targets: text,
        alpha: 1,
        y: text.y - 10,
        duration: 600,
        delay: 300 + index * 150,
        ease: 'Power2.easeOut'
      });
    });
  }

  private createCharactersAndMonstersSection(x: number, y: number, width: number, height: number) {
    const centerX = this.scale.width / 2;
    const sectionHeight = height / 2;
    
    // 参与者区域
    const participantsLabel = this.add.text(centerX, y + 10, '🎭 参与共识', {
      fontSize: `${Math.min(width, height) * 0.06}px`,
      color: '#34495E',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // 显示实际参与的角色
    const actualCharacters = this.victoryData?.characters || [];
    const participantCount = Math.min(actualCharacters.length, 4);
    
    if (participantCount > 0) {
      const avatarSize = Math.min(width / (participantCount + 1), 60);
      const avatarSpacing = width * 0.8 / participantCount;
      const startX = centerX - ((participantCount - 1) * avatarSpacing / 2);

      for (let i = 0; i < participantCount; i++) {
        const character = actualCharacters[i];
        const avatarX = startX + i * avatarSpacing;
        const avatarY = y + 50;

        // 使用角色的实际图片
        const characterKey = character?.character?.image || `character${(i % 4) + 1}`;
        const avatar = this.add.image(avatarX, avatarY, characterKey);
        avatar.setDisplaySize(avatarSize, avatarSize);
        avatar.setOrigin(0.5);
        
        // 创建圆形遮罩
        const mask = this.add.graphics();
        mask.fillStyle(0xffffff);
        mask.fillCircle(avatarX, avatarY, avatarSize / 2);
        avatar.setMask(mask.createGeometryMask());

        // 添加边框
        const border = this.add.graphics();
        border.lineStyle(3, 0x3498DB);
        border.strokeCircle(avatarX, avatarY, avatarSize / 2);

        // 头像动画
        avatar.setScale(0);
        border.setAlpha(0);
        this.tweens.add({
          targets: avatar,
          scaleX: 1,
          scaleY: 1,
          duration: 500,
          delay: 800 + i * 150,
          ease: 'Back.easeOut'
        });
        this.tweens.add({
          targets: border,
          alpha: 1,
          duration: 300,
          delay: 1000 + i * 150
        });
      }
    }

    // 打败的怪兽区域
    const monstersLabel = this.add.text(centerX, y + sectionHeight + 20, '👹 击败的分歧', {
      fontSize: `${Math.min(width, height) * 0.06}px`,
      color: '#E74C3C',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // 显示实际击败的怪兽
    const defeatedMonsters = (this.victoryData as any)?.monsters || [];
    const monsterCount = Math.min(defeatedMonsters.length, 4);
    
    if (monsterCount > 0) {
      const monsterSize = Math.min(width / (monsterCount + 1), 50);
      const monsterSpacing = width * 0.6 / monsterCount;
      const monsterStartX = centerX - ((monsterCount - 1) * monsterSpacing / 2);

      for (let i = 0; i < monsterCount; i++) {
        const monster = defeatedMonsters[i];
        const monsterX = monsterStartX + i * monsterSpacing;
        const monsterY = y + sectionHeight + 60;

        // 使用怪兽的实际图片
        const monsterKey = monster?.image || `monster${(i % 4) + 1}`;
        const monsterSprite = this.add.image(monsterX, monsterY, monsterKey);
        monsterSprite.setDisplaySize(monsterSize, monsterSize);
        monsterSprite.setOrigin(0.5);
        monsterSprite.setTint(0x666666); // 变灰表示被击败
        monsterSprite.setAlpha(0.7);

        // 添加击败效果
        const strikeThrough = this.add.graphics();
        strikeThrough.lineStyle(4, 0xFF0000);
        strikeThrough.lineBetween(
          monsterX - monsterSize/2, monsterY - monsterSize/2,
          monsterX + monsterSize/2, monsterY + monsterSize/2
        );

        // 怪兽动画
        monsterSprite.setScale(0);
        strikeThrough.setAlpha(0);
        this.tweens.add({
          targets: monsterSprite,
          scaleX: 1,
          scaleY: 1,
          duration: 400,
          delay: 1200 + i * 100,
          ease: 'Bounce.easeOut'
        });
        this.tweens.add({
          targets: strikeThrough,
          alpha: 1,
          duration: 200,
          delay: 1500 + i * 100
        });
      }
    }

    // 如果没有数据，显示占位信息
    if (participantCount === 0) {
      const noDataText = this.add.text(centerX, y + 50, '暂无参与角色信息', {
        fontSize: `${Math.min(width, height) * 0.04}px`,
        color: '#95A5A6',
        fontStyle: 'italic'
      }).setOrigin(0.5);
      
      noDataText.setAlpha(0);
      this.tweens.add({
        targets: noDataText,
        alpha: 1,
        duration: 400,
        delay: 800
      });
    }

    if (monsterCount === 0) {
      const noMonstersText = this.add.text(centerX, y + sectionHeight + 60, '完美达成，无分歧需要解决！', {
        fontSize: `${Math.min(width, height) * 0.04}px`,
        color: '#95A5A6',
        fontStyle: 'italic'
      }).setOrigin(0.5);
      
      noMonstersText.setAlpha(0);
      this.tweens.add({
        targets: noMonstersText,
        alpha: 1,
        duration: 400,
        delay: 1200
      });
    }

    // 标签动画
    [participantsLabel, monstersLabel].forEach((label, index) => {
      label.setAlpha(0);
      this.tweens.add({
        targets: label,
        alpha: 1,
        duration: 400,
        delay: 600 + index * 300,
        ease: 'Power2.easeOut'
      });
    });
  }

  private createConsensusResultsSection(x: number, y: number, width: number) {
    const centerX = this.scale.width / 2;
    
    // 共识成果标题
    const resultsLabel = this.add.text(centerX, y + 10, '📊 共识成果', {
      fontSize: `${Math.min(width, 100) * 0.06}px`,
      color: '#27AE60',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // 显示共识统计
    const consensusResults = this.victoryData?.consensusResults || [];
    const totalQuestions = Math.max(consensusResults.length, 3);
    const consensusRate = consensusResults.length > 0 
      ? Math.round((consensusResults.reduce((sum, r) => sum + r.consistency, 0) / consensusResults.length) * 100)
      : 85; // 默认值

    // 共识率显示
    const rateText = this.add.text(centerX, y + 45, `共识率: ${consensusRate}%`, {
      fontSize: `${Math.min(width, 100) * 0.05}px`,
      color: consensusRate >= 80 ? '#27AE60' : consensusRate >= 60 ? '#F39C12' : '#E74C3C',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // 问题统计
    const questionText = this.add.text(centerX, y + 75, `解决分歧: ${totalQuestions} 个`, {
      fontSize: `${Math.min(width, 100) * 0.045}px`,
      color: '#34495E'
    }).setOrigin(0.5);

    // 成就等级
    let achievement = '';
    if (consensusRate >= 90) achievement = '🏆 完美共识';
    else if (consensusRate >= 80) achievement = '🥇 优秀共识';
    else if (consensusRate >= 70) achievement = '🥈 良好共识';
    else achievement = '🥉 基础共识';

    const achievementText = this.add.text(centerX, y + 105, achievement, {
      fontSize: `${Math.min(width, 100) * 0.045}px`,
      color: '#9B59B6',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // 成果动画
    [resultsLabel, rateText, questionText, achievementText].forEach((text, index) => {
      text.setAlpha(0);
      this.tweens.add({
        targets: text,
        alpha: 1,
        y: text.y - 5,
        duration: 400,
        delay: 1800 + index * 200,
        ease: 'Power2.easeOut'
      });
    });
  }

  private createStarEffect() {
    // 创建多层次星星背景效果
    for (let i = 0; i < 30; i++) {
      const starType = Phaser.Math.Between(0, 2);
      const starEmoji = starType === 0 ? '✨' : starType === 1 ? '⭐' : '🌟';
      
      const star = this.add.text(
        Phaser.Math.Between(0, this.scale.width),
        Phaser.Math.Between(0, this.scale.height),
        starEmoji,
        { fontSize: `${Phaser.Math.Between(8, 20)}px` }
      );

      // 不同类型星星的动画
      this.tweens.add({
        targets: star,
        alpha: { from: 0.3, to: 1 },
        scale: { from: 0.8, to: 1.2 },
        duration: Phaser.Math.Between(1500, 3000),
        delay: Phaser.Math.Between(0, 2000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // 旋转动画
      this.tweens.add({
        targets: star,
        rotation: 2 * Math.PI,
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
        ease: 'Linear'
      });
    }
  }

  private createActionButtons() {
    const buttonY = this.scale.height * 0.88;
    const buttonWidth = Math.min(this.scale.width * 0.35, 140);
    const buttonHeight = 45;

    // 保存相册按钮 - 渐变效果
    const saveBtn = this.add.graphics();
    saveBtn.fillGradientStyle(0xFFB74D, 0xFFB74D, 0xFF9800, 0xF57C00, 1);
    saveBtn.fillRoundedRect(this.scale.width * 0.1, buttonY, buttonWidth, buttonHeight, 25);
    
    // 按钮阴影
    const saveShadow = this.add.graphics();
    saveShadow.fillStyle(0x000000, 0.2);
    saveShadow.fillRoundedRect(this.scale.width * 0.1 + 2, buttonY + 2, buttonWidth, buttonHeight, 25);
    
    saveBtn.setInteractive(new Phaser.Geom.Rectangle(this.scale.width * 0.1, buttonY, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);

    const saveText = this.add.text(this.scale.width * 0.275, buttonY + buttonHeight / 2, '💾 保存相册', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.022}px`,
      color: '#ffffff',
      fontStyle: 'bold',
      shadow: { offsetX: 1, offsetY: 1, color: '#000000', blur: 2, fill: true }
    }).setOrigin(0.5);

    // 加入日历按钮 - 渐变效果
    const calendarBtn = this.add.graphics();
    calendarBtn.fillGradientStyle(0x66BB6A, 0x66BB6A, 0x4CAF50, 0x388E3C, 1);
    calendarBtn.fillRoundedRect(this.scale.width * 0.55, buttonY, buttonWidth, buttonHeight, 25);
    
    // 按钮阴影
    const calendarShadow = this.add.graphics();
    calendarShadow.fillStyle(0x000000, 0.2);
    calendarShadow.fillRoundedRect(this.scale.width * 0.55 + 2, buttonY + 2, buttonWidth, buttonHeight, 25);
    
    calendarBtn.setInteractive(new Phaser.Geom.Rectangle(this.scale.width * 0.55, buttonY, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);

    const calendarText = this.add.text(this.scale.width * 0.725, buttonY + buttonHeight / 2, '📅 加入日历', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.022}px`,
      color: '#ffffff',
      fontStyle: 'bold',
      shadow: { offsetX: 1, offsetY: 1, color: '#000000', blur: 2, fill: true }
    }).setOrigin(0.5);

    // 按钮交互
    saveBtn.on('pointerdown', () => this.saveToAlbum());
    calendarBtn.on('pointerdown', () => this.addToCalendar());

    // 按钮点击效果
    saveBtn.on('pointerover', () => {
      this.tweens.add({
        targets: saveBtn,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 200,
        ease: 'Power2.easeOut'
      });
    });

    saveBtn.on('pointerout', () => {
      this.tweens.add({
        targets: saveBtn,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Power2.easeOut'
      });
    });

    calendarBtn.on('pointerover', () => {
      this.tweens.add({
        targets: calendarBtn,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 200,
        ease: 'Power2.easeOut'
      });
    });

    calendarBtn.on('pointerout', () => {
      this.tweens.add({
        targets: calendarBtn,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Power2.easeOut'
      });
    });

    // 按钮入场动画
    [saveShadow, saveBtn, saveText].forEach((element, index) => {
      element.setAlpha(0);
      this.tweens.add({
        targets: element,
        alpha: 1,
        y: element.y - 10,
        duration: 600,
        delay: 1500 + index * 100,
        ease: 'Back.easeOut'
      });
    });

    [calendarShadow, calendarBtn, calendarText].forEach((element, index) => {
      element.setAlpha(0);
      this.tweens.add({
        targets: element,
        alpha: 1,
        y: element.y - 10,
        duration: 600,
        delay: 1700 + index * 100,
        ease: 'Back.easeOut'
      });
    });
  }

  private showConsensusDetails() {
    // 显示共识详细信息模态框
    console.log('📋 显示共识详情');
    // 这里可以显示更详细的共识结果
  }

  private saveToAlbum() {
    console.log('💾 保存到相册');
    // 实现保存功能
  }

  private addToCalendar() {
    console.log('📅 添加到日历');
    // 实现日历功能
  }

  // 设置事件回调
  setEventCallback(callback: (event: string, data?: any) => void) {
    this.eventCallback = callback;
  }
}