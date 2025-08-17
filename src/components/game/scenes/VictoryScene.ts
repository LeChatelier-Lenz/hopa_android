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
}

export class VictoryScene extends Phaser.Scene {
  private victoryData?: VictoryData;
  private eventCallback?: (event: string, data?: any) => void;

  constructor() {
    super({ key: 'VictoryScene' });
  }

  init(data: VictoryData) {
    this.victoryData = data;
  }

  preload() {
    // 创建宝箱占位符
    this.createTreasureChest();
  }

  create() {
    // 创建胜利背景
    this.createVictoryBackground();
    
    // 显示胜利信息
    this.showVictoryMessage();
    
    // 显示宝箱动画
    this.showTreasureChest();
    
    // 3秒后显示奖励
    this.time.delayedCall(3000, () => {
      this.showRewards();
    });
  }

  private createTreasureChest() {
    // 创建宝箱图形
    const graphics = this.add.graphics();
    
    // 宝箱底部
    graphics.fillStyle(0x8B4513);
    graphics.fillRect(0, 20, 60, 40);
    
    // 宝箱盖子
    graphics.fillStyle(0xDAA520);
    graphics.fillRect(0, 0, 60, 30);
    
    // 宝箱锁
    graphics.fillStyle(0xFFD700);
    graphics.fillRect(25, 15, 10, 15);
    
    graphics.generateTexture('treasure_chest', 60, 60);
    graphics.destroy();
  }

  private createVictoryBackground() {
    // 创建庆祝背景
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0xFFD700, 0xFFD700, 0xFFA500, 0xFFA500, 1);
    graphics.fillRect(0, 0, 375, 667);
    
