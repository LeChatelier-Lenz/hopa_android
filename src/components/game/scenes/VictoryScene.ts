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
  private qrCodeUrl?: string;

  constructor() {
    super({ key: 'VictoryScene' });
  }

  init(data: VictoryData) {
    this.victoryData = data;
    console.log('🏆 胜利页面数据:', data);
  }

  preload() {
    // 加载新的卡片背景图片
    this.load.image('card_bg1', '/src/assets/game/ui/card-background1.png');
    this.load.image('card_bg2', '/src/assets/game/ui/card-background2.png');
    this.load.image('card_example', '/src/assets/game/ui/card-example.png');
    
    // 生成二维码内容
    this.generateQRCodeContent();
  }

  create() {
    // 创建精美的共识卡片
    this.createConsensusCard();
    
    // 添加操作按钮
    this.createActionButtons();
  }

  private generateQRCodeContent() {
    // 生成二维码内容（包含共识信息）
    const consensusData = {
      title: this.victoryData?.consensusTheme?.title || '共识活动',
      description: this.victoryData?.consensusTheme?.description || '',
      participants: this.victoryData?.maxParticipants || 2,
      date: new Date().toLocaleDateString('zh-CN'),
      id: `CON${Date.now().toString().slice(-6)}` // 生成6位数ID
    };
    
    this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(JSON.stringify(consensusData))}`;
  }

  private createConsensusCard() {
    // 创建渐变背景
    const bg = this.add.graphics();
    bg.fillGradientStyle(0xFFD700, 0xFFD700, 0xFFA500, 0xFF8C00, 1);
    bg.fillRect(0, 0, this.scale.width, this.scale.height);

    // 添加闪烁星星效果
    this.createStarEffect();

    // 创建卡片主体 - 使用新的背景图片
    const cardWidth = this.scale.width * 0.85;
    const cardHeight = this.scale.height * 0.8; // 稍微增加高度适应新背景
    const cardX = (this.scale.width - cardWidth) / 2;
    const cardY = (this.scale.height - cardHeight) / 2;

    // 添加卡片阴影效果
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.2);
    shadow.fillRoundedRect(cardX + 8, cardY + 8, cardWidth, cardHeight, 20);

    // 使用新的卡片背景图片
    const cardBg = this.add.image(cardX + cardWidth/2, cardY + cardHeight/2, 'card_bg1');
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
    
    // GAME OVER 标题
    const gameOverText = this.add.text(centerX, cardY + 40, 'GAME OVER', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.045}px`,
      color: '#FF4500',
      fontStyle: 'bold',
      fontFamily: 'Arial Black'
    }).setOrigin(0.5);

    // 卡片ID
    const cardId = `047${Date.now().toString().slice(-3)}`;
    const idText = this.add.text(centerX, cardY + 85, cardId, {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.025}px`,
      color: '#666666',
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    // 共识主题
    const title = this.victoryData?.consensusTheme?.title || '共识活动';
    const titleText = this.add.text(centerX, cardY + 125, `「${title}」`, {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.035}px`,
      color: '#000000',
      fontStyle: 'bold',
      wordWrap: { width: cardWidth * 0.8, useAdvancedWrap: true },
      align: 'center'
    }).setOrigin(0.5);

    // 日期和状态
    const currentDate = new Date().toLocaleDateString('zh-CN').replace(/\//g, '/');
    const statusText = this.add.text(centerX, cardY + 175, `${currentDate}     已合拍！`, {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.025}px`,
      color: '#000000',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // 参与人信息区域
    this.createParticipantsSection(cardX, cardY + 200, cardWidth);

    // 二维码
    if (this.qrCodeUrl) {
      // 由于Phaser限制，创建占位符二维码
      this.createQRCodePlaceholder(centerX - 60, cardY + cardHeight - 120);
    }

    // Hopa 品牌标识
    const brandText = this.add.text(centerX, cardY + cardHeight - 40, 'Hopa', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.025}px`,
      color: '#FF6B6B',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // 给所有文本添加入场动画
    const allTexts = [gameOverText, idText, titleText, statusText, brandText];
    allTexts.forEach((text, index) => {
      text.setAlpha(0);
      this.tweens.add({
        targets: text,
        alpha: 1,
        y: text.y + 5,
        duration: 600,
        delay: 300 + index * 100,
        ease: 'Power2.easeOut'
      });
    });
  }

  private createParticipantsSection(x: number, y: number, width: number) {
    const centerX = this.scale.width / 2;
    
    // 参与人数标签
    const participantsLabel = this.add.text(x + 30, y, '参与人 PARTICIPANTS', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.018}px`,
      color: '#666666',
      fontStyle: 'bold'
    });

    // 参与人头像区域（简化为圆形图标）
    const participantCount = this.victoryData?.maxParticipants || 2;
    const iconSize = 35;
    const iconSpacing = 45;
    const startX = centerX - ((participantCount - 1) * iconSpacing / 2);

    for (let i = 0; i < participantCount; i++) {
      const iconX = startX + i * iconSpacing;
      const iconY = y + 40;

      // 创建圆形头像背景
      const avatarBg = this.add.graphics();
      avatarBg.fillStyle(0x4169E1);
      avatarBg.fillCircle(iconX, iconY, iconSize / 2);

      // 添加简单的人物图标
      const avatarIcon = this.add.text(iconX, iconY, '👤', {
        fontSize: `${iconSize * 0.6}px`,
      }).setOrigin(0.5);

      // 头像动画
      avatarBg.setAlpha(0);
      avatarIcon.setAlpha(0);
      this.tweens.add({
        targets: [avatarBg, avatarIcon],
        alpha: 1,
        duration: 400,
        delay: 800 + i * 100
      });
    }

    // 详情按钮
    const detailsBtn = this.add.graphics();
    detailsBtn.fillStyle(0xE3F2FD);
    detailsBtn.fillRoundedRect(x + width - 120, y + 20, 80, 30, 5);
    
    const detailsText = this.add.text(x + width - 80, y + 35, '点击查看', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.016}px`,
      color: '#1976D2',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // 让详情按钮可交互
    detailsBtn.setInteractive(new Phaser.Geom.Rectangle(x + width - 120, y + 20, 80, 30), Phaser.Geom.Rectangle.Contains);
    detailsBtn.on('pointerdown', () => {
      this.showConsensusDetails();
    });
  }

  private createQRCodePlaceholder(x: number, y: number) {
    // 创建二维码占位符
    const qrBg = this.add.graphics();
    qrBg.fillStyle(0x000000);
    qrBg.fillRect(x, y, 120, 120);
    
    // 添加二维码图案（简化版）
    qrBg.fillStyle(0xffffff);
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if ((i + j) % 2 === 0) {
          qrBg.fillRect(x + i * 12, y + j * 12, 10, 10);
        }
      }
    }
    
    // 二维码标签
    const qrLabel = this.add.text(x + 60, y + 140, '扫码保存', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.016}px`,
      color: '#666666'
    }).setOrigin(0.5);

    qrBg.setAlpha(0);
    qrLabel.setAlpha(0);
    this.tweens.add({
      targets: [qrBg, qrLabel],
      alpha: 1,
      duration: 400,
      delay: 1200
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
    const buttonY = this.scale.height * 0.9;
    const buttonWidth = this.scale.width * 0.35;
    const buttonHeight = 50;

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