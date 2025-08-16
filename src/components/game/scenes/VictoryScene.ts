import Phaser from 'phaser';

interface VictoryData {
  victory: boolean;
  characters: any[];
}

export class VictoryScene extends Phaser.Scene {
  private victoryData?: VictoryData;

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
    graphics.fillRect(0, 0, 800, 600);
    
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
    const victoryTitle = this.add.text(400, 150, '🎉 恭喜！共识达成！', {
      fontSize: '48px',
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
    this.add.text(400, 200, '你们成功击败了所有分歧怪兽！', {
      fontSize: '24px',
      color: '#333',
    }).setOrigin(0.5);
  }

  private showTreasureChest() {
    // 显示宝箱
    const chest = this.add.image(400, 300, 'treasure_chest');
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
    glow.setPosition(400, 300);
    
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
    this.add.text(400, 380, '点击宝箱获取奖励！', {
      fontSize: '20px',
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
    // 显示宝箱内容 - 共识卡片
    const cardBackground = this.add.graphics();
    cardBackground.setPosition(400, 450);
    cardBackground.fillStyle(0xffffff);
    cardBackground.fillRoundedRect(-150, -75, 300, 150, 15);
    cardBackground.lineStyle(3, 0xff5a5e);
    cardBackground.strokeRoundedRect(-150, -75, 300, 150, 15);

    // 卡片标题
    this.add.text(400, 400, '🎯 西湖约会共识卡', {
      fontSize: '20px',
      color: '#ff5a5e',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // 共识内容
    const consensusText = [
      '📍 游览路线：雷峰塔 → 苏堤',
      '💰 预算范围：200-300元',
      '🍽️ 用餐选择：湖边特色餐厅',
      '⏰ 游玩时长：全天深度游',
    ];

    consensusText.forEach((text, index) => {
      this.add.text(400, 420 + (index * 25), text, {
        fontSize: '14px',
        color: '#333',
      }).setOrigin(0.5);
    });

    // 卡片出现动画
    this.tweens.add({
      targets: [cardBackground],
      scaleX: 0,
      scaleY: 0,
      duration: 0,
      onComplete: () => {
        this.tweens.add({
          targets: [cardBackground],
          scaleX: 1,
          scaleY: 1,
          duration: 500,
          ease: 'Back.easeOut',
        });
      }
    });
  }

  private showRewards() {
    // 显示获得的奖励列表
    const rewardsTitle = this.add.text(400, 320, '🎁 获得奖励', {
      fontSize: '24px',
      color: '#ff5a5e',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const rewards = [
      '💖 恋人默契度 +10',
      '🏆 西湖探索达人称号',
      '🎫 下次约会优惠券',
      '📱 专属情侣头像',
    ];

    rewards.forEach((reward, index) => {
      const rewardText = this.add.text(400, 360 + (index * 30), reward, {
        fontSize: '16px',
        color: '#333',
        backgroundColor: '#f0f0f0',
        padding: { x: 10, y: 5 },
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
      const returnButton = this.add.text(400, 550, '🏠 返回主页', {
        fontSize: '20px',
        color: '#fff',
        backgroundColor: '#ff5a5e',
        padding: { x: 20, y: 10 },
      }).setOrigin(0.5);

      returnButton.setInteractive();
      returnButton.on('pointerdown', () => {
        // 返回主页或重新开始
        this.scene.start('BattleScene');
      });

      returnButton.on('pointerover', () => {
        returnButton.setStyle({ backgroundColor: '#ff4a4e' });
      });

      returnButton.on('pointerout', () => {
        returnButton.setStyle({ backgroundColor: '#ff5a5e' });
      });
    });
  }
}