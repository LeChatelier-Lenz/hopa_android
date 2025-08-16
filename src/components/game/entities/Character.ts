import Phaser from 'phaser';

interface CharacterConfig {
  id: string;
  name: string;
  avatar: string;
  style: 'casual' | 'elegant' | 'sporty' | 'artistic';
  equipment?: {
    budgetAmulet?: any;
    timeCompass?: any;
    attractionShield?: any;
    cuisineGem?: any;
  };
}

export class Character {
  private scene: Phaser.Scene;
  private sprite: Phaser.GameObjects.Image;
  private config: CharacterConfig;
  private x: number;
  private y: number;

  constructor(scene: Phaser.Scene, x: number, y: number, config: CharacterConfig) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.config = config;

    // 创建角色精灵
    this.sprite = scene.add.image(x, y, 'character');
    this.sprite.setDisplaySize(50, 50);
    
    // 根据角色风格设置颜色
    this.setCharacterStyle();
    
    // 添加装备视觉效果
    this.showEquipment();
  }

  private setCharacterStyle() {
    const styleColors = {
      casual: 0x4CAF50,    // 绿色 - 休闲
      elegant: 0x9C27B0,   // 紫色 - 优雅
      sporty: 0xFF5722,    // 橙色 - 运动
      artistic: 0x3F51B5,  // 蓝色 - 文艺
    };

    const color = styleColors[this.config.style] || styleColors.casual;
    this.sprite.setTint(color);
  }

  private showEquipment() {
    if (!this.config.equipment) return;

    const equipmentIcons: string[] = [];
    
    // 根据装备添加图标
    if (this.config.equipment.budgetAmulet?.enabled) {
      equipmentIcons.push('💰');
    }
    if (this.config.equipment.timeCompass?.enabled) {
      equipmentIcons.push('🧭');
    }
    if (this.config.equipment.attractionShield?.enabled) {
      equipmentIcons.push('🛡️');
    }
    if (this.config.equipment.cuisineGem?.enabled) {
      equipmentIcons.push('🔮');
    }

    // 在角色周围显示装备图标
    equipmentIcons.forEach((icon, index) => {
      const angle = (index / equipmentIcons.length) * Math.PI * 2;
      const radius = 30;
      const iconX = this.x + Math.cos(angle) * radius;
      const iconY = this.y + Math.sin(angle) * radius;

      const iconText = this.scene.add.text(iconX, iconY, icon, {
        fontSize: '16px',
      }).setOrigin(0.5);

      // 装备图标旋转动画
      this.scene.tweens.add({
        targets: iconText,
        angle: 360,
        duration: 5000,
        repeat: -1,
        ease: 'Linear',
      });
    });
  }

  // 攻击动画
  attack(target: { getX: () => number; getY: () => number }) {
    const originalX = this.sprite.x;
    const originalY = this.sprite.y;
    
    // 向目标移动
    this.scene.tweens.add({
      targets: this.sprite,
      x: target.getX() - 50,
      y: target.getY(),
      duration: 300,
      onComplete: () => {
        // 攻击完成后返回原位
        this.scene.tweens.add({
          targets: this.sprite,
          x: originalX,
          y: originalY,
          duration: 300,
        });
      }
    });
  }

  // 受击动画
  takeDamage(damage: number) {
    // 红色闪烁效果
    this.sprite.setTint(0xff0000);
    this.scene.time.delayedCall(200, () => {
      this.setCharacterStyle(); // 恢复原色
    });

    // 震动效果
    const originalX = this.sprite.x;
    this.scene.tweens.add({
      targets: this.sprite,
      x: originalX + 10,
      duration: 50,
      yoyo: true,
      repeat: 3,
    });
  }

  // 胜利动画
  celebrate() {
    // 跳跃庆祝
    this.scene.tweens.add({
      targets: this.sprite,
      y: this.y - 20,
      duration: 200,
      yoyo: true,
      repeat: 3,
    });

    // 旋转庆祝
    this.scene.tweens.add({
      targets: this.sprite,
      angle: 360,
      duration: 1000,
    });
  }

  // Getter 方法
  getSprite(): Phaser.GameObjects.Image {
    return this.sprite;
  }

  getX(): number {
    return this.sprite.x;
  }

  getY(): number {
    return this.sprite.y;
  }

  getName(): string {
    return this.config.name;
  }

  getConfig(): CharacterConfig {
    return this.config;
  }

  getId(): string {
    return this.config.id;
  }

  // 设置位置
  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.sprite.setPosition(x, y);
  }

  // 销毁角色
  destroy() {
    this.sprite.destroy();
  }
}