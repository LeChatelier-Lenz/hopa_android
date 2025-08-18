import Phaser from 'phaser';
import { kimiApi } from '../../../utils/kimiApi';
import { apiConfig } from '../../../config/api';

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

interface ConflictQuestion {
  id: string;
  type: 'choice' | 'fill' | 'sort';
  question: string;
  options?: string[];
  correctAnswer?: number | string | string[];
  explanation: string;
  category: string;
}

export class LoadingScene extends Phaser.Scene {
  private gameData?: GameData;
  private eventCallback?: (event: string, data?: any) => void;
  private loadingProgress: number = 0;
  private monsterSprite?: Phaser.GameObjects.Image;
  private lightEffectSprite?: Phaser.GameObjects.Image;
  private loadingText?: Phaser.GameObjects.Text;
  private progressBar?: Phaser.GameObjects.Graphics;
  private generatedQuestions: ConflictQuestion[] = [];
  private backgroundImage?: Phaser.GameObjects.Image;

  constructor() {
    super({ key: 'LoadingScene' });
  }

  init(data?: any) {
    console.log('LoadingScene init 接收到数据:', data);
    if (data && data.gameData) {
      this.gameData = data.gameData;
    }
  }

  preload() {
    // 加载新的loading界面图片
    this.load.image('loading_monster', '/src/assets/game/monsters/loading-monster.png');
    this.load.image('loading_light', '/src/assets/game/monsters/loading-light.png');
    
    // 加载AI生成的背景图（如果有）- 通过后端代理解决CORS问题
    if (this.gameData?.backgroundUrl) {
      console.log('🖼️ 加载AI生成的背景图:', this.gameData.backgroundUrl);
      // 使用动态后端代理URL
      const proxyUrl = apiConfig.buildImageProxyUrl(this.gameData.backgroundUrl);
      console.log('🔧 使用代理URL:', proxyUrl);
      this.load.image('ai_background', proxyUrl);
    }
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // 创建AI背景
    this.createBackground();

    // 创建标题
    this.add.text(centerX, this.scale.height * 0.15, '🎯 共识征程大作战', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.05}px`,
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // 创建副标题
    if (this.gameData?.consensusTheme) {
      this.add.text(centerX, this.scale.height * 0.22, this.gameData.consensusTheme.title, {
        fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.03}px`,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
        wordWrap: { width: this.scale.width * 0.8 },
      }).setOrigin(0.5);
    }

    // 创建光环特效（背景层，稍大尺寸）
    this.lightEffectSprite = this.add.image(centerX, this.scale.height * 0.4, 'loading_light');
    const lightSize = Math.min(this.scale.width, this.scale.height) * 0.35;
    this.lightEffectSprite.setDisplaySize(lightSize, lightSize);
    this.lightEffectSprite.setAlpha(0.3); // 初始透明度较低
    
    // 创建怪兽图片（居中偏上，叠在光环上方）
    this.monsterSprite = this.add.image(centerX, this.scale.height * 0.4, 'loading_monster');
    const monsterSize = Math.min(this.scale.width, this.scale.height) * 0.25;
    this.monsterSprite.setDisplaySize(monsterSize, monsterSize);
    this.monsterSprite.setAlpha(0.1); // 初始几乎透明
    
    // 添加光环旋转和脉冲效果
    this.tweens.add({
      targets: this.lightEffectSprite,
      rotation: Math.PI * 2,
      duration: 4000,
      repeat: -1,
      ease: 'Linear'
    });
    
    this.tweens.add({
      targets: this.lightEffectSprite,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 创建加载文本
    this.loadingText = this.add.text(centerX, this.scale.height * 0.65, '正在生成冲突预测...', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.025}px`,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);

    // 创建进度条
    this.createProgressBar();

    // 添加背景动态效果
    this.addBackgroundEffects();

    // 开始加载过程
    this.startLoading();
  }

  private createBackground() {
    if (this.gameData?.backgroundUrl && this.textures.exists('ai_background')) {
      this.backgroundImage = this.add.image(0, 0, 'ai_background');
      this.backgroundImage.setOrigin(0, 0);
      this.backgroundImage.setDisplaySize(this.scale.width, this.scale.height);
      
      // 添加深色遮罩提高可读性
      const overlay = this.add.graphics();
      overlay.fillStyle(0x000000, 0.5);
      overlay.fillRect(0, 0, this.scale.width, this.scale.height);
    } else {
      // 默认渐变背景
      const graphics = this.add.graphics();
      graphics.fillGradientStyle(0x1a1a2e, 0x16213e, 0x0f3460, 0x533483, 1);
      graphics.fillRect(0, 0, this.scale.width, this.scale.height);
    }
  }

  private createProgressBar() {
    this.progressBar = this.add.graphics();
    this.updateProgressBar(0);
  }

  private addBackgroundEffects() {
    if (!this.backgroundImage) return;
    
    // 背景轻微缩放动画
    this.tweens.add({
      targets: this.backgroundImage,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private updateLoadingEffects(progress: number) {
    if (!this.monsterSprite || !this.lightEffectSprite) return;
    
    // 怪兽透明度随进度增加（从0.1到1.0）
    const monsterAlpha = 0.1 + (progress * 0.9);
    this.monsterSprite.setAlpha(monsterAlpha);
    
    // 光环透明度和强度随进度增加（从0.3到1.0）
    const lightAlpha = 0.3 + (progress * 0.7);
    this.lightEffectSprite.setAlpha(lightAlpha);
    
    // 光环颜色变化 - 从蓝色到金色
    if (progress > 0.8) {
      this.lightEffectSprite.setTint(0xffd700); // 金色
    } else if (progress > 0.5) {
      this.lightEffectSprite.setTint(0x00ffff); // 青色
    } else {
      this.lightEffectSprite.setTint(0x4169e1); // 皇家蓝
    }
  }

  private updateProgressBar(progress: number) {
    if (!this.progressBar) return;
    
    const centerX = this.scale.width / 2;
    const barY = this.scale.height * 0.75;
    const barWidth = this.scale.width * 0.7;
    const barHeight = this.scale.height * 0.015;
    
    this.progressBar.clear();
    
    // 背景条
    this.progressBar.fillStyle(0x333333, 0.8);
    this.progressBar.fillRoundedRect(centerX - barWidth/2, barY, barWidth, barHeight, barHeight/2);
    
    // 进度条
    this.progressBar.fillStyle(0x00ff88);
    this.progressBar.fillRoundedRect(centerX - barWidth/2, barY, barWidth * progress, barHeight, barHeight/2);
    
    // 边框
    this.progressBar.lineStyle(2, 0xffffff, 0.8);
    this.progressBar.strokeRoundedRect(centerX - barWidth/2, barY, barWidth, barHeight, barHeight/2);
    
    // 进度百分比文字
    if (progress > 0) {
      const percentText = `${Math.floor(progress * 100)}%`;
      if (!this.progressBar.getData('percentText')) {
        const textObj = this.add.text(centerX, barY + barHeight + 20, percentText, {
          fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.02}px`,
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 1,
        }).setOrigin(0.5);
        this.progressBar.setData('percentText', textObj);
      } else {
        this.progressBar.getData('percentText').setText(percentText);
      }
    }
  }

  private async startLoading() {
    const loadingSteps = [
      { text: '正在分析共识场景...', duration: 1000 },
      { text: '预测潜在冲突点...', duration: 1500 },
      { text: '生成冲突解决题目...', duration: 3000 },
      { text: '准备战斗系统...', duration: 1000 },
      { text: '即将进入战斗！', duration: 500 },
    ];

    for (let i = 0; i < loadingSteps.length; i++) {
      const step = loadingSteps[i];
      const progress = (i + 1) / loadingSteps.length;
      
      // 更新文本和进度
      if (this.loadingText) {
        this.loadingText.setText(step.text);
      }
      this.updateProgressBar(progress);
      this.updateLoadingEffects(progress);
      
      // 如果是生成题目的步骤，调用AI
      if (i === 2 && this.gameData?.consensusTheme) {
        await this.generateConflictQuestions();
      }
      
      // 等待指定时间
      await this.wait(step.duration);
    }

    // 加载完成，切换到战斗场景
    this.scene.start('BattleScene', { 
      gameData: {
        ...this.gameData,
        conflictQuestions: this.generatedQuestions
      }
    });
  }


  private async generateConflictQuestions(): Promise<void> {
    if (!this.gameData?.consensusTheme) {
      console.warn('没有共识主题，跳过AI题目生成');
      return;
    }

    try {
      console.log('🤖 开始增强型冲突预测题目生成...');
      
      // 构造玩家装备数据
      const playersEquipment = this.buildPlayersEquipmentData();
      console.log('🎒 构造的玩家装备数据:', playersEquipment);
      
      // 调用后端API生成冲突解决题目
      const conflictData = await kimiApi.generateConflictQuestions({
        title: this.gameData.consensusTheme.title,
        description: this.gameData.consensusTheme.description,
        scenarioType: 'general',
        playersEquipment: playersEquipment, // 传递完整装备数据
      });

      this.generatedQuestions = conflictData;
      console.log('✅ 增强型AI题目生成完成:', this.generatedQuestions);
      
    } catch (error) {
      console.error('❌ AI题目生成失败:', error);
      
      // 使用默认题目
      this.generatedQuestions = this.getDefaultQuestions();
    }
  }

  // 构造玩家装备数据
  private buildPlayersEquipmentData(): any[] {
    const playersEquipment = [];
    
    try {
      // 处理玩家1
      if (this.gameData?.player1Config) {
        const player1Equipment = this.extractPlayerEquipment('1', this.gameData.player1Config);
        if (player1Equipment) playersEquipment.push(player1Equipment);
      }
      
      // 处理玩家2
      if (this.gameData?.player2Config) {
        const player2Equipment = this.extractPlayerEquipment('2', this.gameData.player2Config);
        if (player2Equipment) playersEquipment.push(player2Equipment);
      }
      
      console.log(`🔍 成功构造${playersEquipment.length}个玩家的装备数据`);
      return playersEquipment;
    } catch (error) {
      console.error('❌ 构造玩家装备数据失败:', error);
      return [];
    }
  }

  // 从玩家配置中提取装备数据（直接使用AI生成的配置，无需默认值）
  private extractPlayerEquipment(playerId: string, playerConfig: any): any | null {
    try {
      // 直接使用玩家配置中的装备信息（已由AI在前端生成）
      if (!playerConfig.equipment) {
        console.warn(`⚠️ 玩家${playerId}缺少装备配置，跳过`);
        return null;
      }

      const equipment = playerConfig.equipment;
      const equipmentData = {
        playerId: playerId,
        budgetAmulet: {
          enabled: equipment.budgetAmulet?.enabled || false,
          range: equipment.budgetAmulet?.range || [300, 1000],
          name: '预算护符',
          description: '控制消费范围'
        },
        timeCompass: {
          enabled: equipment.timeCompass?.enabled || false,
          duration: equipment.timeCompass?.duration || 'full-day',
          name: '时间指南针',
          description: '规划活动时长'
        },
        attractionShield: {
          enabled: equipment.attractionShield?.enabled || false,
          preferences: equipment.attractionShield?.preferences || [],
          name: '景点盾牌',
          description: '发现精彩目的地'
        },
        cuisineGem: {
          enabled: equipment.cuisineGem?.enabled || false,
          types: equipment.cuisineGem?.types || [],
          name: '美食宝珠',
          description: '探索当地美食文化'
        }
      };

      console.log(`🎒 玩家${playerId}装备数据 (AI生成):`, {
        budget: `¥${equipmentData.budgetAmulet.range[0]}-${equipmentData.budgetAmulet.range[1]}`,
        time: equipmentData.timeCompass.duration,
        attractions: equipmentData.attractionShield.preferences.join(', '),
        cuisine: equipmentData.cuisineGem.types.join(', ')
      });

      return equipmentData;
    } catch (error) {
      console.error(`❌ 提取玩家${playerId}装备数据失败:`, error);
      return null;
    }
  }

  // 备注：装备配置调整已迁移到前端AI生成系统
  // 详见 src/utils/equipmentAI.ts 和 CharacterCreator.tsx

  private getDefaultQuestions(): ConflictQuestion[] {
    return [
      {
        id: 'conflict_1',
        type: 'choice',
        question: '在预算分歧时，你们通常如何协调？',
        options: [
          '优先考虑性价比最高的选项',
          '平均分配预算到各个环节', 
          '重点投入到最重要的体验',
          '寻找免费或低成本替代方案'
        ],
        correctAnswer: 2,
        explanation: '重点投入能创造最佳共同体验',
        category: 'budget'
      },
      {
        id: 'conflict_2', 
        type: 'choice',
        question: '时间安排产生冲突时，最好的解决方案是？',
        options: [
          '严格按照计划执行',
          '灵活调整，优先重要活动',
          '民主投票决定',
          '轮流决定优先级'
        ],
        correctAnswer: 1,
        explanation: '灵活性有助于应对突发情况',
        category: 'time'
      },
      {
        id: 'conflict_3',
        type: 'choice', 
        question: '对活动偏好不同时，如何达成共识？',
        options: [
          '选择大多数人喜欢的',
          '尝试融合不同偏好',
          '轮流满足每个人的偏好',
          '寻找新的共同兴趣点'
        ],
        correctAnswer: 3,
        explanation: '发现新的共同点能增进关系',
        category: 'preference'
      },
      {
        id: 'conflict_4',
        type: 'sort',
        question: '请按重要性排序这些冲突解决原则：',
        options: [
          '开放沟通',
          '互相妥协', 
          '尊重差异',
          '寻找共赢'
        ],
        correctAnswer: ['开放沟通', '尊重差异', '寻找共赢', '互相妥协'],
        explanation: '沟通是基础，尊重是前提，共赢是目标',
        category: 'principle'
      },
      {
        id: 'conflict_5',
        type: 'fill',
        question: '当遇到意见分歧时，最重要的是保持_____，通过_____来解决问题。',
        options: ['耐心', '理解', '沟通', '冷静'],
        correctAnswer: ['冷静', '沟通'],
        explanation: '冷静思考和开放沟通是解决冲突的关键',
        category: 'communication'
      }
    ];
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

  // 外部接口
  setGameData(data: GameData) {
    this.gameData = data;
  }

  setEventCallback(callback: (event: string, data?: any) => void) {
    this.eventCallback = callback;
  }
}