    // 添加烟花效果
    this.createFireworks();
  }

  private createFireworks() {
    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(100, 700);
      const y = Phaser.Math.Between(100, 300);
      
      const firework = this.add.graphics();
      firework.setPosition(x, y);
      
      // 创建烟花粒子
      for (let j = 0; j < 8; j++) {
        const angle = (j / 8) * Math.PI * 2;
        const endX = Math.cos(angle) * 50;
        const endY = Math.sin(angle) * 50;
        
        const r = Phaser.Math.Between(100, 255);
        const g = Phaser.Math.Between(100, 255);
        const b = Phaser.Math.Between(100, 255);
        const color = (r << 16) | (g << 8) | b;
        firework.lineStyle(3, color);
        firework.lineBetween(0, 0, endX, endY);
      }
      
      // 烟花动画
      this.tweens.add({
        targets: firework,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        duration: 2000,
        delay: i * 500,
        onComplete: () => firework.destroy()
      });
    }
  }

  private showVictoryMessage() {
    // 胜利标题
    const victoryTitle = this.add.text(187.5, 120, '🎉 恭喜！共识达成！', {
      fontSize: '32px',
      color: '#ff5a5e',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // 标题动画
    this.tweens.add({
      targets: victoryTitle,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    // 副标题
    this.add.text(187.5, 170, '你们成功击败了所有分歧怪兽！', {
      fontSize: '18px',
      color: '#333',
    }).setOrigin(0.5);
  }

  private showTreasureChest() {
    // 显示宝箱
    const chest = this.add.image(187.5, 250, 'treasure_chest');
    chest.setScale(2);
    
    // 宝箱出现动画
    chest.setAlpha(0);
    this.tweens.add({
      targets: chest,
      alpha: 1,
      scaleX: 3,
      scaleY: 3,
      duration: 1000,
      ease: 'Bounce.easeOut',
    });

    // 宝箱光芒效果
    const glow = this.add.graphics();
    glow.setPosition(187.5, 250);
    
    let glowRadius = 0;
    this.tweens.add({
      targets: { radius: 0 },
      radius: 100,
      duration: 2000,
      repeat: -1,
      yoyo: true,
      onUpdate: (tween) => {
        glowRadius = tween.getValue() || 0;
        glow.clear();
        glow.fillStyle(0xFFD700, 0.3);
        glow.fillCircle(0, 0, glowRadius);
      }
    });

    // 宝箱点击打开
    chest.setInteractive();
    chest.on('pointerdown', () => {
      this.openTreasureChest(chest);
    });

    // 提示文字
    this.add.text(187.5, 320, '点击宝箱获取奖励！', {
      fontSize: '16px',
      color: '#ff5a5e',
    }).setOrigin(0.5);
  }

  private openTreasureChest(chest: Phaser.GameObjects.Image) {
    // 宝箱打开动画
    this.tweens.add({
      targets: chest,
      angle: -15,
      duration: 300,
      yoyo: true,
      onComplete: () => {
        // 宝箱打开后显示奖励
        this.showTreasureContents();
      }
    });
  }

  private showTreasureContents() {
    // 显示宝箱内容 - 增强共识卡片
    const cardWidth = this.scale.width * 0.85;
    const cardHeight = this.scale.height * 0.4;
    const cardX = this.scale.width / 2;
    const cardY = this.scale.height * 0.6;
    
    const cardBackground = this.add.graphics();
    cardBackground.setPosition(cardX, cardY);
    cardBackground.fillStyle(0xffffff, 0.95);
    cardBackground.fillRoundedRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 20);
    cardBackground.lineStyle(4, 0xff5a5e);
    cardBackground.strokeRoundedRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 20);
    
    // 添加卡片装饰渐变
    const gradient = this.add.graphics();
    gradient.setPosition(cardX, cardY);
    gradient.fillGradientStyle(0xffe6e6, 0xffffff, 0xffe6e6, 0xffffff, 0.3);
    gradient.fillRoundedRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 20);

    // 卡片标题
    const titleY = cardY - cardHeight/2 + 30;
    this.add.text(cardX, titleY, '🎯 共识征程成果卡', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.035}px`,
      color: '#ff5a5e',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    
    // 显示主题
    if (this.victoryData?.consensusTheme) {
      this.add.text(cardX, titleY + 25, `主题: ${this.victoryData.consensusTheme.title}`, {
        fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.025}px`,
        color: '#666',
        fontStyle: 'bold',
      }).setOrigin(0.5);
    }

    // 显示实际共识结果
    this.displayConsensusResults(cardX, titleY + 50, cardWidth - 40);

    // 卡片出现动画
    const allElements = [cardBackground, gradient];
    allElements.forEach(element => {
      element.setScale(0);
      this.tweens.add({
        targets: element,
        scaleX: 1,
        scaleY: 1,
        duration: 600,
        ease: 'Back.easeOut',
        delay: 200
      });
    });
  }

  private displayConsensusResults(startX: number, startY: number, maxWidth: number) {
    if (!this.victoryData?.consensusResults || this.victoryData.consensusResults.length === 0) {
      // 显示默认内容
      const defaultConsensus = [
        '📍 达成了基本共识',
        '🤝 团队协作顶棒',
        '✨ 冲突已解决',
        '🎆 共识征程完成'
      ];
      
      defaultConsensus.forEach((text, index) => {
        const textObj = this.add.text(startX, startY + (index * 25), text, {
          fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.022}px`,
          color: '#333',
          wordWrap: { width: maxWidth }
        }).setOrigin(0.5);
        
        textObj.setAlpha(0);
        this.tweens.add({
          targets: textObj,
          alpha: 1,
          delay: (index + 1) * 300,
          duration: 400
        });
      });
      return;
    }

    // 显示实际共识结果
    const categoryIcons = {
      budget: '💰',
      time: '⏰', 
      attraction: '📍',
      cuisine: '🍽️',
      preference: '❤️',
      communication: '💬',
      principle: '🎯'
    };

    this.victoryData.consensusResults.forEach((result, index) => {
      const icon = categoryIcons[result.category as keyof typeof categoryIcons] || '✅';
      const consistencyEmoji = result.consistency >= 0.9 ? '🎆' : result.consistency >= 0.7 ? '🎉' : '✨';
      
      // 简化显示：只显示答案和一致性
      const displayText = `${icon} ${result.selectedAnswer} ${consistencyEmoji}`;
      
      const textObj = this.add.text(startX, startY + (index * 28), displayText, {
        fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.02}px`,
        color: '#333',
        wordWrap: { width: maxWidth },
        align: 'center'
      }).setOrigin(0.5);
      
      // 每个结果逐个出现
      textObj.setAlpha(0);
      this.tweens.add({
        targets: textObj,
        alpha: 1,
        delay: (index + 1) * 400,
        duration: 500
      });
    });
    
    // 添加成就总结
    const avgConsistency = this.victoryData.consensusResults.reduce((sum, r) => sum + r.consistency, 0) / this.victoryData.consensusResults.length;
    const achievementText = avgConsistency >= 0.9 ? '🏆 完美共识达成!' : avgConsistency >= 0.7 ? '🎆 优秀共识成果!' : '🎉 成功达成共识!';
    
    const summaryY = startY + (this.victoryData.consensusResults.length * 28) + 20;
    const summaryObj = this.add.text(startX, summaryY, achievementText, {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.025}px`,
      color: '#ff5a5e',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    summaryObj.setAlpha(0);
    this.tweens.add({
      targets: summaryObj,
      alpha: 1,
      delay: (this.victoryData.consensusResults.length + 1) * 400 + 500,
      duration: 600
    });
    
    // 添加查看详情按钮
    const cardX = this.scale.width / 2; // 重新定义变量
    this.addDetailViewButton(cardX, summaryY + 40);
  }

  private addDetailViewButton(x: number, y: number) {
    const button = this.add.rectangle(x, y, this.scale.width * 0.4, this.scale.height * 0.05, 0x4CAF50, 0.9);
    button.setInteractive();
    button.setStrokeStyle(2, 0x2E7D32);
    
    const buttonText = this.add.text(x, y, '📋 查看完整共识方案', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.022}px`,
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    
    button.on('pointerover', () => {
      button.setFillStyle(0x66BB6A);
      button.setScale(1.05);
      buttonText.setScale(1.05);
    });
    
    button.on('pointerout', () => {
      button.setFillStyle(0x4CAF50);
      button.setScale(1.0);
      buttonText.setScale(1.0);
    });
    
    button.on('pointerdown', () => {
      this.showDetailedConsensusView();
    });
    
    // 按钮出现动画
    button.setAlpha(0);
    buttonText.setAlpha(0);
    this.tweens.add({
      targets: [button, buttonText],
      alpha: 1,
      delay: 1000,
      duration: 500
    });
  }

  private showDetailedConsensusView() {
    // 创建详细视图遮罩层
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.8);
    overlay.fillRect(0, 0, this.scale.width, this.scale.height);
    overlay.setInteractive();
    
    // 详细视图容器
    const detailWidth = this.scale.width * 0.9;
    const detailHeight = this.scale.height * 0.8;
    const detailX = this.scale.width / 2;
    const detailY = this.scale.height / 2;
    
    const detailContainer = this.add.graphics();
    detailContainer.setPosition(detailX, detailY);
    detailContainer.fillStyle(0xffffff, 0.98);
    detailContainer.fillRoundedRect(-detailWidth/2, -detailHeight/2, detailWidth, detailHeight, 25);
    detailContainer.lineStyle(4, 0xff5a5e);
    detailContainer.strokeRoundedRect(-detailWidth/2, -detailHeight/2, detailWidth, detailHeight, 25);
    
    // 详细视图标题
    const titleY = detailY - detailHeight/2 + 40;
    this.add.text(detailX, titleY, '📊 完整共识方案详情', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.04}px`,
      color: '#ff5a5e',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    
    // 显示主题信息
    if (this.victoryData?.consensusTheme) {
      const themeY = titleY + 35;
      this.add.text(detailX, themeY, `🎯 ${this.victoryData.consensusTheme.title}`, {
        fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.028}px`,
        color: '#333',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      
      this.add.text(detailX, themeY + 25, this.victoryData.consensusTheme.description, {
        fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.022}px`,
        color: '#666',
        wordWrap: { width: detailWidth - 60 },
        align: 'center'
      }).setOrigin(0.5);
    }
    
    // 显示详细的共识结果
    this.displayDetailedResults(detailX, titleY + 100, detailWidth - 60);
    
    // 关闭按钮
    const closeButton = this.add.rectangle(detailX + detailWidth/2 - 30, detailY - detailHeight/2 + 30, 40, 40, 0xff5a5e, 0.9);
    closeButton.setInteractive();
    
    const closeText = this.add.text(detailX + detailWidth/2 - 30, detailY - detailHeight/2 + 30, '✕', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.035}px`,
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    
    closeButton.on('pointerdown', () => {
      // 移除详细视图
      [overlay, detailContainer, closeButton, closeText].forEach(obj => obj.destroy());
      this.children.getAll().forEach(child => {
        if (child.getData && child.getData('isDetailView')) {
          child.destroy();
        }
      });
    });
    
    // 标记详细视图元素
    [overlay, detailContainer, closeButton, closeText].forEach(obj => {
      obj.setData('isDetailView', true);
    });
    
    // 出现动画
    detailContainer.setScale(0);
    this.tweens.add({
      targets: detailContainer,
      scaleX: 1,
      scaleY: 1,
      duration: 400,
      ease: 'Back.easeOut'
    });
  }

  private displayDetailedResults(startX: number, startY: number, maxWidth: number) {
    if (!this.victoryData?.consensusResults || this.victoryData.consensusResults.length === 0) {
      const noDataText = this.add.text(startX, startY + 50, '暂无详细共识数据', {
        fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.025}px`,
        color: '#999',
      }).setOrigin(0.5);
      noDataText.setData('isDetailView', true);
      return;
    }

    // 分析共识数据
    const totalQuestions = this.victoryData.consensusResults.length;
    const averageConsistency = this.victoryData.consensusResults.reduce((sum, r) => sum + r.consistency, 0) / totalQuestions;
    const perfectMatches = this.victoryData.consensusResults.filter(r => r.consistency >= 0.9).length;
    
    // 统计信息
    const statsY = startY;
    const statsText = [
      `📊 共答题 ${totalQuestions} 道`,
      `🎯 平均一致性 ${(averageConsistency * 100).toFixed(1)}%`,
      `✨ 完全一致 ${perfectMatches} 题`,
      `🤝 团队默契度 ${this.getTeamworkLevel(averageConsistency)}`
    ];
    
    statsText.forEach((stat, index) => {
      const text = this.add.text(startX, statsY + (index * 25), stat, {
        fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.022}px`,
        color: '#333',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      text.setData('isDetailView', true);
    });
    
    // 详细问答记录
    const detailStartY = statsY + 120;
    this.add.text(startX, detailStartY, '📝 详细决策记录', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.025}px`,
      color: '#ff5a5e',
      fontStyle: 'bold'
    }).setOrigin(0.5).setData('isDetailView', true);
    
    // 滚动区域（简化版）
    const scrollY = detailStartY + 35;
    this.victoryData.consensusResults.forEach((result, index) => {
      if (index >= 4) return; // 只显示前4个，避免溢出
      
      const itemY = scrollY + (index * 60);
      const consistencyColor = result.consistency >= 0.9 ? '#00C851' : result.consistency >= 0.7 ? '#FF8A00' : '#FF4444';
      const consistencyText = result.consistency >= 0.9 ? '完全一致' : result.consistency >= 0.7 ? '基本一致' : '存在分歧';
      
      // 问题文本（截断）
      const questionText = result.question.length > 30 ? result.question.substring(0, 30) + '...' : result.question;
      const questionObj = this.add.text(startX, itemY, questionText, {
        fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.018}px`,
        color: '#333',
        wordWrap: { width: maxWidth },
        align: 'center'
      }).setOrigin(0.5);
      questionObj.setData('isDetailView', true);
      
      // 选择的答案
      const answerObj = this.add.text(startX, itemY + 20, `选择: ${result.selectedAnswer}`, {
        fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.016}px`,
        color: '#666'
      }).setOrigin(0.5);
      answerObj.setData('isDetailView', true);
      
      // 一致性标识
      const consistencyObj = this.add.text(startX, itemY + 35, `${consistencyText} (${(result.consistency * 100).toFixed(0)}%)`, {
        fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.016}px`,
        color: consistencyColor,
        fontStyle: 'bold'
      }).setOrigin(0.5);
      consistencyObj.setData('isDetailView', true);
    });
    
    if (this.victoryData.consensusResults.length > 4) {
      const moreText = this.add.text(startX, scrollY + 250, `... 还有 ${this.victoryData.consensusResults.length - 4} 项决策`, {
        fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.018}px`,
        color: '#999',
        fontStyle: 'italic'
      }).setOrigin(0.5);
      moreText.setData('isDetailView', true);
    }
  }

  private getTeamworkLevel(consistency: number): string {
    if (consistency >= 0.9) return '完美配合 ⭐⭐⭐';
    if (consistency >= 0.8) return '默契十足 ⭐⭐';
    if (consistency >= 0.7) return '配合良好 ⭐';
    return '需要磨合 💪';
  }

  private showRewards() {
    // 显示获得的奖励列表
    const rewardsTitle = this.add.text(187.5, 450, '🎁 获得奖励', {
      fontSize: '18px',
      color: '#ff5a5e',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const rewards = [
      '🤝 团队默契度 +10',
      '🏆 共识达成专家称号',
      '🎫 活动策划优惠券',
      '📱 专属团队徽章',
    ];

    rewards.forEach((reward, index) => {
      const rewardText = this.add.text(187.5, 480 + (index * 25), reward, {
        fontSize: '13px',
        color: '#333',
        backgroundColor: '#f0f0f0',
        padding: { x: 8, y: 4 },
      }).setOrigin(0.5);

      // 奖励出现动画
      rewardText.setAlpha(0);
      this.tweens.add({
        targets: rewardText,
        alpha: 1,
        delay: index * 200,
        duration: 500,
      });
    });

    // 返回按钮
    this.time.delayedCall(3000, () => {
      const returnButton = this.add.text(187.5, 600, '🏠 返回主页', {
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#ff5a5e',
        padding: { x: 15, y: 8 },
      }).setOrigin(0.5);

      returnButton.setInteractive();
      returnButton.on('pointerdown', () => {
        // 触发返回主页事件
        if (this.eventCallback) {
          this.eventCallback('returnHome');
        } else {
          // 如果没有回调，默认重新开始游戏
          this.scene.start('BattleScene');
        }
      });

      returnButton.on('pointerover', () => {
        returnButton.setStyle({ backgroundColor: '#ff4a4e' });
      });

      returnButton.on('pointerout', () => {
        returnButton.setStyle({ backgroundColor: '#ff5a5e' });
      });
    });
  }

  // 设置事件回调
  setEventCallback(callback: (event: string, data?: any) => void) {
    this.eventCallback = callback;
  }
}