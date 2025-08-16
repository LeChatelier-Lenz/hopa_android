import Phaser from 'phaser';

interface MonsterConfig {
  id: string;
  name: string;
  type: 'budget' | 'time' | 'attraction' | 'cuisine';
  health: number;
  maxHealth: number;
  attacks: string[];
  description?: string;
}

export class Monster {
  private scene: Phaser.Scene;
  private sprite: Phaser.GameObjects.Image;
  private config: MonsterConfig;
  private x: number;
  private y: number;
  private currentHealth: number;
  private isDead: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, config: MonsterConfig) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.config = config;
    this.currentHealth = config.health;

    // 创建怪物精灵
    this.sprite = scene.add.image(x, y, 'monster');
    this.sprite.setDisplaySize(80, 80);
    
    // 根据怪物类型设置外观
    this.setMonsterAppearance();
    
    // 添加怪物特效
    this.addMonsterEffects();
  }

  private setMonsterAppearance() {
    const typeColors = {
      budget: 0xFFD700,    // 金色 - 预算狮王
      time: 0x1E88E5,      // 蓝色 - 时间安排龙
      attraction: 0x8E24AA, // 紫色 - 景点选择蛛
      cuisine: 0xFF8F00,   // 橙色 - 美食口味鬼
    };

    const color = typeColors[this.config.type] || typeColors.budget;
    this.sprite.setTint(color);

    // 根据类型添加特殊形状
    this.addTypeSpecificFeatures();
  }

  private addTypeSpecificFeatures() {
    const graphics = this.scene.add.graphics();
    graphics.setPosition(this.x, this.y);

    switch (this.config.type) {
      case 'budget':
        // 预算狮王 - 添加金币环绕效果
        this.createCoinEffect();
        break;
      case 'time':
        // 时间安排龙 - 添加时钟纹理
        this.createClockEffect();
        break;
      case 'attraction':
        // 景点选择蛛 - 添加蛛网效果
        this.createWebEffect();
        break;
      case 'cuisine':
        // 美食口味鬼 - 添加食物粒子
        this.createFoodEffect();
        break;
    }
  }

  private createCoinEffect() {
    // 创建金币环绕效果
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const radius = 50;
      const coinX = this.x + Math.cos(angle) * radius;
      const coinY = this.y + Math.sin(angle) * radius;

      const coin = this.scene.add.graphics();
      coin.setPosition(coinX, coinY);
      coin.fillStyle(0xFFD700);
      coin.fillCircle(0, 0, 8);
      coin.lineStyle(2, 0xFFA000);
      coin.strokeCircle(0, 0, 8);

      // 金币旋转动画
      this.scene.tweens.add({
        targets: coin,
        angle: 360,
        duration: 3000,
        repeat: -1,
        ease: 'Linear',
      });

      // 金币围绕怪物旋转
      this.scene.tweens.add({
        targets: coin,
        rotation: Math.PI * 2,
        duration: 5000,
        repeat: -1,
        ease: 'Linear',
        onUpdate: () => {
          const currentAngle = angle + coin.rotation;
          coin.setPosition(
            this.x + Math.cos(currentAngle) * radius,
            this.y + Math.sin(currentAngle) * radius
          );
        }
      });
    }
  }

  private createClockEffect() {
    // 创建时钟指针效果
    const clockHand = this.scene.add.graphics();
    clockHand.setPosition(this.x, this.y);
    clockHand.lineStyle(4, 0x1E88E5);
    clockHand.lineBetween(0, 0, 0, -30);

    // 时钟指针旋转
    this.scene.tweens.add({
      targets: clockHand,
      angle: 360,
      duration: 2000,
      repeat: -1,
      ease: 'Linear',
    });
  }

  private createWebEffect() {
    // 创建蛛网效果
    const web = this.scene.add.graphics();
    web.setPosition(this.x, this.y);
    web.lineStyle(2, 0x8E24AA, 0.7);

    // 画蛛网
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      web.lineBetween(0, 0, Math.cos(angle) * 40, Math.sin(angle) * 40);
    }

    for (let r = 10; r <= 40; r += 10) {
      web.beginPath();
      web.arc(0, 0, r, 0, Math.PI * 2);
      web.strokePath();
    }
  }

  private createFoodEffect() {
    // 创建食物粒子效果
    const foods = ['🍎', '🍕', '🍰', '🍜'];
    
    foods.forEach((food, index) => {
      const angle = (index / foods.length) * Math.PI * 2;
      const radius = 35;
      const foodX = this.x + Math.cos(angle) * radius;
      const foodY = this.y + Math.sin(angle) * radius;

      const foodText = this.scene.add.text(foodX, foodY, food, {
        fontSize: '20px',
      }).setOrigin(0.5);

      // 食物飘动效果
      this.scene.tweens.add({
        targets: foodText,
        y: foodY - 10,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });
  }

  private addMonsterEffects() {
    // 怪物呼吸效果
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // 怪物阴影效果
    const shadow = this.scene.add.ellipse(this.x, this.y + 50, 60, 20, 0x000000, 0.3);
    
    // 阴影跟随怪物缩放
    this.scene.tweens.add({
      targets: shadow,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  // 受到伤害
  takeDamage(damage: number): boolean {
    if (this.isDead) return false;

    this.currentHealth = Math.max(0, this.currentHealth - damage);
    
    // 受击动画
    this.playHitAnimation();
    
    // 检查是否死亡
    if (this.currentHealth <= 0) {
      this.die();
      return true;
    }
    
    return false;
  }

  private playHitAnimation() {
    // 红色闪烁
    const originalTint = this.sprite.tint;
    this.sprite.setTint(0xff0000);
    
    this.scene.time.delayedCall(200, () => {
      this.sprite.setTint(originalTint);
    });

    // 震动效果
    const originalX = this.sprite.x;
    this.scene.tweens.add({
      targets: this.sprite,
      x: originalX + 15,
      duration: 50,
      yoyo: true,
      repeat: 5,
    });
  }

  private die() {
    this.isDead = true;
    
    // 死亡动画
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      scaleX: 0,
      scaleY: 0,
      angle: 180,
      duration: 1000,
      ease: 'Power2.easeOut',
      onComplete: () => {
        this.sprite.destroy();
      }
    });

    // 死亡粒子效果
    this.createDeathEffect();
  }

  private createDeathEffect() {
    // 创建死亡爆炸效果
    for (let i = 0; i < 10; i++) {
      const particle = this.scene.add.graphics();
      particle.setPosition(this.x, this.y);
      particle.fillStyle(Phaser.Math.Between(0x888888, 0xffffff));
      particle.fillCircle(0, 0, Phaser.Math.Between(3, 8));

      const angle = Phaser.Math.Between(0, 360) * Math.PI / 180;
      const speed = Phaser.Math.Between(50, 150);

      this.scene.tweens.add({
        targets: particle,
        x: this.x + Math.cos(angle) * speed,
        y: this.y + Math.sin(angle) * speed,
        alpha: 0,
        duration: 1000,
        onComplete: () => particle.destroy()
      });
    }
  }

  // 怪物攻击动画
  attack() {
    // 攻击前摇
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 300,
      yoyo: true,
      onComplete: () => {
        // 执行攻击特效
        this.executeAttack();
      }
    });
  }

  private executeAttack() {
    switch (this.config.type) {
      case 'budget':
        this.budgetAttack();
        break;
      case 'time':
        this.timeAttack();
        break;
      case 'attraction':
        this.attractionAttack();
        break;
      case 'cuisine':
        this.cuisineAttack();
        break;
    }
  }

  private budgetAttack() {
    // 金币雨攻击
    for (let i = 0; i < 15; i++) {
      const coin = this.scene.add.graphics();
      coin.setPosition(Phaser.Math.Between(0, 800), -20);
      coin.fillStyle(0xFFD700);
      coin.fillCircle(0, 0, 10);

      this.scene.tweens.add({
        targets: coin,
        y: 650,
        angle: 720,
        duration: Phaser.Math.Between(1000, 2000),
        delay: i * 100,
        onComplete: () => coin.destroy()
      });
    }
  }

  private timeAttack() {
    // 时间漩涡攻击
    const vortex = this.scene.add.graphics();
    vortex.setPosition(400, 300);
    
    for (let r = 10; r <= 100; r += 10) {
      vortex.lineStyle(3, 0x1E88E5, 1 - r / 100);
      vortex.beginPath();
      vortex.arc(0, 0, r, 0, Math.PI * 2);
      vortex.strokePath();
    }

    this.scene.tweens.add({
      targets: vortex,
      angle: 720,
      alpha: 0,
      duration: 3000,
      onComplete: () => vortex.destroy()
    });
  }

  private attractionAttack() {
    // 蛛网陷阱攻击
    const web = this.scene.add.graphics();
    web.setPosition(400, 300);
    web.lineStyle(4, 0x8E24AA);
    
    // 创建蛛网陷阱
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      web.lineBetween(0, 0, Math.cos(angle) * 150, Math.sin(angle) * 150);
    }

    web.setAlpha(0);
    this.scene.tweens.add({
      targets: web,
      alpha: 1,
      duration: 500,
      onComplete: () => {
        this.scene.time.delayedCall(2000, () => {
          this.scene.tweens.add({
            targets: web,
            alpha: 0,
            duration: 500,
            onComplete: () => web.destroy()
          });
        });
      }
    });
  }

  private cuisineAttack() {
    // 食物投掷攻击
    const foods = ['🍅', '🥕', '🌶️', '🥒'];
    
    foods.forEach((food, index) => {
      const foodProjectile = this.scene.add.text(this.x, this.y, food, {
        fontSize: '30px',
      }).setOrigin(0.5);

      const targetX = Phaser.Math.Between(500, 700);
      const targetY = Phaser.Math.Between(300, 500);

      this.scene.tweens.add({
        targets: foodProjectile,
        x: targetX,
        y: targetY,
        angle: 360,
        duration: 1000,
        delay: index * 200,
        ease: 'Power2.easeOut',
        onComplete: () => {
          // 爆炸效果
          const explosion = this.scene.add.graphics();
          explosion.setPosition(targetX, targetY);
          explosion.fillStyle(0xFF8F00);
          explosion.fillCircle(0, 0, 20);
          
          this.scene.tweens.add({
            targets: explosion,
            scaleX: 3,
            scaleY: 3,
            alpha: 0,
            duration: 500,
            onComplete: () => {
              explosion.destroy();
              foodProjectile.destroy();
            }
          });
        }
      });
    });
  }

  // Getter方法
  getSprite(): Phaser.GameObjects.Image {
    return this.sprite;
  }

  getX(): number {
    return this.sprite.x;
  }

  getY(): number {
    return this.sprite.y;
  }

  getId(): string {
    return this.config.id;
  }

  getName(): string {
    return this.config.name;
  }

  getHealth(): number {
    return this.currentHealth;
  }

  getMaxHealth(): number {
    return this.config.maxHealth;
  }

  getType(): string {
    return this.config.type;
  }

  isDeadStatus(): boolean {
    return this.isDead;
  }

  getConfig(): MonsterConfig & { currentHealth: number } {
    return {
      ...this.config,
      currentHealth: this.currentHealth,
    };
  }

  // 设置位置
  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.sprite.setPosition(x, y);
  }

  // 销毁怪物
  destroy() {
    this.sprite.destroy();
  }
}