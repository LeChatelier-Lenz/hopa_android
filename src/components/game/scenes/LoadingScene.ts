import Phaser from 'phaser';
import { kimiApi } from '../../../utils/kimiApi';

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
  private monsterMask?: Phaser.GameObjects.Graphics;
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
    // 随机加载一个怪兽图片
    const monsterIndex = Math.floor(Math.random() * 5) + 1;
    const monsterExtension = monsterIndex === 1 ? 'png' : 'jpg';
    this.load.image('monster_main', `/src/assets/game/monsters/monster${monsterIndex}.${monsterExtension}`);
    
    // 加载AI生成的背景图（如果有）- 通过后端代理解决CORS问题
    if (this.gameData?.backgroundUrl) {
      console.log('🖼️ 加载AI生成的背景图:', this.gameData.backgroundUrl);
      // 使用后端代理URL
      const proxyUrl = `http://localhost:3001/ai/proxy/image?url=${encodeURIComponent(this.gameData.backgroundUrl)}`;
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

    // 创建怪兽图片（居中偏上，适当缩小）
    this.monsterSprite = this.add.image(centerX, this.scale.height * 0.4, 'monster_main');
    
    // 根据屏幕大小调整怪兽尺寸，保持1:1比例
    const monsterSize = Math.min(this.scale.width, this.scale.height) * 0.25;
    this.monsterSprite.setDisplaySize(monsterSize, monsterSize);

    // 创建黑色蒙版
    this.monsterMask = this.add.graphics();
    this.updateMonsterMask(1.0); // 初始完全遮盖

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

  private updateMonsterMask(maskRatio: number) {
    if (!this.monsterMask || !this.monsterSprite) return;
    
    this.monsterMask.clear();
    
    if (maskRatio > 0) {
      const maskHeight = this.monsterSprite.displayHeight * maskRatio;
      
      this.monsterMask.fillStyle(0x000000, 1.0);
      this.monsterMask.fillRect(
        this.monsterSprite.x - this.monsterSprite.displayWidth / 2,
        this.monsterSprite.y - this.monsterSprite.displayHeight / 2,
        this.monsterSprite.displayWidth,
        maskHeight
      );
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
      this.updateMonsterMask(1.0 - progress);
      
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
      console.log('🤖 开始生成冲突预测题目...');
      
      // 调用后端API生成冲突解决题目
      const conflictData = await kimiApi.generateConflictQuestions({
        title: this.gameData.consensusTheme.title,
        description: this.gameData.consensusTheme.description,
        scenarioType: 'general',
      });

      this.generatedQuestions = conflictData;
      console.log('✅ AI题目生成完成:', this.generatedQuestions);
      
    } catch (error) {
      console.error('❌ AI题目生成失败:', error);
      
      // 使用默认题目
      this.generatedQuestions = this.getDefaultQuestions();
    }
  }

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