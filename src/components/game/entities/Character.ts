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

    const equipmentSprites: { key: string; name: string }[] = [];
    
    // 根据装备添加图片 - 匹配合适的图片资源
    if (this.config.equipment.budgetAmulet?.enabled) {
      equipmentSprites.push({ key: 'equipment_clover', name: '预算护符' }); // 四叶草护符
    }
    if (this.config.equipment.timeCompass?.enabled) {
      equipmentSprites.push({ key: 'equipment_magic_bar', name: '时间罗盘' }); // 魔法棒作为罗盘
    }
    if (this.config.equipment.attractionShield?.enabled) {
      equipmentSprites.push({ key: 'equipment_gemstone', name: '景点护盾' }); // 宝石护盾
    }
    if (this.config.equipment.cuisineGem?.enabled) {
      equipmentSprites.push({ key: 'equipment_ring', name: '美食宝石' }); // 戒指上的宝石
    }

    // 在角色周围显示装备图片
    equipmentSprites.forEach((equipment, index) => {
      const angle = (index / equipmentSprites.length) * Math.PI * 2;
      const radius = 35;
      const iconX = this.x + Math.cos(angle) * radius;
      const iconY = this.y + Math.sin(angle) * radius;

      // 创建装备图片
      const equipmentSprite = this.scene.add.image(iconX, iconY, equipment.key);
      equipmentSprite.setDisplaySize(20, 20); // 设置装备图片大小
      equipmentSprite.setOrigin(0.5);

      // 添加装备名称标签（可选）
      const nameText = this.scene.add.text(iconX, iconY + 15, equipment.name, {
        fontSize: '10px',
        color: '#ffffff',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: { x: 2, y: 1 },
      }).setOrigin(0.5);

      // 装备图标旋转动画
      this.scene.tweens.add({
        targets: [equipmentSprite, nameText],
        angle: 360,
        duration: 8000,
        repeat: -1,
        ease: 'Linear',
      });

      // 装备图标浮动动画
      this.scene.tweens.add({
        targets: [equipmentSprite, nameText],
        y: iconY - 5,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
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